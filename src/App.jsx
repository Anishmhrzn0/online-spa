import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import BookingPage from './components/Booking';
import Auth from './components/Auth';
import UserProfile from './components/UserProfile';
import Admin from './components/Admin';

function App() {
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [allBookings, setAllBookings] = useState([]);

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('aqualux_current_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('aqualux_current_user');
      }
    }

    // Load all bookings for admin
    const savedBookings = localStorage.getItem('aqualux_all_bookings');
    if (savedBookings) {
      try {
        setAllBookings(JSON.parse(savedBookings));
      } catch (error) {
        console.error('Error loading bookings from localStorage:', error);
      }
    }
  }, []);

  const handleLogin = (userData) => {
    const userWithName = {
      ...userData,
      name: `${userData.firstName} ${userData.lastName}`,
      isAdmin: userData.email === 'admin@aqualux.com' // Make admin user
    };
    setUser(userWithName);
    localStorage.setItem('aqualux_current_user', JSON.stringify(userWithName));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('aqualux_current_user');
    setIsProfileOpen(false);
  };

  const handleBookingComplete = (booking) => {
    // Add booking to user's bookings
    if (user) {
      const users = JSON.parse(localStorage.getItem('aqualux_users') || '[]');
      const userIndex = users.findIndex((u) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex].bookings = users[userIndex].bookings || [];
        users[userIndex].bookings.push(booking);
        localStorage.setItem('aqualux_users', JSON.stringify(users));
        
        // Update current user
        const updatedUser = { ...user, bookings: users[userIndex].bookings };
        setUser(updatedUser);
        localStorage.setItem('aqualux_current_user', JSON.stringify(updatedUser));
      }
    }

    // Add to all bookings for admin
    const newAllBookings = [...allBookings, booking];
    setAllBookings(newAllBookings);
    localStorage.setItem('aqualux_all_bookings', JSON.stringify(newAllBookings));
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('aqualux_current_user', JSON.stringify(updatedUser));
  };

  const HomePage = () => (
    <div className="min-h-screen">
      <Hero />
      <About />
      <Services />
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
            <BookingPage user={user} onBookingComplete={handleBookingComplete} />
          </div>
        </div>
      </div>
    </div>
  );

  const ServicesPage = () => (
    <div className="min-h-screen pt-16">
      <div className="py-20">
        <Services />
      </div>
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
            <BookingPage user={user} onBookingComplete={handleBookingComplete} />
          </div>
        </div>
      </div>
    </div>
  );

  const BookingOnlyPage = () => (
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
          <BookingPage user={user} onBookingComplete={handleBookingComplete} />
        </div>
      </div>
    </div>
  );

  return (
    <Router>
      <div className="App">
        <Header
          isAdmin={user?.isAdmin}
          user={user}
          onAuthClick={() => setIsAuthOpen(true)}
          onProfileClick={() => setIsProfileOpen(true)}
        />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/booking" element={<BookingOnlyPage />} />
          <Route 
            path="/admin" 
            element={
              user?.isAdmin ? (
                <div className="pt-16">
                  <Admin 
                    user={user} 
                    allBookings={allBookings} 
                    setAllBookings={setAllBookings} 
                  />
                </div>
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
        </Routes>

        <Auth
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onLogin={handleLogin}
        />

        <UserProfile
          user={user}
          onLogout={handleLogout}
          onClose={() => setIsProfileOpen(false)}
          isOpen={isProfileOpen}
          onUserUpdate={handleUserUpdate}
        />
      </div>
    </Router>
  );
}

export default App;