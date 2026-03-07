const publicService = require('../services/PublicService');
const MCProfileDTO = require('../dtos/MCProfileDTO');
const ResourceDTO = require('../dtos/ResourceDTO');

exports.getLandingData = async (req, res) => {
    try {
        const data = await publicService.getLandingData();
        res.status(200).json({ status: 'success', data });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.discoverMCs = async (req, res) => {
    try {
        const mcs = await publicService.discoverMCs(req.query);
        const formattedMCs = mcs.map(m => new MCProfileDTO(m));
        res.status(200).json({ status: 'success', results: formattedMCs.length, data: { mcs: formattedMCs } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getMCProfile = async (req, res) => {
    try {
        const profile = await publicService.getMCProfile(req.params.id);
        res.status(200).json({ status: 'success', data: { profile: profile ? new MCProfileDTO(profile) : null } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getResources = async (req, res) => {
    try {
        const resources = await publicService.getResources();
        const formattedResources = resources.map(r => new ResourceDTO(r));
        res.status(200).json({ status: 'success', data: { resources: formattedResources } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
