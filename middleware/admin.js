
const jwt = require('jsonwebtoken');
const JWT_ADMIN_SECRET = require('../config/config');

function adminMiddleware(req, res, next) {
    const token = req.headers.token;
    
    const decodedAdmin = jwt.verify(token, JWT_ADMIN_SECRET);

    if (decodedAdmin) {
        req.adminId = decodedAdmin.id;
        next();
    } else {
        res.status(403).json({
            message: 'You are not signed in'
        });
    }

}

module.exports = {
    adminMiddleware: adminMiddleware
};