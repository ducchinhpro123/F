//route chung cua cac api
import express from 'express'
import ProductRoute from '../routes/products.js';

import UserRoute from '../routes/users.js';
import CategoryRoute from '../routes/categories.js';

const router = express.Router();
// Định nghĩa các tuyến đường (routes) của bạn

router.use('/products', ProductRoute);
router.use('/users', UserRoute);
router.use('/categories', CategoryRoute);

// Sample data
export default router;