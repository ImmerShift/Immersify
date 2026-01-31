import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Questionnaire from './pages/Questionnaire';
import Strategy from './pages/Strategy';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/strategy" element={<Strategy />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
