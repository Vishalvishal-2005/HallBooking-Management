// ==================== src/pages/BookingForm.jsx ====================
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Building, 
  ArrowLeft,
  CreditCard,
  Shield,
  CheckCircle,
  Star,
  Wifi,
  Car,
  Utensils
} from 'lucide-react';

const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hall, setHall] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bookingDate: '',
    startTime: '',
    endTime: '',
    eventType: '',
    guestCount: '',
    specialRequests: ''
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState('');
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    fetchHallDetails();
  }, [id]);

  useEffect(() => {
    calculateTotal();
  }, [formData.startTime, formData.endTime, hall]);

  const fetchHallDetails = async () => {
    try {
      const response = await api.get(`/halls/${id}`);
      setHall(response.data);
      // Parse facilities
      if (response.data.facilities) {
        setFacilities(response.data.facilities.split(',').map(f => f.trim()));
      }
    } catch (error) {
      console.error('Error fetching hall:', error);
    }
  };

  const calculateTotal = () => {
    if (!formData.startTime || !formData.endTime || !hall) return;

    const start = new Date(`2000-01-01T${formData.startTime}`);
    const end = new Date(`2000-01-01T${formData.endTime}`);
    const hours = (end - start) / (1000 * 60 * 60);

    if (hours > 0) {
      setTotalAmount(hours * hall.price_per_hour);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check availability first
      const availabilityResponse = await api.post('/bookings/check-availability', {
        hallId: id,
        bookingDate: formData.bookingDate,
        startTime: formData.startTime,
        endTime: formData.endTime
      });

      if (!availabilityResponse.data.available) {
        setError('This time slot is not available. Please choose another time.');
        setLoading(false);
        return;
      }

      // Create booking
      const bookingData = {
        ...formData,
        hallId: id,
        totalAmount: totalAmount * 1.23 // Including taxes
      };

      const response = await api.post('/bookings', bookingData);

      // Redirect to payment
      if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      } else {
        navigate(`/my-bookings`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!hall) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading venue details...</p>
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const baseAmount = totalAmount;
  const serviceFee = totalAmount * 0.05;
  const gst = totalAmount * 0.18;
  const finalTotal = baseAmount + serviceFee + gst;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Venues
          </button>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Complete Your Booking</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Fill in your event details and secure your perfect venue
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="p-8">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Booking Date */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        Booking Date *
                      </label>
                      <input
                        type="date"
                        required
                        min={today}
                        value={formData.bookingDate}
                        onChange={(e) => setFormData({...formData, bookingDate: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                      />
                    </div>

                    {/* Event Type */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Building className="h-4 w-4 text-blue-600" />
                        Event Type *
                      </label>
                      <select
                        required
                        value={formData.eventType}
                        onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                      >
                        <option value="">Select event type</option>
                        <option value="Wedding">Wedding</option>
                        <option value="Birthday">Birthday Party</option>
                        <option value="Conference">Conference</option>
                        <option value="Meeting">Corporate Meeting</option>
                        <option value="Anniversary">Anniversary</option>
                        <option value="Reception">Reception</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Start Time */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Clock className="h-4 w-4 text-blue-600" />
                        Start Time *
                      </label>
                      <input
                        type="time"
                        required
                        value={formData.startTime}
                        onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                      />
                    </div>

                    {/* End Time */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Clock className="h-4 w-4 text-blue-600" />
                        End Time *
                      </label>
                      <input
                        type="time"
                        required
                        value={formData.endTime}
                        onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                      />
                    </div>

                    {/* Guest Count */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Users className="h-4 w-4 text-blue-600" />
                        Expected Guests *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        max={hall.capacity}
                        value={formData.guestCount}
                        onChange={(e) => setFormData({...formData, guestCount: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                      />
                      <p className="text-xs text-gray-500">
                        Maximum capacity: <span className="font-semibold">{hall.capacity} guests</span>
                      </p>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      rows="4"
                      value={formData.specialRequests}
                      onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white resize-none"
                      placeholder="Tell us about any special requirements, decorations, catering needs, or other requests..."
                    ></textarea>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold hover:shadow-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || totalAmount === 0}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-5 w-5" />
                          Proceed to Payment
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Venue Summary */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  Venue Details
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Building className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-lg truncate">{hall.name}</h4>
                      <div className="flex items-center gap-1 text-gray-600 mt-1">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm truncate">{hall.location}</span>
                      </div>
                      {hall.rating && (
                        <div className="flex items-center gap-1 mt-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold text-gray-700">{hall.rating}</span>
                          <span className="text-xs text-gray-500">/5</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-xs text-gray-600">Capacity</div>
                      <div className="font-bold text-gray-900">{hall.capacity}</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mx-auto mb-2">₹{hall.price_per_hour}</div>
                      <div className="text-xs text-gray-600">Per Hour</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Facilities */}
            {facilities.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Key Facilities</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {facilities.slice(0, 4).map((facility, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="truncate">{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Price Summary */}
            {totalAmount > 0 && (
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Price Summary
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-100">Hall Rental</span>
                      <span className="font-semibold">₹{baseAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-100">Service Fee (5%)</span>
                      <span className="font-semibold">₹{serviceFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-100">GST (18%)</span>
                      <span className="font-semibold">₹{gst.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-blue-500 pt-3 mt-2">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total Amount</span>
                        <span>₹{finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="mt-6 pt-4 border-t border-blue-500">
                    <div className="flex items-center justify-center gap-4 text-blue-200 text-sm">
                      <div className="flex items-center gap-1">
                        <Shield className="h-4 w-4" />
                        <span>Secure Payment</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        <span>Instant Confirmation</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;