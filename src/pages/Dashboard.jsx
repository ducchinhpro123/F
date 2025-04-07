import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProductContext } from '../context/ProductContext';
import { useCustomerContext } from '../context/CustomerContext';
import { useOrderContext } from '../context/OrderContext';
import { useCategoryContext } from '../context/CategoryContext';
import ProductStats from '../components/stats/ProductStats';
import CustomerStats from '../components/stats/CustomerStats';
import PriceStats from '../components/stats/PriceStats';
import './Dashboard.css';

const Dashboard = () => {
  const { products, fetchProducts } = useProductContext();
  const { customers } = useCustomerContext();
  const { productSoldQuantities, getTotalProductsSold } = useOrderContext();
  const { categories, fetchCategories } = useCategoryContext();
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [productData, setProductData] = useState({
    totalProducts: 0,
    totalStock: 0,
    totalSold: 0,
    categories: {}
  });

  // Lấy dữ liệu sản phẩm khi component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // Xử lý dữ liệu thống kê sản phẩm
  useEffect(() => {
    if (products) {
      // Lấy danh sách sản phẩm từ cấu trúc API response
      const productsList = Array.isArray(products.products) ? products.products : [];
      
      // Sử dụng totalProducts từ API response nếu có, ngược lại sử dụng độ dài mảng
      const totalProducts = products.totalProducts || productsList.length;
      
      // Tính tổng tồn kho
      const totalStock = productsList.reduce((sum, product) => {
        // Chuyển đổi giá trị tồn kho sang số và đảm bảo giá trị hợp lệ
        const stockValue = Number(product.stock);
        return sum + (isNaN(stockValue) ? 0 : stockValue);
      }, 0);
      
      // Lấy tổng số lượng đã bán từ OrderContext
      const totalSold = getTotalProductsSold();
      
      // Phân loại sản phẩm theo danh mục
      const categories = {};
      productsList.forEach(product => {
        // Đảm bảo category luôn có giá trị
        const category = product.category ? 
          (typeof product.category === 'object' ? product.category.name : product.category) : 
          'Chưa phân loại';
        
        if (!categories[category]) {
          categories[category] = {
            count: 0,
            totalValue: 0
          };
        }
        
        // Tăng số lượng sản phẩm trong danh mục
        categories[category].count += 1;
        
        // Tính giá trị hàng tồn = giá x số lượng
        const price = Number(product.price) || 0;
        const stock = Number(product.stock) || 0;
        categories[category].totalValue += price * stock;
      });
      
      // Cập nhật trạng thái với dữ liệu đã xử lý
      setProductData({ totalProducts, totalStock, totalSold, categories });
      
      // Xử lý sản phẩm gần đây
      if (productsList.length > 0) {
        // Sắp xếp sản phẩm theo thời gian để lấy sản phẩm gần đây
        const sorted = [...productsList].sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB - dateA;
        });
        
        setRecentProducts(sorted.slice(0, 5)); // Lấy 5 sản phẩm gần nhất
      }
    }
  }, [products, getTotalProductsSold]);

  // Xử lý dữ liệu khách hàng
  useEffect(() => {
    // Kiểm tra và lấy các khách hàng gần đây
    if (customers && customers.length) {
      const sorted = [...customers].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      });
      setRecentCustomers(sorted.slice(0, 5)); // Giới hạn tối đa 5 khách hàng
    }
  }, [customers]);

  // Định dạng tiền tệ VND
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="dashboard container">
      <div className="dashboard-header">
        <h1>Tổng Quan</h1>
        <p>Trang tổng quan hiển thị thông tin tổng hợp về sản phẩm và khách hàng</p>
      </div>

      {/* Hiển thị thông tin tổng quát */}
      <div className="summary-stats">
        <div className="summary-card">
          <div className="summary-title">Tổng số sản phẩm</div>
          <div className="summary-value">{productData.totalProducts}</div>
        </div>
        <div className="summary-card">
          <div className="summary-title">Tổng hàng trong kho</div>
          <div className="summary-value">{productData.totalStock}</div>
        </div>
        <div className="summary-card">
          <div className="summary-title">Đã bán</div>
          <div className="summary-value">{productData.totalSold}</div>
        </div>
        <div className="summary-card">
          <div className="summary-title">Danh mục sản phẩm</div>
          <div className="summary-value">{categories?.categories?.length || Object.keys(productData.categories).length}</div>
        </div>
      </div>

      <div className="dashboard-stats">
        {products && (
          <ProductStats 
            products={Array.isArray(products.products) ? products.products : []} 
            categories={Array.isArray(categories?.categories) ? categories.categories : []}
            productData={productData}
          />
        )}
        {customers && Array.isArray(customers) && (
          <CustomerStats customers={customers} />
        )}
        {products && (
          <PriceStats 
            products={Array.isArray(products.products) ? products.products : []} 
            customers={customers}
            categories={Array.isArray(categories?.categories) ? categories.categories : []}
          />
        )}
      </div>
      
      <div className="dashboard-recent">
        <div className="recent-section">
          <h2>Sản Phẩm Gần Đây</h2>
          {recentProducts.length > 0 ? (
            <ul className="recent-list">
              {recentProducts.map(product => (
                <li key={product._id || product.id} className="recent-item">
                  <span>{product.name}</span>
                  <span>{formatCurrency(parseFloat(product.price || 0))}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>Chưa có sản phẩm nào</p>
          )}
          <div className="recent-actions">
            <Link to="/products/new" className="btn btn-sm">Thêm Sản Phẩm</Link>
            <Link to="/products" className="btn btn-sm btn-outline">Xem Tất Cả</Link>
          </div>
        </div>
        
        <div className="recent-section">
          <h2>Khách Hàng Gần Đây</h2>
          {recentCustomers.length > 0 ? (
            <ul className="recent-list">
              {recentCustomers.map(customer => (
                <li key={customer._id || customer.id} className="recent-item">
                  <span>{customer.name}</span>
                  <span>{customer.email}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>Chưa có khách hàng nào</p>
          )}
          <div className="recent-actions">
            <Link to="/customers" className="btn btn-sm btn-outline">Xem Tất Cả</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
