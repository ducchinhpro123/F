import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useCategoryContext } from '../../context/CategoryContext';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Định nghĩa màu cho các danh mục để duy trì tính nhất quán
const CATEGORY_COLORS = {
  'Chưa phân loại': 'rgba(189, 195, 199, 0.6)'
};

const ProductStats = ({ products, categories, productData }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const { categories: allCategories } = useCategoryContext();

  // Hàm tạo màu cho biểu đồ
  const getColorForCategory = (category) => {
    if (CATEGORY_COLORS[category]) {
      return CATEGORY_COLORS[category];
    }

    // Tạo màu ngẫu nhiên nếu không có màu định nghĩa sẵn
    const r = Math.floor(Math.random() * 200) + 55;
    const g = Math.floor(Math.random() * 200) + 55;
    const b = Math.floor(Math.random() * 200) + 55;
    return `rgba(${r}, ${g}, ${b}, 0.6)`;
  };

  useEffect(() => {
    // Kiểm tra nếu có dữ liệu productData và allCategories từ context
    if (productData && allCategories) {
      const dbCategories = allCategories.categories || [];
      
      // Lấy tổng số sản phẩm từ dữ liệu thực tế
      const totalProducts = products.length;
      setTotalProductsCount(totalProducts);
      
      // Tạo danh sách tất cả danh mục từ database
      const categoryData = {};
      
      // Khởi tạo tất cả danh mục từ database với số lượng 0
      if (dbCategories.length > 0) {
        dbCategories.forEach(category => {
          if (category && category.name) {
            categoryData[category.name] = {
              count: 0,
              totalValue: 0
            };
          }
        });
      } else {
        // Hardcoded categories nếu không lấy được từ database
        const defaultCategories = [
          'Smartphones', 'Laptops', 'Audio', 'Wearables', 
          'Tablets', 'Cameras', 'Gaming', 'Smart Home'
        ];
        
        defaultCategories.forEach(name => {
          categoryData[name] = {
            count: 0,
            totalValue: 0
          };
        });
      }
      
      // Thêm danh mục "Chưa phân loại" nếu cần
      categoryData['Chưa phân loại'] = {
        count: 0,
        totalValue: 0
      };
      
      // Cập nhật số lượng từ productData.categories nếu có
      if (productData.categories && Object.keys(productData.categories).length > 0) {
        Object.keys(productData.categories).forEach(categoryName => {
          if (categoryData[categoryName]) {
            categoryData[categoryName] = productData.categories[categoryName];
          } else if (categoryName !== 'Chưa phân loại') {
            // Nếu có danh mục trong productData nhưng không có trong danh sách mặc định
            categoryData[categoryName] = productData.categories[categoryName];
          }
        });
      }
      
      // Chuyển đổi dữ liệu cho biểu đồ
      const categoryNames = Object.keys(categoryData);
      const categoryCounts = categoryNames.map(name => categoryData[name].count || 0);
      
      // Tạo màu cho biểu đồ
      const backgroundColors = categoryNames.map(category => getColorForCategory(category));
      const borderColors = backgroundColors.map(color => color.replace('0.6', '1'));
      
      setChartData({
        labels: categoryNames,
        datasets: [
          {
            label: 'Số lượng sản phẩm',
            data: categoryCounts,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      });
    } else if (Array.isArray(products) && Array.isArray(categories)) {
      // Fallback nếu không có productData
      // Lấy tổng số sản phẩm thực tế
      const totalProducts = products.length;
      setTotalProductsCount(totalProducts);

      // Khởi tạo đối tượng đếm danh mục với tất cả các danh mục từ CategoryContext
      const categoryCount = {};
      
      // Khởi tạo tất cả danh mục với số lượng ban đầu là 0
      categories.forEach(category => {
        if (category && category.name) {
          categoryCount[category.name] = 0;
        }
      });

      // Thêm danh mục "Chưa phân loại"
      categoryCount['Chưa phân loại'] = 0;

      // Đếm số lượng sản phẩm theo danh mục
      products.forEach(product => {
        // Kiểm tra nếu category là một đối tượng có thuộc tính name
        let categoryName = 'Chưa phân loại';
        if (product.category && typeof product.category === 'object' && product.category.name) {
          categoryName = product.category.name;
        } else if (product.category && typeof product.category === 'string') {
          const category = categories.find(cat => cat._id === product.category);
          categoryName = category ? category.name : product.category;
        }
        
        // Đảm bảo danh mục tồn tại trong đối tượng đếm
        if (categoryCount[categoryName] === undefined) {
          categoryCount[categoryName] = 0;
        }
        
        // Đếm số lượng sản phẩm
        categoryCount[categoryName] += 1;
      });

      // Lọc các danh mục không có sản phẩm nào
      const filteredCategories = Object.keys(categoryCount).filter(
        category => categoryCount[category] > 0
      );

      // Lấy số lượng sản phẩm cho các danh mục đã lọc
      const counts = filteredCategories.map(category => categoryCount[category]);

      // Tạo màu cho biểu đồ
      const backgroundColors = filteredCategories.map(category => getColorForCategory(category));
      const borderColors = backgroundColors.map(color => color.replace('0.6', '1'));

      setChartData({
        labels: filteredCategories,
        datasets: [
          {
            label: 'Số lượng sản phẩm',
            data: counts,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      });
    }
  }, [products, categories, productData, allCategories]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 12
          },
          padding: 20
        }
      },
      title: {
        display: true,
        text: 'Phân loại sản phẩm theo danh mục',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = Math.round((value / totalProductsCount) * 100);
            return `${label}: ${value} sản phẩm (${percentage}%)`;
          }
        }
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  return (
    <div className="stat-card">
      <h3>Phân bố sản phẩm theo danh mục</h3>
      <div className="chart-container">
        <Pie data={chartData} options={chartOptions} />
      </div>
      <div className="stats-summary" style={{ textAlign: 'center', marginTop: '10px' }}>
        <small>Tổng số: {totalProductsCount} sản phẩm</small>
      </div>
    </div>
  );
};

export default ProductStats; 