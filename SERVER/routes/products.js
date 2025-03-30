const express = require('express');
const router = express.Router();
const ProductController = require('../controller/ProductController');
const { protect } = require('../middleware/auth');
const { productUpload } = require('../middleware/upload');

// Public routes
router.get('/', ProductController.getAllProducts);
router.get('/featured', ProductController.getFeaturedProducts);
router.get('/:id', ProductController.getProductById);

// Protected routes - include file upload middleware for specific routes
router.post('/', protect, productUpload.single('image'), ProductController.createProduct);
router.put('/:id', protect, productUpload.single('image'), ProductController.updateProduct);
router.delete('/:id', protect, ProductController.deleteProduct);

// Upload image only
router.post('/:id/image', protect, productUpload.single('image'), ProductController.uploadImage);

module.exports = router;
