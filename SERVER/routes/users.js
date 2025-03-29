var express = require('express');
var router = express.Router();
const UserController = require('../controller/UserController');
const { protect } = require('../middleware/auth');

router.post('/login', UserController.login);
router.post('/register', UserController.register);
router.get('/getAllUser', UserController.getAllUser);

// Profile routes - protected
router.get('/profile', protect, UserController.getProfile);
router.put('/profile', protect, UserController.updateProfile);
router.post('/profile/avatar', protect, UserController.uploadAvatar);

module.exports = router;
