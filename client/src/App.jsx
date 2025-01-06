import React from 'react'
import { Routes, Route } from 'react-router-dom';
import CreateTask from './pages/CreateTask';
import EditTask from './pages/EditTask';
import Home from './pages/Home';

const App = () => {

  return <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/create" element={<CreateTask />} />
  <Route path="/edit/:id" element={<EditTask />} />
  </Routes>
  
}

export default App