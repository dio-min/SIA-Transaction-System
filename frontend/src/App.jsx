import React from 'react'

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Login from './pages/Login'

import { Input, Space } from 'antd';

import Landing from './pages/Landing'
import Admin from './pages/User/Admin'
import Travelers from './pages/User/Travelers'


import './App.css'

const getCurrentUser = () => {
  try {
    const savedCurrentUser = localStorage.getItem('currentUser');
    return savedCurrentUser ? JSON.parse(savedCurrentUser) : null;
  } catch (error) {
    localStorage.removeItem('currentUser');
    return null;
  }
};

function ProtectedRoute({ children, allowedRole }) {
  const currentUser = getCurrentUser();

  if (!currentUser?._id) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && currentUser.role !== allowedRole) {
    const fallbackPath = currentUser.role === 'admin' ? '/admin' : '/travelers';
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <div>

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="admin">
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/travelers"
            element={
              <ProtectedRoute>
                <Travelers />
              </ProtectedRoute>
            }
          />
        
        </Routes>
      </div>
    </Router>
  )
}

export default App
 