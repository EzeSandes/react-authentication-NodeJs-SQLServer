const express = require('express');
const cors = require('cors');

const app = express();
const userRouter = require('./routes/userRoutes');

// To parse auto. the data from the frontend
app.use(express.json());

/********************* CORS */

app.use(cors());

/********************* ROUTES */
app.use('/api/v1/users', userRouter);

module.exports = app;
