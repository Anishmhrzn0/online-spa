import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import AppRoutes from './routes/appRoute';
import Auth from './components/Auth';
import UserProfile from './components/UserProfile';

function App() {
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [allBookings, setAllBookings] = useState([]);
  const [userBookings, setUserBookings] = useState([]);

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const authToken = localStorage.getItem('authToken');
    
    if (savedUser && authToken) {
      try {
        const userData = JSON.parse(savedUser);
        const userWithName = {
          ...userData,
          name: `${userData.firstName} ${userData.lastName}`,
          isAdmin: userData.isAdmin || false
        };
        setUser(userWithName);
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
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
      isAdmin: userData.isAdmin || false
    };
    setUser(userWithName);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setIsProfileOpen(false);
  };

  const handleBookingComplete = (booking) => {
    // Add to user's bookings
    const newUserBookings = [...userBookings, booking];
    setUserBookings(newUserBookings);

    // Add to all bookings for admin
    const newAllBookings = [...allBookings, booking];
    setAllBookings(newAllBookings);
    localStorage.setItem('aqualux_all_bookings', JSON.stringify(newAllBookings));
    
    // Force refresh of admin bookings if admin is viewing
    if (user && user.isAdmin) {
      const updatedBookings = JSON.parse(localStorage.getItem('aqualux_all_bookings') || '[]');
      setAllBookings(updatedBookings);
    }
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };



  return (
    <Router>
      <div className="App">
        <Header
          isAdmin={user && user.isAdmin}
          user={user}
          onAuthClick={() => setIsAuthOpen(true)}
          onProfileClick={() => setIsProfileOpen(true)}
        />
        
          <AppRoutes 
                    user={user} 
            userBookings={userBookings}
                    allBookings={allBookings} 
                    setAllBookings={setAllBookings} 
            onBookingComplete={handleBookingComplete}
          />

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