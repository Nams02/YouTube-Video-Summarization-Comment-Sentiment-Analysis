import React from 'react';
import VideoDetailsCard from '../components/VideoDetailsCard';

const SummarizedContent = () => {
    // Mock data for video details
    const mockVideoDetails = {
        title: "Understanding React Components",
        description: "This video dives into the fundamentals of React components...",
        views: 10234,
        likes: 500,
        summary: "A concise summary of the video content goes here.",
    };

    return (
        <div>
            <h1>Summarized Video Content</h1>
            <VideoDetailsCard videoDetails={mockVideoDetails} />
        </div>
    );
};

export default SummarizedContent;