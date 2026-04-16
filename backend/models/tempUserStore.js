const { randomUUID } = require("crypto");
const bcrypt = require("bcryptjs");
const {
  getSupabaseAdminClient,
  hasSupabaseConfig,
  hasServiceRole,
} = require("../config/supabaseClient");

const users = [];

const APP_TO_DB_ROLE = {
  user: "consumer",
  consumer: "consumer",
  household: "consumer",
  provider: "mechanic",
  verified_reseller: "mechanic",
  mechanic: "mechanic",
  admin: "admin",
  volunteer_inspector: "admin",
};

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

const createUser = ({
  id,
  name,
  email,
  passwordHash,
  role = "household",
  isEmailVerified = false,
  emailVerificationStatus = "pending",
  emailVerifiedAt = null,
  isSuspended = false,
  suspendedReason = "",
  suspendedAt = null,
  isPhoneVerified = true,
  trust = null,
}) => {
  const user = {
    id: id || randomUUID(),
    name,
    email: email.toLowerCase(),
    passwordHash,
    role,
    isEmailVerified,
    emailVerificationStatus,
    emailVerifiedAt,
    isSuspended,
    suspendedReason,
    suspendedAt,
    isPhoneVerified,
    createdAt: new Date().toISOString(),
    trust: trust ? { ...seedTrustMetrics(), ...trust } : seedTrustMetrics(),
  };

  users.push(user);
  return user;
};

const createOrReplaceUser = (payload) => {
  const normalizedEmail = String(payload.email || "").toLowerCase();
  const existing = findUserByEmail(normalizedEmail);

  if (existing) {
    Object.assign(existing, {
      ...payload,
      email: normalizedEmail,
    });
    return existing;
  }

  return createUser({
    ...payload,
    email: normalizedEmail,
  });
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

const mapRoleForDatabase = (role) => {
  return APP_TO_DB_ROLE[String(role || "").toLowerCase()] || "consumer";
};

const findSupabaseAuthUserByEmail = async (supabase, email) => {
  const normalizedEmail = String(email || "").toLowerCase();
  let page = 1;

  while (page <= 10) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 200,
    });

    if (error) {
      throw new Error(`Failed to list Supabase auth users: ${error.message}`);
    }

    const usersPage = Array.isArray(data?.users) ? data.users : [];
    const match = usersPage.find(
      (user) => String(user.email || "").toLowerCase() === normalizedEmail
    );

    if (match) {
      return match;
    }

    if (usersPage.length < 200) {
      break;
    }

    page += 1;
  }

  return null;
};

