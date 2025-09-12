import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SkillMatrix from './pages/SkillMatrix.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SkillMatrix />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
