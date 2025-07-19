import React, { useState, useEffect } from 'react';
import { User, Calendar, Phone, Mail, Settings, LogOut, Clock, Star, Gift, Edit, Trash2, CheckCircle } from 'lucide-react';

const UserProfile = ({ user, onLogout, onClose, isOpen, onUserUpdate }) => {
  const [activeTab, setActiveTab] = useState('bookings');

  // Get user's actual bookings from localStorage
  const getUserBookings = () => {
    if (!user) return [];
    const users = JSON.parse(localStorage.getItem('aqualux_users') || '[]');
    const currentUser = users.find((u) => u.id === user.id);
    return currentUser?.bookings || [];
  };

  const [userBookings, setUserBookings] = useState(getUserBookings());

  // Refresh bookings when user changes or component opens
  useEffect(() => {
    if (user && isOpen) {
      const updatedBookings = getUserBookings();
      setUserBookings(updatedBookings);
    }
  }, [user, isOpen]);

  // Update user bookings in localStorage
  const updateUserBookings = (newBookings) => {
    const users = JSON.parse(localStorage.getItem('aqualux_users') || '[]');
    const userIndex = users.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex].bookings = newBookings;
      localStorage.setItem('aqualux_users', JSON.stringify(users));
      
      // Update current user in localStorage
      const updatedUser = { ...user, bookings: newBookings };
      localStorage.setItem('aqualux_current_user', JSON.stringify(updatedUser));
      
      // Update parent component
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }
      
      setUserBookings(newBookings);
    }
  };

  const cancelBooking = (bookingId) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      const updatedBookings = userBookings.filter((booking) => booking.id !== bookingId);
      updateUserBookings(updatedBookings);
      alert('Booking cancelled successfully.');
    }
  };

  const rescheduleBooking = (bookingId) => {
    const newDate = prompt('Enter new date (YYYY-MM-DD):');
    const newTime = prompt('Enter new time (HH:MM):');
    
    if (newDate && newTime) {
      const updatedBookings = userBookings.map((booking) => 
        booking.id === bookingId 
          ? { ...booking, date: newDate, time: newTime, status: 'rescheduled' }
          : booking
      );
      updateUserBookings(updatedBookings);
      alert('Booking rescheduled successfully.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'rescheduled':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const addSampleBooking = () => {
    const sampleBooking = {
      id: Date.now(),
      service: 'Hydrotherapy Supreme',
      date: '2025-01-20',
      time: '14:00',
      status: 'confirmed',
      price: 180,
      preferences: {
        temperature: 'medium',
        aromatherapy: 'lavender',
        pressure: 'medium',
        duration: '90'
      },
      bookedAt: new Date().toISOString()
    };
    
    const updatedBookings = [...userBookings, sampleBooking];
    updateUserBookings(updatedBookings);
    alert('Sample booking added! You can now see how your bookings will appear.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-full w-16 h-16 flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-600">Member since {new Date(user.memberSince).getFullYear()}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex space-x-1 mb-8 bg-gray-100 rounded-lg p-1">
            {[
              { id: 'bookings', label: 'My Bookings', icon: Calendar },
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'rewards', label: 'Rewards', icon: Gift }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <Settings className="h-5 w-5" />
              <span>Account Settings</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;