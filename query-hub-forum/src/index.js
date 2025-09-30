import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { seedData } from './utils/seedData';

// Seed sample data on first load
seedData();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);