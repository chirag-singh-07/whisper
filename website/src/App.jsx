import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import ChatDashboard from './components/ChatDashboard';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

// Auth Route Component (Redirect to chat if already logged in)
const AuthRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  if (token) return <Navigate to="/chat" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <AuthRoute>
              <Register />
            </AuthRoute>
          } 
        />
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute>
              <ChatDashboard />
            </ProtectedRoute>
          } 
        />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
