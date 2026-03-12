/**
 * @file mcController.js
 * @description Bộ điều khiển xử lý các chức năng quản lý cá nhân dành cho thành viên vai trò MC.
 */

const mcService = require('../services/MCService');
const MCProfileDTO = require('../dtos/MCProfileDTO');
const TransactionDTO = require('../dtos/TransactionDTO');

// Lấy thông tin tổng quan của Dashboard MC
exports.getDashboard = async (req, res) => {
    try {
        const stats = await mcService.getDashboardStats(req.user.id);
        res.status(200).json({ status: 'success', data: stats });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Cập nhật hồ sơ năng lực (Onboarding/Update)
exports.updateProfile = async (req, res) => {
    try {
        const sanitizedData = MCProfileDTO.fromOnboardingRequest(req.body);
        const profile = await mcService.updateProfile(req.user.id, sanitizedData);
        res.status(200).json({ status: 'success', data: { profile: new MCProfileDTO(profile) } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Lấy danh sách lịch trình làm việc
exports.getCalendar = async (req, res) => {
    try {
        const calendar = await mcService.getCalendar(req.user.id);
        res.status(200).json({ status: 'success', data: { calendar } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Khóa một ngày bận trên lịch
exports.blockDate = async (req, res) => {
    try {
        const schedule = await mcService.blockDate(req.user.id, req.body);
        res.status(201).json({ status: 'success', data: { schedule } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Lấy thông tin ví và lịch sử giao dịch
exports.getWallet = async (req, res) => {
    try {
        const wallet = await mcService.getWallet(req.user.id);
        const formattedHistory = wallet.history.map(t => new TransactionDTO(t));
        res.status(200).json({ 
            status: 'success', 
            data: { 
                stats: wallet.stats, 
                history: formattedHistory 
            } 
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Yêu cầu rút tiền từ tài khoản
exports.requestPayout = async (req, res) => {
    try {
        const transaction = await mcService.requestPayout(req.user.id, req.body.amount);
        res.status(200).json({ status: 'success', data: { transaction: new TransactionDTO(transaction) } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

