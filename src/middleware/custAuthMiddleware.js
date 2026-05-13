const Customer = require('../model/customer');
const jwt = require('jsonwebtoken');

const custAuthMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const customer = await Customer.findById(decoded.id);
    if (!customer) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.customer = customer; // Attach the customer object to the request for use in subsequent middleware or route handlers
    next();
  } catch (err) {
    console.error('Error in auth middleware:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = custAuthMiddleware;
