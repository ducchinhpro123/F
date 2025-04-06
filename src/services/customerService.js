// api voi customer
import { api } from './api';


const CUSTOMERS_ENDPOINT = '/customers';



/**
 * Get all customers
 * @returns {Promise<Array>} Array of customers
 */
export async function getCustomers() {
  return api.get(CUSTOMERS_ENDPOINT);
}

/**
 * Get a customer by ID
 * @param {string} id - Customer ID
 * @returns {Promise<Object>} Customer data
 */
export async function getCustomerById(id) {
  return api.get(`${CUSTOMERS_ENDPOINT}/${id}`);
}

/**
 * Create a new customer
 * @param {Object} customerData - Customer data
 * @returns {Promise<Object>} Created customer
 */
export async function createCustomer(customerData) {
  return api.post(CUSTOMERS_ENDPOINT, customerData);
}

/**
 * Update a customer
 * @param {string} id - Customer ID
 * @param {Object} customerData - Updated customer data
 * @returns {Promise<Object>} Updated customer
 */
export async function updateCustomer(id, customerData) {
  return api.put(`${CUSTOMERS_ENDPOINT}/${id}`, customerData);
}

/**
 * Delete a customer
 * @param {string} id - Customer ID
 * @returns {Promise<void>}
 */
export async function deleteCustomer(id) {
  return api.delete(`${CUSTOMERS_ENDPOINT}/${id}`);
}

/**
 * Search customers by query
 * @param {string} query - Search term
 * @returns {Promise<Array>} Matching customers
 */
export async function searchCustomers(query) {
  return api.get(`${CUSTOMERS_ENDPOINT}/search?q=${encodeURIComponent(query)}`);
}

export default {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  searchCustomers
};
