import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Header.css';

const Header = ({ toggleSidebar }) => {
  const location = useLocation();
  const [notifications, setNotifications] = useState(3);
  
  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/') return 'Dashboard';
    if (path.includes('/products')) {
      if (path.includes('/new')) return 'Add Product';
      if (path.includes('/edit')) return 'Edit Product';
      return 'Products';
    }
    if (path.includes('/customers')) {
      if (path.includes('/new')) return 'Add Customer';
      if (path.includes('/edit')) return 'Edit Customer';
      return 'Customers';
    }
    if (path.includes('/sales')) {
      if (path.includes('/new')) return 'New Sale';
      return 'Sales';
    }
    
    return 'Inventory System';
  };
  
  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          ☰
        </button>
        <h2 className="page-title">{getPageTitle()}</h2>
      </div>
      
      <div className="header-right">
        <div className="notifications">
          <span className="notifications-icon">🔔</span>
          {notifications > 0 && (
            <span className="notification-badge">{notifications}</span>
          )}
        </div>
        
        <div className="user-menu">
          <div className="avatar">JD</div>
          <span className="user-name">John Doe</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
