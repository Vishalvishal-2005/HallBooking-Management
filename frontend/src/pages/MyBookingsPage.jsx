import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Users, 
  MapPin, 
  Building, 
  X, 
  AlertCircle, 
  CheckCircle, 
  Shield, 
  Star 
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiCall } from '../services/api';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelConfirm, setShowCancelConfirm] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await apiCall('/api/bookings/my-bookings');
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      await apiCall(`/api/bookings/${bookingId}`, { method: 'DELETE' });
      fetchBookings();
      setShowCancelConfirm(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const getStatusConfig = (status) => {
    const config = {
      PENDING: { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock,
        gradient: 'from-yellow-400 to-yellow-500'
      },
      APPROVED: { 
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
        gradient: 'from-green-400 to-green-500'
      },
      REJECTED: { 
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: X,
        gradient: 'from-red-400 to-red-500'
      },
      CANCELLED: { 
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: X,
        gradient: 'from-gray-400 to-gray-500'
      },
      COMPLETED: { 
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: CheckCircle,
        gradient: 'from-blue-400 to-blue-500'
      }
    };
    return config[status] || config.PENDING;
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDuration = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const hours = Math.ceil((endTime - startTime) / (1000 * 60 * 60));
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex flex-col">
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Bookings
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Manage and track all your venue bookings in one place
            </p>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-lg">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Bookings Yet</h3>
              <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                Start by exploring our amazing venues and book your perfect event space
              </p>
              <button
                onClick={() => window.location.href = '/halls'}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                Browse Venues
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {bookings.map(booking => {
                const statusConfig = getStatusConfig(booking.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <div 
                    key={booking.id} 
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    {/* Header with Gradient */}
                    <div className={`bg-gradient-to-r ${statusConfig.gradient} p-6 text-white relative overflow-hidden`}>
                      <div className="absolute top-4 right-4">
                        <StatusIcon className="h-6 w-6 text-white/80" />
                      </div>
                      <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-2 line-clamp-1">
                          {booking.hall?.name || `Venue #${booking.hall_id}`}
                        </h3>
                        <div className="flex items-center gap-2 text-white/90">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{booking.hall?.location || 'Location not specified'}</span>
                        </div>
                      </div>
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-2 right-2 w-12 h-12 bg-white rounded-full"></div>
                        <div className="absolute bottom-2 left-2 w-8 h-8 bg-white rounded-full"></div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Status Badge */}
                      <div className="flex items-center justify-between mb-6">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${statusConfig.color}`}>
                          <StatusIcon className="h-4 w-4" />
                          {booking.status}
                        </span>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">₹{booking.total_amount}</div>
                          <div className="text-xs text-gray-500">Total Amount</div>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Calendar className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Event Date</div>
                            <div className="font-semibold text-gray-900">{formatDate(booking.start_time)}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Clock className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Time & Duration</div>
                            <div className="font-semibold text-gray-900">
                              {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {getDuration(booking.start_time, booking.end_time)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Users className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Attendees</div>
                            <div className="font-semibold text-gray-900">{booking.attendees} people</div>
                          </div>
                        </div>

                        {(booking.event_name || booking.event_type) && (
                          <div className="p-3 bg-gray-50 rounded-xl">
                            <div className="text-xs text-gray-500 mb-2">Event Details</div>
                            {booking.event_name && (
                              <div className="font-semibold text-gray-900 mb-1">{booking.event_name}</div>
                            )}
                            {booking.event_type && (
                              <div className="text-sm text-gray-600">{booking.event_type}</div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      {booking.status === 'PENDING' && (
                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowCancelConfirm(booking.id);
                            }}
                            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                          >
                            <X className="h-4 w-4" />
                            Cancel Booking
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500/50 transition-all duration-300 pointer-events-none"></div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

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
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                          <Building className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{selectedBooking.hall?.name}</div>
                          <div className="text-sm text-gray-600 flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {selectedBooking.hall?.location}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Event Information</h4>
                      {selectedBooking.event_name && (
                        <div className="mb-2">
                          <span className="text-sm text-gray-600">Event:</span>
                          <span className="ml-2 font-medium text-gray-900">{selectedBooking.event_name}</span>
                        </div>
                      )}
                      {selectedBooking.event_type && (
                        <div>
                          <span className="text-sm text-gray-600">Type:</span>
                          <span className="ml-2 font-medium text-gray-900">{selectedBooking.event_type}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Booking Details</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium">{formatDate(selectedBooking.start_time)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time:</span>
                          <span className="font-medium">
                            {formatTime(selectedBooking.start_time)} - {formatTime(selectedBooking.end_time)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">
                            {getDuration(selectedBooking.start_time, selectedBooking.end_time)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Attendees:</span>
                          <span className="font-medium">{selectedBooking.attendees}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Payment Information</h4>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900 mb-2">₹{selectedBooking.total_amount}</div>
                        <div className="text-sm text-gray-600">Total Amount Paid</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {showCancelConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full transform transition-all duration-300 scale-100">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Cancel Booking</h3>
                    <p className="text-gray-600">Are you sure you want to proceed?</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">
                  This action cannot be undone. Your booking will be permanently cancelled and any payments will be refunded according to our cancellation policy.
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCancelConfirm(null)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold"
                  >
                    Keep Booking
                  </button>
                  <button
                    onClick={() => cancelBooking(showCancelConfirm)}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                  >
                    Confirm Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stylish Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  HallBooker
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Your trusted partner for finding and booking the perfect event venues. AI-powered recommendations for unforgettable experiences.
              </p>
              <div className="flex items-center gap-2 text-gray-400">
                <Shield className="h-4 w-4" />
                <span className="text-sm">Secure & Reliable</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-lg mb-4 text-white">Quick Links</h3>
              <ul className="space-y-3">
                <li><a href="/halls" className="text-gray-300 hover:text-white transition-colors duration-200">Browse Halls</a></li>
                <li><a href="/my-bookings" className="text-gray-300 hover:text-white transition-colors duration-200">My Bookings</a></li>
                <li><a href="/about" className="text-gray-300 hover:text-white transition-colors duration-200">About Us</a></li>
                <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors duration-200">Contact</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-lg mb-4 text-white">Support</h3>
              <ul className="space-y-3">
                <li><a href="/help" className="text-gray-300 hover:text-white transition-colors duration-200">Help Center</a></li>
                <li><a href="/faq" className="text-gray-300 hover:text-white transition-colors duration-200">FAQ</a></li>
                <li><a href="/privacy" className="text-gray-300 hover:text-white transition-colors duration-200">Privacy Policy</a></li>
                <li><a href="/terms" className="text-gray-300 hover:text-white transition-colors duration-200">Terms of Service</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold text-lg mb-4 text-white">Contact Us</h3>
              <div className="space-y-3 text-gray-300">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>123 Event Street, City</span>
                </p>
                <p className="flex items-center gap-2">
                  <span>📞</span>
                  <span>+1 (555) 123-4567</span>
                </p>
                <p className="flex items-center gap-2">
                  <span>✉️</span>
                  <span>support@hallbooker.com</span>
                </p>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-200">
                  <span className="text-sm">📘</span>
                </button>
                <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-200">
                  <span className="text-sm">🐦</span>
                </button>
                <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-200">
                  <span className="text-sm">📷</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 HallBooker. All rights reserved.
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Trusted by 10,000+ event planners</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-gray-400 text-sm ml-1">4.9/5</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MyBookingsPage;