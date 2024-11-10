import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: { main: '#0057a7', contrastText: '#ffffff' },
        secondary: { main: '#008080', contrastText: '#ffffff' },
        background: { default: '#f0f4f8', paper: '#ffffff' },
        action: { hover: '#ffc107', selected: '#ffc107' },
        text: { primary: '#333333', secondary: '#555555' },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif', // Consistent font across MUI components
        h6: { fontWeight: 600 },
        body1: { fontSize: '1rem', lineHeight: 1.7 },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    transition: '0.3s ease',
                    '&:hover': {
                        backgroundColor: '#008080',
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
                        transform: 'scale(1.05)', // Slight increase in scale for more noticeable hover effect
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    transition: '0.3s ease',
                    '&:hover': {
                        color: '#ffc107',
                        transform: 'scale(1.1)', // Added scaling effect for better interactivity
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    marginBottom: '15px', // Added consistent spacing for text fields
                },
            },
        },
    },
});

export default theme;