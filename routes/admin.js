
const { Router } = require('express');
const adminMiddleware = require('../middleware/admin');

const adminRouter = Router();

adminRouter.post('/signin', function(req, res) {
    res.json({
        message: 'admin signin endpoint'
    });
});

adminRouter.post('/signup', function(req, res) {
    res.json({
        message: 'admin signup endpoint'
    });
});

adminRouter.use(adminMiddleware);

adminRouter.post('/course', function(req, res) {
    res.json({
        message: 'admin createcourse endpoint'
    });
});

adminRouter.put('/course', function(req, res) {
    res.json({
        message: 'admin change course endpoint'
    });
});

adminRouter.get('/course', function(req, res) {
    res.json({
        message: 'admin get all courses endpoint'
    });
});

module.exports = {
    adminRouter: adminRouter
};