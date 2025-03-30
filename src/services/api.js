// Base API configuration and helper functions

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Handles HTTP requests to the API
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} - Response data
 */
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('auth_token');
  
  // Default headers for JSON
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
  
  // Don't set Content-Type header when FormData is present
  // Browser will automatically set it with correct boundary
  if (options.body instanceof FormData) {
    delete defaultHeaders['Content-Type'];
  }
  
<<<<<<< HEAD
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
  
=======
>>>>>>> 479b5cdd100fdf8f9dd1624a9f691ca58718d819
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Common HTTP method wrappers
export const api = {
  get: (endpoint) => apiRequest(endpoint),
  
  post: (endpoint, data) => {
    // If data is FormData, don't stringify it
    if (data instanceof FormData) {
      return apiRequest(endpoint, {
        method: 'POST',
        body: data,
      });
    }
    
    return apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  put: (endpoint, data) => {
    // If data is FormData, don't stringify it
    if (data instanceof FormData) {
      return apiRequest(endpoint, {
        method: 'PUT',
        body: data,
      });
    }
    
    return apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
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
