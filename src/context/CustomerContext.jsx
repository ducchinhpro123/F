import { createContext, useContext, useState, useCallback } from 'react';
import { getCustomers, getCustomerById, createCustomer, updateCustomer } from '../services/customerService';

const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCustomers();
      setCustomers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCustomerById = useCallback(async (id) => {
    setLoading(true);
    try {
      const data = await getCustomerById(id);
      setCurrentCustomer(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateCustomer = useCallback(async (customerData) => {
    setLoading(true);
    try {
      const data = await createCustomer(customerData);
      setCustomers(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdateCustomer = useCallback(async (id, customerData) => {
    setLoading(true);
    try {
      const data = await updateCustomer(id, customerData);
      setCustomers(prev => prev.map(item => item.id === id ? data : item));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    customers,
    currentCustomer,
    loading,
    error,
    fetchCustomers,
    fetchCustomerById,
    createCustomer: handleCreateCustomer,
    updateCustomer: handleUpdateCustomer
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomerContext = () => useContext(CustomerContext);
