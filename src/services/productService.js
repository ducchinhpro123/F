import { api } from './api';

const PRODUCTS_ENDPOINT = '/products';

/**
 * Get all products
 * @param {Object} params - Query parameters (filters, pagination)
 * @returns {Promise<Object>} Products response with pagination data
 */
export async function getProducts(params = {}) {
  // Convert params object to query string
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value);
    }
  });
  
  const queryString = queryParams.toString();
  const endpoint = queryString ? `${PRODUCTS_ENDPOINT}?${queryString}` : PRODUCTS_ENDPOINT;
  
  return api.get(endpoint);
}

/**
 * Get a product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object>} Product data with details
 */
export async function getProductById(id) {
  return api.get(`${PRODUCTS_ENDPOINT}/${id}`);
}

/**
 * Create a new product
 * @param {Object|FormData} productData - Product data or FormData object
 * @returns {Promise<Object>} Created product
 */
export async function createProduct(productData) {
  const data = await api.post(PRODUCTS_ENDPOINT, productData);
  return data.product;
}

/**
 * Update a product
 * @param {string} id - Product ID
 * @param {Object|FormData} productData - Updated product data or FormData object
 * @returns {Promise<Object>} Updated product
 */
export async function updateProduct(id, productData) {
  const data = await api.put(`${PRODUCTS_ENDPOINT}/${id}`, productData);
  return data.product;
}

/**
 * Delete a product
 * @param {string} id - Product ID
 * @returns {Promise<Object>} Deletion confirmation
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

/**
 * Get featured products
 * @returns {Promise<Array>} Array of featured products
 */
export async function getFeaturedProducts() {
  return api.get(`${PRODUCTS_ENDPOINT}/featured`);
}

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getFeaturedProducts
};
