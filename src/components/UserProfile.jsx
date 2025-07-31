import React, { useState, useEffect } from 'react';
import { User, Calendar, Phone, Mail, Settings, LogOut, Clock, Star, Edit, Trash2, CheckCircle, Loader } from 'lucide-react';
import { bookingsAPI } from '../services/api';

const UserProfile = ({ user, onLogout, onClose, isOpen, onUserUpdate }) => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    preferredTemperature: user?.preferences?.temperature || 'medium',
    favoriteAromatherapy: user?.preferences?.aromatherapy || 'lavender'
  });

  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user bookings from backend API
  const fetchUserBookings = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await bookingsAPI.getUserBookings();
      if (response.success) {
        setUserBookings(response.data);
      } else {
        setError('Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      setError('Failed to fetch bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Refresh bookings when user changes or component opens
  useEffect(() => {
    if (user && isOpen) {
      fetchUserBookings();
    }
  }, [user, isOpen]);

  const cancelBooking = async (bookingId) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      try {
        const response = await bookingsAPI.update(bookingId, { status: 'cancelled' });
        if (response.success) {
          // Refresh bookings after cancellation
          fetchUserBookings();
          alert('Booking cancelled successfully.');
        } else {
          alert('Failed to cancel booking. Please try again.');
        }
      } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Failed to cancel booking. Please try again.');
      }
    }
  };

  const rescheduleBooking = async (bookingId) => {
    const newDate = prompt('Enter new date (YYYY-MM-DD):');
    const newTime = prompt('Enter new time (HH:MM):');
    
    if (newDate && newTime) {
      try {
        const response = await bookingsAPI.update(bookingId, { 
          appointmentDate: newDate,
          appointmentTime: newTime,
          status: 'rescheduled'
        });
        if (response.success) {
          // Refresh bookings after rescheduling
          fetchUserBookings();
          alert('Booking rescheduled successfully.');
        } else {
          alert('Failed to reschedule booking. Please try again.');
        }
      } catch (error) {
        console.error('Error rescheduling booking:', error);
        alert('Failed to reschedule booking. Please try again.');
      }
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
            {(user?.isAdmin ? [
              { id: 'profile', label: 'Profile', icon: User }
            ] : [
              { id: 'bookings', label: 'My Bookings', icon: Calendar },
              { id: 'profile', label: 'Profile', icon: User }
            ]).map((tab) => (
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

          {activeTab === 'bookings' && !user?.isAdmin && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Your Bookings</h3>
                  <p className="text-gray-600">Manage your spa appointments and treatment history</p>
                </div>
                <div className="flex space-x-3">

                  <button 
                    onClick={() => {
                      const bookingElement = document.getElementById('booking');
                      if (bookingElement) {
                        onClose();
                        const headerHeight = 64;
                        const elementPosition = bookingElement.offsetTop - headerHeight;
                        window.scrollTo({
                          top: elementPosition,
                          behavior: 'smooth'
                        });
                      }
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    New Booking
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <Loader className="h-16 w-16 text-blue-500 animate-spin mx-auto" />
                  <p className="text-gray-600 mt-4">Loading your bookings...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12 bg-red-50 rounded-xl">
                  <p className="text-red-800">{error}</p>
                  <button 
                    onClick={fetchUserBookings}
                    className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Retry
                  </button>
                </div>
              ) : userBookings.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Yet</h4>
                  <p className="text-gray-600 mb-6">
                    You haven't made any spa appointments yet. Book your first treatment to start your wellness journey!
                  </p>
                  <button 
                    onClick={() => {
                      const bookingElement = document.getElementById('booking');
                      if (bookingElement) {
                        onClose();
                        const headerHeight = 64;
                        const elementPosition = bookingElement.offsetTop - headerHeight;
                        window.scrollTo({
                          top: elementPosition,
                          behavior: 'smooth'
                        });
                      }
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Book Your First Treatment
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userBookings.map((booking) => (
                    <div key={booking.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-gray-900 text-lg">
                              {booking.service?.title || 'Service'}
                            </h4>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(booking.appointmentDate).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>{booking.appointmentTime}</span>
                            </div>
                          </div>
                          {booking.specialRequests && (
                            <div className="mt-3 p-3 bg-white rounded-lg">
                              <h5 className="text-sm font-medium text-gray-900 mb-2">Special Requests:</h5>
                              <p className="text-sm text-gray-600">{booking.specialRequests}</p>
                            </div>
                          )}
                        </div>
                        <div className="text-right ml-6">
                          <div className="text-2xl font-bold text-gray-900 mb-2">
                            ${booking.service?.price || booking.totalAmount || '0'}
                          </div>
                          {booking.status === 'confirmed' && (
                            <div className="flex flex-col space-y-2">
                              <button
                                onClick={() => rescheduleBooking(booking.id)}
                                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                              >
                                <Edit className="h-4 w-4" />
                                <span>Reschedule</span>
                              </button>
                              <button
                                onClick={() => cancelBooking(booking.id)}
                                className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>Cancel</span>
                              </button>
                            </div>
                          )}
                          {booking.status === 'completed' && (
                            <div className="flex items-center space-x-1 text-green-600 text-sm">
                              <CheckCircle className="h-4 w-4" />
                              <span>Completed</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {booking.status === 'completed' && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">Rate your experience:</span>
                              <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star key={star} className="h-4 w-4 text-yellow-400 fill-current cursor-pointer hover:scale-110 transition-transform" />
                                ))}
                              </div>
                            </div>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                              Book Again
                            </button>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-3 text-xs text-gray-500">
                        Booked on {new Date(booking.bookedAt || booking.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">{user.phone || '+1 (555) 123-4567'}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">Member since {new Date(user.memberSince).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl p-6 text-white">
                  <h3 className="text-lg font-semibold mb-4">Membership Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="font-semibold">{user.membershipStatus || 'Premium Member'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Bookings:</span>
                      <span className="font-semibold">{userBookings.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Treatment Preferences</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Temperature
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option>Medium (100-104°F)</option>
                      <option>Cool (95-100°F)</option>
                      <option>Warm (104-108°F)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Favorite Aromatherapy
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option>Lavender (Relaxing)</option>
                      <option>Eucalyptus (Energizing)</option>
                      <option>Chamomile (Calming)</option>
                      <option>Citrus (Uplifting)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

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