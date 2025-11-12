// ==================== src/pages/Dashboard.jsx ====================
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, upcoming: 0, completed: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/user/' + user.id);
      setBookings(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (bookings) => {
    const stats = {
      total: bookings.length,
      upcoming: bookings.filter(b => b.status === 'CONFIRMED' && new Date(b.bookingDate) > new Date()).length,
      completed: bookings.filter(b => b.status === 'COMPLETED').length,
      cancelled: bookings.filter(b => b.status === 'CANCELLED').length
    };
    setStats(stats);
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      fetchBookings();
      alert('Booking cancelled successfully');
    } catch (error) {
      alert('Failed to cancel booking');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.bookingDate);
    const today = new Date();
    
    switch(activeTab) {
      case 'upcoming':
        return booking.status === 'CONFIRMED' && bookingDate > today;
      case 'past':
        return booking.status === 'COMPLETED' || bookingDate < today;
      case 'cancelled':
        return booking.status === 'CANCELLED';
      default:
        return true;
    }
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'CONFIRMED': return 'bg-success text-white';
      case 'PENDING': return 'bg-warning text-dark';
      case 'CANCELLED': return 'bg-danger text-white';
      case 'COMPLETED': return 'bg-primary text-white';
      default: return 'bg-secondary text-white';
    }
  };

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center vh-100">Loading...</div>;
  }

  return (
    <div className="container my-5">
      <div className="mb-4">
        <h1 className="mb-2">Welcome, {user.fullName}!</h1>
        <p className="text-muted">Manage your bookings and account</p>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="mb-1 text-muted small">Total Bookings</p>
                <h3 className="mb-0">{stats.total}</h3>
              </div>
              <div className="bg-primary text-white rounded-circle p-3">
                <i className="bi bi-journal-text fs-4"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="mb-1 text-muted small">Upcoming</p>
                <h3 className="mb-0 text-success">{stats.upcoming}</h3>
              </div>
              <div className="bg-success text-white rounded-circle p-3">
                <i className="bi bi-clock fs-4"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="mb-1 text-muted small">Completed</p>
                <h3 className="mb-0 text-primary">{stats.completed}</h3>
              </div>
              <div className="bg-primary text-white rounded-circle p-3">
                <i className="bi bi-check-circle fs-4"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="mb-1 text-muted small">Cancelled</p>
                <h3 className="mb-0 text-danger">{stats.cancelled}</h3>
              </div>
              <div className="bg-danger text-white rounded-circle p-3">
                <i className="bi bi-x-circle fs-4"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        {['upcoming', 'past', 'cancelled', 'all'].map(tab => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-calendar-x fs-1 text-muted"></i>
          <h3 className="mt-3">No bookings</h3>
          <p className="text-muted">Get started by booking a venue.</p>
        </div>
      ) : (
        <div className="row g-3">
          {filteredBookings.map(booking => (
            <div key={booking.id} className="col-12">
              <div className="card shadow-sm">
                <div className="card-body d-flex justify-content-between align-items-start">
                  <div className="d-flex">
                    <img
                      src={booking.hallImage || '/placeholder.jpg'}
                      alt={booking.hallName}
                      className="rounded me-3"
                      style={{ width: 100, height: 100, objectFit: 'cover' }}
                    />
                    <div>
                      <h5>{booking.hallName}</h5>
                      <p className="text-muted mb-1">{booking.hallCity}</p>
                      <p className="mb-1 small">Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
                      <p className="mb-0 small">Time: {booking.startTime} - {booking.endTime}</p>
                      <p className="mb-0 small">Guests: {booking.guestCount}</p>
                    </div>
                  </div>
                  <div className="text-end">
                    <span className={`badge ${getStatusColor(booking.status)} mb-2`}>
                      {booking.status}
                    </span>
                    <p className="mb-2 fw-bold fs-5">₹{booking.totalAmount}</p>
                    {booking.status === 'CONFIRMED' && new Date(booking.bookingDate) > new Date() && (
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleCancelBooking(booking.id)}>
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
