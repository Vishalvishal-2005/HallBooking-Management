import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UserCircle, 
  AlertCircle, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Building, 
  Calendar,
  Eye,
  EyeOff,
  CheckCircle,
  Sparkles,
  Star,
  Shield,
  Users
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SignupPage = () => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    email: '', 
    password: '', 
    full_name: '', 
    phone: '', 
    role: 'USER'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signup(formData);
      
      if (result.success) {
        // Navigation is now handled automatically by ProtectedRoute
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden border border-blue-100 relative">
        {/* Decorative Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 border-b border-blue-500">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="bg-white/20 p-2 rounded-xl">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">HallBooker</h1>
          </div>
          <p className="text-blue-100 text-center text-sm">Your journey to perfect events starts here</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Side - Form */}
          <div className="p-8 lg:p-10">
            <div className="text-center mb-8">
              <div className="bg-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border border-blue-200">
                <UserCircle className="h-10 w-10 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-600">Join thousands of event organizers and venue owners</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-11 pr-4 py-4 bg-blue-50 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="Enter your email"
                    required
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    className="w-full pl-11 pr-4 py-4 bg-blue-50 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="Enter your full name"
                    required
                  />
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-600" />
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full pl-11 pr-4 py-4 bg-blue-50 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="Enter your phone number"
                  />
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-blue-600" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-11 pr-12 py-4 bg-blue-50 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="Create a strong password"
                    minLength="6"
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-blue-600 text-xs mt-2">
                  Password must be at least 6 characters long
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Building className="h-4 w-4 text-blue-600" />
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, role: 'USER'})}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      formData.role === 'USER' 
                        ? 'bg-blue-100 border-blue-500 text-blue-700 shadow-lg' 
                        : 'bg-white border-blue-200 text-gray-700 hover:bg-blue-50'
                    }`}
                  >
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-sm font-semibold">Event Organizer</div>
                    <div className="text-xs text-blue-600 mt-1">Book venues</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, role: 'HALL_OWNER'})}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      formData.role === 'HALL_OWNER' 
                        ? 'bg-blue-100 border-blue-500 text-blue-700 shadow-lg' 
                        : 'bg-white border-blue-200 text-gray-700 hover:bg-blue-50'
                    }`}
                  >
                    <Building className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-sm font-semibold">Venue Owner</div>
                    <div className="text-xs text-blue-600 mt-1">Manage halls</div>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Create Account
                  </>
                )}
              </button>
            </form>

            <p className="text-center mt-8 text-gray-600 text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 underline"
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* Right Side - Features */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 lg:p-10 border-l border-blue-200 hidden lg:block">
            <div className="h-full flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Join HallBooker?</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-2 rounded-lg mt-1">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">AI-Powered Recommendations</h4>
                    <p className="text-gray-600 text-sm">Get personalized venue suggestions based on your event needs</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-2 rounded-lg mt-1">
                    <Building className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Wide Venue Selection</h4>
                    <p className="text-gray-600 text-sm">Access thousands of verified venues across multiple locations</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-2 rounded-lg mt-1">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Easy Booking Process</h4>
                    <p className="text-gray-600 text-sm">Book your perfect venue in just a few clicks</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-2 rounded-lg mt-1">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Secure & Reliable</h4>
                    <p className="text-gray-600 text-sm">Your data and transactions are protected with enterprise-grade security</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-8 pt-6 border-t border-blue-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">10K+</div>
                    <div className="text-blue-700 text-xs">Venues</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">50K+</div>
                    <div className="text-blue-700 text-xs">Events</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      4.9
                    </div>
                    <div className="text-blue-700 text-xs">Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;