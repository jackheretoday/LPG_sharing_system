const { randomUUID } = require("crypto");

const users = [];

const seedTrustMetrics = () => ({
  totalExchanges: 0,
  successfulExchanges: 0,
  safetyChecksCompleted: 0,
  disputesCount: 0,
  acceptedEmergencyRequests: 0,
  avgResponseSeconds: 0,
  trustScore: 0,
  badges: [],
  verification: {
    addressText: "",
    pinCode: "",
    isPinVerified: false,
    idDocUrl: null,
    idStatus: "not_submitted",
  },
});

const findUserByEmail = (email) => {
  return users.find((user) => user.email === email.toLowerCase());
};

const findUserById = (id) => {
  return users.find((user) => String(user.id) === String(id));
};

const listUsers = () => {
  return [...users];
};

const listUsersByRole = (role) => {
  const normalizedRole = String(role || "").toLowerCase();
  return users.filter((user) => String(user.role || "").toLowerCase() === normalizedRole);
};

const removeUserById = (id) => {
  const index = users.findIndex((user) => String(user.id) === String(id));

  if (index === -1) {
    return null;
  }

  const [removed] = users.splice(index, 1);
  return removed;
};

const removeUserByEmail = (email) => {
  const normalizedEmail = String(email || "").toLowerCase();
  const index = users.findIndex((user) => user.email === normalizedEmail);

  if (index === -1) {
    return null;
  }

  const [removed] = users.splice(index, 1);
  return removed;
};

const createUser = ({ id, name, email, passwordHash, role = "household" }) => {
  const user = {
    id: id || randomUUID(),
    name,
    email: email.toLowerCase(),
    passwordHash,
    role,
    isEmailVerified: false,
    emailVerificationStatus: "pending",
    emailVerifiedAt: null,
    isSuspended: false,
    suspendedReason: "",
    suspendedAt: null,
    isPhoneVerified: true,
    createdAt: new Date().toISOString(),
    trust: seedTrustMetrics(),
  };

  users.push(user);
  return user;
};

const updateUser = (id, updates) => {
  const user = findUserById(id);

  if (!user) {
    return null;
  }

  Object.assign(user, updates);
  return user;
};

const updateTrust = (id, trustUpdates) => {
  const user = findUserById(id);

  if (!user) {
    return null;
  }

  user.trust = {
    ...seedTrustMetrics(),
    ...user.trust,
    ...trustUpdates,
  };

  return user.trust;
};

const addBadge = (id, badge) => {
  const user = findUserById(id);

  if (!user) {
    return null;
  }

  const badges = new Set(user.trust.badges || []);
  badges.add(badge);
  user.trust.badges = Array.from(badges);
  return user.trust.badges;
};

module.exports = {
  findUserByEmail,
  findUserById,
  listUsers,
  listUsersByRole,
  removeUserById,
  removeUserByEmail,
  createUser,
  updateUser,
  updateTrust,
  addBadge,
};
