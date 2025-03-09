import { createContext, useContext, useState, useCallback } from 'react';
import { getSales, getSaleById, createSale, updateSale, getSalesSummary } from '../services/salesService';

const SalesContext = createContext();

export const SalesProvider = ({ children }) => {
  const [sales, setSales] = useState([]);
  const [currentSale, setCurrentSale] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSales = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSales();
      setSales(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSaleById = useCallback(async (id) => {
    setLoading(true);
    try {
      const data = await getSaleById(id);
      setCurrentSale(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSummaryData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSalesSummary();
      setSalesData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    sales,
    currentSale,
    salesData,
    loading,
    error,
    fetchSales,
    fetchSaleById,
    fetchSummaryData,
    createSale,
    updateSale
  };

  return (
    <SalesContext.Provider value={value}>
      {children}
    </SalesContext.Provider>
  );
};

export const useSalesContext = () => useContext(SalesContext);
