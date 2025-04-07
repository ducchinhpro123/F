var express = require('express');
var router = express.Router();
const { protect } = require('../middleware/auth');

// Controller sẽ được thêm sau khi tạo
// Tạm thời sử dụng mock data
const MOCK_CUSTOMERS = [
  {
    _id: "cust001",
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0901234567",
    address: "123 Đường ABC, Hà Nội",
    status: "active",
    createdAt: new Date("2023-01-15"),
    orders: 5
  },
  {
    _id: "cust002",
    name: "Trần Thị B",
    email: "tranthib@example.com",
    phone: "0912345678",
    address: "456 Đường XYZ, Hồ Chí Minh",
    status: "active",
    createdAt: new Date("2023-02-20"),
    orders: 3
  },
  {
    _id: "cust003",
    name: "Lê Văn C",
    email: "levanc@example.com",
    phone: "0923456789",
    address: "789 Đường KLM, Đà Nẵng",
    status: "inactive",
    createdAt: new Date("2023-03-10"),
    orders: 0
  },
  {
    _id: "cust004",
    name: "Phạm Thị D",
    email: "phamthid@example.com",
    phone: "0934567890",
    address: "321 Đường PQR, Hải Phòng",
    status: "active",
    createdAt: new Date("2023-04-05"),
    orders: 2
  },
  {
    _id: "cust005",
    name: "Hoàng Văn E",
    email: "hoangvane@example.com",
    phone: "0945678901",
    address: "654 Đường STU, Cần Thơ",
    status: "active",
    createdAt: new Date(),
    orders: 1
  }
];

// Get all customers
router.get('/', function(req, res) {
  res.json(MOCK_CUSTOMERS);
});

// Get customer by ID
router.get('/:id', function(req, res) {
  const customer = MOCK_CUSTOMERS.find(c => c._id === req.params.id);
  if (!customer) {
    return res.status(404).json({ message: 'Customer not found' });
  }
  res.json(customer);
});

// Create new customer
router.post('/', protect, function(req, res) {
  // Normally we would save to database here
  const newCustomer = {
    _id: `cust${Date.now()}`,
    ...req.body,
    createdAt: new Date(),
    orders: 0
  };
  
  // In a real app, we would add to database and return the new customer
  res.status(201).json(newCustomer);
});

// Update customer
router.put('/:id', protect, function(req, res) {
  const customer = MOCK_CUSTOMERS.find(c => c._id === req.params.id);
  if (!customer) {
    return res.status(404).json({ message: 'Customer not found' });
  }
  
  // In a real app, we would update the database and return the updated customer
  const updatedCustomer = { ...customer, ...req.body };
  res.json(updatedCustomer);
});

// Delete customer
router.delete('/:id', protect, function(req, res) {
  const customer = MOCK_CUSTOMERS.find(c => c._id === req.params.id);
  if (!customer) {
    return res.status(404).json({ message: 'Customer not found' });
  }
  
  // In a real app, we would delete from database
  res.json({ message: 'Customer deleted successfully' });
});

module.exports = router; 