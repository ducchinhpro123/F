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

export default {
  loginUser,
  registerUser
};
