const userRepository = require('../repositories/UserRepository');
const mcProfileRepository = require('../repositories/MCProfileRepository');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class AuthService {
    async register(userData) {
        // In a real app, hash password here if model doesn't handle it
        const user = await userRepository.create(userData);
        
        // If user is MC, create an empty profile
        if (user.role === 'mc') {
            await mcProfileRepository.create({ user: user._id });
        }
        
        return user;
    }

    async login(email, password) {
        const user = await userRepository.findByEmail(email);
        
        // Basic password check (assuming plain text for now as per existing controller, 
        // but adding placeholder for bcrypt)
        if (!user || user.password !== password) {
            throw new Error('Invalid email or password');
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret-fallback', {
            expiresIn: process.env.JWT_EXPIRE || '30d'
        });

        return { user, token };
    }

    async updateSettings(userId, settingsData) {
        return await userRepository.update(userId, settingsData);
    }

    async submitKYC(userId, kycData) {
        return await userRepository.setKYC(userId, kycData);
    }
}

module.exports = new AuthService();
