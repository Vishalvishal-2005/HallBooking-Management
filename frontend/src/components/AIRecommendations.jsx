// ==================== src/components/AIRecommendations.jsx ====================
import React, { useEffect, useState } from 'react';
import { Clock, Sparkles, TrendingUp, Users } from 'lucide-react';
import { api } from '../services/api';
import HallCard from './HallCard';

const AIRecommendations = ({ currentHallId, onBook }) => {
  const [similarHalls, setSimilarHalls] = useState([]);
  const [personalizedHalls, setPersonalizedHalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('similar');

  useEffect(() => {
    if (currentHallId) {
      fetchSimilarHalls();
    }
    fetchPersonalizedHalls();
  }, [currentHallId]);

  const fetchSimilarHalls = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await api.get(`/api/ai/similar/${currentHallId}`);
      
      if (!Array.isArray(data) || data.length === 0) {
        const fallbackData = await api.get('/api/halls?limit=3');
        setSimilarHalls(Array.isArray(fallbackData) ? fallbackData.slice(0, 3) : []);
      } else {
        setSimilarHalls(data);
      }
    } catch (error) {
      console.error('Error fetching similar halls:', error);
      setError('Failed to load similar venues');
      setSimilarHalls([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPersonalizedHalls = async () => {
    try {
      setError(null);
      const data = await api.get('/api/ai/personalized');
      
      if (!Array.isArray(data) || data.length === 0) {
        const fallbackData = await api.get('/api/halls?limit=3');
        setPersonalizedHalls(Array.isArray(fallbackData) ? fallbackData.slice(0, 3) : []);
      } else {
        setPersonalizedHalls(data);
      }
    } catch (error) {
      console.error('Error fetching personalized recommendations:', error);
      setError('Failed to load personalized recommendations');
      setPersonalizedHalls([]);
    }
  };

  const hallsToShow = activeTab === 'similar' ? similarHalls : personalizedHalls;

  const retryFetch = () => {
    setError(null);
    if (activeTab === 'similar') {
      fetchSimilarHalls();
    } else {
      fetchPersonalizedHalls();
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-6 w-6 text-purple-600" />
        <h3 className="text-xl font-semibold text-gray-900">AI Recommendations</h3>
        {error && (
          <span className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
            {error}
          </span>
        )}
      </div>

      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('similar')}
          className={`pb-3 px-2 font-medium border-b-2 transition ${
            activeTab === 'similar'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <TrendingUp className="h-4 w-4 inline mr-2" />
          Similar Venues
        </button>
        <button
          onClick={() => setActiveTab('personalized')}
          className={`pb-3 px-2 font-medium border-b-2 transition ${
            activeTab === 'personalized'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users className="h-4 w-4 inline mr-2" />
          For You
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent mx-auto"></div>
          <p className="text-gray-600 mt-2">Finding perfect venues for you...</p>
        </div>
      ) : hallsToShow.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hallsToShow.map(hall => (
            <HallCard key={hall.id} hall={hall} onBook={onBook} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Clock className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p>No recommendations available at the moment.</p>
          <p className="text-sm">Try browsing more halls to get better suggestions.</p>
          <button
            onClick={retryFetch}
            className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;