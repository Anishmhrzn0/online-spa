import React, { useState } from 'react';
import { useEffect } from 'react';
import { Calendar, Clock, User, Mail, Phone, CreditCard } from 'lucide-react';
import { defaultServices } from './Services';
import { bookingsAPI, servicesAPI } from '../services/api.js';

const BookingPage = ({ user, onBookingComplete }) => {
  const [services, setServices] = useState(defaultServices);
  const [selectedServiceId, setSelectedServiceId] = useState(defaultServices[0].id);
  const service = services.find(s => s.id === selectedServiceId);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    specialRequests: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Load services from backend API
  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await servicesAPI.getAll();
        if (response.success && response.data.length > 0) {
          setServices(response.data);
          setSelectedServiceId(response.data[0].id);
        } else {
          setServices(defaultServices);
        }
      } catch (error) {
        console.error('Error loading services:', error);
        setServices(defaultServices);
      }
    };

    loadServices();
  }, []);

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
    '5:00 PM', '6:00 PM', '7:00 PM'
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!bookingData.date) newErrors.date = 'Date is required';
    if (!bookingData.time) newErrors.time = 'Time is required';
    if (!bookingData.name.trim()) newErrors.name = 'Name is required';
    if (!bookingData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(bookingData.email)) newErrors.email = 'Email is invalid';
    if (!bookingData.phone.trim()) newErrors.phone = 'Phone is required';
    if (bookingData.date) {
      const selectedDate = new Date(bookingData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'Please select a future date';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const bookingDataToSend = {
        serviceId: service.id,
        appointmentDate: bookingData.date,
        appointmentTime: bookingData.time,
        customerName: bookingData.name,
        customerEmail: bookingData.email,
        customerPhone: bookingData.phone,
        specialRequests: bookingData.specialRequests
      };

      const response = await bookingsAPI.create(bookingDataToSend);

      if (response.success) {
      const booking = {
          id: response.data.id,
        serviceId: service.id,
        serviceName: service.title,
        servicePrice: service.price,
        serviceDuration: service.duration,
        date: bookingData.date,
        time: bookingData.time,
        customerName: bookingData.name,
        customerEmail: bookingData.email,
        customerPhone: bookingData.phone,
        specialRequests: bookingData.specialRequests,
          status: response.data.status,
          createdAt: response.data.createdAt
      };

      if (onBookingComplete) onBookingComplete(booking);
        
      setBookingData({
        date: '',
        time: '',
          name: user?.firstName ? `${user.firstName} ${user.lastName}` : '',
        email: user?.email || '',
          phone: user?.phone || '',
        specialRequests: ''
      });
      setErrors({});
      alert(`Booking confirmed! Your ${booking.serviceName} appointment is scheduled for ${booking.date} at ${booking.time}.`);
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert(error.response?.data?.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 mt-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Book Your Treatment</h2>
      {/* Service Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select a Service</label>
        <select
          value={selectedServiceId}
          onChange={e => setSelectedServiceId(Number(e.target.value))}
          className="w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {services.map(s => (
            <option key={s.id} value={s.id}>{s.title} ({s.price}, {s.duration})</option>
          ))}
        </select>
      </div>
      {/* Service Details */}
      <div className="bg-blue-50 rounded-xl p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">{service.title}</h3>
        <p className="text-gray-600 text-sm mb-3">{service.description}</p>
        <div className="flex items-center space-x-4 mb-2">
          <span className="text-blue-600 font-semibold text-lg">{service.price}</span>
          <span className="text-gray-500">{service.duration}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {service.features.map((feature, idx) => (
            <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{feature}</span>
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="h-4 w-4 inline mr-1" /> Date
          </label>
          <input
            type="date"
            value={bookingData.date}
            onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
            className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.date ? 'border-red-300' : 'border-gray-300'}`}
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="h-4 w-4 inline mr-1" /> Time
          </label>
          <select
            value={bookingData.time}
            onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
            className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.time ? 'border-red-300' : 'border-gray-300'}`}
          >
            <option value="">Select a time</option>
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
          {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="h-4 w-4 inline mr-1" /> Full Name
          </label>
          <input
            type="text"
            value={bookingData.name}
            onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
            className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="Enter your full name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="h-4 w-4 inline mr-1" /> Email Address
          </label>
          <input
            type="email"
            value={bookingData.email}
            onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
            className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="h-4 w-4 inline mr-1" /> Phone Number
          </label>
          <input
            type="tel"
            value={bookingData.phone}
            onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
            className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="Enter your phone number"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Requests (Optional)
          </label>
          <textarea
            value={bookingData.specialRequests}
            onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
            placeholder="Any special requests or preferences..."
          />
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <CreditCard className="h-5 w-5 text-gray-600 mr-2" />
            <h4 className="font-semibold text-gray-900">Payment Information</h4>
          </div>
          <p className="text-gray-600 text-sm">
            Payment will be processed at the spa. You can pay by cash, card, or digital payment methods.
          </p>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Booking Your Treatment...' : `Book Treatment - ${service.price}`}
        </button>
      </form>
    </div>
  );
};

export default BookingPage;