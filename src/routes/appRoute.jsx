import React from 'react';
import { Routes, Route } from 'react-router-dom';
import About from '../components/About';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Booking  from '../components/Booking';
import UserProfile from '../components/UserProfile';
import Auth from '../components/Auth';
const AppRoutes = () => {
  return (
    <Routes>

      <Route path="/about" element={<About />} />
      <Route path="/header" element={<Header />} />
      <Route path="/hero" element={<Hero />} />
      <Route path="/services" element={<Services />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/user-profile" element={<UserProfile />} />
      <Route path="/auth" element={<Auth />} />
      
      
      {/* Add more routes as needed */}
    
    </Routes>
  );
};

export default AppRoutes;