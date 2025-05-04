var express = require('express');
var router = express.Router();
const { protect } = require('../middleware/auth');
var ProductRoute = require('../routes/products');
var UserRoute = require('../routes/users');
var CategoryRoute = require('../routes/categories');
var chatRouter = require('../routes/chat');

router.use('/products', ProductRoute);
router.use('/users', UserRoute);
router.use('/categories', CategoryRoute);
router.use('/chat', chatRouter);

// Sample data
module.exports = router;
