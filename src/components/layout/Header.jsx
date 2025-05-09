import { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RenderUserAvatar from '../common/renderUserAvatar';
import './Header.css';

const Header = ({ toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(3);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  
  const { user, logout, isAuthenticated } = useAuth();
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/') return 'Dashboard';
    if (path === '/login') return 'Login';
    if (path === '/signup') return 'Sign Up';
    if (path === '/profile') return 'My Profile';
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
  
  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/login');
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
        
        <div className="user-menu-container" ref={userMenuRef}>
          <div 
            className="user-menu" 
            onClick={() => isAuthenticated ? setUserMenuOpen(!userMenuOpen) : navigate('/login')}
          >
            <div className="avatar">
              {isAuthenticated ? <RenderUserAvatar /> : 'G'}
            </div>
            <span className="user-name">{isAuthenticated ? user.name : 'Guest'}</span>
          </div>
          
          {userMenuOpen && (
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <strong>{user?.name}</strong>
                <span>@{user?.username}</span>
              </div>
              <ul className="user-dropdown-menu">
                <li>
                  <Link to="/profile" onClick={() => setUserMenuOpen(false)}>
                    Profile
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
