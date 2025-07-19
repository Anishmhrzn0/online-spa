import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Booking from './components/Booking';
import UserProfile from './components/UserProfile';

function App() {
  const [currentSection, setCurrentSection] = useState('home');
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

  const handleLogout = () => {
    setUser(null);
    setShowProfile(false);
    localStorage.removeItem('aqualux_current_user');
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

      <main className='m'>
        <section id="home" className="min-h-screen">
          <Hero className="" />
        </section>

        <section id="services" className="min-h-screen">
          <Services />
        </section>

        <section id="about" className="min-h-screen">
          <About />
        </section>

        <section id="booking" className="min-h-screen">
          <Booking />
        </section>
      </main>
      <Footer />
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