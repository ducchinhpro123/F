import { createContext, useContext, useState, useCallback } from 'react';
import { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer } from '../services/customerService';

const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all customers
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCustomers();
      console.log('Fetched customers:', response);
      setCustomers(response);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Failed to fetch customers. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single customer by ID
  const fetchCustomerById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const customer = await getCustomerById(id);
      if (customer) {
        setCurrentCustomer(customer);
      } else {
        console.error('Invalid API response:', customer);
        setError('Invalid API response. Please contact support.');
      }
    } catch (error) {
      console.error(`Error fetching customer with ID ${id}:`, error);
      setError('Failed to fetch customer details. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new customer
  const addCustomer = async (customerData) => {
    setError(null);
    try {
      const newCustomer = await createCustomer(customerData);
      // Fetch lại toàn bộ danh sách sau khi thêm
      await fetchCustomers();
      return newCustomer;
    } catch (error) {
      console.error('Error adding customer:', error);
      setError('Failed to add customer. Please try again later.');
      throw error;
    }
  };

  // Edit an existing customer
  const editCustomer = async (id, customerData) => {
    setError(null);
    try {
      const updatedCustomer = await updateCustomer(id, customerData);
      setCustomers((prev) =>
        prev.map((customer) => (customer.id === id ? updatedCustomer : customer))
      );
    } catch (error) {
      console.error(`Error updating customer with ID ${id}:`, error);
      setError('Failed to update customer. Please try again later.');
    }
  };

  // Remove a customer
  const removeCustomer = async (id) => {
    setError(null);
    try {
      await deleteCustomer(id);
      setCustomers((prev) => prev.filter((customer) => customer._id !== id));
    } catch (error) {
      console.error(`Error deleting customer with ID ${id}:`, error);
      setError('Failed to delete customer. Please try again later.');
    }
  };

  return (
    <CustomerContext.Provider
      value={{
        customers,
        setCustomers,
        currentCustomer,
        loading,
        error,
        fetchCustomers,
        fetchCustomerById,
        addCustomer,
        editCustomer,
        removeCustomer,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomerContext = () => useContext(CustomerContext);