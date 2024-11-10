// import React from 'react';
// import { Paper, Typography, Chip, Stack, Fade, Box } from '@mui/material';
// import { useTheme } from '@mui/material/styles'; // Importing useTheme for theme access

// const TrendsSummary = ({ keywords, summary }) => {
//     const theme = useTheme(); // Using the useTheme hook to access the theme

//     return (
//         <Fade in timeout={700}>
//             <Paper
//                 elevation={3}
//                 sx={{
//                     padding: '20px',
//                     marginTop: '20px',
//                     backgroundColor: '#f9fbfd',
//                     borderRadius: 2
//                 }}
//             >
//                 {/* Section Title */}
//                 <Typography
//                     variant="h6"
//                     gutterBottom
//                     sx={{
//                         fontWeight: 'bold',
//                         color: '#003366'
//                     }}
//                 >
//                     Trending Keywords
//                 </Typography>

//                 {/* Keywords Display */}
//                 <Stack
//                     direction="row"
//                     spacing={1}
//                     sx={{
//                         flexWrap: 'wrap',
//                         gap: 1.5,
//                         [theme.breakpoints.down('sm')]: {
//                             direction: 'column', // Stack chips vertically on smaller screens
//                             alignItems: 'center', // Center align for smaller screens
//                         }
//                     }}
//                 >
//                     {keywords.map((keyword, index) => (
//                         <Chip
//                             key={index}
//                             label={keyword}
//                             sx={{
//                                 color: '#0073e6',
//                                 fontWeight: 'medium',
//                                 backgroundColor: '#e6f2fa',
//                                 transition: '0.3s',
//                                 '&:hover': {
//                                     backgroundColor: '#cce7f7',
//                                     color: '#004c99',
//                                     boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
//                                 }
//                             }}
//                         />
//                     ))}
//                 </Stack>

//                 {/* Summarized Trends */}
//                 <Box sx={{ marginTop: '20px' }}>
//                     <Typography
//                         variant="body1"
//                         sx={{
//                             color: '#666',
//                             fontStyle: 'italic',
//                             lineHeight: 1.6,
//                             letterSpacing: '0.5px'
//                         }}
//                     >
//                         {summary}
//                     </Typography>
//                 </Box>
//             </Paper>
//         </Fade>
//     );
// };

// export default TrendsSummary;

import React from 'react';
import { Paper, Typography, Chip, Stack, Fade, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const TrendsSummary = ({ keywords = [], summary = 'No trends available.' }) => {
    const theme = useTheme();

    return (
        <Fade in timeout={700}>
            <Paper
                elevation={3}
                sx={{
                    padding: '20px',
                    marginTop: '20px',
                    backgroundColor: '#f9fbfd',
                    borderRadius: 2
                }}
            >
                {/* Section Title */}
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                        fontWeight: 'bold',
                        color: '#003366'
                    }}
                >
                    Trending Keywords
                </Typography>

                {/* Keywords Display */}
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        flexWrap: 'wrap',
                        gap: 1.5,
                        [theme.breakpoints.down('sm')]: {
                            direction: 'column',
                            alignItems: 'center',
                        }
                    }}
                >
                    {keywords.map((keyword, index) => (
                        <Chip
                            key={index}
                            label={keyword}
                            sx={{
                                color: '#0073e6',
                                fontWeight: 'medium',
                                backgroundColor: '#e6f2fa',
                                transition: '0.3s',
                                '&:hover': {
                                    backgroundColor: '#cce7f7',
                                    color: '#004c99',
                                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                                }
                            }}
                        />
                    ))}
                </Stack>

                {/* Summarized Trends */}
                <Box sx={{ marginTop: '20px' }}>
                    <Typography
                        variant="body1"
                        sx={{
                            color: '#666',
                            fontStyle: 'italic',
                            lineHeight: 1.6,
                            letterSpacing: '0.5px'
                        }}
                    >
                        {summary}
                    </Typography>
                </Box>
            </Paper>
        </Fade>
    );
};

export default TrendsSummary;