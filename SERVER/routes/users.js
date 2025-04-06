import express from 'express';
import { protect } from '../middleware/auth.js';  // Đảm bảo có .js khi sử dụng ESM
import UserController from '../controller/UserController.js';  // Thêm .js cho các tệp nội bộ
import multer from 'multer';

const router = express.Router();  // Khai báo router trước khi sử dụng

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/avatars');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Routes cho user
router.put('/update/:id', upload.single('avatar'), UserController.updateCustomer);
router.post('/login', UserController.login);
router.post('/register', UserController.register);
router.get('/getAllUser', UserController.getAllUser);
router.get('/user/:id', UserController.getUser);
router.delete('/delete/:id', UserController.deleteUser);

// Profile routes - protected
router.get('/profile', protect, UserController.getProfile);
router.put('/profile', protect, UserController.updateProfile);
router.post('/profile/avatar', protect, UserController.uploadAvatar);

// Export router theo chuẩn ESM
export default router;
