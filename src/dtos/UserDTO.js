class UserDTO {
  constructor(user) {
    this.id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
    this.phoneNumber = user.phoneNumber;
    this.avatar = user.avatar;
    this.isVerified = user.isVerified;
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
