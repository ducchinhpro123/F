// Base API configuration and helper functions

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Handles HTTP requests to the API
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} - Response data
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  // Add auth token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  // Don't set content-type for FormData (browser will set it with boundary)
  if (options.formData) {
    delete defaultHeaders['Content-Type'];
  }
  
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  // Remove formData flag from config
  if (config.formData) {
    delete config.formData;
  }
  
  try {
    const response = await fetch(url, config);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } else {
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      return response.text();
    }
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// Common HTTP method wrappers
export const api = {
  get: (endpoint) => apiRequest(endpoint),
  
  post: (endpoint, data) => apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  put: (endpoint, data) => apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (endpoint) => apiRequest(endpoint, {
    method: 'DELETE',
  }),
  
  // For form data with file uploads
  postForm: (endpoint, formData) => apiRequest(endpoint, {
    method: 'POST',
    body: formData,
    formData: true, // Flag to avoid setting Content-Type
  })
};
