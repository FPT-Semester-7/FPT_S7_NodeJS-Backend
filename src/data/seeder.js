const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Nạp biến môi trường
dotenv.config();

// Import Models
const {
    User,
    MCProfile,
    Booking,
    Review,
    Script,
    Resource,
    Promo,
    Transaction,
    Notification,
    Message,
    Schedule,
    WithdrawalRequest
} = require('../models');

// Import dữ liệu mẫu từ JSON
const usersData = require('./users.json');
const scriptsData = require('./scripts.json');

const seedData = async () => {
    try {
        const defaultUri = 'mongodb://localhost:27017/booking-mc';
        const connUri = process.env.MONGODB_URI || process.env.MONGO_URI || defaultUri;
        
        await mongoose.connect(connUri);
        console.log('--- Đã kết nối MongoDB để nạp dữ liệu mẫu ---');

        // 1. Xóa dữ liệu cũ
        console.log('Đang xóa dữ liệu cũ...');
        await Promise.all([
            User.deleteMany(),
            MCProfile.deleteMany(),
            Booking.deleteMany(),
            Review.deleteMany(),
            Script.deleteMany(),
            Resource.deleteMany(),
            Promo.deleteMany(),
            Transaction.deleteMany(),
            Notification.deleteMany(),
            Message.deleteMany(),
            Schedule.deleteMany(),
            WithdrawalRequest.deleteMany()
        ]);

        // 2. Nạp Users
        console.log('Đang nạp Users...');
        const createdUsers = await User.insertMany(usersData);
        const mcUsers = createdUsers.filter(u => u.role === 'mc');
        const clientUsers = createdUsers.filter(u => u.role === 'client');

        // 3. Nạp MC Profiles cho các User là MC
        console.log('Đang tạo hồ sơ MC chi tiết...');
        const mcProfiles = mcUsers.map((mc, index) => ({
            user: mc._id,
            regions: ['Hà Nội', 'Đà Nẵng', 'TP. Hồ Chí Minh'],
            experience: 3 + index,
            styles: ['Vui vẻ', 'Chuyên nghiệp', 'Năng động'],
            rates: { min: 2000000 + (index * 500000), max: 10000000 + (index * 1000000) },
            eventTypes: ['Wedding', 'Corporate', 'Gala Dinner'],
            status: index % 2 === 0 ? 'Available' : 'Busy',
            rating: 4.5 + (index * 0.05),
            reviewsCount: 10 + index,
            showreels: [
                { url: 'https://example.com/demo.jpg', type: 'image' }
            ]
        }));
        await MCProfile.insertMany(mcProfiles);

        // 4. Nạp Scripts
        console.log('Đang nạp thư viện kịch bản...');
        await Script.insertMany(scriptsData);

        // 5. Nạp Resources (Tài nguyên tải về)
        console.log('Đang nạp tài nguyên giáo trình...');
        const resources = Array.from({ length: 10 }).map((_, i) => ({
            title: `Hướng dẫn làm MC Sự kiện v${i + 1}`,
            type: i % 2 === 0 ? 'Contract' : 'Checklist',
            fileUrl: `https://storage.mchub.com/guide-${i+1}.pdf`,
            fileSize: '2.5 MB',
            description: 'Tài liệu hướng dẫn chi tiết dành cho các MC mới bắt đầu.'
        }));
        await Resource.insertMany(resources);

        // 6. Nạp Promos (Khuyến mãi)
        console.log('Đang nạp mã giảm giá...');
        const promos = Array.from({ length: 10 }).map((_, i) => ({
            code: `S7PROMO${i + 1}`,
            discountType: i % 2 === 0 ? 'Percentage' : 'FixedAmount',
            discountValue: i % 2 === 0 ? 10 : 200000,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            maxUsage: 100,
            isActive: true
        }));
        await Promo.insertMany(promos);

        // 7. Tạo Bookings mẫu (Đơn đặt lịch)
        console.log('Đang tạo các đơn đặt lịch hẹn...');
        const bookings = Array.from({ length: 15 }).map((_, i) => {
            const mc = mcUsers[i % mcUsers.length];
            const client = clientUsers[i % clientUsers.length];
            return {
                client: client._id,
                mc: mc._id,
                eventDate: new Date(Date.now() + (i + 5) * 24 * 60 * 60 * 1000),
                location: `Trung tâm Hội nghị số ${i + 1}, Quận 1, TP.HCM`,
                eventType: 'Gala Dinner',
                price: 5000000,
                status: i < 5 ? 'Completed' : (i < 10 ? 'Accepted' : 'Pending'),
                paymentStatus: i < 5 ? 'FullyPaid' : 'Pending'
            };
        });
        const createdBookings = await Booking.insertMany(bookings);

        // 8. Tạo Reviews mẫu
        console.log('Đang nạp đánh giá của khách hàng...');
        const reviews = createdBookings.slice(0, 10).map((b, i) => ({
            booking: b._id,
            mc: b.mc,
            client: b.client,
            rating: 5,
            comment: 'MC rất chuyên nghiệp, dẫn dắt chương trình cực kỳ cuốn hút. Sẽ quay lại đặt tiếp!'
        }));
        await Review.insertMany(reviews);

        // 9. Tạo Transactions (Lịch sử giao dịch)
        console.log('Đang tạo lịch sử dòng tiền...');
        const transactions = createdBookings.slice(0, 10).map((b, i) => ({
            booking: b._id,
            client: b.client,
            mc: b.mc,
            amount: b.price,
            type: 'Deposit',
            status: 'Completed',
            transactionId: `TXN${Date.now()}${i}`
        }));
        await Transaction.insertMany(transactions);

        // 10. Tạo Notifications (Thông báo)
        console.log('Đang tạo các thông báo hệ thống...');
        const notifications = createdUsers.slice(0, 10).map((u, i) => ({
            user: u._id,
            title: 'Chào mừng bạn đến với MC Hub',
            body: 'Bạn đã đăng ký tài khoản thành công. Hãy bắt đầu trải nghiệm dịch vụ của chúng tôi.',
            type: 'System'
        }));
        await Notification.insertMany(notifications);

        // 11. Tạo Messages (Tin nhắn chat)
        console.log('Đang nạp lịch sử chat mẫu...');
        const messages = Array.from({ length: 10 }).map((_, i) => ({
            booking: createdBookings[0]._id,
            sender: i % 2 === 0 ? createdBookings[0].client : createdBookings[0].mc,
            receiver: i % 2 !== 0 ? createdBookings[0].client : createdBookings[0].mc,
            content: i % 2 === 0 ? 'Chào bạn, tôi muốn trao đổi về kịch bản tiệc tối nay.' : 'Vâng, tôi đã nhận được thông tin, lát tôi sẽ gửi bản thảo cho bạn.'
        }));
        await Message.insertMany(messages);

        // 12. Tạo Schedule (Lịch biểu bận/rảnh)
        console.log('Đang tạo lịch làm việc cho MC...');
        const schedules = mcUsers.map((mc, i) => ({
            mc: mc._id,
            date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
            startTime: '08:00',
            endTime: '12:00',
            status: 'Available'
        }));
        await Schedule.insertMany(schedules);

        // 13. Tạo Withdrawal Requests (Yêu cầu rút tiền)
        console.log('Đang tạo yêu cầu rút tiền mẫu...');
        const withdrawals = mcUsers.map((mc, i) => ({
            mc: mc._id,
            amount: 10000000,
            bankName: 'Vietcombank',
            accountNumber: '1234567890',
            accountHolder: mc.name.toUpperCase(),
            status: 'Pending'
        }));
        await WithdrawalRequest.insertMany(withdrawals);

        console.log('\n--- CHÚC MỪNG! ĐÃ NẠP THÀNH CÔNG TÀÀN BỘ DỮ LIỆU MẪU (10+ ITEM/BẢNG) ---');
        process.exit();
    } catch (err) {
        console.error('Lỗi khi nạp dữ liệu:', err);
        process.exit(1);
    }
};

seedData();
