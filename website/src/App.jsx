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
  console.log('🔐 ProtectedRoute - Token check:', token);
  console.log('🔐 ProtectedRoute - Token type:', typeof token);
  console.log('🔐 ProtectedRoute - Is falsy?', !token);
  
  if (!token) {
    console.log('❌ No token found, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  console.log('✅ Token found, rendering protected content');
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
