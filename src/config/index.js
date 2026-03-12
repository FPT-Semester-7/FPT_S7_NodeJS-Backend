const connectDB = require('./db');
const { cloudinary, upload } = require('./cloudinary');

module.exports = {
    connectDB,
    cloudinary,
    upload
};
