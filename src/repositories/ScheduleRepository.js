const Schedule = require('../models/Schedule');

class ScheduleRepository {
    async findByMCId(mcId) {
        return await Schedule.find({ mc: mcId });
    }

    async create(data) {
        return await Schedule.create(data);
    }

    async updateStatus(id, status) {
        return await Schedule.findByIdAndUpdate(id, { status }, { new: true });
    }
}

module.exports = new ScheduleRepository();
