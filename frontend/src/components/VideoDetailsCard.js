// import React from 'react';
// import { Card, CardContent, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// const VideoDetailsCard = ({ title, description, transcription, summary }) => {
//     return (
//         <Card
//             sx={{
//                 background: 'linear-gradient(135deg, #f5f7fa 30%, #c3cfe2 90%)',
//                 borderRadius: 2,
//                 boxShadow: 5,
//                 transition: 'transform 0.3s',
//                 '&:hover': { transform: 'scale(1.02)' },
//                 padding: { xs: '10px', sm: '20px' },
//             }}
//         >
//             <CardContent>
//                 {/* Video Title */}
//                 <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
//                     {title}
//                 </Typography>

//                 {/* Video Description */}
//                 <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
//                     {description}
//                 </Typography>

//                 {/* Accordion for Transcription */}
//                 <Accordion
//                     TransitionProps={{ unmountOnExit: true }}
//                     sx={{
//                         '&:hover': { backgroundColor: '#eef2f6' },
//                         transition: 'background-color 0.2s'
//                     }}
//                 >
//                     <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="transcription-content" id="transcription-header">
//                         <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: '#3f51b5' }}>
//                             View Transcription
//                         </Typography>
//                     </AccordionSummary>
//                     <AccordionDetails>
//                         <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6, mb: 1 }}>
//                             {transcription}
//                         </Typography>
//                     </AccordionDetails>
//                 </Accordion>

//                 {/* Accordion for Summary */}
//                 <Accordion
//                     TransitionProps={{ unmountOnExit: true }}
//                     sx={{
//                         '&:hover': { backgroundColor: '#eef2f6' },
//                         transition: 'background-color 0.2s'
//                     }}
//                 >
//                     <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="summary-content" id="summary-header">
//                         <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: '#3f51b5' }}>
//                             View Summary
//                         </Typography>
//                     </AccordionSummary>
//                     <AccordionDetails>
//                         <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#666', lineHeight: 1.6, mb: 1 }}>
//                             {summary}
//                         </Typography>
//                     </AccordionDetails>
//                 </Accordion>
//             </CardContent>
//         </Card>
//     );
// };

// export default VideoDetailsCard;


import React, { useEffect, useState } from 'react';
import VideoDetailsCard from '../components/VideoDetailsCard';
import api from '../services/api';

const VideoMetadata = () => {
    const [videoDetails, setVideoDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVideoMetadata = async () => {
            try {
                const response = await api.get('/api/video-metadata');
                setVideoDetails(response.data); // Assuming response.data includes title, description, transcription, and summary
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
            {videoDetails && (
                <VideoDetailsCard
                    title={videoDetails.title}
                    description={videoDetails.description}
                    transcription={videoDetails.transcription}
                    summary={videoDetails.summary}
                />
            )}
        </div>
    );
};

export default VideoMetadata;
