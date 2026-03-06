const User = require('../models/User');

class UserRepository {
    async create(userData) {
        return await User.create(userData);
    }

    async findByEmail(email) {
        return await User.findOne({ email }).select('+password');
    }

    async findById(id) {
        return await User.findById(id);
    }

    async update(id, updateData) {
        return await User.findByIdAndUpdate(id, updateData, { new: true });
    }

    async setKYC(id, kycData) {
        return await User.findByIdAndUpdate(id, { 
            kycStatus: 'pending',
            kycDetails: kycData 
        }, { new: true });
    }
}

module.exports = new UserRepository();
