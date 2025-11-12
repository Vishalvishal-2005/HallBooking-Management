import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  AlertCircle, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Building,
  Sparkles,
  CheckCircle,
  Users,
  Star,
  Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      
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
          <p className="text-blue-100 text-center text-sm">Welcome back to your event planning journey</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Side - Features */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-blue-200">
            <div className="h-full flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Continue Your Journey</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-2 rounded-lg mt-1">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Manage Your Bookings</h4>
                    <p className="text-gray-600 text-sm">Access and manage all your upcoming events in one place</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-2 rounded-lg mt-1">
                    <Building className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Discover New Venues</h4>
                    <p className="text-gray-600 text-sm">Explore handpicked venues with AI-powered recommendations</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-2 rounded-lg mt-1">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Instant Confirmations</h4>
                    <p className="text-gray-600 text-sm">Get real-time availability and instant booking confirmations</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-2 rounded-lg mt-1">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Secure Platform</h4>
                    <p className="text-gray-600 text-sm">Your data and payments are protected with advanced security</p>
                  </div>
                </div>
              </div>

              {/* Testimonials */}
              <div className="mt-8 pt-6 border-t border-blue-200">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm italic mb-2">
                    "HallBooker made finding our wedding venue so easy! The AI recommendations were spot on."
                  </p>
                  <p className="text-blue-600 text-xs">— Sarah M., Event Organizer</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-8 lg:p-10">
            <div className="text-center mb-8">
              <div className="bg-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border border-blue-200">
                <Calendar className="h-10 w-10 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to continue your event planning journey</p>
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
                    placeholder="you@example.com"
                    required
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
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
                    placeholder="Enter your password"
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
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600">
                  <input
                    type="checkbox"
                    className="rounded bg-blue-50 border-blue-300 text-blue-600 focus:ring-blue-500"
                  />
                  Remember me
                </label>
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:text-blue-700 transition-colors duration-200 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-blue-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">New to HallBooker?</span>
                </div>
              </div>

              <Link
                to="/signup"
                className="w-full bg-white border-2 border-blue-500 text-blue-600 py-4 rounded-xl hover:bg-blue-50 transition-all duration-200 font-semibold text-lg text-center block hover:border-blue-600"
              >
                Create New Account
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 pt-6 border-t border-blue-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-600">50K+</div>
                  <div className="text-blue-700 text-xs">Events</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">10K+</div>
                  <div className="text-blue-700 text-xs">Venues</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">4.9★</div>
                  <div className="text-blue-700 text-xs">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;