const ensureSupabaseIdentity = async ({
  name,
  email,
  password,
  role,
  passwordHash,
  isEmailVerified = true,
}) => {
  if (!hasSupabaseConfig() || !hasServiceRole()) {
    return null;
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return null;
  }

  const normalizedEmail = String(email || "").toLowerCase();
  const dbRole = mapRoleForDatabase(role);
  let authUser = await findSupabaseAuthUserByEmail(supabase, normalizedEmail);

  if (!authUser) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: Boolean(isEmailVerified),
      user_metadata: {
        name,
        app_role: role,
      },
      app_metadata: {
        role: dbRole,
        app_role: role,
      },
    });

    if (error || !data?.user) {
      throw new Error(`Failed to create Supabase auth user ${normalizedEmail}: ${error?.message || "Unknown error"}`);
    }

    authUser = data.user;
  } else {
    const updatePayload = {
      email: normalizedEmail,
      user_metadata: {
        ...(authUser.user_metadata || {}),
        name,
        app_role: role,
      },
      app_metadata: {
        ...(authUser.app_metadata || {}),
        role: dbRole,
        app_role: role,
      },
    };

    if (password) {
      updatePayload.password = password;
    }

    if (isEmailVerified) {
      updatePayload.email_confirm = true;
    }

    const { data, error } = await supabase.auth.admin.updateUserById(authUser.id, updatePayload);
    if (error || !data?.user) {
      throw new Error(`Failed to update Supabase auth user ${normalizedEmail}: ${error?.message || "Unknown error"}`);
    }

    authUser = data.user;
  }

  const { error: userError } = await supabase.from("users").upsert(
    {
      id: authUser.id,
      name,
      email: normalizedEmail,
      role: dbRole,
      password_hash: passwordHash || null,
      is_email_verified: Boolean(isEmailVerified),
      email_verified_at: isEmailVerified ? new Date().toISOString() : null,
      is_verified: Boolean(isEmailVerified),
    },
    { onConflict: "id" }
  );

  if (userError) {
    throw new Error(`Failed to upsert public.users for ${normalizedEmail}: ${userError.message}`);
  }

  await supabase.from("user_verifications").upsert(
    {
      user_id: authUser.id,
      address_text: "",
      pin_code: "",
      is_pin_verified: false,
      id_doc_url: null,
      id_status: "not_submitted",
    },
    { onConflict: "user_id" }
  );

  await supabase.from("trust_metrics").upsert(
    {
      user_id: authUser.id,
      total_exchanges: 0,
      successful_exchanges: 0,
      safety_checks_completed: 0,
      disputes_count: 0,
      accepted_emergency_requests: 0,
      avg_response_seconds: 0,
      trust_score: 0,
    },
    { onConflict: "user_id" }
  );

  return {
    id: authUser.id,
    email: normalizedEmail,
    role: dbRole,
  };
};

const hydrateUserFromSupabaseByEmail = async (email) => {
  if (!hasSupabaseConfig() || !hasServiceRole()) {
    return null;
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return null;
  }

  const normalizedEmail = String(email || "").toLowerCase();
  const { data, error } = await supabase
    .from("users")
    .select("id,name,email,role,password_hash,is_email_verified,email_verified_at,is_suspended,suspended_reason,suspended_at")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (error || !data?.id) {
    return null;
  }

  const appRole =
    {
      mechanic: "provider",
      admin: "admin",
      consumer: "consumer",
    }[String(data.role || "").toLowerCase()] || "consumer";

  return createOrReplaceUser({
    id: data.id,
    name: data.name || normalizedEmail.split("@")[0],
    email: normalizedEmail,
    passwordHash: data.password_hash || "",
    role: appRole,
    isEmailVerified: Boolean(data.is_email_verified),
    emailVerificationStatus: data.is_email_verified ? "verified" : "pending",
    emailVerifiedAt: data.email_verified_at || null,
    isSuspended: Boolean(data.is_suspended),
    suspendedReason: data.suspended_reason || "",
    suspendedAt: data.suspended_at || null,
  });
};

module.exports = {
  findUserByEmail,
  findUserById,
  listUsers,
  listUsersByRole,
  removeUserById,
  removeUserByEmail,
  createUser,
  createOrReplaceUser,
  updateUser,
  updateTrust,
  addBadge,
  ensureSupabaseIdentity,
  hydrateUserFromSupabaseByEmail,
  mapRoleForDatabase,
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
      let supabaseIdentity = null;

      try {
        supabaseIdentity = await ensureSupabaseIdentity({
          name: testUser.name,
          email: testUser.email,
          password: testUser.password,
          role: testUser.role,
          passwordHash,
          isEmailVerified: true,
        });
      } catch (error) {
        console.warn(error.message);
      }

      const seededUser = createOrReplaceUser({
        id: supabaseIdentity?.id || testUser.id,
        name: testUser.name,
        email: testUser.email,
        passwordHash,
        role: testUser.role,
      });
      
      // Verify the email immediately
      updateUser(seededUser.id, {
        isEmailVerified: true,
        emailVerificationStatus: "verified",
        emailVerifiedAt: new Date().toISOString(),
      });
    }

    console.log("✅ Test users seeded successfully!");
    return testUsers;
  },
};
