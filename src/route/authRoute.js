const express = require('express');
const Customer = require('../model/customer');
const Employee = require('../model/employee');

const authRouter = express.Router();

authRouter.post('/customer/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const verifyPassword = await customer.comparePassword(password);

    if (!verifyPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = customer.getJWTToken(); // how getJWTToken is attached to customer const which is retreived from DB and how it is working is because of the way we defined the method in the customerSchema. When we define a method on the schema, it becomes available on all instances of that model. So when we retrieve a customer from the database, it is an instance of the Customer model, and it has access to the getJWTToken method that we defined on the schema. This allows us to call customer.getJWTToken() to generate a JWT token for that specific customer instance.

    res
      .cookie('token', token, { httpOnly: true })
      .json({ message: 'Customer login successful' });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

authRouter.post('/employee/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const verifyPassword = await employee.comparePassword(password);

    if (!verifyPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = employee.getJWTToken();

    res
      .cookie('token', token, { httpOnly: true })
      .json({ message: 'Employee login successful' });
  } catch (error) {
    console.error('Error during employee login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

authRouter.post('/logout', (req, res) => {
  res.clearCookie('token').json({ message: 'Logout successful' });
});

module.exports = authRouter;
