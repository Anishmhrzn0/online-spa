import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSpa } from '../../context/SpaContext';
import { Menu, X, User, Calendar, LogOut } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useSpa();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center z-50">
          <span className={`text-2xl font-serif font-bold transition-colors duration-300 ${
            isScrolled ? 'text-teal' : 'text-teal'
          }`}>
            Tranquil Haven
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className={`text-${isScrolled ? 'charcoal' : 'charcoal'} hover:text-teal transition-colors duration-300`}>
            Home
          </Link>
          <Link to="/services" className={`text-${isScrolled ? 'charcoal' : 'charcoal'} hover:text-teal transition-colors duration-300`}>
            Services
          </Link>
          <Link to="/booking" className={`text-${isScrolled ? 'charcoal' : 'charcoal'} hover:text-teal transition-colors duration-300`}>
            Book Now
          </Link>
          {currentUser ? (
            <div className="relative group">
              <button className="flex items-center space-x-1 text-teal">
                <User size={18} />
                <span>{currentUser.name.split(' ')[0]}</span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden transform 
              scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-300 origin-top-right">
                <button 
                  onClick={logout}
                  className="w-full text-left block px-4 py-2 hover:bg-teal hover:text-white transition-colors duration-300"
                >
                  <div className="flex items-center space-x-2">
                    <LogOut size={16} />
                    <span>Logout</span>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn-primary py-2 px-4">
              Login
            </Link>
          )}
        </nav>
        
        {/* Mobile Menu Button */}
        <button
          className="md:hidden z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X size={24} className={`${isScrolled ? 'text-charcoal' : 'text-charcoal'}`} />
          ) : (
            <Menu size={24} className={`${isScrolled ? 'text-charcoal' : 'text-charcoal'}`} />
          )}
        </button>
        
        {/* Mobile Navigation */}
        <div 
          className={`fixed inset-0 bg-white z-40 flex flex-col items-center justify-center space-y-8 transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <Link to="/" className="text-xl font-medium text-charcoal hover:text-teal transition-colors duration-300">
            Home
          </Link>
          {currentUser ? (
            <>
              <Link to={currentUser.isStaff ? "/staff" : "/customer"} className="text-xl font-medium text-charcoal hover:text-teal transition-colors duration-300">
                Dashboard
              </Link>
              <button 
                onClick={logout}
                className="text-xl font-medium text-charcoal hover:text-teal transition-colors duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;