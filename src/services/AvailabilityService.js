const bookingRepository = require("../repositories/BookingRepository");
const scheduleRepository = require("../repositories/ScheduleRepository");
const mcProfileRepository = require("../repositories/MCProfileRepository");

class AvailabilityService {
  async createAvailability(mcId, slotData) {
    await this.ensureMCExists(mcId);

    return scheduleRepository.create({
      mc: mcId,
      date: slotData.date,
      startTime: slotData.startTime,
      endTime: slotData.endTime,
      status:
        slotData.isAvailable === false
          ? "Busy"
          : slotData.status || "Available",
      note: slotData.note,
    });
  }

  async getAvailability(mcId) {
    await this.ensureMCExists(mcId);

    const [scheduleEntries, bookings] = await Promise.all([
      scheduleRepository.findByMCId(mcId),
      bookingRepository.findCalendarByMCId(mcId),
    ]);

    const scheduleItems = scheduleEntries.map((entry) => ({
      id: entry._id,
      mcId: entry.mc,
      date: entry.date,
      startTime: entry.startTime,
      endTime: entry.endTime,
      status: entry.status,
      isAvailable: entry.status === "Available",
      source: "availability",
      bookingId: entry.bookingId || null,
      title:
        entry.status === "Busy"
          ? "Unavailable"
          : entry.status === "Booked"
            ? "Confirmed Booking"
            : "Available",
      note: entry.note || "",
    }));

    const bookingItems = bookings.map((booking) => ({
      id: booking._id,
      mcId: booking.mc?._id || booking.mc,
      date: booking.eventDate,
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
      isAvailable: false,
      source: "booking",
      bookingId: booking._id,
      title: booking.eventName || booking.eventType,
      location: booking.location,
    }));

    return [...scheduleItems, ...bookingItems].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );
  }

  async deleteAvailability(id, currentUser) {
    const slot = await scheduleRepository.findById(id);

    if (!slot) {
      throw new Error("Availability slot not found");
    }

    const ownerId = slot.mc?._id ? slot.mc._id.toString() : slot.mc.toString();
    if (currentUser.role !== "admin" && ownerId !== currentUser.id) {
      throw new Error("You do not have permission to remove this slot");
    }

    if (slot.status === "Booked") {
      throw new Error("Booked schedule entries cannot be deleted manually");
    }

    await scheduleRepository.deleteById(id);
  }

  async ensureMCExists(mcId) {
    const profile = await mcProfileRepository.findByIdentifier(mcId);
    if (!profile) {
      throw new Error("MC profile not found");
    }
  }
}

module.exports = new AvailabilityService();
