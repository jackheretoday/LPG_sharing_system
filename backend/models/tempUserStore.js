const { randomUUID } = require("crypto");
const bcrypt = require("bcryptjs");
const {
  getSupabaseAdminClient,
  hasSupabaseConfig,
  hasServiceRole,
} = require("../config/supabaseClient");

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

const mirrorTestUserToSupabase = async ({ id, name, email, role }) => {
  if (!hasSupabaseConfig() || !hasServiceRole()) {
    return;
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return;
  }

  const { error } = await supabase.from("users").upsert(
    {
      id,
      name,
      email,
      role,
    },
    { onConflict: "id" }
  );

  if (error) {
    throw new Error(`Failed to mirror test user ${email} to Supabase: ${error.message}`);
  }
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
  seedTestUsers: async () => {
    // Test Users Data
    const testUsers = [
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        name: "Test Consumer",
        email: "consumer@test.com",
        password: "Test@123456",
        role: "consumer",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440002",
        name: "Test Provider",
        email: "provider@test.com",
        password: "Test@123456",
        role: "provider",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440003",
        name: "Test Admin",
        email: "admin@test.com",
        password: "Test@123456",
        role: "admin",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440004",
        name: "John Bright",
        email: "john@test.com",
        password: "Test@123456",
        role: "consumer",
      },
    ];

    // Clear existing test users
    for (const testUser of testUsers) {
      removeUserByEmail(testUser.email);
    }

    // Create test users with verified emails
    for (const testUser of testUsers) {
      const passwordHash = await bcrypt.hash(testUser.password, 10);
      createUser({
        id: testUser.id,
        name: testUser.name,
        email: testUser.email,
        passwordHash,
        role: testUser.role,
      });
      
      // Verify the email immediately
      updateUser(testUser.id, {
        isEmailVerified: true,
        emailVerificationStatus: "verified",
        emailVerifiedAt: new Date().toISOString(),
      });

      try {
        await mirrorTestUserToSupabase({
          id: testUser.id,
          name: testUser.name,
          email: testUser.email,
          role: testUser.role,
        });
      } catch (error) {
        console.warn(error.message);
      }
    }

    console.log("✅ Test users seeded successfully!");
    return testUsers;
  },
};
