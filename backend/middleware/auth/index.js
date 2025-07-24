const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const USER = require('../../models/user');

const protect = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(401);
            throw new Error('Not authorized, please login');
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);

        const user = await USER.findById(verified?.id).select('-password');

        if (!user) {
            res.status(401);
            throw new Error('User not found');
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(401);
        throw new Error('Not authorized, please login');
    }
})

module.exports = protect;