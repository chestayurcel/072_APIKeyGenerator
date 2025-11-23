const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Halaman utama
router.get('/', userController.showHomePage);

// Proses simpan user dan key
router.post('/save', userController.saveUserAndKey);

module.exports = router;