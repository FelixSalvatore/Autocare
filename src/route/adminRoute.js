const express = require('express');
const Customer = require('../model/customer');
const custAuthMiddleware = require('../middleware/custAuthMiddleware');

const adminRouter = express.Router();

adminRouter.get('/customers', custAuthMiddleware, async (req, res) => {
  try {
    // Fetch all customers from the database
    const customers = await Customer.find();
    res.status(200).json({ customers: customers });
  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = adminRouter;
