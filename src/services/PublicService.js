const mcProfileRepository = require("../repositories/MCProfileRepository");
const Resource = require("../models/Resource");
const User = require("../models/User");
const Booking = require("../models/Booking");
const Transaction = require("../models/Transaction");
const Review = require("../models/Review");

const cache = {
  landingData: null,
  landingDataExpiresAt: 0
};

class PublicService {
  async getLandingData() {
    const now = Date.now();
    if (cache.landingData && cache.landingDataExpiresAt > now) {
      return cache.landingData;
    }

    const [
      activeMCs,
      completedBookings,
      revenueResult,
      ratingResult
    ] = await Promise.all([
      User.countDocuments({ role: "mc", isVerified: true }),
      Booking.countDocuments({ status: "Completed" }),
      Transaction.aggregate([
        { $match: { status: "Completed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      Review.aggregate([
        { $group: { _id: null, avgRating: { $avg: "$rating" } } }
      ])
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    const avgRating = ratingResult.length > 0 ? Number(ratingResult[0].avgRating.toFixed(1)) : 5.0;
    const result = {
      hero: {
        title: "The Premier Marketplace for Professional Event MCs.",
        subtitle: "Find the voice that elevates your stage.",
      },
      stats: {
        activeMCs: activeMCs,
        completedBookings: completedBookings,
        totalRevenue: totalRevenue,
        avgRating: avgRating,
      },
      valueProps: [
        {
          title: "Verified Talents",
          desc: "Every MC is manually vetted for quality.",
        },
        {
          title: "Secure Escrow",
          desc: "Payments held until the show is done.",
        },
      ],
    };

    cache.landingData = result;
    cache.landingDataExpiresAt = now + 5 * 60 * 1000; // 5 minutes cache

    return result;
  }

  async discoverMCs(filters) {
    return await mcProfileRepository.findActive(filters);
  }

  async getMCProfile(id) {
    return await mcProfileRepository.findByIdentifier(id);
  }

  async getResources() {
    return await Resource.find();
  }
}

module.exports = new PublicService();
