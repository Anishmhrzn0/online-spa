import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Trash2, Calendar, Clock, User, Mail, Phone, Edit, Save, X, Plus, Loader } from 'lucide-react';
import { adminAPI, bookingsAPI, servicesAPI, usersAPI } from '../services/api';

const Admin = ({ user }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashboardRes, bookingsRes, servicesRes, usersRes] = await Promise.all([
        adminAPI.getDashboard(),
        bookingsAPI.getAll(),
        servicesAPI.getAll(),
        usersAPI.getAll()
      ]);

      setDashboardData(dashboardRes.data);
      setBookings(bookingsRes.data || []);
      setServices(servicesRes.data || []);
      setUsers(usersRes.data || []);
    } catch (err) {
      console.error('Error loading admin data:', err);
      setError('Failed to load admin data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await bookingsAPI.delete(bookingId);
        setBookings(bookings.filter(booking => booking.id !== bookingId));
        setSelectedBooking(null);
      } catch (err) {
        console.error('Error deleting booking:', err);
        alert('Failed to delete booking. Please try again.');
      }
    }
  };

  const handleEditService = (service) => {
    setEditingService(service.id);
    setEditForm({
      title: service.title,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration.toString(),
      category: service.category,
      features: Array.isArray(service.features) ? service.features.join(', ') : ''
    });
  };

  const handleSaveService = async () => {
    try {
      const serviceData = {
        title: editForm.title,
        description: editForm.description,
        price: parseFloat(editForm.price),
        duration: parseInt(editForm.duration),
        category: editForm.category,
        features: editForm.features.split(',').map(f => f.trim()).filter(f => f)
      };

      const updatedService = await servicesAPI.update(editingService, serviceData);
      setServices(services.map(service => 
        service.id === editingService ? updatedService.data : service
      ));
      setEditingService(null);
      setEditForm({});
    } catch (err) {
      console.error('Error updating service:', err);
      alert('Failed to update service. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingService(null);
    setEditForm({});
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return '✓';
      case 'pending': return '⏳';
      case 'cancelled': return '✗';
      case 'completed': return '✓';
      default: return '?';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center justify-center h-64">
          <Loader className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading admin dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={loadAllData}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.firstName || 'Admin'}!</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'bookings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Bookings ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'services'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Services ({services.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Users ({users.length})
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'dashboard' && dashboardData && (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-blue-600">{dashboardData.statistics.totalUsers}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Bookings</h3>
              <p className="text-3xl font-bold text-green-600">{dashboardData.statistics.totalBookings}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Services</h3>
              <p className="text-3xl font-bold text-purple-600">{dashboardData.statistics.totalServices}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold text-orange-600">${dashboardData.statistics.totalRevenue}</p>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboardData.recentBookings.slice(0, 5).map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.user.firstName} {booking.user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{booking.user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.service.title}</div>
                        <div className="text-sm text-gray-500">${booking.service.price}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(booking.appointmentDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'bookings' && (
        <>
          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search by customer name, email, or service..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                          <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.service?.title || 'N/A'}</div>
                        <div className="text-sm text-gray-500">${booking.totalAmount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(booking.appointmentDate).toLocaleDateString()}</div>
                        <div className="text-sm text-gray-500">{booking.appointmentTime}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          <span className="mr-1">{getStatusIcon(booking.status)}</span>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="text-red-600 hover:text-red-900 flex items-center"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredBookings.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No bookings found matching your criteria.</p>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'services' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Service Management</h3>
            <p className="text-sm text-gray-500">Edit service details, pricing, and features</p>
          </div>
          <div className="divide-y divide-gray-200">
            {services.map((service) => (
              <div key={service.id} className="p-6">
                {editingService === service.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Service Title</label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editForm.price}
                          onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                        <input
                          type="number"
                          value={editForm.duration}
                          onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                          value={editForm.category}
                          onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Massage">Massage</option>
                          <option value="Facial">Facial</option>
                          <option value="BodyTreatment">Body Treatment</option>
                          <option value="Wellness">Wellness</option>
                          <option value="Specialty">Specialty</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma-separated)</label>
                      <input
                        type="text"
                        value={editForm.features}
                        onChange={(e) => setEditForm({ ...editForm, features: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Feature 1, Feature 2, Feature 3"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSaveService}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{service.title}</h4>
                        <p className="text-gray-600 mt-1">{service.description}</p>
                      </div>
                      <button
                        onClick={() => handleEditService(service)}
                        className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                    </div>
                    <div className="flex items-center space-x-4 mb-3">
                      <span className="text-lg font-semibold text-blue-600">${service.price}</span>
                      <span className="text-gray-500">{service.duration} minutes</span>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{service.category}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(service.features) && service.features.map((feature, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">User Management</h3>
            <p className="text-sm text-gray-500">View and manage user accounts</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Membership</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Points</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-gray-500">{user.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {user.membershipStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.points}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Booking Details</h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <User className="h-5 w-5 mr-2 text-blue-600" />
                      Customer Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Name:</span> {selectedBooking.customerName}</p>
                      <p className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {selectedBooking.customerEmail}
                      </p>
                      <p className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {selectedBooking.customerPhone}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Service Details</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Service:</span> {selectedBooking.service?.title || 'N/A'}</p>
                      <p><span className="font-medium">Price:</span> ${selectedBooking.totalAmount}</p>
                      <p><span className="font-medium">Duration:</span> {selectedBooking.service?.duration || 'N/A'} minutes</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                    Appointment Schedule
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                        <span className="font-medium">{new Date(selectedBooking.appointmentDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-600" />
                        <span className="font-medium">{selectedBooking.appointmentTime}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBooking.status)}`}>
                        {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {selectedBooking.specialRequests && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Special Requests</h4>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-gray-700">{selectedBooking.specialRequests}</p>
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Booking Information</h4>
                  <div className="text-sm text-gray-600">
                    <p><span className="font-medium">Booking ID:</span> #{selectedBooking.id}</p>
                    <p><span className="font-medium">Created:</span> {new Date(selectedBooking.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => handleDeleteBooking(selectedBooking.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Booking
                </button>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;