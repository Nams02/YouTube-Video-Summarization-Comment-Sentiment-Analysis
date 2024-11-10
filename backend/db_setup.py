import sqlite3

# Connect to SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect('youtube_data.db')

# Create a cursor object
cursor = conn.cursor()

# Create table for video metadata
cursor.execute('''
CREATE TABLE IF NOT EXISTS video_metadata (
    video_id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    transcription TEXT,
    summary TEXT
)
''')

# Create table for comments
cursor.execute('''
CREATE TABLE IF NOT EXISTS comments (
    comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    video_id TEXT,
    text TEXT,
    author TEXT,
    published_at TEXT,
    like_count INTEGER,
    FOREIGN KEY (video_id) REFERENCES video_metadata (video_id)
)
''')

# Create table for analyzed results
cursor.execute('''
CREATE TABLE IF NOT EXISTS sentiment_analysis (
    analysis_id INTEGER PRIMARY KEY AUTOINCREMENT,
    video_id TEXT,
    total_comments INTEGER,
    positive_percentage REAL,
    negative_percentage REAL,
    neutral_percentage REAL,
    sentiment_count TEXT,
    analyzed_comments TEXT,
    FOREIGN KEY (video_id) REFERENCES video_metadata (video_id)
)
''')

# Commit changes and close the connection
conn.commit()
conn.close()
