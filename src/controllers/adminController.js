const User = require("../models/User");
const Booking = require("../models/Booking");
const Transaction = require("../models/Transaction");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { isActive, isVerified } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        isActive,
        isVerified,
      },
      {
        new: true,
      },
    );

    if (!user)
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("mc").populate("client");
    res.status(200).json({
      status: "success",
      results: bookings.length,
      data: {
        bookings,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("mcId")
      .populate("clientId")
      .populate("bookingId");
    res.status(200).json({
      status: "success",
      results: transactions.length,
      data: {
        transactions,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const allowed = [
      "name",
      "email",
      "avatar",
      "bio",
      "phoneNumber",
      "role",
      "isVerified",
      "isActive",
    ];
    const safeData = allowed.reduce((acc, key) => {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        acc[key] = req.body[key];
      }
      return acc;
    }, {});

    if (Object.keys(safeData).length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "No valid fields provided for admin update",
      });
    }

    const user = await User.findByIdAndUpdate(req.params.id, safeData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
