import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    
    // Dispatch an event to notify Layout about the collapse state
    const event = new CustomEvent('sidebarCollapsed', { 
      detail: { collapsed: newCollapsedState } 
    });
    window.dispatchEvent(event);
  };
  
  const sidebarClass = `sidebar ${isCollapsed ? 'collapsed' : ''} ${isOpen ? 'open' : ''}`;
  
  return (
    <>
      {isOpen && <div className="mobile-overlay active" onClick={toggleSidebar}></div>}
      <div className={sidebarClass}>
        <div className="sidebar-header">
          <NavLink to="/" className="logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 4h4v3h-4V4zm10 16H4V9h16v11z"/>
              <path d="M9 12h6v2H9z"/>
            </svg>
            <span>Hi mom!</span>
          </NavLink>
        </div>
        
        <ul className="nav-items">
          <li className="nav-item">
            <NavLink to="/" className="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
              </svg>
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/products" className="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z"/>
              </svg>
              <span>Products</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/customers" className="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <span>Customers</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/chat" className="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
              </svg>
              <span>Chat</span>
            </NavLink>
          </li>
        </ul>
        
        <button className="toggle-sidebar" onClick={handleToggleCollapse}>
          {isCollapsed ? '»' : '«'}
        </button>
      </div>
    </>
  );
};

export default Sidebar;
