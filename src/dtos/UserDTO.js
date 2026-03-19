class UserDTO {
  constructor(user) {
    // Defensive checks to prevent errors when user fields are missing
    if (!user) {
      this.id = null;
      this.name = "Unknown";
      this.email = "";
      this.role = "";
      this.phoneNumber = "";
      this.avatar = null;
      this.isVerified = false;
      this.kycStatus = "unverified";
      this.mcProfile = null;
      return;
    }

    this.id = user._id || null;
    this.name = user.name || "Unknown";
    this.email = user.email || "";
    this.role = user.role || "";
    this.phoneNumber = user.phoneNumber || "";
    this.avatar = user.avatar || null;
    this.isVerified = user.isVerified || false;
    this.kycStatus = user.kycStatus || "unverified";
    this.mcProfile = user.mcProfile || null;
  }

  static fromRequest(body) {
    return {
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role,
      phoneNumber: body.phoneNumber,
    };
  }
}

module.exports = UserDTO;
