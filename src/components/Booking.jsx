import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, Mail, Droplets, Thermometer, Flower, Settings } from 'lucide-react';

const Booking = ({ user, onAuthRequired, onBookingSuccess }) => {
  const [selectedService, setSelectedService] = useState('hydrotherapy');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    name: user ? `${user.firstName} ${user.lastName}` : '',
    email: user?.email || '',
    phone: user?.phone || '',
    preferences: {
      temperature: 'medium',
      aromatherapy: 'lavender',
      pressure: 'medium',
      duration: '90'
    }
  });

  const services = [
    { id: 'hydrotherapy', name: 'Hydrotherapy Supreme', price: 180, icon: Droplets },
    { id: 'thermal', name: 'Thermal Equilibrium', price: 150, icon: Thermometer },
    { id: 'aromatherapy', name: 'Aromatherapy Luxe', price: 200, icon: Flower },
    { id: 'wellness', name: 'Wellness Intensive', price: 350, icon: Settings }
  ];

  const timeSlots = [
    '09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00', '19:30'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!user && onAuthRequired) {
      onAuthRequired();
      return;
    }

    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time for your appointment.');
      return;
    }
    
    // Create booking object
    const selectedServiceData = services.find(s => s.id === selectedService);
    const newBooking = {
      id: Date.now(),
      service: selectedServiceData?.name || 'Unknown Service',
      date: selectedDate,
      time: selectedTime,
      status: 'confirmed',
      price: selectedServiceData?.price || 0,
      preferences: formData.preferences,
      bookedAt: new Date().toISOString()
    };

    // Save booking to user's profile
    if (user) {
      const users = JSON.parse(localStorage.getItem('aqualux_users') || '[]');
      const userIndex = users.findIndex((u) => u.id === user.id);
      
      if (userIndex !== -1) {
        if (!users[userIndex].bookings) {
          users[userIndex].bookings = [];
        }
        users[userIndex].bookings.push(newBooking);
        localStorage.setItem('aqualux_users', JSON.stringify(users));
        
        // Update current user in localStorage
        const updatedUser = { ...user, bookings: users[userIndex].bookings };
        localStorage.setItem('aqualux_current_user', JSON.stringify(updatedUser));
        
        // Notify parent component to refresh user data
        if (onBookingSuccess) {
          onBookingSuccess();
        }
      }
    }
    
    // Reset form
    setSelectedDate('');
    setSelectedTime('');
    setFormData({
      ...formData,
      preferences: {
        temperature: 'medium',
        aromatherapy: 'lavender',
        pressure: 'medium',
        duration: '90'
      }
    });
    
    alert(`Booking confirmed! Your ${selectedServiceData?.name} appointment is scheduled for ${new Date(selectedDate).toLocaleDateString()} at ${selectedTime}. You can view and manage your bookings in your profile.`);
  };

  // Update form data when user changes
  React.useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone || ''
      });
    }
  }, [user]);

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Book Your Experience
          </h2>
          <p className="text-xl text-gray-600">
            Customize your perfect spa treatment with our advanced booking system
          </p>
          {!user && (
            <div className="mt-4 p-4 bg-blue-100 rounded-lg">
              <p className="text-blue-800">
                <strong>Sign in</strong> to save your preferences and manage your bookings easily!
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Service Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Droplets className="h-5 w-5 mr-2 text-blue-600" />
                Select Treatment
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      selectedService === service.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedService(service.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <service.icon className="h-6 w-6 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{service.name}</h4>
                        <p className="text-sm text-gray-600">${service.price}</p>
                        {user && (
                          <p className="text-xs text-green-600">Member discount applied</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Date & Time Selection */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Select Date *
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="h-4 w-4 inline mr-2" />
                  Select Time *
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Choose a time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Personal Information
                {user && <span className="ml-2 text-sm text-green-600">(Auto-filled from profile)</span>}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    readOnly={!!user}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4 inline mr-2" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    readOnly={!!user}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  readOnly={!!user}
                />
              </div>
            </div>

            {/* Treatment Preferences */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Settings className="h-5 w-5 mr-2 text-blue-600" />
                Treatment Preferences
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Water Temperature
                  </label>
                  <select
                    value={formData.preferences.temperature}
                    onChange={(e) => setFormData({
                      ...formData,
                      preferences: {...formData.preferences, temperature: e.target.value}
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="cool">Cool (95-100°F)</option>
                    <option value="medium">Medium (100-104°F)</option>
                    <option value="warm">Warm (104-108°F)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aromatherapy Blend
                  </label>
                  <select
                    value={formData.preferences.aromatherapy}
                    onChange={(e) => setFormData({
                      ...formData,
                      preferences: {...formData.preferences, aromatherapy: e.target.value}
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="lavender">Lavender (Relaxing)</option>
                    <option value="eucalyptus">Eucalyptus (Energizing)</option>
                    <option value="chamomile">Chamomile (Calming)</option>
                    <option value="citrus">Citrus (Uplifting)</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {user ? 'Book Your Experience' : 'Sign In to Book'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Booking;