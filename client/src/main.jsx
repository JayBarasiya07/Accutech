import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './App.css'; // relative path to App.css in src
import { StrictMode } from 'react';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
