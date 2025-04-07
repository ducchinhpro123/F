import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { 
  getProducts, 
  getProductById, 
  createProduct as apiCreateProduct, 
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct 
} from '../services/productService';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all products with filter and pagination support
  const fetchProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts(params);
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  // Tự động tải dữ liệu sản phẩm khi component mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Fetch product by ID
  const fetchProductById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductById(id);
      setCurrentProduct(data);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.message || `Failed to load product with ID: ${id}`);
      setCurrentProduct(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new product
  const createProduct = useCallback(async (productData) => {
    setLoading(true);
    setError(null);
    try {
      const createdProduct = await apiCreateProduct(productData);
      setProducts(prev => {
        if (!prev || !prev.products) return prev;
        return {
          ...prev,
          products: [createdProduct, ...prev.products]
        };
      });
      return createdProduct;
    } catch (err) {
      console.error('Error creating product:', err);
      setError(err.message || 'Failed to create product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update existing product
  const updateProduct = useCallback(async (id, productData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedProduct = await apiUpdateProduct(id, productData);
      
      // Update products list if it exists
      setProducts(prev => {
        if (!prev || !prev.products) return prev;
        return {
          ...prev,
          products: prev.products.map(p => 
            p._id === id ? updatedProduct : p
          )
        };
      });
      
      return updatedProduct;
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err.message || `Failed to update product with ID: ${id}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete product
  const deleteProduct = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await apiDeleteProduct(id);
      
      // Remove from products list if it exists
      setProducts(prev => {
        if (!prev || !prev.products) return prev;
        return {
          ...prev,
          products: prev.products.filter(p => p._id !== id)
        };
      });
      
      return true;
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err.message || `Failed to delete product with ID: ${id}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Context value
  const value = {
    products,
    currentProduct,
    loading,
    error,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);
