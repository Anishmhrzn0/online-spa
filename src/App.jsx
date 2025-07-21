import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Booking from './components/Booking';
import UserProfile from './components/UserProfile';

function App() {
  const [currentSection, setCurrentSection] = useState('home');
   const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);


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
      const sections = ['home', 'services', 'about', 'booking'];
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
    <div className="min-h-screen bg-white cursor-default">
      <Header
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
         user={user}
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
                  onBookingSuccess={refreshUserData}
                />
              </section>
              
              <section id="about" className="min-h-screen">
                <About />
              </section>
            </main>
            
      {/* <Footer/> */}
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