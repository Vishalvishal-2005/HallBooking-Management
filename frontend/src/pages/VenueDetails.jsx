// src/pages/VenueDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const VenueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hall, setHall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchHallDetails();
    fetchReviews();
  }, [id]);

  const fetchHallDetails = async () => {
    try {
      const response = await api.get(`/halls/${id}`);
      setHall(response.data);
    } catch (error) {
      console.error('Error fetching hall:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/reviews/hall/${id}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleBookNow = () => {
    if (!user) {
      navigate('/signin');
      return;
    }
    navigate(`/booking/${id}`);
  };

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center vh-100">Loading...</div>;
  }

  if (!hall) {
    return <div className="text-center py-5">Hall not found</div>;
  }

  return (
    <div className="container py-5">
      <div className="row">
        {/* Main Content */}
        <div className="col-lg-8 mb-4">
          {/* Image Gallery */}
          <div className="mb-4">
            <div className="mb-2 rounded overflow-hidden" style={{ height: '400px' }}>
              <img
                src={hall.images?.[selectedImage]?.imageUrl || '/placeholder.jpg'}
                alt={hall.name}
                className="img-fluid w-100 h-100"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="d-flex gap-2 flex-wrap">
              {hall.images?.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`border rounded overflow-hidden p-0 ${selectedImage === idx ? 'border-primary' : ''}`}
                  style={{ width: '90px', height: '70px' }}
                >
                  <img
                    src={img.imageUrl}
                    alt={`${hall.name} ${idx + 1}`}
                    className="img-fluid w-100 h-100"
                    style={{ objectFit: 'cover' }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Hall Details */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h2 className="card-title fw-bold">{hall.name}</h2>
              <p className="text-muted mb-2">
                {hall.address}, {hall.city}, {hall.state} - {hall.pincode}
              </p>
              <div className="d-flex align-items-center mb-3">
                <div className="me-4">
                  <i className="bi bi-star-fill text-warning me-1"></i>
                  <span className="fw-semibold">{hall.rating || 'New'}</span>
                  <span className="text-muted ms-1">({reviews.length} reviews)</span>
                </div>
                <div>
                  <i className="bi bi-people-fill me-1"></i>
                  <span>Capacity: {hall.capacity} guests</span>
                </div>
              </div>
              <span className="badge bg-info text-dark mb-3">{hall.hallType}</span>
              <h5 className="mt-3">Description</h5>
              <p>{hall.description}</p>
            </div>
          </div>

          {/* Facilities */}
          {hall.facilities && hall.facilities.length > 0 && (
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title mb-3">Facilities</h5>
                <div className="row">
                  {hall.facilities.map((facility, idx) => (
                    <div key={idx} className="col-6 col-md-4 mb-2 d-flex align-items-center">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      <span>{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Reviews</h5>
              {reviews.length === 0 ? (
                <p className="text-muted">No reviews yet</p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="mb-3 border-bottom pb-2">
                    <div className="d-flex align-items-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`bi bi-star-fill ${i < review.rating ? 'text-warning' : 'text-secondary'}`}
                        ></i>
                      ))}
                      <span className="ms-2 text-muted small">{review.userName}</span>
                    </div>
                    <p className="mb-0">{review.reviewText}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm sticky-top" style={{ top: '20px' }}>
            <div className="card-body">
              <h3 className="fw-bold text-primary">₹{hall.pricePerHour} <small className="text-muted fs-6">/ hour</small></h3>
              <button
                onClick={handleBookNow}
                className="btn btn-primary w-100 mt-3 mb-3"
              >
                Book Now
              </button>

              <div className="mb-3">
                <div className="d-flex align-items-center mb-1">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Instant Booking
                </div>
                <div className="d-flex align-items-center mb-1">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Secure Payment
                </div>
                <div className="d-flex align-items-center">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Verified Venue
                </div>
              </div>

              <hr />

              <h6 className="fw-semibold">Contact Owner</h6>
              <p className="text-muted small mb-0">For special requests or queries, contact the venue owner.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;
