import { api } from './api';

const PRODUCTS_ENDPOINT = '/products';

/**
 * Get all products
 * @returns {Promise<Array>} Array of products
 */
export async function getProducts() {
  return api.get(PRODUCTS_ENDPOINT);
}

/**
 * Get a product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object>} Product data
 */
export async function getProductById(id) {
  return api.get(`${PRODUCTS_ENDPOINT}/${id}`);
}

/**
 * Create a new product
 * @param {Object} productData - Product data
 * @returns {Promise<Object>} Created product
 */
export async function createProduct(productData) {
  return api.post(PRODUCTS_ENDPOINT, productData);
}

/**
 * Update a product
 * @param {string} id - Product ID
 * @param {Object} productData - Updated product data
 * @returns {Promise<Object>} Updated product
 */
export async function updateProduct(id, productData) {
  return api.put(`${PRODUCTS_ENDPOINT}/${id}`, productData);
}

/**
 * Delete a product
 * @param {string} id - Product ID
 * @returns {Promise<void>}
 */
export async function deleteProduct(id) {
  return api.delete(`${PRODUCTS_ENDPOINT}/${id}`);
}

/**
 * Search products by query
 * @param {string} query - Search term
 * @returns {Promise<Array>} Matching products
 */
export async function searchProducts(query) {
  return api.get(`${PRODUCTS_ENDPOINT}/search?q=${encodeURIComponent(query)}`);
}

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
};
