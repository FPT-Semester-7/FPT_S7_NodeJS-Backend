const Script = require('../models/Script');

class ScriptRepository {
    async findAll(filters = {}) {
        let query = {};
        if (filters.category) query.category = filters.category;
        if (filters.tone) query.tone = filters.tone;
        if (filters.search) query.title = { $regex: filters.search, $options: 'i' };
        
        return await Script.find(query);
    }

    async findById(id) {
        return await Script.findById(id);
    }

    async incrementFavorite(id) {
        return await Script.findByIdAndUpdate(id, { $inc: { favoritesCount: 1 } }, { new: true });
    }
}

module.exports = new ScriptRepository();
