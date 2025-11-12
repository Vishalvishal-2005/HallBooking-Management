import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Calendar, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Star,
  Eye,
  Plus,
  ArrowUpRight,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Target
} from 'lucide-react';
import { api } from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

const OwnerDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchStats();
    fetchChartData();
  }, [timeRange]);

  const fetchStats = async () => {
    try {
      const response = await api.get(`/api/owner/stats?range=${timeRange}`);
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      // Mock data - replace with actual API calls
      const bookingData = [
        { month: 'Jan', bookings: 12, revenue: 24000, occupancy: 65 },
        { month: 'Feb', bookings: 18, revenue: 36000, occupancy: 72 },
        { month: 'Mar', bookings: 15, revenue: 30000, occupancy: 68 },
        { month: 'Apr', bookings: 22, revenue: 44000, occupancy: 78 },
        { month: 'May', bookings: 25, revenue: 50000, occupancy: 82 },
        { month: 'Jun', bookings: 30, revenue: 60000, occupancy: 85 },
      ];

      const hallPerformance = [
        { name: 'Grand Ballroom', bookings: 45, revenue: 90000, fill: '#0088FE' },
        { name: 'Conference Hall', bookings: 32, revenue: 64000, fill: '#00C49F' },
        { name: 'Wedding Palace', bookings: 28, revenue: 56000, fill: '#FFBB28' },
        { name: 'Meeting Room A', bookings: 15, revenue: 30000, fill: '#FF8042' },
      ];

      setChartData(bookingData);
      setRevenueData(hallPerformance);
    } catch (err) {
      console.error('Error fetching chart data:', err);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

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
      label: 'Total Venues', 
      value: stats?.total_halls || 0, 
      change: '+2',
      trend: 'up',
      icon: Building, 
      color: 'from-blue-500 to-cyan-500',
      description: 'Active venues'
    },
    { 
      label: 'Total Bookings', 
      value: stats?.total_bookings || 0, 
      change: '+12%',
      trend: 'up',
      icon: Calendar, 
      color: 'from-purple-500 to-pink-500',
      description: 'This month'
    },
    { 
      label: 'Pending Actions', 
      value: stats?.pending_bookings || 0, 
      change: '3 needs review',
      trend: 'attention',
      icon: Clock, 
      color: 'from-yellow-500 to-orange-500',
      description: 'Awaiting approval'
    },
    { 
      label: 'Total Revenue', 
      value: `₹${stats?.total_revenue?.toLocaleString() || 0}`, 
      change: '+18%',
      trend: 'up',
      icon: DollarSign, 
      color: 'from-green-500 to-emerald-500',
      description: 'Lifetime earnings'
    }
  ];

  const quickActions = [
    { label: 'Add New Venue', icon: Plus, color: 'bg-gradient-to-r from-blue-500 to-blue-600', path: '/owner/halls' },
    { label: 'Manage Bookings', icon: Calendar, color: 'bg-gradient-to-r from-green-500 to-green-600', path: '/owner/bookings' },
    { label: 'View Analytics', icon: BarChart3, color: 'bg-gradient-to-r from-purple-500 to-purple-600', path: '/owner/analytics' },
    { label: 'Generate Reports', icon: Activity, color: 'bg-gradient-to-r from-orange-500 to-orange-600', path: '/owner/reports' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Venue Owner Dashboard
              </h1>
              <p className="text-gray-600 text-lg">Monitor your venue performance and manage bookings</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-xl p-2 border border-gray-200 shadow-sm">
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-transparent border-0 text-sm font-medium text-gray-700 focus:ring-0"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            const isPositive = stat.trend === 'up';
            const isAttention = stat.trend === 'attention';
            
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
                    isPositive ? 'bg-green-100 text-green-700' : 
                    isAttention ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    <TrendingUp className={`h-3 w-3 ${isPositive ? '' : isAttention ? '' : 'rotate-180'}`} />
                    {stat.change}
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
                      style={{ width: `${Math.min(100, (parseInt(stat.value) / (statCards[0].value * 2)) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          {/* Revenue & Bookings Chart */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Revenue & Bookings Analytics</h3>
                  <p className="text-sm text-gray-600">Monthly performance overview</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Bookings</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Revenue</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="bookings" 
                  fill="#3B82F6" 
                  radius={[4, 4, 0, 0]}
                  name="Bookings"
                />
                <Bar 
                  dataKey="revenue" 
                  fill="#10B981" 
                  radius={[4, 4, 0, 0]}
                  name="Revenue (₹)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Venue Performance */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <PieChartIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Venue Performance</h3>
                  <p className="text-sm text-gray-600">Booking distribution</p>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="bookings"
                  nameKey="name"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [value, 'Bookings']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Metrics & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Growth Trend */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Activity className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Revenue Growth Trend</h3>
                  <p className="text-sm text-gray-600">Monthly revenue progression</p>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10B981" 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
                  <p className="text-sm text-gray-600">Manage your business</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {quickActions.map((action, index) => {
                const ActionIcon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={() => window.location.href = action.path}
                    className={`w-full ${action.color} text-white p-4 rounded-xl hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-between group`}
                  >
                    <div className="flex items-center gap-3">
                      <ActionIcon className="h-5 w-5" />
                      <span className="font-semibold">{action.label}</span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </button>
                );
              })}
            </div>

            {/* Performance Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Performance Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Average Occupancy</span>
                  <span className="font-semibold text-green-600">78%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Customer Rating</span>
                  <span className="font-semibold text-yellow-600 flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    4.8/5
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-semibold text-blue-600">2.1h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboardPage;