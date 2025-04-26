const jwt = require('jsonwebtoken');
const { JWT_USER_SECRET } = require('../config/config');

function userMiddleware(req, res, next) {
    const token = req.headers.token;

    if (!token) {
        res.status(401).json({
            message: 'No token provided'
        });
    }

    try {
        const decodedUser = jwt.verify(token, JWT_USER_SECRET);
        req.userId = decodedUser.userId;
        next();
    } catch(error) {
        res.status(403).json({
            message: `You are not signed in: ${error}`
        });
    }

}

module.exports = {
    userMiddleware: userMiddleware
};