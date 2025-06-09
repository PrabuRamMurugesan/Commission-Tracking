import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';  // No need for ".js" extension

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
