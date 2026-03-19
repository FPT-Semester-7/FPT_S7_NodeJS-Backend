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
        
        // Filter out any profiles that failed to convert to DTO
        const formattedMCs = mcs
            .map(m => {
                try {
                    return new MCProfileDTO(m);
                } catch (error) {
                    console.error(`Error converting MC profile ${m._id} to DTO:`, error.message);
                    return null;
                }
            })
            .filter(m => m !== null); // Remove failed conversions
        
        res.status(200).json({ 
            status: 'success', 
            results: formattedMCs.length, 
            data: { mcs: formattedMCs } 
        });
    } catch (err) {
        console.error('Error in discoverMCs:', err);
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getMCProfile = async (req, res) => {
    try {
        const profile = await publicService.getMCProfile(req.params.id);
        
        if (!profile) {
            return res.status(404).json({ status: 'fail', message: 'MC profile not found' });
        }
        
        try {
            const formattedProfile = new MCProfileDTO(profile);
            res.status(200).json({ status: 'success', data: { profile: formattedProfile } });
        } catch (error) {
            console.error(`Error converting MC profile ${req.params.id} to DTO:`, error.message);
            res.status(400).json({ status: 'fail', message: 'Error formatting profile data: ' + error.message });
        }
    } catch (err) {
        console.error('Error in getMCProfile:', err);
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getResources = async (req, res) => {
    try {
        const resources = await publicService.getResources();
        
        // Filter out resources that failed to convert
        const formattedResources = resources
            .map(r => {
                try {
                    return new ResourceDTO(r);
                } catch (error) {
                    console.error(`Error converting resource ${r._id} to DTO:`, error.message);
                    return null;
                }
            })
            .filter(r => r !== null);
        
        res.status(200).json({ status: 'success', data: { resources: formattedResources } });
    } catch (err) {
        console.error('Error in getResources:', err);
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
