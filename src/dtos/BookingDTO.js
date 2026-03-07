class BookingDTO {
    constructor(booking) {
        this.id = booking._id;
        this.client = booking.client?._id || booking.client;
        this.mc = booking.mc?._id || booking.mc;
        this.eventDate = booking.eventDate;
        this.venue = booking.venue;
        this.duration = booking.duration;
        this.totalPrice = booking.totalPrice;
        this.status = booking.status;
        this.brief = booking.brief;
        this.createdAt = booking.createdAt;

        if (booking.client && typeof booking.client === 'object' && booking.client.name) {
            this.clientName = booking.client.name;
        }
        if (booking.mc && typeof booking.mc === 'object' && booking.mc.name) {
            this.mcName = booking.mc.name;
        }
    }

    static fromRequest(body) {
        return {
            mc: body.mcId || body.mc,
            eventDate: body.eventDate,
            venue: body.venue,
            duration: body.duration,
            totalPrice: body.totalPrice,
            brief: body.brief || body.requirements
        };
    }
}

module.exports = BookingDTO;
