const Transaction = require('../models/Transaction');

class TransactionRepository {
    async findByUserId(userId) {
        return await Transaction.find({ user: userId }).sort({ createdAt: -1 });
    }

    async getStats(userId) {
        const transactions = await Transaction.find({ user: userId });
        const totalRevenue = transactions
            .filter(t => t.type === 'Credit' && t.status === 'Completed')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const pendingEscrow = transactions
            .filter(t => t.status === 'Pending')
            .reduce((sum, t) => sum + t.amount, 0);

        return { totalRevenue, pendingEscrow };
    }

    async create(data) {
        return await Transaction.create(data);
    }
}

module.exports = new TransactionRepository();
