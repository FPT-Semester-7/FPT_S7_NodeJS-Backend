const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config({ path: 'd:/ProjectCode/The-MC-Hub-S7/FPT_S7_NodeJS-Backend/.env' });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const images = [
    'C:/Users/trung/.gemini/antigravity/brain/1e058f08-e141-45d5-a9f0-4bdbf5db5770/mc_female_1_1773310494937.png',
    'C:/Users/trung/.gemini/antigravity/brain/1e058f08-e141-45d5-a9f0-4bdbf5db5770/mc_male_1_1773310511028.png',
    'C:/Users/trung/.gemini/antigravity/brain/1e058f08-e141-45d5-a9f0-4bdbf5db5770/mc_female_2_1773310533217.png'
];

async function upload() {
    console.log('--- Đang tải ảnh lên Cloudinary ---');
    for (const path of images) {
        try {
            const result = await cloudinary.uploader.upload(path, {
                folder: 'mc_hub_mock'
            });
            console.log(`SUCCESS: ${result.secure_url}`);
        } catch (error) {
            console.error(`FAILED: ${path}`, error.message);
        }
    }
}

upload();
