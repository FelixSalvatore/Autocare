const Employee = require('../model/employee');
const jwt = require('jsonwebtoken');

const empAuthMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const employee = await Employee.findById(decoded.id);
    if (!employee) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.employee = employee; // Attach the employee object to the request for use in subsequent middleware or route handlers
    next();
  } catch (error) {
    console.error('Error in auth middleware:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = empAuthMiddleware;
