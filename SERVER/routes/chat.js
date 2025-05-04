const express = require('express');
const router = express.Router();
const ChatController = require('../controller/ChatController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/send-message', ChatController.sendChat);

module.exports = router;
