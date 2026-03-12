const UserDTO = require("./UserDTO");

class MCProfileDTO {
  constructor(profile) {
    this.id = profile._id;
    this.userId = profile.user._id || profile.user;
    this.regions = profile.regions;
    this.experience = profile.experience;
    this.styles = profile.styles;
    this.biography = profile.biography;
    this.personality = profile.personality;
    this.hostingStyle = profile.hostingStyle;
    this.notableEvents = profile.notableEvents;
    this.languages = profile.languages;
    this.rates = profile.rates;
    this.eventTypes = profile.eventTypes;
    this.status = profile.status;
    this.showreels = profile.showreels;
    this.audioSamples = profile.audioSamples;
    this.eventPhotos = profile.eventPhotos;
    this.customPackages = profile.customPackages;
    this.rating = profile.rating;
    this.reviewsCount = profile.reviewsCount;

    if (profile.user && typeof profile.user === "object" && profile.user.name) {
      this.user = new UserDTO(profile.user);
    }
  }

  static fromOnboardingRequest(body) {
    return {
      eventTypes: body.niche ? [body.niche] : body.eventTypes,
      experience: body.experience,
      languages: body.languages,
      biography: body.biography,
      personality: body.personality,
      hostingStyle: body.hostingStyle,
      notableEvents: body.notableEvents,
      rates: body.rates,
      customPackages: body.customPackages,
      showreels: body.media
        ? body.media.map((m) => ({ url: m.url, type: m.type }))
        : body.showreels,
      audioSamples: body.audioSamples,
      eventPhotos: body.eventPhotos,
    };
  }
}

module.exports = MCProfileDTO;
