import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { WorkoutProvider } from './context/WorkoutContext'; // Import WorkoutProvider

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <WorkoutProvider> {/* Wrap the App with WorkoutProvider */}
        <App />
      </WorkoutProvider>
    </AuthProvider>
  </React.StrictMode>,
);
