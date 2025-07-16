import React,{useState} from 'react';
import { Droplets, Thermometer, Flower, Settings } from 'lucide-react';

const Booking = ({ user }) => {
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
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8"></form>
          </div>
        </div>
     </section>
    );      
};
export default Booking;
  