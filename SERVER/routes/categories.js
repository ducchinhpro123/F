import express from 'express';
const router = express.Router();
import CategoryController from '../controller/CategoryController.js';
import { protect } from '../middleware/auth.js';
import { categoryUpload } from '../middleware/upload.js';
import Category from '../models/Category.js';


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

export default Category