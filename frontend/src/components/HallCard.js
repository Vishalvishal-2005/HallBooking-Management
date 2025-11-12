// ==================== src/components/HallCard.jsx ====================
import React from 'react';
import { MapPin, Users, Star, Building, Wifi, Car, Utensils, Snowflake, Tv, Music, Coffee } from 'lucide-react';

const HallCard = ({ hall, onBook, onSelect, showActions = false, onEdit, onDelete }) => {
  // Parse facilities string into array
  const facilities = hall.facilities ? hall.facilities.split(',').map(f => f.trim()) : [];
  
  // Enhanced facility icons mapping
  const facilityIcons = {
    wifi: { icon: Wifi, color: 'text-blue-500' },
    parking: { icon: Car, color: 'text-green-500' },
    catering: { icon: Utensils, color: 'text-orange-500' },
    ac: { icon: Snowflake, color: 'text-cyan-500' },
    'air conditioning': { icon: Snowflake, color: 'text-cyan-500' },
    television: { icon: Tv, color: 'text-purple-500' },
    tv: { icon: Tv, color: 'text-purple-500' },
    sound: { icon: Music, color: 'text-pink-500' },
    audio: { icon: Music, color: 'text-pink-500' },
    kitchen: { icon: Coffee, color: 'text-amber-500' },
    // Add more mappings as needed
  };

  const getFacilityIcon = (facility) => {
    const lowerFacility = facility.toLowerCase();
    for (const [key, data] of Object.entries(facilityIcons)) {
      if (lowerFacility.includes(key)) {
        return data;
      }
    }
    return { icon: Star, color: 'text-gray-500' }; // Default icon
  };

  // Generate a consistent gradient based on hall ID
  const gradientClass = `bg-gradient-to-br ${
    hall.id % 4 === 0 ? 'from-purple-500 to-pink-600' :
    hall.id % 3 === 0 ? 'from-blue-500 to-cyan-600' :
    hall.id % 2 === 0 ? 'from-green-500 to-emerald-600' :
    'from-orange-500 to-red-600'
  }`;

  return (
    <div 
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer transform hover:-translate-y-2"
      onClick={() => onSelect && onSelect(hall)}
    >
      {/* Image/Header Section */}
      <div className={`h-48 ${gradientClass} relative overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-20 h-20 bg-white rounded-full"></div>
          <div className="absolute bottom-4 right-4 w-16 h-16 bg-white rounded-full"></div>
        </div>
        
        {/* Main Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Building className="h-16 w-16 text-white opacity-20" />
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          {hall.available ? (
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/30 flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              Available
            </span>
          ) : (
            <span className="bg-red-500/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-red-300 flex items-center gap-1.5">
              <div className="w-2 h-2 bg-red-300 rounded-full"></div>
              Booked
            </span>
          )}
        </div>

        {/* Price Overlay */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg transform group-hover:scale-105 transition-transform duration-300">
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">₹{hall.price_per_hour}</div>
            <div className="text-xs text-gray-500 font-medium">per hour</div>
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {/* Content Section */}
      <div className="p-6">
        {/* Title and Location */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors duration-200">
            {hall.name}
          </h3>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
            <span className="line-clamp-1 text-sm font-medium">{hall.location || 'Location not specified'}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {hall.description || 'No description available for this venue.'}
        </p>

        {/* Key Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Capacity</div>
              <div className="text-sm font-bold text-gray-900">{hall.capacity} people</div>
            </div>
          </div>
          
          {hall.rating && (
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                <Star className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium">Rating</div>
                <div className="text-sm font-bold text-gray-900 flex items-center gap-1">
                  {hall.rating}/5
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Facilities */}
        {facilities.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">Key Facilities</div>
            <div className="flex flex-wrap gap-2">
              {facilities.slice(0, 4).map((facility, index) => {
                const { icon: IconComponent, color } = getFacilityIcon(facility);
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 hover:shadow-md"
                  >
                    <IconComponent className={`h-3.5 w-3.5 ${color}`} />
                    <span>{facility}</span>
                  </div>
                );
              })}
              {facilities.length > 4 && (
                <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-700 px-3 py-2 rounded-lg text-xs font-medium">
                  <span>+{facilities.length - 4} more</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 border-t border-gray-100">
          {showActions ? (
            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit && onEdit(hall);
                }}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>Edit</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete && onDelete(hall.id);
                }}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>Delete</span>
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBook(hall);
              }}
              disabled={!hall.available}
              className={`w-full px-4 py-4 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-3 ${
                hall.available 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Building className="h-5 w-5" />
              <span className="text-lg">{hall.available ? 'Book Now' : 'Not Available'}</span>
              {hall.available && (
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500/50 transition-all duration-300 pointer-events-none"></div>
    </div>
  );
};

export default HallCard;