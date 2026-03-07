const UserDTO = require('./UserDTO');

class MCProfileDTO {
    constructor(profile) {
        this.id = profile._id;
        this.userId = profile.user._id || profile.user;
        this.regions = profile.regions;
        this.experience = profile.experience;
        this.styles = profile.styles;
        this.rates = profile.rates;
        this.eventTypes = profile.eventTypes;
        this.status = profile.status;
        this.showreels = profile.showreels;
        this.rating = profile.rating;
        this.reviewsCount = profile.reviewsCount;
        
        if (profile.user && typeof profile.user === 'object' && profile.user.name) {
            this.user = new UserDTO(profile.user);
        }
    }

    static fromOnboardingRequest(body) {
        return {
            eventTypes: body.niche ? [body.niche] : body.eventTypes,
            experience: body.experience,
            languages: body.languages,
            showreels: body.media ? body.media.map(m => ({ url: m.url, type: m.type })) : body.showreels
        };
    }
}

module.exports = MCProfileDTO;
