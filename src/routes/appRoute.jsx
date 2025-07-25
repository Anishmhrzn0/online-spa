import React from 'react';
import { Routes, Route } from 'react-router-dom';
import About from '../components/About';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Services from '../components/Services';
import BookingPage from '../components/Booking';
import UserProfile from '../components/UserProfile';
import Auth from '../components/Auth';
import Admin from '../components/Admin';

const Home = (props) => (
  <>
    <Hero />
    <Services {...props} />
  </>
);

const AppRoutes = ({ user, userBookings, allBookings, setAllBookings }) => {
  return (
    <Routes>
      <Route path="/" element={user ? <BookingPage user={user} /> : <Home user={user} />} />
      <Route path="/about" element={<About />} />
      <Route path="/header" element={<Header />} />
      <Route path="/hero" element={<Hero />} />
      <Route path="/services" element={<Services user={user} />} />
      <Route path="/booking" element={<BookingPage user={user} />} />
      <Route path="/user-profile" element={<UserProfile user={user} userBookings={userBookings} />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/admin" element={<Admin user={user} allBookings={allBookings} setAllBookings={setAllBookings} />} />
      {/* Add more routes as needed */}
    </Routes>
  );
};

export default AppRoutes;