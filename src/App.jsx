import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import QuestionnairePage from '@/pages/QuestionnairePage';
import BrandHealthPage from '@/pages/BrandHealthPage';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/questionnaire" replace />} />
        <Route path="/questionnaire" element={<QuestionnairePage />} />
        <Route path="/brandhealth" element={<BrandHealthPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;