const Schedule = require("../models/Schedule");

class ScheduleRepository {
  async findByMCId(mcId) {
    return await Schedule.find({ mc: mcId }).sort({ date: 1, startTime: 1 });
  }

  async findById(id) {
    return await Schedule.findById(id);
  }

  async create(data) {
    return await Schedule.create(data);
  }

  async deleteById(id) {
    return await Schedule.findByIdAndDelete(id);
  }

  async updateStatus(id, status) {
    return await Schedule.findByIdAndUpdate(id, { status }, { new: true });
  }
}

module.exports = new ScheduleRepository();
