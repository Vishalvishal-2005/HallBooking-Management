import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Building,
  MapPin,
  User,
  RefreshCw,
  Filter,
  Search,
  MoreVertical,
  Eye,
  MessageCircle,
  TrendingUp
} from 'lucide-react';
import { api } from '../services/api';

const OwnerBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setError(null);
      console.log('Fetching owner bookings...');
      
      const bookingsData = await api.get('/api/owner/bookings');
      console.log('Bookings data:', bookingsData);
      
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.message || 'Failed to load bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      console.log(`Updating booking ${bookingId} to ${status}`);
      await api.put(`/api/owner/bookings/${bookingId}/status`, { status });
      setShowConfirmModal(null);
      fetchBookings();
    } catch (err) {
      console.error('Error updating booking:', err);
      alert(err.message || 'Failed to update booking status');
    }
  };

  const getStatusConfig = (status) => {
    const config = {
      PENDING: { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-800', 
        border: 'border-yellow-200',
        icon: Clock,
        color: 'from-yellow-400 to-yellow-500',
        actionColor: 'bg-gradient-to-r from-yellow-500 to-yellow-600'
      },
      APPROVED: { 
        bg: 'bg-green-100', 
        text: 'text-green-800',
        border: 'border-green-200',
        icon: CheckCircle,
        color: 'from-green-400 to-green-500',
        actionColor: 'bg-gradient-to-r from-green-500 to-green-600'
      },
      REJECTED: { 
        bg: 'bg-red-100', 
        text: 'text-red-800',
        border: 'border-red-200',
        icon: XCircle,
        color: 'from-red-400 to-red-500',
        actionColor: 'bg-gradient-to-r from-red-500 to-red-600'
      },
      CANCELLED: { 
        bg: 'bg-gray-100', 
        text: 'text-gray-800',
        border: 'border-gray-200',
        icon: AlertCircle,
        color: 'from-gray-400 to-gray-500',
        actionColor: 'bg-gradient-to-r from-gray-500 to-gray-600'
      },
      COMPLETED: { 
        bg: 'bg-blue-100', 
        text: 'text-blue-800',
        border: 'border-blue-200',
        icon: CheckCircle,
        color: 'from-blue-400 to-blue-500',
        actionColor: 'bg-gradient-to-r from-blue-500 to-blue-600'
      }
    };

    return config[status] || config.PENDING;
  };

  const getStatusBadge = (status) => {
    const statusConfig = getStatusConfig(status);
    const Icon = statusConfig.icon;

    return (
      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
        <Icon className="h-4 w-4" />
        {status}
      </span>
    );
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.hall?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.event_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    ALL: bookings.length,
    PENDING: bookings.filter(b => b.status === 'PENDING').length,
    APPROVED: bookings.filter(b => b.status === 'APPROVED').length,
    COMPLETED: bookings.filter(b => b.status === 'COMPLETED').length,
    REJECTED: bookings.filter(b => b.status === 'REJECTED').length,
    CANCELLED: bookings.filter(b => b.status === 'CANCELLED').length
  };

  const hasBookings = Array.isArray(bookings) && bookings.length > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-200">
            <AlertCircle className="h-24 w-24 mx-auto text-red-400 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Bookings</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
            <button
              onClick={fetchBookings}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Venue Bookings
              </h1>
              <p className="text-gray-600 text-lg">Manage and monitor bookings for your venues</p>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={fetchBookings}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 font-semibold text-gray-700"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          {Object.entries(statusCounts).map(([status, count]) => {
            const statusConfig = getStatusConfig(status);
            const isActive = statusFilter === status;
            
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                  isActive 
                    ? `bg-gradient-to-r ${statusConfig.color} text-white border-transparent shadow-lg` 
                    : 'bg-white border-gray-200 hover:shadow-md text-gray-700'
                }`}
              >
                <div className="text-2xl font-bold mb-1">{count}</div>
                <div className="text-sm font-medium">{status}</div>
              </button>
            );
          })}
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bookings by venue, user, or event..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              Showing {filteredBookings.length} of {bookings.length} bookings
            </div>
          </div>
        </div>

        {!hasBookings ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-200">
            <Calendar className="h-24 w-24 mx-auto text-gray-400 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Bookings Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Bookings for your venues will appear here once customers start making reservations.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={fetchBookings}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                Check Again
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map(booking => {
              const statusConfig = getStatusConfig(booking.status);
              
              return (
                <div 
                  key={booking.id} 
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      {/* Left Section - Booking Details */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                              {booking.hall?.name || `Venue #${booking.hall_id}`}
                            </h3>
                            <div className="flex items-center gap-4 flex-wrap">
                              {getStatusBadge(booking.status)}
                              <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                  {new Date(booking.start_time).toLocaleDateString('en-US', { 
                                    weekday: 'short', 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setSelectedBooking(booking)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Eye className="h-4 w-4 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <MoreVertical className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                              <Clock className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-600">Time Slot</div>
                              <div className="font-semibold text-gray-900">
                                {new Date(booking.start_time).toLocaleTimeString()} - {new Date(booking.end_time).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                              <Users className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-600">Attendees</div>
                              <div className="font-semibold text-gray-900">{booking.attendees} people</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                              <DollarSign className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-600">Total Amount</div>
                              <div className="font-semibold text-gray-900">₹{booking.total_amount}</div>
                            </div>
                          </div>
                        </div>

                        {/* Event Details */}
                        {(booking.event_name || booking.event_type || booking.remarks) && (
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex flex-wrap gap-4">
                              {booking.event_name && (
                                <div>
                                  <span className="text-sm text-gray-600">Event:</span>
                                  <span className="ml-2 font-medium text-gray-900">{booking.event_name}</span>
                                </div>
                              )}
                              {booking.event_type && (
                                <div>
                                  <span className="text-sm text-gray-600">Type:</span>
                                  <span className="ml-2 font-medium text-gray-900">{booking.event_type}</span>
                                </div>
                              )}
                              {booking.remarks && (
                                <div className="flex items-start gap-2">
                                  <MessageCircle className="h-4 w-4 text-gray-400 mt-0.5" />
                                  <span className="text-sm text-gray-600">{booking.remarks}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Section - User Info & Actions */}
                      <div className="lg:w-80 space-y-4">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <User className="h-4 w-4 text-green-600" />
                            Customer Information
                          </h4>
                          <div className="space-y-2">
                            <p className="font-medium text-gray-900">{booking.user?.full_name}</p>
                            <p className="text-sm text-gray-600">{booking.user?.email}</p>
                            {booking.user?.phone && (
                              <p className="text-sm text-gray-600">{booking.user.phone}</p>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {booking.status === 'PENDING' && (
                          <div className="space-y-3">
                            <button
                              onClick={() => setShowConfirmModal({ id: booking.id, action: 'APPROVE' })}
                              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                              <CheckCircle className="h-5 w-5" />
                              Approve Booking
                            </button>
                            <button
                              onClick={() => setShowConfirmModal({ id: booking.id, action: 'REJECT' })}
                              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                              <XCircle className="h-5 w-5" />
                              Reject Booking
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500/50 transition-all duration-300 pointer-events-none"></div>
                </div>
              );
            })}
          </div>
        )}

        {/* Booking Detail Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-900">Booking Details</h3>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Venue Information</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-gray-600">Name:</span>
                          <span className="ml-2 font-medium text-gray-900">{selectedBooking.hall?.name}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Location:</span>
                          <span className="ml-2 font-medium text-gray-900">{selectedBooking.hall?.location}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Capacity:</span>
                          <span className="ml-2 font-medium text-gray-900">{selectedBooking.hall?.capacity} people</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Event Information</h4>
                      <div className="space-y-2">
                        {selectedBooking.event_name && (
                          <div>
                            <span className="text-sm text-gray-600">Event Name:</span>
                            <span className="ml-2 font-medium text-gray-900">{selectedBooking.event_name}</span>
                          </div>
                        )}
                        {selectedBooking.event_type && (
                          <div>
                            <span className="text-sm text-gray-600">Event Type:</span>
                            <span className="ml-2 font-medium text-gray-900">{selectedBooking.event_type}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-sm text-gray-600">Attendees:</span>
                          <span className="ml-2 font-medium text-gray-900">{selectedBooking.attendees}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Booking Details</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium">{new Date(selectedBooking.start_time).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time:</span>
                          <span className="font-medium">
                            {new Date(selectedBooking.start_time).toLocaleTimeString()} - {new Date(selectedBooking.end_time).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          {getStatusBadge(selectedBooking.status)}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="font-medium text-green-600">₹{selectedBooking.total_amount}</span>
                        </div>
                      </div>
                    </div>

                    {selectedBooking.remarks && (
                      <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Customer Remarks</h4>
                        <p className="text-gray-700">{selectedBooking.remarks}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full transform transition-all duration-300 scale-100">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    showConfirmModal.action === 'APPROVE' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {showConfirmModal.action === 'APPROVE' ? 
                      <CheckCircle className="h-6 w-6 text-green-600" /> : 
                      <XCircle className="h-6 w-6 text-red-600" />
                    }
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {showConfirmModal.action === 'APPROVE' ? 'Approve Booking' : 'Reject Booking'}
                    </h3>
                    <p className="text-gray-600">Are you sure you want to proceed?</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">
                  {showConfirmModal.action === 'APPROVE' 
                    ? 'This booking will be confirmed and the customer will be notified.'
                    : 'This booking will be rejected and the customer will be notified.'
                  }
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmModal(null)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => updateBookingStatus(
                      showConfirmModal.id, 
                      showConfirmModal.action === 'APPROVE' ? 'APPROVED' : 'REJECTED'
                    )}
                    className={`flex-1 px-6 py-3 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl ${
                      showConfirmModal.action === 'APPROVE' 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' 
                        : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                    }`}
                  >
                    {showConfirmModal.action === 'APPROVE' ? 'Approve' : 'Reject'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerBookingsPage;