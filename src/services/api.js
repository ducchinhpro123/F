// Base API configuration and helper functions

// import { axios } from 'axios';

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

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    // Use the merged config object which includes headers
    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (!response.ok) {
      // Try to parse error response as JSON, fallback to text
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: await response.text() };
      }
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    // Handle cases where response might be empty (e.g., 204 No Content)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return await response.json();
    } else {
      // Return null or response text for non-JSON responses
      return response.status === 204 ? null : await response.text();
    }
  } catch (error) {
    console.error('API request error:', error);
    // Re-throw the error so calling code can handle it
    throw error;
  }
}

// Common HTTP method wrappers
export const api = {
  get: (endpoint) => apiRequest(endpoint),

  post: (endpoint, data) => {
    const options = {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    };
    return apiRequest(endpoint, options);
  },

  put: (endpoint, data) => {
    const options = {
      method: 'PUT',
      body: data instanceof FormData ? data : JSON.stringify(data),
    };
    return apiRequest(endpoint, options);
  },

  delete: (endpoint) => apiRequest(endpoint, {
    method: 'DELETE',
  }),

  // For form data with file uploads (postForm is essentially the same as post now)
  postForm: (endpoint, formData) => apiRequest(endpoint, {
    method: 'POST',
    body: formData,
  })
};
