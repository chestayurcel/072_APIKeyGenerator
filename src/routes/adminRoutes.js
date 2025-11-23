const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { checkAuth } = require('../middleware/authMiddleware');

// Halaman login (GET)
router.get('/', adminController.showLoginPage);

// Proses login (POST)
router.post('/login', adminController.processLogin);

// Proses logout
router.get('/logout', adminController.processLogout);

// Dashboard (Diproteksi)
router.get('/dashboard', checkAuth, adminController.showDashboard);

// Detail user (Diproteksi)
router.get('/user/:id', checkAuth, adminController.showUserDetail);

module.exports = router;