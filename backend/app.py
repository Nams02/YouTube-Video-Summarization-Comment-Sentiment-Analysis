from flask import Flask, jsonify, request
import requests
import re
import sqlite3
import json
from transformers import pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, VideoUnavailable, NoTranscriptFound
from youtube_transcript_api.formatters import TextFormatter

# Function to save video metadata


def save_video_metadata(video_id, title, description, transcription, summary):
    conn = sqlite3.connect('youtube_data.db')
    cursor = conn.cursor()
    cursor.execute('''
    INSERT OR REPLACE INTO video_metadata (video_id, title, description, transcription, summary)
    VALUES (?, ?, ?, ?, ?)
    ''', (video_id, title, description, transcription, summary))
    conn.commit()
    conn.close()

# Function to save comments


def save_comments(video_id, comments):
    conn = sqlite3.connect('youtube_data.db')
    cursor = conn.cursor()
    for comment in comments:
        cursor.execute('''
        INSERT INTO comments (video_id, text, author, published_at, like_count)
        VALUES (?, ?, ?, ?, ?)
        ''', (video_id, comment['text'], comment['author'], comment['published_at'], comment['like_count']))
    conn.commit()
    conn.close()

# Function to save sentiment analysis results


def save_sentiment_analysis(video_id, total_comments, sentiment_percentage, sentiment_count, analyzed_comments):
    conn = sqlite3.connect('youtube_data.db')
    cursor = conn.cursor()
    cursor.execute('''
    INSERT INTO sentiment_analysis (video_id, total_comments, positive_percentage, negative_percentage, neutral_percentage, sentiment_count, analyzed_comments)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (video_id, total_comments, sentiment_percentage['POSITIVE'], sentiment_percentage['NEGATIVE'], sentiment_percentage['NEUTRAL'], json.dumps(sentiment_count), json.dumps(analyzed_comments)))
    conn.commit()
    conn.close()


app = Flask(__name__)

# Insert your actual YouTube API key here
YOUTUBE_API_KEY = 'AIzaSyCUsQg-YUhYTMVZ9bpimLDzmfP_2btCBFU'

# Initialize sentiment analysis and summarization pipelines
sentiment_analyzer = pipeline('sentiment-analysis')
summarizer = pipeline('summarization', model='t5-base', tokenizer='t5-base')

# Clean comment function to remove unnecessary elements


def clean_comment(text):
    clean_text = re.sub(r'<.*?>', '', text)  # Remove HTML tags
    # Remove newlines and spaces
    clean_text = re.sub(r'\n+', ' ', clean_text).strip()
    return clean_text

# Function to fetch video comments with pagination


def fetch_comments(video_id):
    comments = []
    next_page_token = None

    base_url = f"https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId={
        video_id}&maxResults=50&key={YOUTUBE_API_KEY}"

    while len(comments) < 150:
        url = base_url if not next_page_token else f"{
            base_url}&pageToken={next_page_token}"
        response = requests.get(url)

        if response.status_code != 200:
            print("API Error:", response.status_code, response.text)
            return []

        data = response.json()
        if 'items' in data:
            for item in data['items']:
                comment_data = item['snippet']['topLevelComment']['snippet']
                comment_info = {
                    'text': clean_comment(comment_data['textOriginal']),
                    'author': comment_data['authorDisplayName'],
                    'published_at': comment_data['publishedAt'],
                    'like_count': comment_data['likeCount'],
                }
                comments.append(comment_info)
                if len(comments) >= 150:
                    break

        next_page_token = data.get('nextPageToken')
        if not next_page_token:
            break

    return comments


@app.route('/video_comments', methods=['GET'])
def get_video_comments():
    video_id = request.args.get('video_id')
    if not video_id:
        return jsonify({'error': 'Missing video_id parameter'}), 400

    comments = fetch_comments(video_id)
    if not comments:
        return jsonify({'message': 'No comments found for this video'}), 404

    # Save comments to the database
    save_comments(video_id, comments)

    return jsonify({'comments': comments})


@app.route('/analyze_comments', methods=['GET'])
def analyze_comments():
    video_id = request.args.get('video_id')
    if not video_id:
        return jsonify({'error': 'Missing video_id parameter'}), 400

    comments = fetch_comments(video_id)
    if not comments:
        return jsonify({'message': 'No comments found for this video'}), 404

    # Extract text from comments for analysis
    comment_texts = [comment['text'] for comment in comments]
    try:
        sentiment_results = sentiment_analyzer(comment_texts)
    except Exception as err:
        return jsonify({'error': f'Sentiment analysis failed: {err}'}), 500

    # Combine comments with their sentiment and count tallies
    sentiment_count = {'POSITIVE': 0, 'NEGATIVE': 0, 'NEUTRAL': 0}
    analyzed_comments = []

    for comment, sentiment in zip(comment_texts, sentiment_results):
        label = sentiment['label']
        if label == 'POSITIVE':
            sentiment_count['POSITIVE'] += 1
        elif label == 'NEGATIVE':
            sentiment_count['NEGATIVE'] += 1
        else:
            sentiment_count['NEUTRAL'] += 1

        analyzed_comments.append({
            "comment": comment,
            "sentiment": label,
            "confidence": sentiment['score']
        })

    # Calculate percentages for each sentiment
    total_comments = len(comment_texts)
    sentiment_percentage = {
        key: (count / total_comments) * 100 for key, count in sentiment_count.items()
    }

    # Save sentiment analysis results to the database
    save_sentiment_analysis(video_id, total_comments,
                            sentiment_percentage, sentiment_count, analyzed_comments)

    return jsonify({
        'total_comments': total_comments,
        'sentiment_count': sentiment_count,
        'sentiment_percentage': sentiment_percentage,
        'analyzed_comments': analyzed_comments
    })

# Function to summarize long text in chunks


def summarize_text(text):
    # Parameters for summarization
    max_input_length = 512
    min_summary_length = 80  # Detailed summaries, but adaptive if max length is lower

    # Split the text into chunks, ensuring it ends at logical sentence boundaries
    text_chunks = []
    while len(text) > max_input_length:
        chunk = text[:max_input_length]

        # Find the last complete sentence end in the chunk
        last_sentence_end = max(chunk.rfind(
            '. '), chunk.rfind('! '), chunk.rfind('? '))
        if last_sentence_end != -1:
            # Add the chunk ending at the sentence boundary
            text_chunks.append(chunk[:last_sentence_end + 1])
            text = text[last_sentence_end + 1:].strip()
        else:
            # Fallback if no sentence end is found; avoid cutting words
            last_space = chunk.rfind(' ')
            text_chunks.append(chunk[:last_space])
            text = text[last_space:].strip()

    # Append any remaining text as the final chunk
    if text:
        text_chunks.append(text)

    # Summarize each chunk and store results
    summarized_chunks = []
    for chunk in text_chunks:
        # Dynamically adjust max_summary_length based on chunk length
        chunk_length = len(chunk.split())
        max_summary_length = min(150, int(chunk_length * 0.8))

        # Adjust min_summary_length to ensure it's always less than or equal to max_summary_length
        adjusted_min_length = min(min_summary_length, max_summary_length - 1)

        summary = summarizer(
            chunk,
            max_length=max_summary_length,
            min_length=adjusted_min_length,
            do_sample=False,
            num_beams=4  # Maintain coherence and reduce repetition
        )[0]['summary_text']
        summarized_chunks.append(summary)

    # Combine all summarized chunks into one final summary
    final_summary = ' '.join(summarized_chunks)

    # Post-process to ensure clean, flowing text
    final_summary = final_summary.replace(' .', '.').replace(
        ' ,', ',').replace(' ?', '?').replace(' !', '!')

    return final_summary


def get_video_transcription(video_id):
    """
    Retrieves the transcription of a YouTube video if available.
    Returns the transcription text or an error message if transcription is unavailable.
    """
    try:
        # Fetch transcript using YouTubeTranscriptApi
        transcript_data = YouTubeTranscriptApi.get_transcript(
            video_id, languages=['en'])

        # Convert transcript to plain text
        formatter = TextFormatter()
        transcription_text = formatter.format_transcript(transcript_data)

        # Clean and format the transcription text
        clean_text = re.sub(r'\n+', ' ', transcription_text).strip()
        return clean_text

    except TranscriptsDisabled:
        return 'Transcription is disabled for this video.'
    except VideoUnavailable:
        return 'Video is unavailable.'
    except NoTranscriptFound:
        return 'No transcript found for this video.'
    except Exception as e:
        return f'Error occurred while fetching transcript: {str(e)}'


@app.route('/video_metadata', methods=['GET'])
def get_video_metadata():
    video_id = request.args.get('video_id')
    if not video_id:
        return jsonify({'error': 'Missing video_id parameter'}), 400

    # Fetch video metadata (reuse your existing logic)
    url = f"https://www.googleapis.com/youtube/v3/videos?part=snippet&id={
        video_id}&key={YOUTUBE_API_KEY}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
    except Exception as e:
        return jsonify({'error': f'Failed to fetch video metadata: {e}'}), 500

    if 'items' not in data or len(data['items']) == 0:
        return jsonify({'error': 'No metadata found for this video'}), 404

    video_info = data['items'][0]['snippet']
    video_title = video_info['title']
    video_description = video_info['description']

    # Fetch and summarize transcription
    transcription_text = get_video_transcription(video_id)
    if transcription_text.startswith('Error'):
        return jsonify({'error': transcription_text}), 500

    combined_text = f"{video_title} {video_description} {transcription_text}"
    summary = summarize_text(combined_text)

    # Save data to the database
    save_video_metadata(video_id, video_title,
                        video_description, transcription_text, summary)

    return jsonify({
        'title': video_title,
        'description': video_description,
        'transcription': transcription_text,
        'summary': summary
    })

# Function for keyword extraction from comments


def extract_keywords(comments, top_n=5):
    vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
    tfidf_matrix = vectorizer.fit_transform(comments)
    feature_names = vectorizer.get_feature_names_out()

    keywords = {}
    for i, row in enumerate(tfidf_matrix):
        row_data = row.toarray().flatten()
        top_indices = row_data.argsort()[-top_n:][::-1]
        keywords[i] = [feature_names[idx]
                       for idx in top_indices if row_data[idx] > 0.1]

    return keywords


@app.route('/summarize_comment_trends', methods=['GET'])
def summarize_comment_trends():
    try:
        video_id = request.args.get('video_id')
        comments = fetch_comments(video_id)

        if not comments:
            return jsonify({"error": "No comments found"}), 404

        keywords_per_comment = extract_keywords(
            [comment['text'] for comment in comments], top_n=3)

        all_keywords = [kw for kws in keywords_per_comment.values()
                        for kw in kws]
        if not all_keywords:
            return jsonify({"error": "Failed to extract meaningful keywords"}), 500

        keywords_text = " ".join(all_keywords)
        summary = summarizer(keywords_text, max_length=100,
                             min_length=30, do_sample=False)[0]['summary_text']

        return jsonify({"trends_summary": summary}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to summarize comment trends: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True)
