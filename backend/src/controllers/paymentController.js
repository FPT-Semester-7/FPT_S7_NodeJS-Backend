const Transaction = require('../models/Transaction');

exports.createPayment = async (req, res) => {
    try {
        const newPayment = await Transaction.create(req.body);
        res.status(201).json({ status: 'success', data: { transaction: newPayment } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getPaymentHistory = async (req, res) => {
    try {
        const userId = req.params.userId;
        const transactions = await Transaction.find({ $or: [{ client: userId }, { mc: userId }] });
        res.status(200).json({ status: 'success', results: transactions.length, data: { transactions } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.updatePaymentStatus = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!transaction) return res.status(404).json({ status: 'fail', message: 'Transaction not found' });
        res.status(200).json({ status: 'success', data: { transaction } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
