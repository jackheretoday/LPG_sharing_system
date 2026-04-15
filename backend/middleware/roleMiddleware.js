const { findUserById } = require("../models/tempUserStore");

const requireRole = (allowedRoles) => {
  const allowed = new Set(allowedRoles);

  return (req, res, next) => {
    const tokenUserId = req.user?.id;
    const tokenRole = req.user?.role;
    const user = tokenUserId ? findUserById(tokenUserId) : null;
    const currentRole = tokenRole || user?.role;

    if (!currentRole || !allowed.has(currentRole)) {
      res.status(403);
      return next(new Error("Forbidden: insufficient role"));
    }

    req.currentRole = currentRole;
    req.currentUser = user || null;
    return next();
  };
};

module.exports = {
  requireRole,
};
