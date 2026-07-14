const express = require('express');
const router = express.Router();
const { login, register, checkStatus, deleteAccount } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/check-status/:id', checkStatus);

router.delete('/delete-account/:id', deleteAccount);

module.exports = router;