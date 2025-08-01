import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import About from '../components/About';
import Hero from '../components/Hero';
import Services from '../components/Services';
import BookingPage from '../components/Booking';
import UserProfile from '../components/UserProfile';
import Admin from '../components/Admin';

const Home = ({ user, onBookingComplete }) => (
  <div className="min-h-screen">
    <Hero />
    <About />
    <Services user={user} />
    <div id="booking">
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!(user && user.isAdmin) ? (
            <>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Book Your Treatment
                </h2>
                <p className="text-xl text-gray-600">
                  Reserve your spot for the ultimate spa experience
                </p>
              </div>
              <BookingPage user={user} onBookingComplete={onBookingComplete} />
            </>
          ) : null}
        </div>
      </div>
    </div>
  </div>
);

const ServicesPage = ({ user, onBookingComplete }) => (
  <div className="min-h-screen pt-16">
    <div className="py-20">
      <Services user={user} />
    </div>
    {!(user && user.isAdmin) && (
      <div id="booking">
        <div className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Book Your Treatment
              </h2>
              <p className="text-xl text-gray-600">
                Reserve your spot for the ultimate spa experience
              </p>
            </div>
            <BookingPage user={user} onBookingComplete={onBookingComplete} />
          </div>
        </div>
      </div>
    )}
  </div>
);

const BookingOnlyPage = ({ user, onBookingComplete }) => (
  !(user && user.isAdmin) ? (
    <div className="min-h-screen pt-16">
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Book Your Treatment
            </h2>
            <p className="text-xl text-gray-600">
              Reserve your spot for the ultimate spa experience
            </p>
          </div>
          <BookingPage user={user} onBookingComplete={onBookingComplete} />
        </div>
      </div>
    </div>
  ) : null
);

const AppRoutes = ({ user, userBookings, allBookings, setAllBookings, onBookingComplete }) => {
  return (
    <Routes>
      <Route path="/" element={<div className="pt-22"><Home user={user} onBookingComplete={onBookingComplete} /></div>} />
      <Route path="/about" element={<div className="pt-22"><About /></div>} />
      <Route path="/services" element={<div className="pt-22"><ServicesPage user={user} onBookingComplete={onBookingComplete} /></div>} />
      <Route path="/booking" element={<div className="pt-22"><BookingOnlyPage user={user} onBookingComplete={onBookingComplete} /></div>} />
      <Route path="/user-profile" element={<div className="pt-22"><UserProfile user={user} userBookings={userBookings} /></div>} />
      <Route 
        path="/admin" 
        element={
          user && user.isAdmin ? (
            <div className="pt-22">
              <Admin user={user} allBookings={allBookings} setAllBookings={setAllBookings} />
            </div>
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
    </Routes>
  );
};

export default AppRoutes;