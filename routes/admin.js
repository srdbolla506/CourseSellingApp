
const { Router } = require('express');
const adminMiddleware = require('../middleware/admin');
const bcrypt = require('bcrypt');
const { adminModel } = require('../db');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET;

const NO_OF_ROUNDS = 10;


const adminRouter = Router();

adminRouter.post('/signup', async function(req, res) {

    const { email, password, firstName, lastName } = req.body;

    //Hash the password
    const salt = await bcrypt.genSalt(NO_OF_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        await adminModel.create({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName
        });

        res.status(201).json({
            message: `Signing up the user: ${firstName} is successful`
        });
    } catch(err) {
        if (err.code == 11000) {
            res.status(409).json({
                error: `Email already exists`
            });
        }
        res.status(400).json({
            error: `Error signing up the user: ${err.message}`
        });
    }

});

adminRouter.post('/signin', async function(req, res) {

    const { email, password } = req.body;

    const admin = await adminModel.findOne({
        email: email
    });

    if (admin && await bcrypt.compare(password, admin.password)) {
        const jwtToken = jwt.sign({
            id: admin._id
        }, JWT_ADMIN_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            token: jwtToken,
            message: `User: ${admin.firstName} has been successfully signed in`
        })
    } else {
        res.status(403).json({
            message: `Invalid credentials`
        })
    }

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