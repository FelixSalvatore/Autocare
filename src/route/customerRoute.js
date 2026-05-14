const express = require('express');
const Customer = require('../model/customer');

const customerRouter = express.Router();

customerRouter.post('/register', async (req, res) => {
  const customerData = req.body;

  try {
    const newCustomer = new Customer(customerData);
    await newCustomer.save();
    res.status(201).json({ message: 'Customer registered successfully' });
  } catch (err) {
    console.error('Error registering customer:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = customerRouter;
