import {
  Building,
  Car,
  CheckCircle,
  MapPin,
  Plus,
  Search,
  Star,
  Trash2,
  User,
  Users,
  Utensils,
  Wifi,
  XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiCall } from '../services/api';

const AdminHallsPage = () => {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedHall, setSelectedHall] = useState(null);

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = async () => {
    try {
      const data = await apiCall('/api/admin/halls');
      setHalls(data);
    } catch (err) {
      console.error('Error fetching halls:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleHallStatus = async (hallId, currentStatus) => {
    try {
      await apiCall(`/api/admin/halls/${hallId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ available: !currentStatus })
      });
      fetchHalls();
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteHall = async (hallId) => {
    try {
      await apiCall(`/api/admin/halls/${hallId}`, { method: 'DELETE' });
      setShowDeleteModal(null);
      fetchHalls();
    } catch (err) {
      alert(err.message);
    }
  };

  const getStatusConfig = (status) => {
    const config = {
      true: { 
        label: 'Available',
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200',
        icon: CheckCircle,
        color: 'from-green-400 to-green-500'
      },
      false: { 
        label: 'Unavailable',
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-200',
        icon: XCircle,
        color: 'from-red-400 to-red-500'
      }
    };

    return config[status] || config.false;
  };

  const getFacilityIcon = (facility) => {
    const facilityIcons = {
      wifi: Wifi,
      parking: Car,
      catering: Utensils,
      ac: Building,
    };

    const lowerFacility = facility.toLowerCase();
    for (const [key, Icon] of Object.entries(facilityIcons)) {
      if (lowerFacility.includes(key)) {
        return Icon;
      }
    }
    return Star;
  };

  const filteredHalls = halls.filter(hall => {
    const matchesSearch = 
      hall.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hall.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hall.owner?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || 
      (statusFilter === 'AVAILABLE' && hall.available) ||
      (statusFilter === 'UNAVAILABLE' && !hall.available);

    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    ALL: halls.length,
    AVAILABLE: halls.filter(h => h.available).length,
    UNAVAILABLE: halls.filter(h => !h.available).length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading venues...</p>
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
                Venues Management
              </h1>
              <p className="text-gray-600 text-lg">Manage all event venues and their availability</p>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl">
                <Plus className="h-5 w-5" />
                Add New Venue
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Object.entries(statusCounts).map(([status, count]) => {
            const isActive = statusFilter === status;
            const config = getStatusConfig(status === 'AVAILABLE');
            
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg' 
                    : 'bg-white border-gray-200 hover:shadow-md text-gray-700'
                }`}
              >
                <div className="text-3xl font-bold mb-2">{count}</div>
                <div className="text-sm font-medium">{status.replace('_', ' ')} Venues</div>
                <div className={`text-xs mt-2 ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                  {status === 'ALL' ? 'Total venues in system' : 
                   status === 'AVAILABLE' ? 'Currently available for booking' : 
                   'Temporarily unavailable'}
                </div>
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
                  placeholder="Search venues by name, location, or owner..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              Showing {filteredHalls.length} of {halls.length} venues
            </div>
          </div>
        </div>

        {filteredHalls.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-200">
            <Building className="h-24 w-24 mx-auto text-gray-400 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No venues found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {searchTerm || statusFilter !== 'ALL' 
                ? 'Try adjusting your search criteria or filters' 
                : 'There are no venues in the system yet'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredHalls.map(hall => {
              const statusConfig = getStatusConfig(hall.available);
              const StatusIcon = statusConfig.icon;
              const facilities = hall.facilities ? hall.facilities.split(',').map(f => f.trim()) : [];

              return (
                <div 
                  key={hall.id} 
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer"
                  onClick={() => setSelectedHall(hall)}
                >
                  {/* Header with Gradient */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-48 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Building className="h-32 w-32 text-white opacity-10" />
                    </div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border backdrop-blur-sm ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig.label}
                      </span>
                    </div>

                    {/* Price Overlay */}
                    <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                      <div className="text-white text-right">
                        <div className="text-2xl font-bold">₹{hall.price_per_hour}</div>
                        <div className="text-xs opacity-90">per hour</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {hall.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {hall.description || 'No description available for this venue.'}
                    </p>
                    
                    {/* Key Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-3 text-gray-700">
                        <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <span className="text-sm">{hall.location || 'Location not specified'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <Users className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm">Capacity: {hall.capacity} people</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <User className="h-4 w-4 text-purple-600 flex-shrink-0" />
                        <span className="text-sm">Owner: {hall.owner?.full_name || 'Unknown'}</span>
                      </div>
                    </div>

                    {/* Facilities */}
                    {facilities.length > 0 && (
                      <div className="mb-4">
                        <div className="text-xs text-gray-500 mb-2">Key Facilities</div>
                        <div className="flex flex-wrap gap-1.5">
                          {facilities.slice(0, 3).map((facility, index) => {
                            const FacilityIcon = getFacilityIcon(facility);
                            return (
                              <span
                                key={index}
                                className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
                              >
                                <FacilityIcon className="h-3 w-3" />
                                {facility}
                              </span>
                            );
                          })}
                          {facilities.length > 3 && (
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                              +{facilities.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleHallStatus(hall.id, hall.available);
                          }}
                          className={`flex-1 px-4 py-3 rounded-xl transition-all duration-200 font-semibold flex items-center justify-center gap-2 ${
                            hall.available
                              ? 'bg-yellow-500 text-white hover:bg-yellow-600 shadow-lg hover:shadow-xl'
                              : 'bg-green-500 text-white hover:bg-green-600 shadow-lg hover:shadow-xl'
                          }`}
                        >
                          <StatusIcon className="h-4 w-4" />
                          {hall.available ? 'Make Unavailable' : 'Make Available'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteModal(hall.id);
                          }}
                          className="px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center justify-center"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
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

        {/* Hall Detail Modal */}
        {selectedHall && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-900">Venue Details</h3>
                  <button
                    onClick={() => setSelectedHall(null)}
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
                          <span className="ml-2 font-medium text-gray-900">{selectedHall.name}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Location:</span>
                          <span className="ml-2 font-medium text-gray-900">{selectedHall.location}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Capacity:</span>
                          <span className="ml-2 font-medium text-gray-900">{selectedHall.capacity} people</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Price:</span>
                          <span className="ml-2 font-medium text-gray-900">₹{selectedHall.price_per_hour}/hour</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Owner Information</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-gray-600">Name:</span>
                          <span className="ml-2 font-medium text-gray-900">{selectedHall.owner?.full_name}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Email:</span>
                          <span className="ml-2 font-medium text-gray-900">{selectedHall.owner?.email}</span>
                        </div>
                        {selectedHall.owner?.phone && (
                          <div>
                            <span className="text-sm text-gray-600">Phone:</span>
                            <span className="ml-2 font-medium text-gray-900">{selectedHall.owner.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Status & Description</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Current Status:</span>
                          {getStatusConfig(selectedHall.available).label}
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Description:</span>
                          <p className="mt-1 text-gray-900">{selectedHall.description || 'No description available.'}</p>
                        </div>
                      </div>
                    </div>

                    {selectedHall.facilities && (
                      <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Facilities</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedHall.facilities.split(',').map((facility, index) => {
                            const FacilityIcon = getFacilityIcon(facility.trim());
                            return (
                              <span
                                key={index}
                                className="inline-flex items-center gap-1 bg-white/50 text-gray-700 px-3 py-1.5 rounded-lg text-sm border border-orange-200"
                              >
                                <FacilityIcon className="h-3 w-3" />
                                {facility.trim()}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full transform transition-all duration-300 scale-100">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Delete Venue</h3>
                    <p className="text-gray-600">Are you sure you want to proceed?</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">
                  This action cannot be undone. The venue will be permanently removed from the system and all associated bookings will be cancelled.
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(null)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteHall(showDeleteModal)}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                  >
                    Delete Venue
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

export default AdminHallsPage;