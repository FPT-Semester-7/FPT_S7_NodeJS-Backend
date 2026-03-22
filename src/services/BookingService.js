const bookingRepository = require("../repositories/BookingRepository");
const scheduleRepository = require("../repositories/ScheduleRepository");
const transactionRepository = require("../repositories/TransactionRepository");
const mcProfileRepository = require("../repositories/MCProfileRepository");
const notificationService = require("./NotificationService");
const chatService = require("./ChatService");

const combineDateAndTime = (dateValue, timeValue) => {
  const date = new Date(dateValue);
  const [hours = 0, minutes = 0] = String(timeValue || "00:00")
    .split(":")
    .map(Number);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

class BookingService {
  /**
   * Inject io instance for real-time notifications
   */
  setIO(io) {
    this._io = io;
  }

  async createBooking(bookingData) {
    const profile = await mcProfileRepository.findByIdentifier(bookingData.mc);
    if (!profile) {
      throw new Error("MC profile not found");
    }

    const mcId = profile.user?._id
      ? profile.user._id.toString()
      : profile.user.toString();
    const eventStart = combineDateAndTime(
      bookingData.eventDate,
      bookingData.startTime,
    );
    const eventEnd = combineDateAndTime(
      bookingData.eventDate,
      bookingData.endTime,
    );

    if (eventEnd <= eventStart) {
      throw new Error("End time must be after start time");
    }

    const [existingBookings, scheduleEntries] = await Promise.all([
      bookingRepository.findCalendarByMCId(mcId),
      scheduleRepository.findByMCId(mcId),
    ]);

    const overlapsAcceptedBooking = existingBookings.some((booking) => {
      if (booking.status !== "Accepted") {
        return false;
      }

      const start = combineDateAndTime(booking.eventDate, booking.startTime);
      const end = combineDateAndTime(booking.eventDate, booking.endTime);
      return eventStart < end && eventEnd > start;
    });

    if (overlapsAcceptedBooking) {
      throw new Error(
        "This MC already has a confirmed booking during the selected time",
      );
    }

    const overlapsBlockedSlot = scheduleEntries.some((entry) => {
      if (entry.status === "Available") {
        return false;
      }

      const start = combineDateAndTime(entry.date, entry.startTime || "00:00");
      const end = combineDateAndTime(entry.date, entry.endTime || "23:59");
      return eventStart < end && eventEnd > start;
    });

    if (overlapsBlockedSlot) {
      throw new Error("This MC is unavailable during the selected time");
    }

    const normalizedBooking = {
      ...bookingData,
      mc: mcId,
      budget: Number(bookingData.budget || 0),
      price: Number(bookingData.price || bookingData.budget || 0),
      audienceSize: Number(bookingData.audienceSize || 0),
    };

    const booking = await bookingRepository.create(normalizedBooking);

    // AUTO-CREATE conversation between client & MC (business rule: chat unlocked after booking)
    await chatService.createConversationForBooking(
      booking._id,
      bookingData.client,
      mcId,
    );

    // Notify MC about new booking request
    await notificationService.create(
      {
        user: mcId,
        senderId: bookingData.client,
        title: "New Booking Request",
        body: `You have a new ${booking.eventType} booking request on ${new Date(booking.eventDate).toLocaleDateString()}`,
        type: "booking_request",
        relatedId: booking._id,
        relatedModel: "Booking",
        linkAction: `/m/booking-requests`,
      },
      this._io,
    );

    return booking;
  }

  async processEscrowPayment(bookingId, paymentDetails) {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) throw new Error("Booking not found");

    await transactionRepository.create({
      booking: booking._id,
      client: booking.client._id || booking.client,
      mc: booking.mc._id || booking.mc,
      amount: booking.price,
      type: "Deposit",
      status: "Completed",
      transactionId: paymentDetails?.transactionId,
    });

    const updated = await bookingRepository.updateStatus(
      bookingId,
      booking.status,
      {
        paymentStatus: "DepositPaid",
      },
    );

    // Notify MC about escrow payment
    const mcId = booking.mc?._id || booking.mc;
    await notificationService.create(
      {
        user: mcId,
        senderId: booking.client._id || booking.client,
        title: "Escrow Funds Secured",
        body: `Payment of ${booking.price?.toLocaleString()} VND for "${booking.eventName}" is now held in escrow.`,
        type: "payment_escrowed",
        relatedId: booking._id,
        relatedModel: "Booking",
        linkAction: `/m/calendar?booking=${booking._id}`,
      },
      this._io,
    );

    return updated;
  }

  async getMyBookings(userId, role) {
    return await bookingRepository.findByUserId(userId, role);
  }

  async getClientBookings(userId) {
    return await bookingRepository.findByClientId(userId);
  }

  async getMCBookings(userId) {
    return await bookingRepository.findByMCId(userId);
  }

  async acceptBooking(bookingId, mcId) {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) throw new Error("Booking not found");

    const bookingMCId = booking.mc?._id
      ? booking.mc._id.toString()
      : booking.mc.toString();
    if (bookingMCId !== mcId) {
      throw new Error("You do not have permission to accept this booking");
    }

    if (booking.status !== "Pending") {
      throw new Error("Only pending bookings can be accepted");
    }

    const updated = await bookingRepository.updateStatus(
      bookingId,
      "Accepted",
      { decidedAt: new Date() },
    );

    await scheduleRepository.create({
      mc: mcId,
      date: updated.eventDate,
      startTime: updated.startTime,
      endTime: updated.endTime,
      status: "Booked",
      bookingId: updated._id,
      note: updated.eventName,
    });

    // Notify client about booking acceptance
    const clientId = updated.client._id || updated.client;
    await notificationService.create(
      {
        user: clientId,
        senderId: mcId,
        title: "Booking Confirmed",
        body: `Your booking request for "${updated.eventName}" has been accepted!`,
        type: "booking_confirmed",
        relatedId: updated._id,
        relatedModel: "Booking",
        linkAction: `/m/booking/${updated.mc?._id || updated.mc}`,
      },
      this._io,
    );

    return updated;
  }

  async rejectBooking(bookingId, mcId) {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) throw new Error("Booking not found");

    const bookingMCId = booking.mc?._id
      ? booking.mc._id.toString()
      : booking.mc.toString();
    if (bookingMCId !== mcId) {
      throw new Error("You do not have permission to reject this booking");
    }

    if (booking.status !== "Pending") {
      throw new Error("Only pending bookings can be rejected");
    }

    const updated = await bookingRepository.updateStatus(
      bookingId,
      "Rejected",
      { decidedAt: new Date() },
    );

    // Deactivate the conversation (business rule: chat closed on rejection)
    await chatService.deactivateByBookingId(bookingId);

    // Notify client about booking rejection
    const clientId = updated.client._id || updated.client;
    await notificationService.create(
      {
        user: clientId,
        senderId: mcId,
        title: "Booking Declined",
        body: `Your booking request for "${updated.eventName}" has been declined.`,
        type: "booking_cancelled",
        relatedId: updated._id,
        relatedModel: "Booking",
        linkAction: `/m/profile/${updated.mc?._id || updated.mc}`,
      },
      this._io,
    );

    return updated;
  }
}

module.exports = new BookingService();
