import './styles/App.css';
import logo from './assets/logo.svg';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Container, ThemeProvider, Fade } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import VideoMetadata from './pages/VideoMetadata';
import CommentsSentiment from './pages/CommentsSentiment';
import SummarizedContent from './pages/SummarizedContent';
import theme from './styles/theme';

function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {/* Fade transition applied to the entire app */}
        <Fade in={loaded} timeout={500}>
          <div style={{ padding: '20px' }}>
            {/* Navbar component placed outside of routing for consistency */}
            <Navbar />
            <Container>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/video-metadata" element={<VideoMetadata />} />
                <Route path="/comments-sentiment" element={<CommentsSentiment />} />
                <Route path="/summarized-content" element={<SummarizedContent />} />
              </Routes>
            </Container>
          </div>
        </Fade>
      </Router>
    </ThemeProvider>
  );
}

export default App;