class BookingDTO {
  constructor(booking) {
    this.id = booking._id;
    this.client = booking.client?._id || booking.client;
    this.mc = booking.mc?._id || booking.mc;
    this.eventName = booking.eventName;
    this.eventType = booking.eventType;
    this.eventDate = booking.eventDate;
    this.startTime = booking.startTime;
    this.endTime = booking.endTime;
    this.location = booking.location;
    this.description = booking.description;
    this.audienceSize = booking.audienceSize;
    this.budget = booking.budget;
    this.specialRequests = booking.specialRequests;
    this.price = booking.price;
    this.status = booking.status;
    this.paymentStatus = booking.paymentStatus;
    this.createdAt = booking.createdAt;

    if (
      booking.client &&
      typeof booking.client === "object" &&
      booking.client.name
    ) {
      this.clientName = booking.client.name;
      this.clientAvatar = booking.client.avatar;
    }
    if (booking.mc && typeof booking.mc === "object" && booking.mc.name) {
      this.mcName = booking.mc.name;
      this.mcAvatar = booking.mc.avatar;
    }
  }

  static fromRequest(body) {
    return {
      mc: body.mcId || body.mc,
      eventName: body.eventName,
      eventType: body.eventType,
      eventDate: body.eventDate,
      startTime: body.startTime,
      endTime: body.endTime,
      location: body.location || body.venue,
      description: body.description || body.brief,
      audienceSize: body.audienceSize,
      budget: Number(body.budget || body.totalPrice || 0),
      specialRequests:
        body.specialRequirements ||
        body.specialRequests ||
        body.requirements ||
        "",
      price: Number(body.price || body.budget || body.totalPrice || 0),
    };
  }
}

module.exports = BookingDTO;
