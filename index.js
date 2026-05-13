const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { connectDB } = require('./src/config/database');
const authRouter = require('./src/route/authRoute');
const customerRouter = require('./src/route/customerRoute');
const adminRouter = require('./src/route/adminRoute');

const app = express();

// add middleware of express to parse json
app.use(express.json());
app.use(cookieParser());
dotenv.config();

// Import and use auth routes

connectDB()
  .then(() => {
    app.listen(process.env.PORT, (req, res) => {
      console.log('Server is running on port 7000');
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });

app.use('/auth', authRouter);
app.use('/customer', customerRouter);
app.use('/admin', adminRouter);
