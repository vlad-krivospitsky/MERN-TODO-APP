import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AnotherPage from './pages/AnotherPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/another" element={<AnotherPage />} />
      </Routes>
    </Router>
  );
}

export default App;
