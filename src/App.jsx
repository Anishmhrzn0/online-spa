import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Auth from './components/Auth';
import UserProfile from './components/UserProfile';
import Booking from './components/Booking';

function App() {
  const [currentSection, setCurrentSection] = useState('home');

 
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([
    // Pre-registered admin user
    
  ]);
  const [allBookings, setAllBookings] = useState([
    {
      id: 1,
      serviceId: 1,
      serviceName: 'Hydrotherapy Supreme',
      servicePrice: '$180',
      date: '2024-01-15',
      time: '2:00 PM',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.j@email.com',
      customerPhone: '+1 (555) 123-4567',
      status: 'confirmed',
      createdAt: '2024-01-10T10:00:00Z'
    },
    {
      id: 2,
      serviceId: 3,
      serviceName: 'Aromatherapy Luxe',
      servicePrice: '$200',
      date: '2024-01-28',
      time: '10:00 AM',
      customerName: 'Michael Chen',
      customerEmail: 'm.chen@email.com',
      customerPhone: '+1 (555) 987-6543',
      status: 'confirmed',
      createdAt: '2024-01-20T14:30:00Z'
    }
  ]);

  // Load user from localStorage on app start
  useEffect(() => {
    // Load registered users from localStorage
    const savedUsers = localStorage.getItem('aqualux_registered_users');
    if (savedUsers) {
      setRegisteredUsers(JSON.parse(savedUsers));
    }
    
    const savedUser = localStorage.getItem('aqualux_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      // Check if saved user is admin
    }
  }, []);

  const handleUserAuth = (userData) => {
    if (userData.type === 'signup') {
      // Handle new user registration
      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        password: userData.password,
        isAdmin: userData.email === 'admin@aqualuxspa.com',
        joinDate: new Date().toISOString()
      };
      
      // Add to registered users
      const updatedUsers = [...registeredUsers, newUser];
      setRegisteredUsers(updatedUsers);
      localStorage.setItem('aqualux_registered_users', JSON.stringify(updatedUsers));
      
      // Set as current user
      const userForSession = {
        id: newUser.id, 
        name: newUser.name,
        email: newUser.email,
        joinDate: newUser.joinDate,
        isAdmin: newUser.isAdmin
      };
      
      if (newUser.isAdmin) {
        setIsAdmin(true);
      }
      
      setUser(userForSession);
      localStorage.setItem('aqualux_user', JSON.stringify(userForSession));
    } else {
      // Handle existing user login
      if (userData.isAdmin) {
        setIsAdmin(true);
      }
      
      setUser(userData);
      localStorage.setItem('aqualux_user', JSON.stringify(userData));
    }
    
    setShowAuthModal(false);
  };

  const handleUserLogout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('aqualux_user');
    setShowUserProfile(false);
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('aqualux_user', JSON.stringify(updatedUser));
  };

  const handleBookService = (service) => {
    if (!user) {
      alert('Please create an account or sign in to book treatments.');
      setShowAuth(true);
      return;
    }
    setSelectedService(service);
    setShowBooking(true);
  };

  const handleBookingComplete = (booking) => {
    setAllBookings(prevBookings => [...prevBookings, booking]);
    // Also add to user's personal booking history
    if (user && booking.customerEmail === user.email) {
      setUserBookings(prevUserBookings => [...prevUserBookings, booking]);
    }
    // You could also save to localStorage or send to a backend here
    alert(`Booking confirmed! Your ${booking.serviceName} appointment is scheduled for ${booking.date} at ${booking.time}.`);
  };
  // Update current section based on scroll position
  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      // Update booking status to cancelled in allBookings
      setAllBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      );
      
      // Update user's personal booking history
      setUserBookings(prevUserBookings => 
        prevUserBookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      );
      
      alert('Booking has been cancelled successfully.');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'services', 'about'];
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

  // Load user bookings when user changes
  useEffect(() => {
    if (user) {
      // Filter bookings for current user and update userBookings
      const filteredBookings = allBookings.filter(booking => 
        booking.customerEmail === user.email
      );
      setUserBookings(filteredBookings);
    } else {
      setUserBookings([]);
    }
  }, [user, allBookings]);

  // Admin mode rendering

  
  return (
    <div className="min-h-screen bg-white">
      <Header 
        currentSection={currentSection} 
        user={user}
        onAuthClick={() => setShowAuthModal(true)}
        onProfileClick={() => setShowUserProfile(true)}
      />
      
      <main>
        <section id="home">
          <Hero />
        </section>
        
        <section id="services">
          <Services onBookService={handleBookService} user={user} />
        </section>
      </main>
      
      {/* Authentication */}
      <Auth
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onAuth={handleUserAuth}
        registeredUsers={registeredUsers}
      />

      {/* User Profile Modal */}
      {user && showUserProfile && (
        <UserProfile
          user={user}
          userBookings={userBookings}
          onClose={() => setShowUserProfile(false)}
          onUpdateUser={handleUpdateUser}
          onLogout={handleUserLogout}
          onCancelBooking={handleCancelBooking}
        />
      )}

      {/* Booking*/}
      <Booking
        isOpen={showBooking}
        onClose={() => setShowBooking(false)}
        service={selectedService}
        user={user}
        onBookingComplete={handleBookingComplete}
      />

      {/* Hidden admin access hint */}
      <div className="fixed bottom-4 right-4 opacity-20 hover:opacity-100 transition-opacity duration-300">
        <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded">
          <div className="text-center">
            <div className="font-medium">Admin Access:</div>
            <div>Ctrl+Shift+A</div>
            <div>?admin=true</div>
            <div>admin@aqualuxspa.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;