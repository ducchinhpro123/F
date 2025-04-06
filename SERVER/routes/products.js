import express from 'express';
import ProductController from '../controller/ProductController.js';
import { protect } from '../middleware/auth.js';
import { productUpload } from '../middleware/upload.js';

const router = express.Router();


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

export default router
