const authService = require('../services/AuthService');
const UserDTO = require('../dtos/UserDTO');

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const userResponse = new UserDTO(user);

    res.status(statusCode).json({
        status: 'success',
        token,
        data: { user: userResponse },
    });
};

const signToken = (id) => {
    const jwt = require('jsonwebtoken');
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret-fallback', {
        expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    });
};

exports.register = async (req, res) => {
    try {
        const sanitizedData = UserDTO.fromRequest(req.body);
        const user = await authService.register(sanitizedData);
        createSendToken(user, 201, res);
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ status: 'fail', message: 'Please provide email and password' });
        }

        const { user, token } = await authService.login(email, password);
        
        res.status(200).json({
            status: 'success',
            token,
            data: { user: new UserDTO(user) },
        });
    } catch (err) {
        res.status(401).json({ status: 'fail', message: err.message });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const user = await authService.updateSettings(req.user.id, req.body);
        res.status(200).json({ status: 'success', data: { user: new UserDTO(user) } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.submitKYC = async (req, res) => {
    try {
        const user = await authService.submitKYC(req.user.id, req.body);
        res.status(200).json({ status: 'success', data: { user: new UserDTO(user) } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
