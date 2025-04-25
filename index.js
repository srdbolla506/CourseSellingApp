
require('dotenv').config();

const mongoose = require('mongoose');

const express = require('express');
const app = express();

const { userRouter } = require('./routes/user');
const { courseRouter } = require('./routes/course');
const { adminRouter } = require('./routes/admin');


app.use('/api/v1/user', userRouter);
app.use('/api/v1/course', courseRouter);
app.use('/api/v1/admin', adminRouter);


async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(process.env.PORT);
    console.log('Listening to port 3000');
}

main();


