const roleMiddleware = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: insufficient permissions',
      });
    }
    next();
  };
};

// Export as both default and named export (authorize) for compatibility
export default roleMiddleware;
export { roleMiddleware as authorize };
