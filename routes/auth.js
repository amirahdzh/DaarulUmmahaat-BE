const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rute untuk login
router.post('/login', authController.login);

// Rute untuk register
router.post('/register', authController.register);

module.exports = router;
