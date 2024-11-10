// import React, { useEffect, useState } from 'react';
// import VideoDetailsCard from '../components/VideoDetailsCard';
// import api from '../services/api';

// const VideoMetadata = () => {
//     const [videoDetails, setVideoDetails] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchVideoMetadata = async () => {
//             try {
//                 const response = await api.get('/api/video-metadata');
//                 setVideoDetails(response.data); // Assuming response.data includes title, description, transcription, and summary
//             } catch (err) {
//                 setError('Failed to load video metadata. Please try again later.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchVideoMetadata();
//     }, []);

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     if (error) {
//         return <div>{error}</div>;
//     }

//     return (
//         <div>
//             <h1>Video Metadata</h1>
//             {videoDetails && (
//                 <VideoDetailsCard
//                     title={videoDetails.title}
//                     description={videoDetails.description}
//                     transcription={videoDetails.transcription}
//                     summary={videoDetails.summary}
//                 />
//             )}
//         </div>
//     );
// };

// export default VideoMetadata;

import React, { useEffect, useState } from 'react';
import VideoDetailsCard from '../components/VideoDetailsCard';
import api from '../services/api'; // Import the axios instance from api.js

const VideoMetadata = () => {
    const [videoDetails, setVideoDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVideoMetadata = async () => {
            try {
                const response = await api.get('/api/video-metadata'); // Use the `api` instance
                setVideoDetails(response.data);
            } catch (err) {
                setError('Failed to load video metadata. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchVideoMetadata();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Video Metadata</h1>
            {videoDetails && <VideoDetailsCard videoDetails={videoDetails} />}
        </div>
    );
};

export default VideoMetadata;
