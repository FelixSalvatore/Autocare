const express = require('express');
const Customer = require('../model/customer');

const empAuthMiddleware = require('../middleware/empAuthMiddleware');
const Employee = require('../model/employee');
const authorizeRoles = require('../middleware/authorizeMiddleware');

const adminRouter = express.Router();

adminRouter.get(
  '/customers',
  empAuthMiddleware,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      // Fetch all customers from the database
      const customers = await Customer.find();
      res.status(200).json({ customers: customers });
    } catch (err) {
      console.error('Error fetching customers:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
);

adminRouter.get(
  '/employees',
  empAuthMiddleware,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const employees = await Employee.find();
      res.status(200).json({ employees: employees });
    } catch (err) {
      console.log('Failed fetching employees:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
);

adminRouter.post(
  '/employee/register',
  empAuthMiddleware,
  authorizeRoles('admin'),
  async (req, res) => {
    const body = req.body;

    try {
      if (req.body.role === 'mechanic') {
        if (!req.body.supervisorId) {
          return res.status(400).json({
            error: 'Supervisor ID is required for mechanic',
          });
        }
        const supervisor = await Employee.findById(req.body.supervisorId);

        if (!supervisor || supervisor.role !== 'supervisor') {
          console.log('Passed supervisor ID is not of supervisor role');
          return res.status(403).json({
            error: 'Passed supervisor ID is not of supervisor role',
          });
        }
      } else {
        if (req.body.supervisorId != null) {
          console.log('Supervisor ID should be null');
          return res
            .status(403)
            .json({ error: 'Supervisor ID should be null' });
        }
      }
      const createEmployee = new Employee(body);
      console.log('createEmployee', createEmployee);
      await createEmployee.save();
      res
        .status(201)
        .json({ message: 'Employee registered successfully', createEmployee });
    } catch (error) {
      console.error('Error registering employee :', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
);

module.exports = adminRouter;
