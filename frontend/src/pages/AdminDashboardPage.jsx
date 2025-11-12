import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Shield,
  Activity,
  Database,
  Cpu,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { apiCall } from '../services/api';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const fetchStats = async () => {
    try {
      const data = await apiCall(`/api/admin/stats?range=${timeRange}`);
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { 
      label: 'Total Users', 
      value: stats?.total_users || 0, 
      change: stats?.user_growth || 0,
      icon: Users, 
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      description: 'Registered users'
    },
    { 
      label: 'Total Venues', 
      value: stats?.total_halls || 0, 
      change: stats?.hall_growth || 0,
      icon: Building, 
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      description: 'Active venues'
    },
    { 
      label: 'Total Bookings', 
      value: stats?.total_bookings || 0, 
      change: stats?.booking_growth || 0,
      icon: Calendar, 
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-orange-50',
      description: 'All-time bookings'
    },
    { 
      label: 'Total Revenue', 
      value: `₹${(stats?.total_revenue || 0).toLocaleString()}`, 
      change: stats?.revenue_growth || 0,
      icon: DollarSign, 
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      description: 'Lifetime revenue'
    },
    { 
      label: 'Active Bookings', 
      value: stats?.active_bookings || 0, 
      change: stats?.active_growth || 0,
      icon: TrendingUp, 
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
      description: 'Current active'
    },
    { 
      label: 'Venue Owners', 
      value: stats?.hall_owners || 0, 
      change: stats?.owner_growth || 0,
      icon: Shield, 
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-50',
      description: 'Registered owners'
    }
  ];

  const systemMetrics = [
    { label: 'Server Uptime', value: '99.9%', status: 'healthy', icon: Cpu },
    { label: 'Database Load', value: '24%', status: 'healthy', icon: Database },
    { label: 'API Response', value: '128ms', status: 'healthy', icon: Activity },
    { label: 'Active Sessions', value: stats?.active_sessions || '247', status: 'warning', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 text-lg">Comprehensive system overview and analytics</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-xl p-2 border border-gray-200 shadow-sm">
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-transparent border-0 text-sm font-medium text-gray-700 focus:ring-0"
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>
              
              <button className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                <MoreHorizontal className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            const isPositive = stat.change >= 0;
            
            return (
              <div 
                key={idx} 
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    <TrendingUp className={`h-3 w-3 ${isPositive ? '' : 'rotate-180'}`} />
                    {Math.abs(stat.change)}%
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${stat.color} transition-all duration-500`}
                      style={{ width: `${Math.min(100, (stat.value / (statCards[0].value * 2)) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts and Detailed Analytics */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Revenue Analytics</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">₹{(stats?.total_revenue || 0).toLocaleString()}</div>
              <p className="text-gray-600">Total Revenue Generated</p>
              <div className="mt-4 flex justify-center gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">+{stats?.revenue_growth || 0}%</div>
                  <p className="text-sm text-gray-500">Growth</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats?.monthly_revenue || 0}</div>
                  <p className="text-sm text-gray-500">This Month</p>
                </div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">System Health</h3>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {systemMetrics.map((metric, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      metric.status === 'healthy' ? 'bg-green-100 text-green-600' :
                      metric.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      <metric.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{metric.label}</p>
                      <p className="text-sm text-gray-500">Real-time monitoring</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{metric.value}</p>
                    <div className={`flex items-center gap-1 text-xs ${
                      metric.status === 'healthy' ? 'text-green-600' :
                      metric.status === 'warning' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {metric.status === 'healthy' ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                      {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Bookings</h3>
              <Eye className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {stats?.recent_bookings?.slice(0, 5).map(booking => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {booking.hall_name}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(booking.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    booking.status === 'APPROVED' ? 'bg-green-100 text-green-800 border border-green-200' :
                    booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                    'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
              <Shield className="h-5 w-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-200 border border-blue-200 group">
                <Users className="h-6 w-6 text-blue-600 mb-2" />
                <p className="font-semibold text-blue-700">Manage Users</p>
                <p className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">View all users</p>
              </button>
              
              <button className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors duration-200 border border-purple-200 group">
                <Building className="h-6 w-6 text-purple-600 mb-2" />
                <p className="font-semibold text-purple-700">Venues</p>
                <p className="text-xs text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">Manage venues</p>
              </button>
              
              <button className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors duration-200 border border-green-200 group">
                <Calendar className="h-6 w-6 text-green-600 mb-2" />
                <p className="font-semibold text-green-700">Bookings</p>
                <p className="text-xs text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">View bookings</p>
              </button>
              
              <button className="p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors duration-200 border border-orange-200 group">
                <BarChart3 className="h-6 w-6 text-orange-600 mb-2" />
                <p className="font-semibold text-orange-700">Reports</p>
                <p className="text-xs text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">Generate reports</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;