import { api } from './api';

/**
 * Login user
 * @param {Object} credentials - User credentials
 * @returns {Promise<Object>} User data and auth token
 */
export async function loginUser(credentials) {
  return api.post('/users/login', credentials);
}

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Created user and auth token
 */
export async function registerUser(userData) {
  return api.post('/users/register', userData);
}

/**
 * Get user profile
 * @returns {Promise<Object>} User profile data
 */
export async function getUserProfile() {
  return api.get('/users/profile');
}

/**
 * Update user profile
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<Object>} Updated user data
 */
export async function updateUserProfile(profileData) {
  return api.put('/users/profile', profileData);
}

/**
 * Upload user avatar
 * @param {FormData} formData - FormData containing avatar file
 * @returns {Promise<Object>} Updated user data with new avatar
 */
export async function uploadUserAvatar(formData) {
  return api.postForm('/users/profile/avatar', formData);
}

export default {
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  uploadUserAvatar
};
