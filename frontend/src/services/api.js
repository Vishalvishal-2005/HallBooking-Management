// ==================== services/api.js ====================
const API_BASE_URL = 'http://localhost:8000';

// Enhanced apiCall function
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('auth_token');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      let errorMessage = 'Request failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `HTTP error! status: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// API methods
const api = {
  get: (endpoint, options = {}) => apiCall(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, data = {}, options = {}) => 
    apiCall(endpoint, { ...options, method: 'POST', body: data }),
  put: (endpoint, data = {}, options = {}) => 
    apiCall(endpoint, { ...options, method: 'PUT', body: data }),
  delete: (endpoint, options = {}) => 
    apiCall(endpoint, { ...options, method: 'DELETE' }),
};

// Named exports
export { api, apiCall };

// Default export
export default api;