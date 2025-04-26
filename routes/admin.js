
const { Router } = require('express');
const { adminMiddleware } = require('../middleware/admin');
const bcrypt = require('bcrypt');
const { adminModel, courseModel } = require('../db');
const jwt = require('jsonwebtoken');

const { JWT_ADMIN_SECRET } = require('../config/config');

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
    } catch(error) {
        if (error.code == 11000) {
            res.status(409).json({
                message: `Email already exists`
            });
        } else {
            res.status(400).json({
                message: `Error signing up the user: ${error}`
            });
        }

    }

});

adminRouter.post('/signin', async function(req, res) {

    const { email, password } = req.body;

    const admin = await adminModel.findOne({
        email: email
    });

    if (admin && await bcrypt.compare(password, admin.password)) {
        const jwtToken = jwt.sign({
            userId: admin._id
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

adminRouter.post('/course', adminMiddleware, async function(req, res) {

    const adminId = req.adminId;

    const { title, description, price, imageUrl } = req.body;

    try {
        const course = await courseModel.create({
            title,
            description,
            price,
            imageUrl,
            creatorId: adminId
        });

        res.status(201).json({
            message: 'Course created',
            courseId: course._id
        });
    } catch(err) {
        res.status(400).json({
            error: 'Error creating course'
        });
    }
});

adminRouter.put('/course', adminMiddleware, async function(req, res) {

    const adminId = req.adminId;

    const { title, description, price, imageUrl, courseId } = req.body;

    try {
        const course = await courseModel.updateOne({
            creatorId: adminId,
            _id: courseId
        }, {
            title: title,
            description: description,
            imageUrl: imageUrl,
            price: price
        });

        res.status(201).json({
            message: 'Course has been updated',
            courseId: course._id
        });
    } catch(err) {
        res.status(401).json({
            message: `Error updating the course: ${courseId}`
        });
    }
    
});

adminRouter.get('/course/bulk', adminMiddleware, async function(req, res) {

    const adminId = req.adminId;

    try {
        const courses = await courseModel.find({
            creatorId: adminId
        });

        res.status(200).json({
            message: 'Courses list has been retrieved successfully',
            courses
        });
    } catch(error) {
        console.log('Error fetching courses: ', error);
        res.status(500).json({
            message: 'Error retrieving courses list'
        });
    }

});

module.exports = {
    adminRouter: adminRouter
};