// import React, { useState } from 'react';
// import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography, Chip, IconButton, ButtonGroup, Button, Select, MenuItem, Fade } from '@mui/material';
// import ThumbUpIcon from '@mui/icons-material/ThumbUp';
// import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
// import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
// import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

// const CommentsSection = ({ comments }) => {
//     const [filter, setFilter] = useState('All');
//     const [sortOrder, setSortOrder] = useState('Newest');

//     const filterComments = (comments, filter) => {
//         if (filter === 'All') return comments;
//         return comments.filter(comment => comment.sentiment === filter);
//     };

//     const sortComments = (comments, sortOrder) => {
//         return comments.sort((a, b) => {
//             if (sortOrder === 'Most Liked') return b.likes - a.likes;
//             if (sortOrder === 'Newest') return new Date(b.timestamp) - new Date(a.timestamp);
//             return comments;
//         });
//     };

//     const displayedComments = sortComments(filterComments(comments, filter), sortOrder);

//     return (
//         <div style={{ margin: 'auto', marginTop: '20px' }} sx={{ maxWidth: { xs: '90%', sm: '600px' } }}>

//             {/* Filter Buttons */}
//             <ButtonGroup variant="outlined" aria-label="filter-comments" sx={{ mb: 2 }}>
//                 <Button onClick={() => setFilter('All')}>All</Button>
//                 <Button onClick={() => setFilter('Positive')} color="success">Positive</Button>
//                 <Button onClick={() => setFilter('Neutral')} color="default">Neutral</Button>
//                 <Button onClick={() => setFilter('Negative')} color="error">Negative</Button>
//             </ButtonGroup>

//             {/* Sort Options */}
//             <Select
//                 value={sortOrder}
//                 onChange={(e) => setSortOrder(e.target.value)}
//                 variant="outlined"
//                 sx={{ ml: 2 }}
//             >
//                 <MenuItem value="Newest">Newest</MenuItem>
//                 <MenuItem value="Most Liked">Most Liked</MenuItem>
//             </Select>

//             {/* Comments List */}
//             <List>
//                 {displayedComments.map((comment, index) => (
//                     <Fade in={true} timeout={500} key={index}>
//                         <ListItem sx={{ backgroundColor: '#f5f5f5', borderRadius: 2, mb: 1, boxShadow: 1 }}>
//                             {/* Avatar and Comment Text */}
//                             <ListItemAvatar>
//                                 <Avatar>{comment.author[0]}</Avatar>
//                             </ListItemAvatar>
//                             <ListItemText
//                                 primary={
//                                     <div style={{ display: 'flex', alignItems: 'center' }}>
//                                         <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{comment.text}</Typography>
//                                         <Chip
//                                             label={comment.sentiment}
//                                             color={
//                                                 comment.sentiment === 'Positive' ? 'success' :
//                                                     comment.sentiment === 'Neutral' ? 'default' :
//                                                         'error'
//                                             }
//                                             icon={
//                                                 comment.sentiment === 'Positive' ? <SentimentSatisfiedAltIcon /> :
//                                                     comment.sentiment === 'Neutral' ? <SentimentNeutralIcon /> :
//                                                         <SentimentDissatisfiedIcon />
//                                             }
//                                             size="small"
//                                             sx={{ ml: 1 }}
//                                         />
//                                     </div>
//                                 }
//                                 secondary={
//                                     <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
//                                         {comment.author} • {new Date(comment.timestamp).toLocaleString()}
//                                     </Typography>
//                                 }
//                             />

//                             {/* Likes Count */}
//                             <IconButton edge="end" aria-label="like button for comment" sx={{ color: '#3f51b5' }}>
//                                 <ThumbUpIcon fontSize="small" />
//                                 <Typography variant="caption" sx={{ ml: 0.5 }}>{comment.likes}</Typography>
//                             </IconButton>
//                         </ListItem>
//                     </Fade>
//                 ))}
//             </List>
//         </div>
//     );
// };

// export default CommentsSection;

import React, { useState } from 'react';
import {
    List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography, Chip, IconButton,
    ButtonGroup, Button, Select, MenuItem, Fade
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

const CommentsSection = ({ comments = [] }) => {
    const [filter, setFilter] = useState('All');
    const [sortOrder, setSortOrder] = useState('Newest');

    // Function to filter comments based on sentiment
    const filterComments = (comments, filter) => {
        if (filter === 'All') return comments;
        return comments.filter(comment => comment.sentiment === filter);
    };

    // Function to sort comments based on selected criteria
    const sortComments = (comments, sortOrder) => {
        return [...comments].sort((a, b) => {
            if (sortOrder === 'Most Liked') return b.likes - a.likes;
            if (sortOrder === 'Newest') return new Date(b.timestamp) - new Date(a.timestamp);
            return 0;
        });
    };

    // Get the displayed comments by applying filter and sort functions
    const displayedComments = sortComments(filterComments(comments, filter), sortOrder);

    return (
        <div style={{ margin: 'auto', marginTop: '20px' }} sx={{ maxWidth: { xs: '90%', sm: '600px' } }}>

            {/* Filter Buttons */}
            <ButtonGroup variant="outlined" aria-label="filter-comments" sx={{ mb: 2 }}>
                <Button onClick={() => setFilter('All')}>All</Button>
                <Button onClick={() => setFilter('Positive')} color="success">Positive</Button>
                <Button onClick={() => setFilter('Neutral')} color="default">Neutral</Button>
                <Button onClick={() => setFilter('Negative')} color="error">Negative</Button>
            </ButtonGroup>

            {/* Sort Options */}
            <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                variant="outlined"
                sx={{ ml: 2 }}
            >
                <MenuItem value="Newest">Newest</MenuItem>
                <MenuItem value="Most Liked">Most Liked</MenuItem>
            </Select>

            {/* Comments List */}
            <List>
                {displayedComments.length > 0 ? (
                    displayedComments.map((comment, index) => (
                        <Fade in={true} timeout={500} key={index}>
                            <ListItem sx={{ backgroundColor: '#f5f5f5', borderRadius: 2, mb: 1, boxShadow: 1 }}>
                                {/* Avatar and Comment Text */}
                                <ListItemAvatar>
                                    <Avatar>{comment.author ? comment.author[0] : 'A'}</Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{comment.text}</Typography>
                                            <Chip
                                                label={comment.sentiment}
                                                color={
                                                    comment.sentiment === 'Positive' ? 'success' :
                                                        comment.sentiment === 'Neutral' ? 'default' :
                                                            'error'
                                                }
                                                icon={
                                                    comment.sentiment === 'Positive' ? <SentimentSatisfiedAltIcon /> :
                                                        comment.sentiment === 'Neutral' ? <SentimentNeutralIcon /> :
                                                            <SentimentDissatisfiedIcon />
                                                }
                                                size="small"
                                                sx={{ ml: 1 }}
                                            />
                                        </div>
                                    }
                                    secondary={
                                        <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                            {comment.author} • {new Date(comment.timestamp).toLocaleString()}
                                        </Typography>
                                    }
                                />

                                {/* Likes Count */}
                                <IconButton edge="end" aria-label="like button for comment" sx={{ color: '#3f51b5' }}>
                                    <ThumbUpIcon fontSize="small" />
                                    <Typography variant="caption" sx={{ ml: 0.5 }}>{comment.likes}</Typography>
                                </IconButton>
                            </ListItem>
                        </Fade>
                    ))
                ) : (
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 2, textAlign: 'center' }}>
                        No comments available.
                    </Typography>
                )}
            </List>
        </div>
    );
};

export default CommentsSection;