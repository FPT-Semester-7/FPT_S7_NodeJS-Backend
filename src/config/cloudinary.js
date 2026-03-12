const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

/**
 * @file cloudinary.js
 * @description Cấu hình Cloudinary để lưu trữ hình ảnh trên đám mây.
 */

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cấu hình bộ lưu trữ cho ảnh đại diện và các hình ảnh khác
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'mc_hub_uploads', // Tên thư mục trên Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }] // Tự động resize ảnh
    },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };
