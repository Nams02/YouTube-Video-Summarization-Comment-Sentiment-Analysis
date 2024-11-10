import React from 'react';
import CommentsSection from '../components/CommentsSection';
import TrendsSummary from '../components/TrendsSummary';

const CommentsSentiment = () => {
    // Mock data for comments and trends
    const mockComments = [
        { id: 1, text: "This is a great video!", sentiment: "Positive" },
        { id: 2, text: "I didn't find this helpful.", sentiment: "Negative" },
        { id: 3, text: "Okay!", sentiment: "Neutral" },
    ];

    const mockTrends = {
        positiveCount: 1,
        negativeCount: 1,
        neutralCount: 1,
    };

    return (
        <div>
            <h1>Comments Sentiment Analysis</h1>
            <TrendsSummary trends={mockTrends} />
            <CommentsSection comments={mockComments} />
        </div>
    );
};

export default CommentsSentiment;