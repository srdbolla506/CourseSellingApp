
const jwt = require('jsonwebtoken');
const { JWT_ADMIN_SECRET } = require('../config/config');

function adminMiddleware(req, res, next) {
    const token = req.headers.token;

    if (!token) {
        res.status(401).json({
            message: 'Token is not provided'
        })
    }

    try {
        const decodedAdmin = jwt.verify(token, JWT_ADMIN_SECRET);
        req.adminId = decodedAdmin.userId;
        next();
    } catch (error) {
        res.status(403).json({
            message: `You are not signed in: ${error}`
        });
    }

}

module.exports = {
    adminMiddleware: adminMiddleware
};