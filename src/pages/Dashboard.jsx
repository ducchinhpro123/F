import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProductContext } from '../context/ProductContext';
import { useCustomerContext } from '../context/CustomerContext';

const Dashboard = () => {
  const { products } = useProductContext();
  const { customers } = useCustomerContext();
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);

  useEffect(() => {
    
    if (products && products.length) {
      const sorted = [...products].sort((a, b) => 
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
      setRecentProducts(sorted.slice(0, 5));
    }

    // Get most recent customers (up to 5)
    if (customers && customers.length) {
      const sorted = [...customers].sort((a, b) => 
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
      setRecentCustomers(sorted.slice(0, 5));
    }
  }, [products, customers]);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="dashboard-summary">
        <div className="summary-card">
          <h3>Products</h3>
          <div className="summary-count">{products?.length || 0}</div>
          <Link to="/products" className="btn btn-primary">View All</Link>
        </div>
        
        <div className="summary-card">
          <h3>Customers</h3>
          <div className="summary-count">{customers?.length || 0}</div>
          <Link to="/customers" className="btn btn-primary">View All</Link>
        </div>
      </div>
      
      <div className="dashboard-recent">
        <div className="recent-section">
          <h2>Recent Products</h2>
          {recentProducts.length > 0 ? (
            <ul className="recent-list">
              {recentProducts.map(product => (
                <li key={product.id} className="recent-item">
                  <span>{product.name}</span>
                  <span>${product.price?.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent products</p>
          )}
          <Link to="/products/new" className="btn btn-sm">Add Product</Link>
        </div>
        
        <div className="recent-section">
          <h2>Recent Customers</h2>
          {recentCustomers.length > 0 ? (
            <ul className="recent-list">
              {recentCustomers.map(customer => (
                <li key={customer.id} className="recent-item">
                  <span>{customer.name}</span>
                  <span>{customer.email}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent customers</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
