import React from 'react'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { Input, Space } from 'antd';

import Landing from './pages/Landing'
import './App.css'
function App() {
  return (
    <Router>
      <div>

        <Routes>
          <Route path="/" element={<Landing />} />

        </Routes>
      </div>
    </Router>
  )
}

export default App
 