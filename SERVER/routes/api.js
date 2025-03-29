var express = require('express');
var router = express.Router();
const { protect } = require('../middleware/auth');
var ProductRoute = require('../routes/products');
var UserRoute = require('../routes/users');

router.use('/products', ProductRoute);
router.use('/users', UserRoute);


module.exports = router;
