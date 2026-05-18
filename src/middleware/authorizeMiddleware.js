const authorizeRoles = (...roles) => {
  const authorizeMiddleware = async (req, res, next) => {
    console.log('req.employee', req.employee, roles);
    if (!roles.includes(req.employee.role)) {
      return res.status(403).json({
        message: 'Access denied',
      });
    }
    next();
  };
  return authorizeMiddleware;
};

module.exports = authorizeRoles;
