import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ProductsList from './pages/Products/ProductsList';
import ProductDetail from './pages/Products/ProductDetail';
import CustomersList from './pages/Customers/CustomersList';
import { ProductProvider } from './context/ProductContext';
import { CustomerProvider } from './context/CustomerContext';
import './App.css';

function App() {
  return (
    <Router>
      <ProductProvider>
        <CustomerProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<ProductsList />} />
              <Route path="/products/new" element={<ProductDetail />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/customers" element={<CustomersList />} />
            </Routes>
          </Layout>
        </CustomerProvider>
      </ProductProvider>
    </Router>
  );
}

export default App;
