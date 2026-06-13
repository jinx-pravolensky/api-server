const express = require('express');
const router = express.Router();
const { login, register, checkStatus } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/check-status/:id', checkStatus);

module.exports = router;