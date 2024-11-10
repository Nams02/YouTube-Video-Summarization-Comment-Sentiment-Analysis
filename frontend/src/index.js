import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Rendering the App component inside React.StrictMode for development
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Measure performance and log it if needed
reportWebVitals(console.log);