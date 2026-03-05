const MCProfile = require('../models/MCProfile');
const User = require('../models/User');

exports.updateProfile = async (req, res) => {
    try {
        const { user } = req; // Assuming auth middleware sets req.user
        const mcData = req.body;

        let profile = await MCProfile.findOneAndUpdate(
            { user: user._id },
            mcData,
            { new: true, upsert: true }
        );

        res.status(200).json({ status: 'success', data: { profile } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getAllMCs = async (req, res) => {
    try {
        // Basic search/filter functionality
        const { search, region, style, eventType, sortPath, minPrice, maxPrice } = req.query;

        let query = {};
        if (region) query.regions = { $in: [region] };
        if (style) query.styles = { $in: [style] };
        if (eventType) query.eventTypes = { $in: [eventType] };
        if (minPrice) query['rates.min'] = { $gte: minPrice };
        if (maxPrice) query['rates.max'] = { $lte: maxPrice };

        let profilesQuery = MCProfile.find(query).populate('user', 'name avatar');

        if (sortPath) {
            // example: sortPath = 'rating' or '-rating'
            profilesQuery = profilesQuery.sort(sortPath);
        }

        const profiles = await profilesQuery;
        res.status(200).json({ status: 'success', results: profiles.length, data: { profiles } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getMCDetails = async (req, res) => {
    try {
        const profile = await MCProfile.findById(req.params.id).populate('user', 'name avatar');
        if (!profile) return res.status(404).json({ status: 'fail', message: 'MC not found' });

        res.status(200).json({ status: 'success', data: { profile } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
