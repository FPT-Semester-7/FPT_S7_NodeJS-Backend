const express = require('express');
const authController = require('../controllers/authController');
const { upload } = require('../config');
const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes (Dành cho người dùng đã đăng nhập)
// router.use(protect); // TODO: Thêm middleware bảo mật
router.put('/settings', authController.updateSettings);
router.post('/kyc', authController.submitKYC);
router.post('/update-avatar', upload.single('avatar'), authController.updateAvatar);

module.exports = router;
