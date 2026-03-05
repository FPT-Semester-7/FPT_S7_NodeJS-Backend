const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Middlewares
app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/authRoutes');
const mcRoutes = require('./routes/mcRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Set up routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/mcs', mcRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/payments', paymentRoutes);


// Database connection
const connectDB = async () => {
    try {
        const defaultUri = 'mongodb://localhost:27017/booking-mc';
        await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || defaultUri);
        console.log(`MongoDB Connected successfully!`);
    } catch (err) {
        console.error(`Error connecting to MongoDB: ${err.message}`);
    }
};

connectDB();

app.get('/', (req, res) => {
    res.send('Welcome to Booking MC API (Web & React Native)');
});

// Socket.io for Real-time Chat
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join_chat', (bookingId) => {
        socket.join(bookingId);
        console.log(`User joined chat room: ${bookingId}`);
    });

    socket.on('send_message', (data) => {
        // data should contain { bookingId, senderId, receiverId, content, attachments }
        // Ideally save to Message model here via controller
        io.to(data.bookingId).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Ensure module exports works for both direct run and testing
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = { app, server, io };
