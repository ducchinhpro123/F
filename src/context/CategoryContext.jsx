import { createContext, useContext, useState, useCallback } from 'react';
import { getCategories, createCategory, deleteCategory, searchCategories, getCategoryById, updateCategory } from '../services/categoryService';

const CategoryContext = createContext();


export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategoryById = useCallback(async (id) => {
    setLoading(true);
    try {
      const data = await getCategoryById(id);
      setCurrentCategory(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateCategory = useCallback(async (productData) => {
    setLoading(true);
    try {
      const data = await createCategory(productData);
      setCategories(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdateCategory = useCallback(async (id, productData) => {
    setLoading(true);
    try {
      const data = await updateCategory(id, productData);
      setCategories(prev => prev.map(item => item.id === id ? data : item));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteCategory = useCallback(async (id) => {
    setLoading(true);
    try {
      await deleteCategory(id);
      setCategories(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    categories,
    currentCategory,
    loading,
    error,
    fetchCategories,
    fetchCategoryById,
    createCategory: handleCreateCategory,
    updateCategory: handleUpdateCategory,
    deleteCategory: handleDeleteCategory
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
}

export const useCategoryContext = () => useContext(CategoryContext);

