

const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: String,
    lastName: String
});

const courseSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    creatorId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const adminSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    firstName: String,
    lastName: String
});

const purchaseSchema = new Schema({
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course'
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const userModel = mongoose.model('User', userSchema);
const courseModel = mongoose.model('Course', courseSchema);
const adminModel = mongoose.model('Admin', adminSchema);
const purchaseModel = mongoose.model('Purchase', purchaseSchema);

module.exports = { userModel, courseModel, adminModel, purchaseModel };




