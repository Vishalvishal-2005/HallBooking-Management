import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  Building, 
  User, 
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Download,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  MapPin
} from 'lucide-react';
import { apiCall } from '../services/api';

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await apiCall('/api/admin/bookings');
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const config = {
      PENDING: { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-800',
        border: 'border-yellow-200',
        icon: Clock,
        color: 'from-yellow-400 to-yellow-500'
      },
      APPROVED: { 
        bg: 'bg-green-100', 
        text: 'text-green-800',
        border: 'border-green-200',
        icon: CheckCircle,
        color: 'from-green-400 to-green-500'
      },
      REJECTED: { 
        bg: 'bg-red-100', 
        text: 'text-red-800',
        border: 'border-red-200',
        icon: XCircle,
        color: 'from-red-400 to-red-500'
      },
      CANCELLED: { 
        bg: 'bg-gray-100', 
        text: 'text-gray-800',
        border: 'border-gray-200',
        icon: XCircle,
        color: 'from-gray-400 to-gray-500'
      },
      COMPLETED: { 
        bg: 'bg-blue-100', 
        text: 'text-blue-800',
        border: 'border-blue-200',
        icon: CheckCircle,
        color: 'from-blue-400 to-blue-500'
      }
    };

    return config[status] || config.PENDING;
  };

  const getStatusBadge = (status) => {
    const statusConfig = getStatusConfig(status);
    const StatusIcon = statusConfig.icon;

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
        <StatusIcon className="h-3 w-3" />
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
    const matchesDate = !dateFilter || new Date(booking.start_time).toDateString() === new Date(dateFilter).toDateString();

    return matchesSearch && matchesStatus && matchesDate;
  });

  const statusCounts = {
    ALL: bookings.length,
    PENDING: bookings.filter(b => b.status === 'PENDING').length,
    APPROVED: bookings.filter(b => b.status === 'APPROVED').length,
    COMPLETED: bookings.filter(b => b.status === 'COMPLETED').length,
    REJECTED: bookings.filter(b => b.status === 'REJECTED').length,
    CANCELLED: bookings.filter(b => b.status === 'CANCELLED').length
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Bookings Management
              </h1>
              <p className="text-gray-600 text-lg">Manage and monitor all bookings across the platform</p>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 font-semibold text-gray-700">
                <Download className="h-4 w-4" />
                Export
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
                  placeholder="Search bookings by hall, user, or event..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                <Filter className="h-4 w-4 text-gray-600" />
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="bg-transparent border-0 focus:ring-0 text-gray-700"
                />
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              Showing {filteredBookings.length} of {bookings.length} bookings
            </div>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-200">
            <Calendar className="h-24 w-24 mx-auto text-gray-400 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {searchTerm || statusFilter !== 'ALL' || dateFilter 
                ? 'Try adjusting your search criteria or filters' 
                : 'There are no bookings in the system yet'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map(booking => {
              const statusConfig = getStatusConfig(booking.status);
              
              return (
                <div key={booking.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      {/* Left Section - Booking Details */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{booking.event_name || 'Untitled Event'}</h3>
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
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <Eye className="h-4 w-4 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <Edit className="h-4 w-4 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <MoreVertical className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      </div>

                      {/* Right Section - Hall & User Info */}
                      <div className="lg:w-80 space-y-4">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Building className="h-4 w-4 text-blue-600" />
                            Venue Details
                          </h4>
                          <div className="space-y-2">
                            <p className="font-medium text-gray-900">{booking.hall?.name}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="h-3 w-3" />
                              <span>{booking.hall?.location}</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              Capacity: <span className="font-medium">{booking.hall?.capacity} people</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <User className="h-4 w-4 text-green-600" />
                            User Information
                          </h4>
                          <div className="space-y-2">
                            <p className="font-medium text-gray-900">{booking.user?.full_name}</p>
                            <p className="text-sm text-gray-600">{booking.user?.email}</p>
                            {booking.user?.phone && (
                              <p className="text-sm text-gray-600">{booking.user.phone}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Event Type & Additional Info */}
                    {(booking.event_type || booking.remarks) && (
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex flex-wrap gap-4">
                          {booking.event_type && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">Event Type:</span>
                              <span className="font-medium text-gray-900">{booking.event_type}</span>
                            </div>
                          )}
                          {booking.remarks && (
                            <div className="flex-1 min-w-0">
                              <span className="text-sm text-gray-600">Remarks:</span>
                              <span className="ml-2 font-medium text-gray-900 truncate">{booking.remarks}</span>
                            </div>
                          )}
                        </div>
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
    </div>
  );
};

export default AdminBookingsPage;