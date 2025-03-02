import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import '../global.css'; // Ensure global.css is imported here

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
