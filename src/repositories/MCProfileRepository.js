const MCProfile = require("../models/MCProfile");
const mongoose = require("mongoose");

class MCProfileRepository {
  async create(data) {
    return await MCProfile.create(data);
  }

  async findByUserId(userId) {
    return await MCProfile.findOne({ user: userId }).populate(
      "user",
      "name email phoneNumber avatar isVerified role mcProfile",
    );
  }

  async findByIdentifier(id) {
    const conditions = [{ user: id }];

    if (mongoose.Types.ObjectId.isValid(id)) {
      conditions.push({ _id: id });
    }

    return await MCProfile.findOne({ $or: conditions }).populate(
      "user",
      "name email phoneNumber avatar isVerified role mcProfile",
    );
  }

  async updateByUserId(userId, updateData) {
    return await MCProfile.findOneAndUpdate({ user: userId }, updateData, {
      new: true,
      upsert: true,
    }).populate(
      "user",
      "name email phoneNumber avatar isVerified role mcProfile",
    );
  }

  async findActive(filters = {}) {
    let query = {};
    if (filters.niche || filters.eventType)
      query.eventTypes = { $in: [filters.niche || filters.eventType] };
    if (filters.languages) query.languages = { $in: filters.languages };
    if (filters.budgetMax)
      query["rates.min"] = { $lte: Number(filters.budgetMax) };
    if (filters.priceRange) {
      const [min, max] = String(filters.priceRange)
        .split("-")
        .map((value) => Number(value));
      if (!Number.isNaN(min) && !Number.isNaN(max)) {
        query["rates.min"] = {
          ...(query["rates.min"] || {}),
          $gte: min,
          $lte: max,
        };
      } else if (!Number.isNaN(min)) {
        query["rates.min"] = { ...(query["rates.min"] || {}), $gte: min };
      }
    }

    const profiles = await MCProfile.find(query).populate(
      "user",
      "name email avatar isVerified role mcProfile",
    );

    if (!filters.search) {
      return profiles;
    }

    const normalizedSearch = String(filters.search).toLowerCase();
    return profiles.filter((profile) => {
      const haystack = [
        profile.user?.name,
        ...(profile.styles || []),
        ...(profile.eventTypes || []),
        ...(profile.regions || []),
        profile.biography,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }

  async countVerified() {
    // Assume verified if KYC is done on User, but let's just count for now
    return await MCProfile.countDocuments();
  }
}

module.exports = new MCProfileRepository();
