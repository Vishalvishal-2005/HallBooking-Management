// In your HallDetailsPage.jsx (if you have one)
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AIRecommendations from './components/AIRecommendations';
import { apiCall } from '../services/api';

const HallDetailsPage = () => {
  const { hallId } = useParams();
  const [hall, setHall] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHall = async () => {
      try {
        const data = await apiCall(`/api/halls/${hallId}`);
        setHall(data);
      } catch (err) {
        console.error('Error fetching hall:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHall();
  }, [hallId]);

  const handleBook = (hall) => {
    // Your booking logic
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hall details content */}
        
        {/* AI Recommendations */}
        <AIRecommendations 
          currentHallId={hallId} 
          onBook={handleBook}
        />
      </div>
    </div>
  );
};

export default HallDetailsPage;