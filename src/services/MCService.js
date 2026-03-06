const mcProfileRepository = require('../repositories/MCProfileRepository');
const bookingRepository = require('../repositories/BookingRepository');
const transactionRepository = require('../repositories/TransactionRepository');
const scheduleRepository = require('../repositories/ScheduleRepository');

class MCService {
    async getDashboardStats(userId) {
        const profile = await mcProfileRepository.findByUserId(userId);
        const totalBookings = await bookingRepository.countActiveByUserId(userId, 'mc');
        const walletStats = await transactionRepository.getStats(userId);

        return {
            profileStatus: profile ? profile.status : 'Unavailable',
            completionPercentage: 85, 
            stats: {
                totalBookings,
                activeInquiries: 3, 
                profileViews: 1240, 
                revenue: walletStats.totalRevenue
            },
            isVerified: true 
        };
    }

    async updateProfile(userId, data) {
        return await mcProfileRepository.updateByUserId(userId, data);
    }

    async getCalendar(userId) {
        return await scheduleRepository.findByMCId(userId);
    }

    async blockDate(userId, dateData) {
        return await scheduleRepository.create({
            mc: userId,
            ...dateData,
            status: 'Busy'
        });
    }

    async getWallet(userId) {
        const history = await transactionRepository.findByUserId(userId);
        const stats = await transactionRepository.getStats(userId);
        return { history, stats };
    }

    async requestPayout(userId, amount) {
        return await transactionRepository.create({
            user: userId,
            amount,
            type: 'Debit',
            status: 'Pending',
            description: 'Payout Request'
        });
    }
}

module.exports = new MCService();
