// ==================== src/components/Navigation.jsx ====================
import {
  BookOpen,
  Building,
  Calendar,
  Home,
  LogOut,
  Menu,
  Shield,
  User,
  Users as UsersIcon,
  X
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAdmin, isOwner } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // ✅ Desktop navigation item class (underline removed)
  const desktopNavItemClass = (isActive) => 
    `no-underline flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
      isActive 
        ? 'text-indigo-700 bg-indigo-50 shadow-sm' 
        : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
    }`;

  // ✅ Mobile navigation item class (underline removed)
  const mobileNavItemClass = (isActive) => 
    `no-underline flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
      isActive 
        ? 'text-indigo-700 bg-indigo-50 border-l-4 border-indigo-600 shadow-sm' 
        : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
    }`;

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo/Brand */}
          <Link 
            to="/" 
            className="no-underline flex items-center gap-3 text-indigo-600 font-bold text-xl hover:scale-105 transition-all duration-200"
          >
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Building className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              HallBooker
            </span>
            {(isAdmin || isOwner) && (
              <span className={`text-xs px-2 py-1 rounded-full font-semibold border ${
                isAdmin 
                  ? 'bg-red-100 text-red-700 border-red-300' 
                  : 'bg-green-100 text-green-700 border-green-300'
              }`}>
                {isAdmin ? 'ADMIN' : 'OWNER'}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {isAdmin ? (
              <>
                <Link to="/admin/dashboard" className={desktopNavItemClass(isActive('/admin/dashboard'))}>
                  <Shield className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link to="/admin/users" className={desktopNavItemClass(isActive('/admin/users'))}>
                  <UsersIcon className="h-4 w-4" />
                  Users
                </Link>
                <Link to="/admin/halls" className={desktopNavItemClass(isActive('/admin/halls'))}>
                  <Building className="h-4 w-4" />
                  Halls
                </Link>
                <Link to="/admin/bookings" className={desktopNavItemClass(isActive('/admin/bookings'))}>
                  <BookOpen className="h-4 w-4" />
                  Bookings
                </Link>
              </>
            ) : isOwner ? (
              <>
                <Link to="/owner/dashboard" className={desktopNavItemClass(isActive('/owner/dashboard'))}>
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link to="/owner/halls" className={desktopNavItemClass(isActive('/owner/halls'))}>
                  <Building className="h-4 w-4" />
                  My Halls
                </Link>
                <Link to="/owner/bookings" className={desktopNavItemClass(isActive('/owner/bookings'))}>
                  <Calendar className="h-4 w-4" />
                  Bookings
                </Link>
              </>
            ) : (
              <>
                <Link to="/halls" className={desktopNavItemClass(isActive('/halls'))}>
                  <Building className="h-4 w-4" />
                  Browse Halls
                </Link>
                <Link to="/my-bookings" className={desktopNavItemClass(isActive('/my-bookings'))}>
                  <Calendar className="h-4 w-4" />
                  My Bookings
                </Link>
              </>
            )}

            <div className="w-px h-6 bg-gradient-to-b from-gray-300 to-gray-400 mx-2"></div>
            
            <Link to="/profile" className={desktopNavItemClass(isActive('/profile'))}>
              <User className="h-4 w-4" />
              Profile
            </Link>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium no-underline"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-600 hover:from-indigo-100 hover:to-purple-100 transition-all duration-300 shadow-lg hover:shadow-xl border border-indigo-100"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-gray-200 bg-gradient-to-br from-white to-gray-50/95 backdrop-blur-md shadow-2xl">
            <div className="flex flex-col gap-2">
              <div className="px-4 mb-2">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  {isAdmin ? 'Admin Panel' : isOwner ? 'Owner Panel' : 'Navigation'}
                </h3>
              </div>

              {isAdmin ? (
                <>
                  <Link to="/admin/dashboard" className={mobileNavItemClass(isActive('/admin/dashboard'))} onClick={() => setIsMobileMenuOpen(false)}>
                    <Shield className="h-5 w-5" />
                    Dashboard
                  </Link>
                  <Link to="/admin/users" className={mobileNavItemClass(isActive('/admin/users'))} onClick={() => setIsMobileMenuOpen(false)}>
                    <UsersIcon className="h-5 w-5" />
                    Users
                  </Link>
                  <Link to="/admin/halls" className={mobileNavItemClass(isActive('/admin/halls'))} onClick={() => setIsMobileMenuOpen(false)}>
                    <Building className="h-5 w-5" />
                    Halls
                  </Link>
                  <Link to="/admin/bookings" className={mobileNavItemClass(isActive('/admin/bookings'))} onClick={() => setIsMobileMenuOpen(false)}>
                    <BookOpen className="h-5 w-5" />
                    Bookings
                  </Link>
                </>
              ) : isOwner ? (
                <>
                  <Link to="/owner/dashboard" className={mobileNavItemClass(isActive('/owner/dashboard'))} onClick={() => setIsMobileMenuOpen(false)}>
                    <Home className="h-5 w-5" />
                    Dashboard
                  </Link>
                  <Link to="/owner/halls" className={mobileNavItemClass(isActive('/owner/halls'))} onClick={() => setIsMobileMenuOpen(false)}>
                    <Building className="h-5 w-5" />
                    My Halls
                  </Link>
                  <Link to="/owner/bookings" className={mobileNavItemClass(isActive('/owner/bookings'))} onClick={() => setIsMobileMenuOpen(false)}>
                    <Calendar className="h-5 w-5" />
                    Bookings
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/halls" className={mobileNavItemClass(isActive('/halls'))} onClick={() => setIsMobileMenuOpen(false)}>
                    <Building className="h-5 w-5" />
                    Browse Halls
                  </Link>
                  <Link to="/my-bookings" className={mobileNavItemClass(isActive('/my-bookings'))} onClick={() => setIsMobileMenuOpen(false)}>
                    <Calendar className="h-5 w-5" />
                    My Bookings
                  </Link>
                </>
              )}

              <div className="px-4 mt-4 mb-2">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Account
                </h3>
              </div>

              <Link to="/profile" className={mobileNavItemClass(isActive('/profile'))} onClick={() => setIsMobileMenuOpen(false)}>
                <User className="h-5 w-5" />
                Profile
              </Link>
              
              <button
                onClick={handleLogout}
                className="no-underline flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium text-left"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-300">
              <div className="px-4 mb-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  User Info
                </h3>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 rounded-xl mx-2">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.full_name || user.email}
                  </p>
                  <p className="text-xs text-gray-600 truncate mt-1">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
