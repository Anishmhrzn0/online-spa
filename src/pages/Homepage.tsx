import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSpa } from '../context/SpaContext';
import TestimonialSlider from '../components/testimonials/TestimonialSlider';
import { ArrowRight } from 'lucide-react';

const Homepage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0 bg-cover bg-center z-0" style={{ 
          backgroundImage: 'url(https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg)',
          backgroundPosition: 'center 30%'
        }}>
          <div className="absolute inset-0 bg-charcoal opacity-40"></div>
        </div>
        
        <div className="container-custom relative z-10 text-white">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 leading-tight">
              Experience Ultimate Relaxation & Rejuvenation
            </h1>
            <p className="text-lg md:text-xl mb-8 text-sand">
              Discover a sanctuary of peace and tranquility where your wellbeing is our priority.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/booking" className="btn-primary">
                Book Your Appointment
              </Link>
              <Link to="/services" className="btn-secondary bg-transparent border-white text-white hover:bg-white hover:text-charcoal">
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Welcome Section */}
      <section className="section bg-sand">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
              <h2 className="text-3xl md:text-4xl font-serif mb-6 text-charcoal">Welcome to Tranquil Haven</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                At Tranquil Haven, we believe in the power of relaxation and rejuvenation. Our luxury spa offers a 
                serene escape from the hustle and bustle of daily life, allowing you to unwind and reconnect with yourself.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Our skilled therapists are dedicated to providing personalized treatments that cater to your specific 
                needs, ensuring that each visit leaves you feeling refreshed and revitalized.
              </p>
              <Link to="/services" className="inline-flex items-center text-teal hover:text-teal-dark transition-colors duration-300">
                <span className="mr-2">Discover our philosophy</span>
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/5240697/pexels-photo-5240697.jpeg" 
                  alt="Spa ambiance" 
                  className="rounded-lg shadow-lg w-full h-auto"
                />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-teal rounded-lg shadow-lg hidden md:flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-2xl font-serif">15+</div>
                    <div className="text-sm">Years of Excellence</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Services */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif mb-4 text-charcoal">Our Featured Treatments</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Indulge in our most popular spa experiences, designed to relax, rejuvenate, and restore.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
          </div>
          
          <div className="text-center mt-12">
            <Link to="/services" className="btn-secondary">
              View All Services
            </Link>
          </div>
        </div>
      </section>
      
      </div>
  );
};

export default Homepage;