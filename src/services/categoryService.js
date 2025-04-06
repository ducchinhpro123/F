import { api } from './api';

const CATEGORIES_ENDPOINT = '/categories';

/**
 * Get all categories
 * @returns {Promise<Array>} Array of categories
 */
export async function getCategories() {
  return api.get(CATEGORIES_ENDPOINT);
}

/**
 * Get a category by ID
 * @param {string} id - Category ID
 * @returns {Promise<Object>} Category data
 */
export async function getCategoryById(id) {
  return api.get(`${CATEGORIES_ENDPOINT}/${id}`);
}

/**
 * Create a new category
 * @param {Object} productData - Category data
 * @returns {Promise<Object>} Created category
 */
export async function createCategory(productData) {
  return api.post(CATEGORIES_ENDPOINT, productData);
}

/**
 * Update a category
 * @param {string} id - Category ID
 * @param {Object} productData - Updated category data
 * @returns {Promise<Object>} Updated category
 */
export async function updateCategory(id, productData) {
  return api.put(`${CATEGORIES_ENDPOINT}/${id}`, productData);
}

/**
 * Delete a category
 * @param {string} id - Category ID
 * @returns {Promise<void>}
 */
export async function deleteCategory(id) {
  return api.delete(`${CATEGORIES_ENDPOINT}/${id}`);
}

/**
 * Search categories by query
 * @param {string} query - Search term
 * @returns {Promise<Array>} Matching categories
 */
export async function searchCategories(query) {
  return api.get(`${CATEGORIES_ENDPOINT}/search?q=${encodeURIComponent(query)}`);
}

export default {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  searchCategories
};
