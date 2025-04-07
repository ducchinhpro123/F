import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Dữ liệu mẫu khách hàng
const SAMPLE_CUSTOMERS = [
  { id: 1, name: 'Nguyen Van A', email: 'nguyenvana@mail.com', createdAt: '2023-06-15T08:30:00' },
  { id: 2, name: 'Tran Thi B', email: 'tranthib@mail.com', createdAt: '2023-06-20T10:15:00' },
  { id: 3, name: 'Le Van C', email: 'levanc@mail.com', createdAt: '2023-06-25T14:45:00' },
  { id: 4, name: 'Pham Thi D', email: 'phamthid@mail.com', createdAt: '2023-07-10T09:20:00' },
  { id: 5, name: 'Hoang Van E', email: 'hoangvane@mail.com', createdAt: '2023-07-18T11:30:00' },
  { id: 6, name: 'Nguyen Thi F', email: 'nguyenthif@mail.com', createdAt: '2023-07-25T13:40:00' },
  { id: 7, name: 'Tran Van G', email: 'tranvang@mail.com', createdAt: '2023-08-02T15:10:00' },
  { id: 8, name: 'Le Thi H', email: 'lethih@mail.com', createdAt: '2023-08-08T16:25:00' },
  { id: 9, name: 'Vo Van I', email: 'vovani@mail.com', createdAt: '2023-08-15T10:45:00' },
  { id: 10, name: 'Nguyen Van K', email: 'nguyenvank@mail.com', createdAt: '2023-08-22T14:20:00' },
  { id: 11, name: 'Tran Thi L', email: 'tranthil@mail.com', createdAt: '2023-08-28T09:30:00' },
  { id: 12, name: 'Pham Van M', email: 'phamvanm@mail.com', createdAt: '2023-09-05T11:15:00' },
  { id: 13, name: 'Nguyen Thi N', email: 'nguyenthin@mail.com', createdAt: '2023-09-12T13:40:00' },
  { id: 14, name: 'Le Van O', email: 'levano@mail.com', createdAt: '2023-09-18T16:10:00' },
  { id: 15, name: 'Tran Van P', email: 'tranvanp@mail.com', createdAt: '2023-09-25T10:25:00' }
];

// Định nghĩa màu theo gradient cho các tháng
const generateGradientColors = (count) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const ratio = i / (count - 1);
    // Gradient từ xanh lá sang xanh dương
    const r = Math.round(46 + (54 - 46) * ratio);
    const g = Math.round(204 + (162 - 204) * ratio);
    const b = Math.round(113 + (235 - 113) * ratio);
    colors.push(`rgba(${r}, ${g}, ${b}, 0.6)`);
  }
  return colors;
};

const CustomerStats = ({ customers }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  // Tính tổng khách hàng theo từng tháng
  const calculateGrowthData = (customerData) => {
    // Nhóm khách hàng theo tháng đăng ký
    const customersByMonth = {};
    customerData.forEach(customer => {
      const date = new Date(customer.createdAt || new Date());
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      customersByMonth[monthYear] = (customersByMonth[monthYear] || 0) + 1;
    });

    // Sắp xếp các tháng theo thứ tự thời gian
    const sortedMonths = Object.keys(customersByMonth).sort((a, b) => {
      const [aMonth, aYear] = a.split('/').map(Number);
      const [bMonth, bYear] = b.split('/').map(Number);
      
      if (aYear !== bYear) return aYear - bYear;
      return aMonth - bMonth;
    });

    // Lấy 6 tháng gần nhất hoặc tất cả nếu ít hơn 6 tháng
    const recentMonths = sortedMonths.slice(-6);
    const counts = recentMonths.map(month => customersByMonth[month]);

    // Tính tốc độ tăng trưởng
    const growthRate = [];
    for (let i = 1; i < counts.length; i++) {
      const prevCount = counts[i-1];
      const currentCount = counts[i];
      
      if (prevCount > 0) {
        const rate = ((currentCount - prevCount) / prevCount) * 100;
        growthRate.push(parseFloat(rate.toFixed(1)));
      } else {
        growthRate.push(100); // Giả sử 100% tăng trưởng nếu tháng trước không có khách hàng
      }
    }

    // Định dạng lại tên tháng để dễ đọc
    const formattedMonths = recentMonths.map(month => {
      const [m, y] = month.split('/');
      const monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
                           'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
      return `${monthNames[parseInt(m)-1]}, ${y}`;
    });

    return { formattedMonths, counts, growthRate, recentMonths };
  };

  useEffect(() => {
    // Sử dụng dữ liệu mẫu nếu không có dữ liệu thực
    const dataToUse = (customers && customers.length) ? customers : SAMPLE_CUSTOMERS;
    
    const { formattedMonths, counts, growthRate } = calculateGrowthData(dataToUse);
    
    // Tạo màu gradient cho các cột
    const backgroundColors = generateGradientColors(counts.length);
    
    setChartData({
      labels: formattedMonths,
      datasets: [
        {
          label: 'Khách hàng mới',
          data: counts,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
          borderWidth: 1,
        },
      ],
    });
  }, [customers]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0, // Chỉ hiển thị số nguyên
        },
        title: {
          display: true,
          text: 'Số khách hàng',
          font: {
            size: 12
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Tháng',
          font: {
            size: 12
          }
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Tăng trưởng khách hàng theo tháng',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          afterLabel: function(context) {
            const datasetIndex = context.datasetIndex;
            const index = context.dataIndex;
            
            if (index > 0) {
              const currentValue = context.dataset.data[index];
              const previousValue = context.dataset.data[index - 1];
              
              if (previousValue && previousValue > 0) {
                const growthPercent = ((currentValue - previousValue) / previousValue * 100).toFixed(1);
                const direction = growthPercent > 0 ? 'tăng' : 'giảm';
                return `Tăng trưởng: ${Math.abs(growthPercent)}% ${direction}`;
              }
            }
            return '';
          }
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart'
    }
  };

  // Tính tổng số khách hàng và tốc độ tăng trưởng
  const totalCustomers = (customers && customers.length) ? customers.length : SAMPLE_CUSTOMERS.length;
  
  // Tính tốc độ tăng trưởng trung bình (nếu có từ 2 tháng trở lên)
  const calculateAverageGrowth = () => {
    if (!customers || customers.length === 0) {
      const { growthRate } = calculateGrowthData(SAMPLE_CUSTOMERS);
      if (growthRate.length === 0) return 0;
      return growthRate.reduce((sum, rate) => sum + rate, 0) / growthRate.length;
    }
    
    const { growthRate } = calculateGrowthData(customers);
    if (growthRate.length === 0) return 0;
    return growthRate.reduce((sum, rate) => sum + rate, 0) / growthRate.length;
  };
  
  const averageGrowth = calculateAverageGrowth();

  return (
    <div className="stat-card">
      <h3>Thống kê khách hàng mới</h3>
      
      {/* Thêm chỉ số tổng quát */}
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '15px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>Tổng khách hàng</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{totalCustomers}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>Tăng trưởng TB</div>
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: averageGrowth >= 0 ? 'var(--success-color, #28a745)' : 'var(--danger-color, #dc3545)' 
          }}>
            {averageGrowth.toFixed(1)}%
          </div>
        </div>
      </div>
      
      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default CustomerStats; 