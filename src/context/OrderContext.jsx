import { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Mock service cho đơn hàng (trong dự án thực tế sẽ kết nối API)
const mockOrderService = {
  getOrders: () => {
    return Promise.resolve([
      {
        id: 'ord001',
        orderItems: [
          { productId: 1, quantity: 2, price: 999.99 },
          { productId: 3, quantity: 1, price: 149.99 }
        ],
        totalPrice: 2149.97,
        isPaid: true,
        isDelivered: true,
        createdAt: '2023-09-10T08:30:00'
      },
      {
        id: 'ord002',
        orderItems: [
          { productId: 5, quantity: 1, price: 799.99 },
          { productId: 8, quantity: 2, price: 129.99 }
        ],
        totalPrice: 1059.97,
        isPaid: true,
        isDelivered: false,
        createdAt: '2023-09-15T10:20:00'
      },
      {
        id: 'ord003',
        orderItems: [
          { productId: 2, quantity: 1, price: 1299.99 },
          { productId: 10, quantity: 3, price: 49.99 }
        ],
        totalPrice: 1449.96,
        isPaid: false,
        isDelivered: false,
        createdAt: '2023-09-20T14:45:00'
      }
    ]);
  },
  
  getOrderById: (id) => {
    // Mock dữ liệu chi tiết đơn hàng
    const orders = [
      {
        id: 'ord001',
        customer: { id: 1, name: 'Nguyen Van A', email: 'nguyenvana@mail.com' },
        orderItems: [
          { productId: 1, name: 'Smartphone Pro X', quantity: 2, price: 999.99 },
          { productId: 3, name: 'Wireless Earbuds', quantity: 1, price: 149.99 }
        ],
        shippingAddress: {
          address: '123 Nguyen Hue St',
          city: 'Ho Chi Minh City',
          postalCode: '70000',
          country: 'Vietnam'
        },
        paymentMethod: 'Credit Card',
        totalPrice: 2149.97,
        isPaid: true,
        paidAt: '2023-09-10T09:15:00',
        isDelivered: true,
        deliveredAt: '2023-09-12T14:30:00',
        createdAt: '2023-09-10T08:30:00'
      },
      {
        id: 'ord002',
        customer: { id: 3, name: 'Le Van C', email: 'levanc@mail.com' },
        orderItems: [
          { productId: 5, name: 'Tablet Pro', quantity: 1, price: 799.99 },
          { productId: 8, name: 'Smart Speaker', quantity: 2, price: 129.99 }
        ],
        shippingAddress: {
          address: '45 Le Loi St',
          city: 'Da Nang',
          postalCode: '50000',
          country: 'Vietnam'
        },
        paymentMethod: 'PayPal',
        totalPrice: 1059.97,
        isPaid: true,
        paidAt: '2023-09-15T11:05:00',
        isDelivered: false,
        deliveredAt: null,
        createdAt: '2023-09-15T10:20:00'
      },
      {
        id: 'ord003',
        customer: { id: 5, name: 'Hoang Van E', email: 'hoangvane@mail.com' },
        orderItems: [
          { productId: 2, name: 'Laptop Ultra', quantity: 1, price: 1299.99 },
          { productId: 10, name: 'Wireless Charging Pad', quantity: 3, price: 49.99 }
        ],
        shippingAddress: {
          address: '78 Tran Hung Dao St',
          city: 'Hanoi',
          postalCode: '10000',
          country: 'Vietnam'
        },
        paymentMethod: 'Bank Transfer',
        totalPrice: 1449.96,
        isPaid: false,
        paidAt: null,
        isDelivered: false,
        deliveredAt: null,
        createdAt: '2023-09-20T14:45:00'
      }
    ];
    
    return Promise.resolve(orders.find(order => order.id === id) || null);
  },
  
  getOrdersSummary: () => {
    return Promise.resolve({
      totalOrders: 3,
      totalSales: 4659.90,
      productsSold: [
        { productId: 1, name: 'Smartphone Pro X', quantity: 2 },
        { productId: 2, name: 'Laptop Ultra', quantity: 1 },
        { productId: 3, name: 'Wireless Earbuds', quantity: 1 },
        { productId: 5, name: 'Tablet Pro', quantity: 1 },
        { productId: 8, name: 'Smart Speaker', quantity: 2 },
        { productId: 10, name: 'Wireless Charging Pad', quantity: 3 }
      ]
    });
  },
  
  // Hàm tính tổng số lượng đã bán cho mỗi sản phẩm
  getProductSoldQuantities: () => {
    return Promise.resolve({
      1: 2,  // Smartphone Pro X: 2 chiếc
      2: 1,  // Laptop Ultra: 1 chiếc
      3: 1,  // Wireless Earbuds: 1 chiếc
      5: 1,  // Tablet Pro: 1 chiếc
      8: 2,  // Smart Speaker: 2 chiếc
      10: 3  // Wireless Charging Pad: 3 chiếc
    });
  }
};

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [ordersSummary, setOrdersSummary] = useState(null);
  const [productSoldQuantities, setProductSoldQuantities] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await mockOrderService.getOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrderById = useCallback(async (id) => {
    setLoading(true);
    try {
      const data = await mockOrderService.getOrderById(id);
      setCurrentOrder(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError(err.message || `Failed to load order with ID: ${id}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrdersSummary = useCallback(async () => {
    setLoading(true);
    try {
      const data = await mockOrderService.getOrdersSummary();
      setOrdersSummary(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders summary:', err);
      setError(err.message || 'Failed to load orders summary');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductSoldQuantities = useCallback(async () => {
    setLoading(true);
    try {
      const data = await mockOrderService.getProductSoldQuantities();
      setProductSoldQuantities(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching product sold quantities:', err);
      setError(err.message || 'Failed to load product sold quantities');
    } finally {
      setLoading(false);
    }
  }, []);

  // Tự động tải dữ liệu khi component mount
  useEffect(() => {
    fetchOrders();
    fetchOrdersSummary();
    fetchProductSoldQuantities();
  }, [fetchOrders, fetchOrdersSummary, fetchProductSoldQuantities]);

  // Tính tổng số sản phẩm đã bán
  const getTotalProductsSold = useCallback(() => {
    return Object.values(productSoldQuantities).reduce((sum, quantity) => sum + quantity, 0);
  }, [productSoldQuantities]);

  // Context value
  const value = {
    orders,
    currentOrder,
    ordersSummary,
    productSoldQuantities,
    loading,
    error,
    fetchOrders,
    fetchOrderById,
    fetchOrdersSummary,
    fetchProductSoldQuantities,
    getTotalProductsSold
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => useContext(OrderContext); 