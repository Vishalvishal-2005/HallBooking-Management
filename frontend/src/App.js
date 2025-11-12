// ==================== src/App.jsx ====================
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Chatbot from './components/Chatbot';
import Navigation from './components/Navigation';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AdminBookingsPage from './pages/AdminBookingsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminHallsPage from './pages/AdminHallsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import BrowseHallsPage from './pages/BrowseHallsPage';
import LoginPage from './pages/LoginPage';
import MyBookingsPage from './pages/MyBookingsPage';
import OwnerBookingsPage from './pages/OwnerBookingPage';
import OwnerDashboardPage from './pages/OwnerDashboardPage';
import OwnerHallsPage from './pages/OwnerHallsPage';
import Profile from './pages/Profile';
import SignupPage from './pages/SignupPage';

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
      <p className="text-indigo-600 font-semibold">Loading...</p>
    </div>
  </div>
);

// Main app content that uses routing
/**
 * Renders the main application content based on user authentication status.
 *
 * The component checks if the user is loading and displays a loading spinner if so.
 * It determines the default route for the user based on their role (admin or owner)
 * and sets up various routes for public and protected pages, ensuring that
 * navigation and chatbot are only available to authenticated users.
 *
 * @returns A JSX element representing the application content.
 */
const AppContent = () => {
  const { user, loading, isAdmin, isOwner } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  /**
   * Returns the default route based on user role.
   *
   * The function checks the user's role and returns the corresponding dashboard route.
   * If the user is an admin, it returns '/admin/dashboard'. If the user is an owner,
   * it returns '/owner/dashboard'. For all other cases, it defaults to '/halls'.
   */
  const getDefaultRoute = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isOwner) return '/owner/dashboard';
    return '/halls';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Only show Navigation if user is authenticated */}
      {user && <Navigation />}
      
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={user ? <Navigate to={getDefaultRoute()} replace /> : <LoginPage />} 
        />
        <Route 
          path="/signup" 
          element={user ? <Navigate to={getDefaultRoute()} replace /> : <SignupPage />} 
        />

        {/* Root path redirect */}
        <Route 
          path="/" 
          element={<Navigate to={user ? getDefaultRoute() : '/login'} replace />} 
        />

        {/* Protected Routes - Regular Users */}
        <Route 
          path="/halls" 
          element={user ? <BrowseHallsPage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/my-bookings" 
          element={user ? <MyBookingsPage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/profile" 
          element={user ? <Profile /> : <Navigate to="/login" replace />} 
        />

        {/* Protected Routes - Hall Owners */}
        <Route 
          path="/owner/dashboard" 
          element={user && isOwner ? <OwnerDashboardPage /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/owner/halls" 
          element={user && isOwner ? <OwnerHallsPage /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/owner/bookings" 
          element={user && isOwner ? <OwnerBookingsPage /> : <Navigate to="/" replace />} 
        />

        {/* Protected Routes - Admin */}
        <Route 
          path="/admin/dashboard" 
          element={user && isAdmin ? <AdminDashboardPage /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/admin/users" 
          element={user && isAdmin ? <AdminUsersPage /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/admin/halls" 
          element={user && isAdmin ? <AdminHallsPage /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/admin/bookings" 
          element={user && isAdmin ? <AdminBookingsPage /> : <Navigate to="/" replace />} 
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* Chatbot available on all authenticated pages */}
      {user && <Chatbot />}
    </div>
  );
};

// Main App component with proper Router wrapping
/**
 * Renders the main application with routing and authentication context.
 */
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;