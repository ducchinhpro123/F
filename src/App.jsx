import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ProductsList from './pages/Products/ProductsList';
import ProductDetail from './pages/Products/ProductDetail';
import CustomersList from './pages/Customers/CustomersList';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import ProfilePage from './pages/Profile/ProfilePage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ProductProvider } from './context/ProductContext';
import { CustomerProvider } from './context/CustomerContext';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <CustomerProvider>
            <Routes>
              {/* Auth routes (outside layout) */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected routes (inside layout) */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout>
                    <ProfilePage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/products" element={
                <ProtectedRoute>
                  <Layout>
                    <ProductsList />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/products/new" element={
                <ProtectedRoute>
                  <Layout>
                    <ProductDetail />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/products/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <ProductDetail />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/customers" element={
                <ProtectedRoute>
                  <Layout>
                    <CustomersList />
                  </Layout>
                </ProtectedRoute>
              } />
            </Routes>
          </CustomerProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
