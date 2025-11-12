// ==================== src/pages/BrowseHallsPage.jsx ====================
import { Building, DollarSign, Filter, MapPin, Search, Users, Heart, Shield, Star, Clock, CheckCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import AIRecommendations from '../components/AIRecommendations';
import HallCard from '../components/HallCard';
import { api } from '../services/api';

const BrowseHallsPage = () => {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ 
    minCapacity: '', 
    maxPrice: '', 
    location: '' 
  });
  const [selectedHall, setSelectedHall] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [bookingData, setBookingData] = useState({
    start_time: '',
    end_time: '',
    event_name: '',
    event_type: '',
    attendees: '',
    remarks: ''
  });

  const fetchHalls = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filters.minCapacity) params.append('min_capacity', filters.minCapacity);
      if (filters.maxPrice) params.append('max_price', filters.maxPrice);
      if (filters.location) params.append('location', filters.location);

      const data = await api.get(`/api/halls/?${params}`);
      setHalls(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching halls:', err);
      alert('Failed to fetch halls. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filters.minCapacity, filters.maxPrice, filters.location]);

  useEffect(() => {
    fetchHalls();
  }, [fetchHalls]);

  const handleBook = (hall) => {
    setSelectedHall(hall);
    setShowBookingModal(true);
    setShowAIRecommendations(true);
  };

  const handleSelectHall = (hall) => {
    setSelectedHall(hall);
  };

  const submitBooking = async () => {
    try {
      if (!bookingData.start_time || !bookingData.end_time || !bookingData.attendees) {
        alert('Please fill in all required fields');
        return;
      }

      await api.post('/api/bookings/', {
        ...bookingData,
        hall_id: selectedHall.id,
        attendees: parseInt(bookingData.attendees)
      });
      
      alert('Booking created successfully!');
      setShowBookingModal(false);
      setSelectedHall(null);
      setBookingData({ 
        start_time: '', 
        end_time: '', 
        event_name: '', 
        event_type: '', 
        attendees: '', 
        remarks: '' 
      });
      
      fetchHalls();
    } catch (err) {
      alert(err.message || 'Failed to create booking');
    }
  };

  const calculateTotal = () => {
    if (!bookingData.start_time || !bookingData.end_time || !selectedHall) return 0;
    const start = new Date(bookingData.start_time);
    const end = new Date(bookingData.end_time);
    const hours = Math.ceil((end - start) / (1000 * 60 * 60));
    return hours * selectedHall.price_per_hour;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({ minCapacity: '', maxPrice: '', location: '' });
  };

  const hasActiveFilters = searchTerm || filters.minCapacity || filters.maxPrice || filters.location;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Find Your Perfect Venue
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Discover and book premium event spaces for your special occasions with AI-powered recommendations
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Filter className="h-6 w-6 text-blue-200" />
                <span className="font-semibold text-white text-lg">Smart Search</span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-blue-200 hover:text-white font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <span>Clear Filters</span>
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
                  <input
                    type="text"
                    placeholder="Search by hall name, location, or facilities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-0 rounded-xl bg-white/95 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:bg-white shadow-lg transition-all duration-200"
                  />
                </div>
              </div>
              
              <div>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
                  <input
                    type="number"
                    placeholder="Min capacity"
                    value={filters.minCapacity}
                    onChange={(e) => setFilters({...filters, minCapacity: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 border-0 rounded-xl bg-white/95 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:bg-white shadow-lg transition-all duration-200"
                  />
                </div>
              </div>
              
              <div>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
                  <input
                    type="number"
                    placeholder="Max price/hr"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 border-0 rounded-xl bg-white/95 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:bg-white shadow-lg transition-all duration-200"
                  />
                </div>
              </div>
              
              <button
                onClick={fetchHalls}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Search className="h-5 w-5" />
                Search
              </button>
            </div>

            {/* Location Filter */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
                <input
                  type="text"
                  placeholder="Filter by location..."
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 border-0 rounded-xl bg-white/95 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:bg-white shadow-lg transition-all duration-200"
                />
              </div>
              <div className="hidden lg:flex items-center gap-6 text-blue-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm">AI Recommendations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span className="text-sm">Secure Booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  <span className="text-sm">Verified Venues</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      {showAIRecommendations && selectedHall && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AIRecommendations 
            currentHallId={selectedHall.id} 
            onBook={handleBook}
          />
        </div>
      )}

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Available Venues {halls.length > 0 && `(${halls.length})`}
            </h2>
            <p className="text-gray-600 mt-2">Handpicked venues for your perfect event</p>
          </div>
          {hasActiveFilters && (
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              Filtered results
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : halls.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-lg">
            <Building className="h-20 w-20 mx-auto text-gray-400 mb-4" />
            <p className="text-2xl font-semibold text-gray-700 mb-2">No venues found</p>
            <p className="text-gray-500 mb-6">Try adjusting your search criteria or explore our AI recommendations</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {halls.map(hall => (
              <HallCard 
                key={hall.id} 
                hall={hall} 
                onBook={handleBook}
                onSelect={handleSelectHall}
              />
            ))}
          </div>
        )}
      </div>

      {/* Booking Workflow Section */}
      <div className="bg-white border-t border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Book your perfect venue in just a few simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <Search className="h-8 w-8 text-white" />
              </div>
              <div className="relative">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Search & Discover</h3>
                <p className="text-gray-600 leading-relaxed">
                  Use smart filters and AI recommendations to find venues that match your needs
                </p>
              </div>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <Building className="h-8 w-8 text-white" />
              </div>
              <div className="relative">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Compare & Select</h3>
                <p className="text-gray-600 leading-relaxed">
                  View detailed information, photos, and reviews to choose your perfect venue
                </p>
              </div>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <div className="relative">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Book Instantly</h3>
                <p className="text-gray-600 leading-relaxed">
                  Secure your booking with real-time availability and instant confirmation
                </p>
              </div>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <div className="relative">
                <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  4
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Enjoy Your Event</h3>
                <p className="text-gray-600 leading-relaxed">
                  Relax and enjoy your special day with our dedicated support team
                </p>
              </div>
            </div>
          </div>
        </div>
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

      {/* Booking Modal */}
      {showBookingModal && selectedHall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">Book {selectedHall.name}</h3>
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    setSelectedHall(null);
                    setBookingData({ 
                      start_time: '', 
                      end_time: '', 
                      event_name: '', 
                      event_type: '', 
                      attendees: '', 
                      remarks: '' 
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Hall Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-blue-100">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <Building className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">{selectedHall.name}</h4>
                    <p className="text-sm text-gray-600">{selectedHall.location}</p>
                    <p className="text-blue-600 font-bold text-lg">₹{selectedHall.price_per_hour}/hour</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={bookingData.start_time}
                    onChange={(e) => setBookingData({...bookingData, start_time: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={bookingData.end_time}
                    onChange={(e) => setBookingData({...bookingData, end_time: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Name
                  </label>
                  <input
                    type="text"
                    value={bookingData.event_name}
                    onChange={(e) => setBookingData({...bookingData, event_name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter event name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type
                  </label>
                  <select
                    value={bookingData.event_type}
                    onChange={(e) => setBookingData({...bookingData, event_type: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="">Select event type</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Conference">Conference</option>
                    <option value="Party">Party</option>
                    <option value="Corporate">Corporate Event</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Attendees *
                  </label>
                  <input
                    type="number"
                    value={bookingData.attendees}
                    onChange={(e) => setBookingData({...bookingData, attendees: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Number of attendees"
                    required
                    min="1"
                    max={selectedHall.capacity}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Hall capacity: {selectedHall.capacity} people
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remarks
                  </label>
                  <textarea
                    value={bookingData.remarks}
                    onChange={(e) => setBookingData({...bookingData, remarks: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Any special requirements or notes"
                    rows="3"
                  />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-blue-600 mb-1">Estimated Total</p>
                    <p className="text-2xl font-bold text-blue-900">₹{calculateTotal()}</p>
                    <p className="text-xs text-blue-600 mt-1">
                      Based on {selectedHall.price_per_hour}/hour × {
                        bookingData.start_time && bookingData.end_time 
                          ? Math.ceil((new Date(bookingData.end_time) - new Date(bookingData.start_time)) / (1000 * 60 * 60))
                          : 0
                      } hours
                    </p>
                  </div>
                  <DollarSign className="h-10 w-10 text-blue-600 opacity-50" />
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    setSelectedHall(null);
                    setBookingData({ 
                      start_time: '', 
                      end_time: '', 
                      event_name: '', 
                      event_type: '', 
                      attendees: '', 
                      remarks: '' 
                    });
                  }}
                  className="flex-1 px-6 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={submitBooking}
                  disabled={!bookingData.start_time || !bookingData.end_time || !bookingData.attendees}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseHallsPage;