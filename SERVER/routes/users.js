const express = require('express');
const router = express.Router();
const { UserController, upload } = require('../controller/UserController'); // Import cả UserController và upload
const { protect } = require('../middleware/auth');

router.post('/login', UserController.login);
router.post('/register', UserController.register);
router.get('/getAllUser', UserController.getAllUser);
router.get('/search', UserController.searchUsers);
router.get('/:id', UserController.getUser);
router.put('/:id/edit', upload.single('avatar'), UserController.updateUser);
router.delete('/:id', UserController.deleteUser);
// Profile routes - protected
router.get('/profile', protect, UserController.getProfile);
router.put('/profile', protect, UserController.updateProfile);
router.post('/profile/avatar', protect, upload.single('avatar'), UserController.uploadAvatar);

module.exports = router;