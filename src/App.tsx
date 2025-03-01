import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Calendar } from './pages/Calendar';
import { Login } from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import { LoadingScreen } from './components/LoadingScreen';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="calendar" element={<Calendar />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
        <LoadingScreen />
      </AuthProvider>
    </Router>
  );
}

export default App;