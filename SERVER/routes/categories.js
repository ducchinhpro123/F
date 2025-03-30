const express = require('express');
const router = express.Router();
const CategoryController = require('../controller/CategoryController');
const { protect } = require('../middleware/auth');
const { categoryUpload } = require('../middleware/upload');

// Public routes
router.get('/', CategoryController.getAllCategories);
router.get('/:id', CategoryController.getCategoryById);
router.get('/:id/products', CategoryController.getProductsByCategory);

// Protected routes - include file upload middleware for specific routes
router.post('/', protect, categoryUpload.single('image'), CategoryController.createCategory);
router.put('/:id', protect, categoryUpload.single('image'), CategoryController.updateCategory);
router.delete('/:id', protect, CategoryController.deleteCategory);

// Upload image only
router.post('/:id/image', protect, categoryUpload.single('image'), CategoryController.uploadImage);

module.exports = router;
