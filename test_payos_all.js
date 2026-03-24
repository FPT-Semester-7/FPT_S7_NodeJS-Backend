const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const Booking = require("./src/models/Booking");
const paymentController = require("./src/controllers/paymentController");

async function testAll() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const bookings = await Booking.find({ status: "Accepted", paymentStatus: "Pending" });
    console.log("Found", bookings.length, "pending bookings.");
    
    for (const b of bookings) {
      console.log(`\nTesting booking ID: ${b._id}, Price: ${b.price}`);
      let statusCalled, jsonCalled;
      const res = {
        status: (code) => {
          statusCalled = code;
          return res;
        },
        json: (data) => {
          jsonCalled = data;
        }
      };
      const req = { body: { bookingId: b._id.toString() } };
      
      try {
        await paymentController.createPaymentLink(req, res);
        console.log(`Result HTTP Status: ${statusCalled}`);
        console.log("Response JSON:", jsonCalled);
      } catch (err) {
        console.error("Uncaught error:", err.message);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

testAll();
