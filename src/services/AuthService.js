/**
 * @file AuthService.js
 * @description Lớp nghiệp vụ (Service) xử lý các chức năng liên quan đến xác thực như Đăng ký, Đăng nhập, KYC.
 */

const userRepository = require("../repositories/UserRepository");
const mcProfileRepository = require("../repositories/MCProfileRepository");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class AuthService {
  // Xử lý đăng ký người dùng mới
  async register(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    // Nếu vai trò người dùng là MC, tự động tạo một profile trống cho họ
    if (user.role === "mc") {
      const profile = await mcProfileRepository.create({ user: user._id });
      await userRepository.update(user._id, { mcProfile: profile._id });
      user.mcProfile = profile._id;
    }

    return user;
  }

  // Xử lý logic đăng nhập
 async login(email, password) {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new Error("Email hoặc mật khẩu không hợp lệ");
  }

  let isPasswordValid = false;

  // Trường hợp 1: password đã được hash
  if (user.password.startsWith("$2b$")) {
    isPasswordValid = await bcrypt.compare(password, user.password);
  } 
  // Trường hợp 2: password cũ (plaintext)
  else {
    if (password === user.password) {
      isPasswordValid = true;

      // 👉 BONUS: tự động hash lại password sau khi login thành công
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await user.save(); // hoặc update DB
    }
  }

  if (!isPasswordValid) {
    throw new Error("Email hoặc mật khẩu không hợp lệ");
  }

  // Tạo JWT
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });

  return { user, token };
}
  // Cập nhật các cài đặt tài khoản của người dùng
  async updateSettings(userId, settingsData) {
    return await userRepository.updateSelfSettings(userId, settingsData);
  }

  // Gửi thông tin xác minh danh tính (KYC)
  async submitKYC(userId, kycData) {
    return await userRepository.setKYC(userId, kycData);
  }
  // Cập nhật ảnh đại diện
  async updateAvatar(userId, avatarUrl) {
    return await userRepository.update(userId, { avatar: avatarUrl });
  }
}

module.exports = new AuthService();
