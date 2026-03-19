const UserDTO = require("./UserDTO");

class MCProfileDTO {
  constructor(profile) {
    // Defensive checks for missing profile
    if (!profile) {
      return {};
    }

    this.id = profile._id || null;
    this.userId = profile.user?._id || profile.user || null;
    this.regions = profile.regions || [];
    this.experience = profile.experience || 0;
    this.styles = profile.styles || [];
    this.biography = profile.biography || "";
    this.personality = profile.personality || "";
    this.hostingStyle = profile.hostingStyle || "";
    this.notableEvents = profile.notableEvents || [];
    this.languages = profile.languages || [];
    this.rates = profile.rates || { min: 0, max: 0 };
    this.eventTypes = profile.eventTypes || [];
    this.status = profile.status || "Available";
    this.showreels = profile.showreels || [];
    this.audioSamples = profile.audioSamples || [];
    this.eventPhotos = profile.eventPhotos || [];
    this.customPackages = profile.customPackages || [];
    this.rating = profile.rating || 0;
    this.reviewsCount = profile.reviewsCount || 0;

    // Safely create UserDTO if user exists and has required fields
    if (profile.user && typeof profile.user === "object") {
      try {
        this.user = new UserDTO(profile.user);
        
        // Flatten user data to top level for easier access from frontend
        this.name = this.user.name;
        this.email = this.user.email;
        this.avatar = this.user.avatar;
        this.verified = this.user.isVerified;
        this.phoneNumber = this.user.phoneNumber;
      } catch (error) {
        console.error("Error creating UserDTO:", error.message);
        this.user = null;
        
        // Set fallback values
        this.name = "Unknown MC";
        this.email = "";
        this.avatar = null;
        this.verified = false;
        this.phoneNumber = "";
      }
    } else {
      this.user = null;
      
      // Set fallback values
      this.name = "Unknown MC";
      this.email = "";
      this.avatar = null;
      this.verified = false;
      this.phoneNumber = "";
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
