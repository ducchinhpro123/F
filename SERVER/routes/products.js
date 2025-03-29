const express = require('express');
const router = express.Router();
const ProductController = require('../controller/ProductController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', ProductController.getAllProducts);
router.get('/featured', ProductController.getFeaturedProducts);
router.get('/:id', ProductController.getProductById);

// Protected routes
router.post('/', protect, ProductController.createProduct);
router.put('/:id', protect, ProductController.updateProduct);
router.delete('/:id', protect, ProductController.deleteProduct);

module.exports = router;
