import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProductContext } from '../context/ProductContext';
import { useCustomerContext } from '../context/CustomerContext';
import { useOrderContext } from '../context/OrderContext';
import { useCategoryContext } from '../context/CategoryContext';
import ProductStats from '../components/stats/ProductStats';
import CustomerStats from '../components/stats/CustomerStats';
import PriceStats from '../components/stats/PriceStats';
import './Dashboard.css';

// Helper function to safely get product list
const getSafeProductList = (productsContext) => {
  return Array.isArray(productsContext?.products) ? productsContext.products : [];
};

// Helper function to safely get category list
const getSafeCategoryList = (categoriesContext) => {
  return Array.isArray(categoriesContext?.categories) ? categoriesContext.categories : [];
};

// Helper function to format currency
const formatCurrency = (value) => {
  return new window.Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value || 0); // Ensure value is not undefined/null
};

const Dashboard = () => {
  // --- Context Hooks ---
  const { products: productsContext, fetchProducts } = useProductContext();
  const { customers: customersContext, fetchCustomers } = useCustomerContext(); // Assuming fetchCustomers exists
  const { getTotalProductsSold, fetchOrders } = useOrderContext(); // Assuming fetchOrders exists
  const { categories: categoriesContext, fetchCategories } = useCategoryContext();

  // --- State ---
  // No local state needed for derived data anymore, using useMemo instead.
  // State for recent items is still needed if calculated separately or fetched differently.

  // --- Data Fetching ---
  useEffect(() => {
    console.log('Fetching initial dashboard data...');
    fetchProducts();
    fetchCategories();
    if (fetchCustomers) fetchCustomers(); // Fetch customers if function exists
    if (fetchOrders) fetchOrders(); // Fetch orders if function exists (needed for getTotalProductsSold)
    // Removed interval refresh for simplification. Consider adding a manual refresh button if needed.
  }, [fetchProducts, fetchCategories, fetchCustomers, fetchOrders]); // Dependencies for initial fetch

  // --- Derived Data Calculation (using useMemo) ---

  // Memoize the safe product list
  const productsList = useMemo(() => getSafeProductList(productsContext), [productsContext]);

  // Memoize the safe category list
  const categoriesList = useMemo(() => getSafeCategoryList(categoriesContext), [categoriesContext]);

  // Memoize product statistics
  const productStats = useMemo(() => {
    const totalProducts = productsContext?.totalProducts || productsList.length;
    const totalStock = productsList.reduce((sum, product) => {
      const stockValue = Number(product.stock);
      return sum + (isNaN(stockValue) ? 0 : stockValue);
    }, 0);
    const totalSold = getTotalProductsSold ? getTotalProductsSold() : 0; // Ensure function exists

    // Calculate category breakdown (simplified, only counts products per category)
    const categoryCounts = productsList.reduce((acc, product) => {
      const categoryName = product.category
        ? typeof product.category === 'object'
          ? product.category.name
          : product.category
        : 'Uncategorized';
      acc[categoryName] = (acc[categoryName] || 0) + 1;
      return acc;
    }, {});

    return {
      totalProducts,
      totalStock,
      totalSold,
      categoryCount: Object.keys(categoryCounts).length, // Count of distinct categories found in products
      // Note: The detailed category breakdown (value, etc.) might be better handled within ProductStats if needed there
    };
  }, [productsList, productsContext?.totalProducts, getTotalProductsSold]);

  // Memoize recent products
  const recentProducts = useMemo(() => {
    if (!productsList.length) return [];
    // Sort by creation date (descending)
    return [...productsList]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5); // Get top 5
  }, [productsList]);

  // Memoize recent customers
  const recentCustomers = useMemo(() => {
    const safeCustomers = Array.isArray(customersContext) ? customersContext : [];
    if (!safeCustomers.length) return [];
    // Sort by creation date (descending)
    return [...safeCustomers]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5); // Get top 5
  }, [customersContext]);

  // --- Render ---
  return (
    <div className="dashboard container">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Summary information about products and customers.</p>
        {/* Consider adding a manual refresh button here */}
        {/* <button onClick={() => { fetchProducts(); fetchCategories(); ... }}>Refresh Data</button> */}
      </div>

      {/* Summary Statistics */}
      <div className="summary-stats">
        <div className="summary-card">
          <div className="summary-title">Total Products</div>
          <div className="summary-value">{productStats.totalProducts}</div>
        </div>
        <div className="summary-card">
          <div className="summary-title">Total Stock</div>
          <div className="summary-value">{productStats.totalStock}</div>
        </div>
        <div className="summary-card">
          <div className="summary-title">Total Sold</div>
          <div className="summary-value">{productStats.totalSold}</div>
        </div>
        <div className="summary-card">
          <div className="summary-title">Product Categories</div>
          {/* Display count from categories context if available, otherwise from calculated product stats */}
          <div className="summary-value">{categoriesList.length > 0 ? categoriesList.length : productStats.categoryCount}</div>
        </div>
      </div>

      {/* Detailed Stats Components */}
      <div className="dashboard-stats">
        {/* Pass memoized lists directly */}
        <ProductStats
          products={productsList}
          categories={categoriesList}
          // Pass specific stats needed, avoid passing the whole old productData object
          // Example: pass categoryCounts if ProductStats needs it
        />
        <CustomerStats customers={Array.isArray(customersContext) ? customersContext : []} />
        <PriceStats
          products={productsList}
          customers={Array.isArray(customersContext) ? customersContext : []}
          categories={categoriesList}
        />
      </div>

      {/* Recent Activity Sections */}
      <div className="dashboard-recent">
        <div className="recent-section">
          <h2>Recent Products</h2>
          {recentProducts.length > 0 ? (
            <ul className="recent-list">
              {recentProducts.map((product) => (
                <li key={product._id || product.id} className="recent-item">
                  <span>{product.name}</span>
                  <span>{formatCurrency(product.price)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent products found.</p>
          )}
          <div className="recent-actions">
            <Link to="/products/new" className="btn btn-sm">Add Product</Link>
            <Link to="/products" className="btn btn-sm btn-outline">View All</Link>
          </div>
        </div>

        <div className="recent-section">
          <h2>Recent Customers</h2>
          {recentCustomers.length > 0 ? (
            <ul className="recent-list">
              {recentCustomers.map((customer) => (
                <li key={customer._id || customer.id} className="recent-item">
                  <span>{customer.name}</span>
                  <span>{customer.email}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent customers found.</p>
          )}
          <div className="recent-actions">
            {/* Assuming a route exists for adding customers */}
            {/* <Link to="/customers/new" className="btn btn-sm">Add Customer</Link> */}
            <Link to="/customers" className="btn btn-sm btn-outline">View All</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
