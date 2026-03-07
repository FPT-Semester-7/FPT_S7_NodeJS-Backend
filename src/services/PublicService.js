const mcProfileRepository = require('../repositories/MCProfileRepository');
const Resource = require('../models/Resource');

class PublicService {
    async getLandingData() {
        const verifiedMCs = await mcProfileRepository.countVerified();
        return {
            hero: {
                title: "The Premier Marketplace for Professional Event MCs.",
                subtitle: "Find the voice that elevates your stage."
            },
            stats: {
                verifiedMCs: verifiedMCs || 500,
                agencies: 50,
                scripts: 1200
            },
            valueProps: [
                { title: "Verified Talents", desc: "Every MC is manually vetted for quality." },
                { title: "Secure Escrow", desc: "Payments held until the show is done." }
            ]
        };
    }

    async discoverMCs(filters) {
        return await mcProfileRepository.findActive(filters);
    }

    async getMCProfile(id) {
        return await mcProfileRepository.findByUserId(id);
    }

    async getResources() {
        return await Resource.find();
    }
}

module.exports = new PublicService();
