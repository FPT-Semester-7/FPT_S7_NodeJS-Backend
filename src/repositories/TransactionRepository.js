const Transaction = require('../models/Transaction');

class TransactionRepository {
    async findByUserId(userId) {
        return await Transaction.find({ mc: userId }).sort({ createdAt: -1 });
    }

    async getStats(userId) {
        const transactions = await Transaction.find({ mc: userId });
        
        // Cập nhật số dư budget cho MC dựa trên các giao dịch đã hoàn thành
        const available = transactions
            .filter(t => t.status === 'Completed')
            .reduce((sum, t) => sum + (t.amount || 0), 0);
        
        // Số tiền đăng nằm trong trung gian escrow chưa hoàn thiện
        const escrow = transactions
            .filter(t => t.status === 'Pending')
            .reduce((sum, t) => sum + (t.amount || 0), 0);
            
        return { available, escrow, processing: 0, totalRevenue: available };
    }

    async create(data) {
        return await Transaction.create(data);
    }
}

module.exports = new TransactionRepository();
