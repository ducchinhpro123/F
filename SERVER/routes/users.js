var express = require('express');
var router = express.Router();
const UserController = require('../controller/UserController'); // import class UserController

const User = require('../models/User');
const { protect } = require('../middleware/auth');

router.post('/login', UserController.login);
router.post('/register', UserController.register);
router.get('/getAllUser', UserController.getAllUser);


module.exports = router;
