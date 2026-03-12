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
    // Trong thực tế, nên băm (hash) mật khẩu ở đây nếu Model chưa xử lý
    const user = await userRepository.create(userData);

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

    // Kiểm tra tài khoản và mật khẩu (Đang so sánh chuỗi trần - nên dùng bcrypt.compare)
    if (!user || user.password !== password) {
      throw new Error("Email hoặc mật khẩu không hợp lệ");
    }

    // Tạo JWT Token để duy trì phiên đăng nhập cho Client
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret-fallback",
      {
        expiresIn: process.env.JWT_EXPIRE || "30d",
      },
    );

    return { user, token };
  }

  // Cập nhật các cài đặt tài khoản của người dùng
  async updateSettings(userId, settingsData) {
    return await userRepository.update(userId, settingsData);
  }

  // Gửi thông tin xác minh danh tính (KYC)
  async submitKYC(userId, kycData) {
    return await userRepository.setKYC(userId, kycData);
  }
}

module.exports = new AuthService();
