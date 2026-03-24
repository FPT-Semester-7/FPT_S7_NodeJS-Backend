const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load env
dotenv.config({ path: path.join(__dirname, ".env") });

const Booking = require("./src/models/Booking");
const payosService = require("./src/services/PayOSService");

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");
    
    // Get a pending payment booking
    const booking = await Booking.findOne({ status: "Accepted", paymentStatus: "Pending" });
    if (!booking) {
      console.log("No pending booking found");
      process.exit(0);
    }
    
    console.log("Trying to create PayOS link for booking:", booking._id, "amount:", booking.price);
    
    const result = await payosService.createPaymentLink(booking);
    console.log("Success:", result);
  } catch (err) {
    console.error("Error creating payment link:", err.message);
    if (err.response) {
      console.error("Axios Error Response:", err.response.data);
    }
  } finally {
    process.exit(0);
  }
}

test();
