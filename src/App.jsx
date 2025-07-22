import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Booking from './components/Booking';
import About from './components/About';
import Auth from './components/Auth';
import UserProfile from './components/UserProfile';

function App() {
  const [currentSection, setCurrentSection] = useState('home');
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('aqualux_current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Save current user to localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('aqualux_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('aqualux_current_user');
    }
  }, [user]);

  const handleSectionChange = (section) => {
    setCurrentSection(section);
    const element = document.getElementById(section);
    if (element) {
      const headerHeight = 64; // Height of fixed header
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleBookingClick = () => {
    setCurrentSection('booking');
    const element = document.getElementById('booking');
    if (element) {
      const headerHeight = 64; // Height of fixed header
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setShowAuth(false);
  };

  const handleLogout = () => {
    setUser(null);
    setShowProfile(false);
    localStorage.removeItem('aqualux_current_user');
  };

  const handleAuthRequired = () => {
    setShowAuth(true);
  };

  // Function to refresh user data from localStorage
  const refreshUserData = () => {
    if (user) {
      const users = JSON.parse(localStorage.getItem('aqualux_users') || '[]');
      const updatedUser = users.find((u) => u.id === user.id);
      if (updatedUser) {
        setUser(updatedUser);
      }
    }
  };

  // Update current section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'services', 'booking', 'about',];
      const headerHeight = 64;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= headerHeight + 100 && rect.bottom >= headerHeight + 100) {
            setCurrentSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header 
        currentSection={currentSection} 
        onSectionChange={handleSectionChange}
        user={user}
        onAuthClick={() => setShowAuth(true)}
        onProfileClick={() => setShowProfile(true)}
      />
      
      <main>
        <section id="home" className="min-h-screen">
          <Hero onBookingClick={handleBookingClick} />
        </section>
        
        <section id="services" className="min-h-screen">
          <Services />
        </section>
        
        <section id="booking" className="min-h-screen">
          <Booking 
            user={user} 
            onAuthRequired={handleAuthRequired}
            onBookingSuccess={refreshUserData}
          />
        </section>
        
        <section id="about" className="min-h-screen">
          <About />
        </section>
      </main>

      <Auth 
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onLogin={handleLogin}
      />

      <UserProfile
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        user={user}
        onLogout={handleLogout}
        onUserUpdate={setUser}
      />
    </div>
  );
}

export default App;