/**
 * @file authController.js
 * @description Bộ điều khiển (Controller) xử lý các HTTP Request liên quan đến tài khoản và xác thực.
 */

const authService = require("../services/AuthService");
const UserDTO = require("../dtos/UserDTO");

// Hàm bổ trợ: Tạo Token và gửi phản hồi về cho Client
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const userResponse = new UserDTO(user);

  res.status(statusCode).json({
    status: "success",
    token,
    data: { user: userResponse },
  });
};

// Hàm bổ trợ: Ký số tạo JWT Token
const signToken = (id) => {
  const jwt = require("jsonwebtoken");
  return jwt.sign({ id }, process.env.JWT_SECRET || "secret-fallback", {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

// Đăng ký tài khoản mới
exports.register = async (req, res) => {
  try {
    const sanitizedData = UserDTO.fromRequest(req.body); // Lọc dữ liệu đầu vào
    const user = await authService.register(sanitizedData);
    createSendToken(user, 201, res);
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// Đăng nhập vào hệ thống
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({
          status: "fail",
          message: "Vui lòng cung cấp email và mật khẩu",
        });
    }

    const { user, token } = await authService.login(email, password);

    res.status(200).json({
      status: "success",
      token,
      data: { user: new UserDTO(user) },
    });
  } catch (err) {
    res.status(401).json({ status: "fail", message: err.message });
  }
};

// Cập nhật các cài đặt tài khoản (Dành cho người dùng đã đăng nhập)
exports.updateSettings = async (req, res) => {
  try {
    const user = await authService.updateSettings(req.user.id, req.body);
    res
      .status(200)
      .json({ status: "success", data: { user: new UserDTO(user) } });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// Gửi hồ sơ xác minh danh tính (Dành cho MC)
exports.submitKYC = async (req, res) => {
  try {
    const user = await authService.submitKYC(req.user.id, req.body);
    res
      .status(200)
      .json({ status: "success", data: { user: new UserDTO(user) } });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// Cập nhật ảnh đại diện người dùng
exports.updateAvatar = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ status: "fail", message: "Authentication required" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ status: "fail", message: "Vui lòng chọn ảnh để tải lên" });
    }

    // req.file.path sẽ chứa URL của ảnh trên Cloudinary
    const user = await authService.updateAvatar(req.user.id, req.file.path);

    res.status(200).json({
      status: "success",
      message: "Cập nhật ảnh đại diện thành công",
      data: {
        avatarUrl: req.file.path,
        user: new UserDTO(user),
      },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};
