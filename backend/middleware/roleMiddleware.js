const { findUserById } = require("../models/tempUserStore");

const roleAliases = {
  admin: "admin",
  volunteer_inspector: "admin",
  provider: "provider",
  verified_reseller: "provider",
  mechanic: "provider",
  consumer: "consumer",
  household: "consumer",
  user: "consumer",
};

const normalizeRole = (role) => {
  if (!role) {
    return null;
  }

  return roleAliases[String(role).toLowerCase()] || String(role).toLowerCase();
};

const requireRole = (allowedRoles) => {
  const allowed = new Set(allowedRoles.map((role) => normalizeRole(role)));

  return (req, res, next) => {
    const tokenUserId = req.user?.id;
    const tokenRole = req.user?.role;
    const user = tokenUserId ? findUserById(tokenUserId) : null;
    const currentRole = normalizeRole(tokenRole || user?.role);

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
