const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const userRouter = require('./routes/userRoutes');

// To parse auto. the data from the frontend
app.use(express.json());

/********************* CORS */

app.use(cors());

/********************* Handle Cookies */

app.use(cookieParser());

/********************* ROUTES */
app.use('/api/v1/users', userRouter);

module.exports = app;
