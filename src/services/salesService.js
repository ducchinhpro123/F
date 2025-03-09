import { api } from './api';

const SALES_ENDPOINT = '/sales';

/**
 * Get all sales
 * @param {Object} filters - Optional query parameters
 * @returns {Promise<Array>} Array of sales
 */
export async function getSales(filters = {}) {
  // Convert filters to query string
  const queryParams = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value) queryParams.append(key, value);
  });
  
  const queryString = queryParams.toString();
  const endpoint = queryString 
    ? `${SALES_ENDPOINT}?${queryString}` 
    : SALES_ENDPOINT;
    
  return api.get(endpoint);
}

/**
 * Get a sale by ID
 * @param {string} id - Sale ID
 * @returns {Promise<Object>} Sale data with details
 */
export async function getSaleById(id) {
  return api.get(`${SALES_ENDPOINT}/${id}`);
}

/**
 * Create a new sale
 * @param {Object} saleData - Sale data including items
 * @returns {Promise<Object>} Created sale
 */
export async function createSale(saleData) {
  return api.post(SALES_ENDPOINT, saleData);
}

/**
 * Update a sale
 * @param {string} id - Sale ID
 * @param {Object} saleData - Updated sale data
 * @returns {Promise<Object>} Updated sale
 */
export async function updateSale(id, saleData) {
  return api.put(`${SALES_ENDPOINT}/${id}`, saleData);
}

/**
 * Delete a sale
 * @param {string} id - Sale ID
 * @returns {Promise<void>}
 */
export async function deleteSale(id) {
  return api.delete(`${SALES_ENDPOINT}/${id}`);
}

/**
 * Get sales summary/statistics
 * @param {Object} params - Time period parameters
 * @returns {Promise<Object>} Sales statistics
 */
export async function getSalesSummary(params = {}) {
  const queryParams = new URLSearchParams(params);
  return api.get(`${SALES_ENDPOINT}/summary?${queryParams.toString()}`);
}

export default {
  getSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
  getSalesSummary
};
