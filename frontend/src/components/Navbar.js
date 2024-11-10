import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);

    // Handles opening the menu when the menu icon is clicked
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Closes the menu when a menu item is selected or when clicking outside
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                {/* App title */}
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                    YouTube Analyzer
                </Typography>

                {/* Full menu for larger screens */}
                <div sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Button color="inherit" component={Link} to="/">Home</Button>
                    <Button color="inherit" component={Link} to="/video-metadata">Video Metadata</Button>
                    <Button color="inherit" component={Link} to="/comments-sentiment">Comments & Sentiment</Button>
                    <Button color="inherit" component={Link} to="/summarized-content">Summary</Button>
                </div>

                {/* Mobile menu icon */}
                <IconButton
                    edge="end"
                    color="inherit"
                    aria-label="menu"
                    sx={{ display: { xs: 'block', sm: 'none' } }}
                    onClick={handleMenuOpen}
                >
                    <MenuIcon />
                </IconButton>

                {/* Dropdown menu for smaller screens */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    sx={{ display: { xs: 'block', sm: 'none' } }}
                >
                    <MenuItem component={Link} to="/" onClick={handleMenuClose}>Home</MenuItem>
                    <MenuItem component={Link} to="/video-metadata" onClick={handleMenuClose}>Video Metadata</MenuItem>
                    <MenuItem component={Link} to="/comments-sentiment" onClick={handleMenuClose}>Comments & Sentiment</MenuItem>
                    <MenuItem component={Link} to="/summarized-content" onClick={handleMenuClose}>Summary</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;