/**
 * @file UserRepository.js
 * @description Lớp truy xuất dữ liệu (Repository) cho đối tượng User.
 * Thực hiện các thao tác CRUD cơ bản trên bảng User.
 */

const User = require("../models/User");

class UserRepository {
  // Tạo người dùng mới
  async create(userData) {
    return await User.create(userData);
  }

  // Tìm người dùng theo Email (bao gồm cả password để dùng cho Login)
  async findByEmail(email) {
    return await User.findOne({ email }).select("+password");
  }

  // Tìm người dùng theo ID
  async findById(id) {
    return await User.findById(id);
  }

  // Cập nhật thông tin người dùng theo ID
  async update(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  }

  // Cập nhật settings của chính người dùng (whitelist an toàn)
  async updateSelfSettings(id, updateData) {
    const ALLOWED_UPDATE_FIELDS = ["name", "avatar", "bio", "phoneNumber"];

    const safeData = Object.keys(updateData)
      .filter((key) => ALLOWED_UPDATE_FIELDS.includes(key))
      .reduce((obj, key) => ({ ...obj, [key]: updateData[key] }), {});

    return await User.findByIdAndUpdate(id, safeData, {
      new: true,
      runValidators: true,
    });
  }

  // Thiết lập trạng thái xác minh danh tính (KYC)
  async setKYC(id, kycData) {
    return await User.findByIdAndUpdate(
      id,
      {
        kycStatus: "pending",
        kycDetails: kycData,
      },
      { new: true },
    );
  }
}

module.exports = new UserRepository();
