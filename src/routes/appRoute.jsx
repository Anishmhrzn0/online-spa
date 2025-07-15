import React from 'react';
import { Routes, Route } from 'react-router-dom';
import About from '../components/About';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Services from '../components/Services';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<About />} />
      <Route path="/header" element={<Header />} />
      <Route path="/hero" element={<Hero />} />
      <Route path="/services" element={<Services />} />
    </Routes>
  );
};

export default AppRoutes;