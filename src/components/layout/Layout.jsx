import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  }, [location]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Listen for sidebar collapsed state
  useEffect(() => {
    const handleSidebarCollapse = (e) => {
      if (e.detail && e.detail.collapsed !== undefined) {
        setSidebarCollapsed(e.detail.collapsed);
      }
    };
    
    window.addEventListener('sidebarCollapsed', handleSidebarCollapse);
    return () => window.removeEventListener('sidebarCollapsed', handleSidebarCollapse);
  }, []);

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`content-wrapper ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header toggleSidebar={toggleSidebar} />
        <div className="content-container">
          <div className="main-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
