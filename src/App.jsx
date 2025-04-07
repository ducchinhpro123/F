import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import ProductsList from "./pages/Products/ProductsList";
import ProductDetail from "./pages/Products/ProductDetail";
import ProductEdit from "./pages/Products/ProductEdit";
import ProductNew from "./pages/Products/ProductNew";
import ProductView from "./pages/Products/ProductView";
import CustomersList from "./pages/Customers/CustomersList";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ProfilePage from "./pages/Profile/ProfilePage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { ProductProvider } from "./context/ProductContext";
import { CategoryProvider } from "./context/CategoryContext";
import { CustomerProvider } from "./context/CustomerContext";
import { AuthProvider } from "./context/AuthContext";
import { OrderProvider } from './context/OrderContext';
import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CategoryProvider>
          <ProductProvider>
            <CustomerProvider>
              <OrderProvider>
                <Routes>
                  {/* Auth routes (outside layout) */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />

                  {/* Protected routes (inside layout) */}
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Dashboard />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <ProfilePage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/products"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <ProductsList />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/products/new"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <ProductNew />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/products/edit/:id"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <ProductEdit />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/products/view/:id"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <ProductView />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customers"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <CustomersList />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </OrderProvider>
            </CustomerProvider>
          </ProductProvider>
        </CategoryProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
