import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Edit2, 
  Save, 
  X, 
  Shield, 
  Calendar,
  Building,
  CheckCircle,
  AlertCircle,
  Lock,
  CreditCard,
  BarChart3,
  Settings,
  Star,
  MapPin,
  Clock,
  Award,
  Bell,
  Palette,
  Globe,
  Eye
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('personal');
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    totalHalls: 0,
    revenue: 0
  });

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    }
  }, [user]);

  // Fetch user stats with proper error handling
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const promises = [
          api.get('/api/bookings/stats/user').catch(err => {
            console.error('Error fetching booking stats:', err);
            return { data: { total: 0, upcoming: 0 } };
          }),
        ];
        
        if (user?.role === 'HALL_OWNER') {
          promises.push(
            api.get('/api/halls/stats/owner').catch(err => {
              console.error('Error fetching hall stats:', err);
              return { data: { total: 0 } };
            })
          );
        } else {
          promises.push(Promise.resolve({ data: { total: 0 } }));
        }
        
        const [bookingsRes, hallsRes] = await Promise.all(promises);
        
        setStats({
          totalBookings: bookingsRes.data?.total || 0,
          upcomingBookings: bookingsRes.data?.upcoming || 0,
          totalHalls: hallsRes?.data?.total || 0,
          revenue: 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({
          totalBookings: 0,
          upcomingBookings: 0,
          totalHalls: 0,
          revenue: 0
        });
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const updateData = { ...formData };
      
      // Remove password fields if they're empty
      if (!updateData.current_password) {
        delete updateData.current_password;
        delete updateData.new_password;
        delete updateData.confirm_password;
      }

      const response = await api.put('/api/auth/profile', updateData);
      updateUser(response.data);
      
      setMessage({ 
        type: 'success', 
        text: 'Profile updated successfully' 
      });
      setEditing(false);
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        current_password: '',
        new_password: '',
        confirm_password: ''
      }));
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to update profile' 
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplay = (role) => {
    const roleMap = {
      'USER': { 
        label: 'Event Organizer', 
        color: 'bg-gradient-to-r from-blue-500 to-blue-600',
        icon: User
      },
      'HALL_OWNER': { 
        label: 'Venue Owner', 
        color: 'bg-gradient-to-r from-green-500 to-green-600',
        icon: Building
      },
      'ADMIN': { 
        label: 'Administrator', 
        color: 'bg-gradient-to-r from-purple-500 to-purple-600',
        icon: Shield
      }
    };
    
    return roleMap[role] || { 
      label: role, 
      color: 'bg-gradient-to-r from-gray-500 to-gray-600',
      icon: User
    };
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const roleInfo = getRoleDisplay(user?.role);
  const RoleIcon = roleInfo.icon;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your profile...</p>
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
              <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Account Settings
              </h1>
              <p className="text-gray-600 mt-3 text-lg">Manage your profile and account preferences</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg ${roleInfo.color}`}>
                <RoleIcon className="h-4 w-4 mr-2" />
                {roleInfo.label}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{formatNumber(stats.totalBookings)}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span>Active bookings</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{formatNumber(stats.upcomingBookings)}</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl shadow-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
              <Calendar className="h-4 w-4" />
              <span>Scheduled events</span>
            </div>
          </div>

          {user.role === 'HALL_OWNER' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">My Venues</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{formatNumber(stats.totalHalls)}</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-xl shadow-lg">
                  <Building className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600">
                <Star className="h-4 w-4" />
                <span>Active venues</span>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">₹{formatNumber(stats.revenue)}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl shadow-lg">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-purple-600">
              <Award className="h-4 w-4" />
              <span>Lifetime earnings</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-8 shadow-xl">
              {/* User Profile Summary */}
              <div className="text-center mb-6">
                <div className="relative mx-auto mb-4">
                  <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                    <User className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg border-4 border-white">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">{user.full_name || 'User'}</h2>
                <p className="text-gray-600 text-sm mb-3">{user.email}</p>
                <div className="mt-3">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white shadow-md ${roleInfo.color}`}>
                    <RoleIcon className="h-4 w-4 mr-2" />
                    {roleInfo.label}
                  </span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-left transition-all duration-200 ${
                    activeTab === 'personal' 
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200 shadow-md' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span className="font-semibold">Personal Info</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-left transition-all duration-200 ${
                    activeTab === 'security' 
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200 shadow-md' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                  }`}
                >
                  <Lock className="h-5 w-5" />
                  <span className="font-semibold">Security</span>
                </button>

                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-left transition-all duration-200 ${
                    activeTab === 'preferences' 
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200 shadow-md' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  <span className="font-semibold">Preferences</span>
                </button>
              </nav>

              {/* Account Info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="h-4 w-4 text-blue-600" />
                  Account Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50">
                    <span className="text-gray-600">Member since</span>
                    <span className="font-semibold text-gray-900">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50">
                    <span className="text-gray-600">User ID</span>
                    <span className="font-semibold text-gray-900">#{user.id}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-green-50">
                    <span className="text-gray-600">Status</span>
                    <span className="font-semibold text-green-600 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {message.text && (
              <div className={`flex items-center gap-3 p-4 rounded-xl mb-6 border shadow-lg ${
                message.type === 'success' 
                  ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200 text-green-700' 
                  : 'bg-gradient-to-r from-red-50 to-red-100 border-red-200 text-red-700'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
                <span className="font-semibold">{message.text}</span>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
              {/* Tab Header */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {activeTab === 'personal' && 'Personal Information'}
                      {activeTab === 'security' && 'Security Settings'}
                      {activeTab === 'preferences' && 'Account Preferences'}
                    </h3>
                    <p className="text-gray-600 mt-2">
                      {activeTab === 'personal' && 'Update your personal details and contact information'}
                      {activeTab === 'security' && 'Manage your password and security settings'}
                      {activeTab === 'preferences' && 'Customize your account preferences'}
                    </p>
                  </div>
                  {activeTab === 'personal' && !editing && (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {activeTab === 'personal' ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <User className="h-4 w-4 text-blue-600" />
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={formData.full_name}
                            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                            disabled={!editing}
                            className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                            placeholder="Enter your full name"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <Mail className="h-4 w-4 text-blue-600" />
                            Email Address *
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              disabled={!editing}
                              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                              placeholder="your@email.com"
                              required
                            />
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <Phone className="h-4 w-4 text-blue-600" />
                            Phone Number
                          </label>
                          <div className="relative">
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              disabled={!editing}
                              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                              placeholder="+1 (555) 000-0000"
                            />
                            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <Shield className="h-4 w-4 text-blue-600" />
                            Account Role
                          </label>
                          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                            <div className={`p-3 rounded-lg ${roleInfo.color}`}>
                              <RoleIcon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <span className="font-bold text-gray-900 block">{roleInfo.label}</span>
                              <span className="text-sm text-gray-500">This role determines your access level</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {editing && (
                        <div className="flex gap-4 pt-8 border-t border-gray-200">
                          <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50"
                          >
                            <Save className="h-5 w-5" />
                            {loading ? 'Saving Changes...' : 'Save Changes'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditing(false);
                              setFormData({
                                ...formData,
                                full_name: user.full_name || '',
                                email: user.email || '',
                                phone: user.phone || ''
                              });
                            }}
                            className="flex items-center gap-3 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold"
                          >
                            <X className="h-5 w-5" />
                            Cancel
                          </button>
                        </div>
                      )}
                    </>
                  ) : activeTab === 'security' ? (
                    <div className="space-y-8">
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6">
                        <div className="flex items-start gap-4">
                          <AlertCircle className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="text-lg font-semibold text-yellow-800">Security Notice</h4>
                            <p className="text-yellow-700 mt-2">
                              Changing your password will log you out of all other active sessions. Make sure to use a strong, unique password.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-8 max-w-2xl">
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <Lock className="h-4 w-4 text-blue-600" />
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type="password"
                              value={formData.current_password}
                              onChange={(e) => setFormData({...formData, current_password: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              placeholder="Enter your current password"
                            />
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <Eye className="h-4 w-4 text-blue-600" />
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              type="password"
                              value={formData.new_password}
                              onChange={(e) => setFormData({...formData, new_password: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              placeholder="Enter your new password"
                            />
                            <Eye className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          </div>
                          <p className="text-xs text-gray-500 mt-3">
                            🔒 Password must be at least 6 characters long with a mix of letters and numbers
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <input
                              type="password"
                              value={formData.confirm_password}
                              onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              placeholder="Confirm your new password"
                            />
                            <CheckCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4 pt-8 border-t border-gray-200">
                        <button
                          type="submit"
                          disabled={loading || !formData.current_password}
                          className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50"
                        >
                          <Lock className="h-5 w-5" />
                          {loading ? 'Updating Password...' : 'Update Password'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Preferences Tab */
                    <div className="space-y-8">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8">
                        <div className="flex items-center gap-4">
                          <Palette className="h-8 w-8 text-blue-600" />
                          <div>
                            <h4 className="text-xl font-semibold text-blue-900">Account Preferences</h4>
                            <p className="text-blue-700 mt-2">
                              Customize your experience and notification preferences to make HallBooker work best for you.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="max-w-2xl">
                        <div className="bg-gray-50 rounded-2xl p-8 text-center">
                          <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-gray-700 mb-3">Coming Soon</h3>
                          <p className="text-gray-600 text-lg">
                            We're working on bringing you more customization options including theme preferences, notification settings, and language options.
                          </p>
                          <div className="mt-6 flex justify-center gap-4">
                            <div className="flex items-center gap-2 text-gray-500">
                              <Bell className="h-5 w-5" />
                              <span>Notifications</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                              <Palette className="h-5 w-5" />
                              <span>Themes</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                              <Globe className="h-5 w-5" />
                              <span>Language</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add missing TrendingUp component
const TrendingUp = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

export default Profile;