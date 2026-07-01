import React from 'react'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'

import { Input, Space } from 'antd';

import Landing from './pages/Landing'
import Admin from './pages/User/Admin'
import Traveler from './pages/User/Traveler'

import './App.css'
function App() {
  return (
    <Router>
      <div>

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/traveler" element={<Traveler />} />
          
        </Routes>
      </div>
    </Router>
  )
}

export default App
 