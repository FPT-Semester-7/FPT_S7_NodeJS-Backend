const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    mc: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true }, // Ngày làm việc
    startTime: { type: String }, // vd: "08:00"
    endTime: { type: String }, // vd: "12:00"
    status: {
      type: String,
      enum: ["Available", "Booked", "Busy"], // Đang rảnh, Đã có lịch đặt, Tự set ngày bận nghỉ ngơi
      default: "Available",
    },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" }, // Nếu bị khóa do có booking thực
    note: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Schedule", scheduleSchema);
