const MCProfile = require('../models/MCProfile');

class MCProfileRepository {
    async create(data) {
        return await MCProfile.create(data);
    }

    async findByUserId(userId) {
        return await MCProfile.findOne({ user: userId });
    }

    async updateByUserId(userId, updateData) {
        return await MCProfile.findOneAndUpdate({ user: userId }, updateData, { new: true, upsert: true });
    }

    async findActive(filters = {}) {
        let query = {};
        if (filters.niche) query.eventTypes = { $in: [filters.niche] };
        if (filters.languages) query.languages = { $in: filters.languages };
        if (filters.budgetMax) query['rates.min'] = { $lte: filters.budgetMax };
        
        return await MCProfile.find(query).populate('user', 'name profilePicture');
    }

    async countVerified() {
        // Assume verified if KYC is done on User, but let's just count for now
        return await MCProfile.countDocuments();
    }
}

module.exports = new MCProfileRepository();
