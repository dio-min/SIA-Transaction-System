import React from 'react'
import Sample from './pages/Sample'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Sidebar from './pages/Sidebar'
import './App.css'
function App() {
  return (
    <Router>
      <div>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Sample />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
 