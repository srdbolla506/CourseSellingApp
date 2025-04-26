const jwt = require('jsonwebtoken');
const JWT_USER_SECRET = require('../config/config');

function userMiddleware(req, res, next) {
    const token = req.headers.token;

    const decodedUser = jwt.verify(token, JWT_USER_SECRET);

    if (decodedUser) {
        req.userId = decodedUser.id;
        next();
    } else {
        res.status(403).json({
            message: 'You are not signed in'
        });
    }
}

module.exports = {
    userMiddleware: userMiddleware
};