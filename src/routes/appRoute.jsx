import React from 'react';
import { Routes, Route } from 'react-router-dom';
import About from '../components/About';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Booking  from '../components/Booking';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<About />} />
      <Route path="/header" element={<Header />} />
      <Route path="/hero" element={<Hero />} />
      <Route path="/services" element={<Services />} />
      <Route path="/booking" element={<Booking />} />
    </Routes>
  );
};

export default AppRoutes;