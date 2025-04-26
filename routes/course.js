

const { Router } = require('express');
const { courseModel, purchaseModel } = require('../db');
const { userMiddleware } = require('../middleware/user');

const courseRouter = Router();

courseRouter.get('/preview', async function(req, res) {

    try {
        const courses = await courseModel.find({});

        res.status(200).json({
            message: `All courses have been successfully retrieved`,
            courses
        });
    } catch(error) {
        res.status(500).json({
            error: `Error retrieving all courses: ${error}`
        });
    }

});

courseRouter.post('/purchase', userMiddleware, async function(req, res) {

    const userId = req.userId;

    const { courseId } = req.body;

    try {
        const purchase = await purchaseModel.create({
            courseId: courseId,
            userId: userId
        });

        res.status(201).json({
            message: `Purchase with ${purchase._id} has been created successfully`,
            purchaseId: purchase._id
        });
    } catch(error) {
        res.status(500).json({
            message: `Error creating a purchase: ${error}`
        });
    }

});

module.exports = {
    courseRouter: courseRouter
};