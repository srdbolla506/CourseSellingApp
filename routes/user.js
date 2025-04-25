
const { userModel } = require('../db');
const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const NO_OF_ROUNDS = 10;

require('dotenv').config();

const JWT_USER_SECRET = process.env.JWT_USER_SECRET

const userRouter = Router();

userRouter.post('/signup', async function(req, res) {

    const { email, password, firstName, lastName } = req.body;

    const salt = await bcrypt.genSalt(NO_OF_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    try {
        await userModel.create({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName
        });

        res.status(201).json({
            message: `Sign up for the user ${firstName} has been succeeded`
        });
    } catch(err) {
        if (err.code == 11000) {
            res.status(409).json({
                error: 'Email already exists'
            });
        }
        res.status(400).json({
            error: `Error signing up the user: ${err.message}`
        });
    }

});

userRouter.post('/signin', async function(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({
        email: email
    });

    if (user && await bcrypt.compare(password, user.password)) {
        const jwtToken = jwt.sign({
            id: user._id
        }, JWT_USER_SECRET, {expiresIn: '1h'});

        res.status(201).json({
            token: jwtToken,
            message: 'User signed in successfully'
        })
    } else {
        res.status(403).json({
            message: 'Invalid credentials'
        })
    }

});

userRouter.get('/purchases', function(req, res) {
    res.json({
        message: 'purchases endpoint'
    });
});

module.exports = {
    userRouter: userRouter
};



