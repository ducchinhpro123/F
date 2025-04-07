import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useCategoryContext } from '../../context/CategoryContext';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PriceStats = ({ products, customers, categories }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const { categories: allCategories } = useCategoryContext();

  // Tính tổng số lượng sản phẩm trong kho
  const calculateTotalStock = (prods) => {
    return prods.reduce((total, product) => total + (parseInt(product.stock) || 0), 0);
  };

  // Chuyển đổi giá trị thành số thập phân an toàn
  const parsePrice = (price) => {
    const parsedPrice = parseFloat(price);
    return isNaN(parsedPrice) ? 0 : parsedPrice;
  };

  // Hàm lấy thông tin danh mục từ ID
  const getCategoryById = (categoryId) => {
    if (!categories || !Array.isArray(categories)) return null;
    return categories.find(cat => cat._id === categoryId);
  };

  // Hàm trích xuất tên danh mục từ đối tượng sản phẩm
  const getCategoryName = (product) => {
    // Kiểm tra nếu category là một đối tượng có thuộc tính name
    if (product.category && typeof product.category === 'object' && product.category.name) {
      return product.category.name;
    }
    // Nếu category là chuỗi nhưng là ID của danh mục
    else if (product.category && typeof product.category === 'string') {
      const category = getCategoryById(product.category);
      if (category) return category.name;
      return product.category;
    }
    // Nếu không có category hoặc không xác định
    return 'Chưa phân loại';
  };

  useEffect(() => {
    // Kiểm tra xem có products và allCategories không
    if (!Array.isArray(products) || !allCategories) {
      return;
    }

    // Lấy danh sách danh mục từ context
    const dbCategories = allCategories.categories || [];
    
    // Khởi tạo đối tượng để lưu trữ dữ liệu của từng danh mục
    const categoriesMap = {};
    
    // Khởi tạo tất cả danh mục với giá trị mặc định
    if (dbCategories.length > 0) {
      dbCategories.forEach(category => {
        if (category && category.name) {
          categoriesMap[category.name] = {
            total: 0,
            count: 0,
            avg: 0
          };
        }
      });
    } else {
      // Sử dụng danh sách hardcoded nếu không có dữ liệu từ API
      const defaultCategories = [
        'Smartphones', 'Laptops', 'Audio', 'Wearables', 
        'Tablets', 'Cameras', 'Gaming', 'Smart Home'
      ];
      
      defaultCategories.forEach(name => {
        categoriesMap[name] = {
          total: 0,
          count: 0,
          avg: 0
        };
      });
    }
    
    // Thêm danh mục "Chưa phân loại"
    categoriesMap['Chưa phân loại'] = {
      total: 0,
      count: 0,
      avg: 0
    };
    
    // Tính tổng giá và số lượng sản phẩm cho mỗi danh mục
    products.forEach(product => {
      const category = getCategoryName(product);
      const price = parsePrice(product.price);
      
      if (!categoriesMap[category]) {
        categoriesMap[category] = {
          total: 0,
          count: 0,
          avg: 0
        };
      }
      
      categoriesMap[category].total += price;
      categoriesMap[category].count++;
    });
    
    // Tính giá trung bình cho mỗi danh mục
    Object.keys(categoriesMap).forEach(category => {
      if (categoriesMap[category].count > 0) {
        categoriesMap[category].avg = categoriesMap[category].total / categoriesMap[category].count;
      }
    });
    
    // Lấy tất cả tên danh mục và sắp xếp theo giá trung bình
    const avgPrices = Object.keys(categoriesMap).map(category => ({
      category,
      avg: categoriesMap[category].avg,
      count: categoriesMap[category].count
    }));
    
    // Sắp xếp theo giá trung bình tăng dần
    avgPrices.sort((a, b) => a.avg - b.avg);
    
    setChartData({
      labels: avgPrices.map(item => item.category),
      datasets: [
        {
          label: 'Giá trung bình (VNĐ)',
          data: avgPrices.map(item => Math.round(item.avg)),
          fill: false,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          tension: 0.1,
          pointRadius: 5,
          pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        },
        {
          label: 'Số lượng sản phẩm',
          data: avgPrices.map(item => item.count),
          fill: false,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          tension: 0.1,
          pointRadius: 5,
          pointBackgroundColor: 'rgba(255, 99, 132, 1)',
          yAxisID: 'y1',
        }
      ],
    });
  }, [products, categories, allCategories]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Giá trung bình (VNĐ)',
          font: {
            size: 12
          }
        }
      },
      y1: {
        beginAtZero: true,
        position: 'right',
        title: {
          display: true,
          text: 'Số lượng sản phẩm',
          font: {
            size: 12
          }
        },
        grid: {
          drawOnChartArea: false,
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Phân tích giá sản phẩm theo danh mục',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const datasetLabel = context.dataset.label || '';
            const value = context.raw || 0;
            if (datasetLabel.includes('Giá')) {
              return `${datasetLabel}: ${value.toLocaleString()} VNĐ`;
            } else {
              return `${datasetLabel}: ${value}`;
            }
          }
        }
      }
    },
  };

  // Xác định dữ liệu sử dụng cho hiển thị
  const dataToUse = (products && products.length) ? products : [];
  const customerCount = (customers && customers.length) ? customers.length : 0;
  const totalStock = calculateTotalStock(dataToUse);
  const totalProductCount = dataToUse.length; // Sử dụng số lượng sản phẩm thực tế

  // Tính toán giá thấp nhất, trung bình và cao nhất
  const calculatedData = (() => {
    try {
      if (dataToUse && dataToUse.length > 0) {
        const prices = dataToUse.map(p => parsePrice(p.price)).filter(price => price > 0);
        
        if (prices.length === 0) return { min: 0, avg: 0, max: 0 };
        
        const min = Math.min(...prices);
        const avg = Math.round(prices.reduce((acc, price) => acc + price, 0) / prices.length);
        const max = Math.max(...prices);
        
        return { min, avg, max };
      }
      return { min: 0, avg: 0, max: 0 };
    } catch (error) {
      console.error("Error calculating price data:", error);
      return { min: 0, avg: 0, max: 0 };
    }
  })();

  return (
    <div className="stat-card">
      <h3>Phân tích giá sản phẩm</h3>
      
      {/* Thêm phần tổng quan thống kê */}
      <div className="overview-stats">
        <div className="stats-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
          <div className="stat-overview-card" style={{ flex: '1', minWidth: '150px', backgroundColor: 'rgba(54, 162, 235, 0.1)', padding: '15px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '5px', color: 'var(--primary-color)' }}>Tổng sản phẩm</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-color)' }}>{totalProductCount}</div>
          </div>
          
          <div className="stat-overview-card" style={{ flex: '1', minWidth: '150px', backgroundColor: 'rgba(75, 192, 192, 0.1)', padding: '15px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '5px', color: 'var(--primary-color)' }}>Tổng người dùng</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-color)' }}>{customerCount}</div>
          </div>
          
          <div className="stat-overview-card" style={{ flex: '1', minWidth: '150px', backgroundColor: 'rgba(255, 159, 64, 0.1)', padding: '15px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '5px', color: 'var(--primary-color)' }}>Tổng tồn kho</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-color)' }}>{totalStock.toLocaleString()}</div>
          </div>
        </div>
      </div>
      
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>
      
      <div className="price-distribution">
        <h4 style={{ marginTop: '20px', marginBottom: '10px', fontSize: '1rem' }}>Phân bố giá sản phẩm:</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <div className="price-stat-item" style={{ backgroundColor: 'rgba(54, 162, 235, 0.1)', padding: '8px 12px', borderRadius: '4px', flex: '1' }}>
            <div style={{ fontWeight: 'bold' }}>Thấp nhất:</div>
            <div>{calculatedData.min.toLocaleString()} VNĐ</div>
          </div>
          <div className="price-stat-item" style={{ backgroundColor: 'rgba(75, 192, 192, 0.1)', padding: '8px 12px', borderRadius: '4px', flex: '1' }}>
            <div style={{ fontWeight: 'bold' }}>Trung bình:</div>
            <div>{calculatedData.avg.toLocaleString()} VNĐ</div>
          </div>
          <div className="price-stat-item" style={{ backgroundColor: 'rgba(255, 99, 132, 0.1)', padding: '8px 12px', borderRadius: '4px', flex: '1' }}>
            <div style={{ fontWeight: 'bold' }}>Cao nhất:</div>
            <div>{calculatedData.max.toLocaleString()} VNĐ</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceStats; 