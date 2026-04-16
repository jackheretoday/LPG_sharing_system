const bcrypt = require("bcryptjs");
const {
  getSupabaseAdminClient,
  hasSupabaseConfig,
  hasServiceRole,
} = require("../config/supabaseClient");
const {
  createUser,
  createOrReplaceUser,
  ensureSupabaseIdentity,
  findUserByEmail,
  findUserById,
  hydrateUserFromSupabaseByEmail,
  listUsersByRole,
  mapRoleForDatabase,
  updateUser,
  removeUserById,
  removeUserByEmail,
} = require("../models/tempUserStore");
const {
  createChallenge,
  verifyChallenge,
  clearChallenge,
} = require("../models/authChallengeStore");
const { sendOtpEmail, hasSmtpConfig } = require("../services/emailService");
const { writeAuditLog } = require("../services/auditService");
const { generateToken } = require("../utilis/token");

const roleAliases = {
  user: "user",
  consumer: "consumer",
  provider: "provider",
  admin: "admin",
  household: "consumer",
  verified_reseller: "provider",
  volunteer_inspector: "admin",
};

const allowedRoles = new Set(["user", "consumer", "provider", "admin", "household", "verified_reseller", "volunteer_inspector"]);

const resolveNextRoute = (role) => {
  const normalized = String(role || "").toLowerCase();

  if (["admin", "volunteer_inspector"].includes(normalized)) {
    return "/admin";
  }

  if (["provider", "verified_reseller", "mechanic"].includes(normalized)) {
    return "/mechanic";
  }

  if (["user"].includes(normalized)) {
    return "/user";
  }

  return "/consumer";
};

const normalizeRole = (role) => {
  if (!role) {
    return "consumer";
  }

  const normalized = roleAliases[String(role).toLowerCase()];
  return normalized || null;
};

const serializeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  trust: user.trust,
  isEmailVerified: Boolean(user.isEmailVerified),
  emailVerificationStatus: user.emailVerificationStatus || "pending",
  emailVerifiedAt: user.emailVerifiedAt || null,
  isSuspended: Boolean(user.isSuspended),
  suspendedReason: user.suspendedReason || "",
  suspendedAt: user.suspendedAt || null,
});

const persistSupabaseUser = async ({ id, name, email, role, passwordHash, isEmailVerified = false }) => {
  if (!hasSupabaseConfig() || !hasServiceRole()) {
    return { ok: false, skipped: true, errors: [] };
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return { ok: false, skipped: true, errors: [] };
  }

  const errors = [];

  const normalizedEmail = String(email || "").toLowerCase();
  const { data: userRow, error: lookupError } = await supabase
    .from("users")
    .select("id")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (lookupError) {
    errors.push({ table: "users", code: lookupError.code, message: lookupError.message });
  }

  if (userRow?.id) {
    const { error: usersError } = await supabase.from("users").upsert(
      {
        id: userRow.id,
        name,
        email: normalizedEmail,
        role: mapRoleForDatabase(role),
        password_hash: passwordHash || null,
        is_email_verified: Boolean(isEmailVerified),
        email_verified_at: isEmailVerified ? new Date().toISOString() : null,
        is_verified: Boolean(isEmailVerified),
      },
      { onConflict: "id" }
    );

    if (usersError) {
      errors.push({ table: "users", code: usersError.code, message: usersError.message });
    }

    const { error: verificationError } = await supabase.from("user_verifications").upsert(
      {
        user_id: userRow.id,
        address_text: "",
        pin_code: "",
        is_pin_verified: false,
        id_doc_url: null,
        id_status: "not_submitted",
      },
      { onConflict: "user_id" }
    );

    if (verificationError) {
      errors.push({
        table: "user_verifications",
        code: verificationError.code,
        message: verificationError.message,
      });
    }

    const { error: trustError } = await supabase.from("trust_metrics").upsert(
      {
        user_id: userRow.id,
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

    if (trustError) {
      errors.push({
        table: "trust_metrics",
        code: trustError.code,
        message: trustError.message,
      });
    }
  }

  return {
    ok: errors.length === 0,
    skipped: false,
    errors,
  };
};

const deleteSupabaseUser = async (id) => {
  if (!hasSupabaseConfig() || !hasServiceRole()) {
    return { ok: false, skipped: true, errors: [] };
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return { ok: false, skipped: true, errors: [] };
  }

  const errors = [];

  const { error: trustError } = await supabase.from("trust_metrics").delete().eq("user_id", id);
  if (trustError) {
    errors.push({ table: "trust_metrics", code: trustError.code, message: trustError.message });
  }

  const { error: verificationError } = await supabase.from("user_verifications").delete().eq("user_id", id);
  if (verificationError) {
    errors.push({ table: "user_verifications", code: verificationError.code, message: verificationError.message });
  }

  const { error: usersError } = await supabase.from("users").delete().eq("id", id);
  if (usersError) {
    errors.push({ table: "users", code: usersError.code, message: usersError.message });
  }

  return {
    ok: errors.length === 0,
    skipped: false,
    errors,
  };
};

const issueSession = (user) =>
  generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

const markVerified = (user) => {
  const next = updateUser(user.id, {
    isEmailVerified: true,
    emailVerificationStatus: "verified",
    emailVerifiedAt: user.emailVerifiedAt || new Date().toISOString(),
  });

  return next || user;
};

const syncVerificationToSupabase = async (user) => {
  if (!hasSupabaseConfig() || !hasServiceRole()) {
    return;
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return;
  }

  await supabase
    .from("users")
    .update({
      is_email_verified: true,
      email_verified_at: user.emailVerifiedAt || new Date().toISOString(),
      is_verified: true,
    })
    .eq("id", user.id);
};

const sendVerificationChallenge = async ({ user, purpose }) => {
  const challenge = createChallenge({
    email: user.email,
    purpose,
    userId: user.id,
    role: user.role,
  });

  const delivery = await sendOtpEmail({
    to: user.email,
    name: user.name,
    otp: challenge.otp,
    purpose,
    role: user.role,
  });

  return {
    delivery,
    expiresInMinutes: Number(process.env.EMAIL_OTP_TTL_MINUTES || 10),
    smtpConfigured: hasSmtpConfig(),
    devOtp: hasSmtpConfig() ? null : challenge.otp,
  };
};

const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Name, email and password are required");
    }

    if (password.length < 6) {
      res.status(400);
      throw new Error("Password must be at least 6 characters");
    }

    if (role && !allowedRoles.has(String(role).toLowerCase())) {
      res.status(400);
      throw new Error("Invalid role selected");
    }

    const normalizedRole = normalizeRole(role);
    if (!normalizedRole) {
      res.status(400);
      throw new Error("Invalid role selected");
    }

    const existing = findUserByEmail(email);
    if (existing) {
      res.status(409);
      throw new Error("User already exists with this email");
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const supabaseIdentity = await ensureSupabaseIdentity({
      name,
      email,
      password,
      role: normalizedRole,
      passwordHash,
      isEmailVerified: false,
    });

    const user = createOrReplaceUser({
      id: supabaseIdentity?.id,
      name,
      email,
      passwordHash,
      role: normalizedRole,
    });

    const supabaseMirror = await persistSupabaseUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      passwordHash,
      isEmailVerified: false,
    });

    const otpDelivery = await sendVerificationChallenge({
      user,
      purpose: "signup",
    });

    return res.status(201).json({
      success: true,
      message: "Signup successful. A verification code has been sent to your email.",
      verificationRequired: true,
      nextRoute: "/auth/otp-verify",
      user: serializeUser(user),
      otpDelivery,
      devOtp: otpDelivery.devOtp,
      supabaseMirror,
      note: otpDelivery.smtpConfigured
        ? "OTP was sent using SMTP email delivery."
        : "SMTP is not configured, so the OTP was logged to the backend console for development.",
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    let user = findUserByEmail(email);
    if (!user) {
      user = await hydrateUserFromSupabaseByEmail(email);
    }

    if (!user) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    if (!user.isEmailVerified) {
      res.status(403);
      throw new Error("Email is not verified. Please complete signup OTP verification first.");
    }

    if (user.isSuspended) {
      res.status(403);
      throw new Error(user.suspendedReason || "Your account is suspended. Contact support.");
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      verificationRequired: false,
      token: issueSession(user),
      nextRoute: resolveNextRoute(user.role),
      user: serializeUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

const updateUserSuspension = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { suspended = true, reason = "" } = req.body || {};

    const user = findUserById(userId);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const nextSuspended = Boolean(suspended);
    const updated = updateUser(userId, {
      isSuspended: nextSuspended,
      suspendedReason: nextSuspended ? String(reason || "Suspended by moderator") : "",
      suspendedAt: nextSuspended ? new Date().toISOString() : null,
    });

    if (hasSupabaseConfig() && hasServiceRole()) {
      const supabase = getSupabaseAdminClient();
      if (supabase) {
        await supabase
          .from("users")
          .update({
            is_suspended: nextSuspended,
            suspended_reason: nextSuspended ? String(reason || "Suspended by moderator") : "",
            suspended_at: nextSuspended ? new Date().toISOString() : null,
          })
          .eq("id", userId);
      }
    }

    await writeAuditLog({
      actorUserId: req.user?.id || null,
      action: "auth.user_suspension_updated",
      entityType: "users",
      entityId: userId,
      details: {
        suspended: nextSuspended,
        reason: nextSuspended ? String(reason || "Suspended by moderator") : "",
      },
    });

    return res.status(200).json({
      success: true,
      message: nextSuspended ? "User suspended" : "User unsuspended",
      user: serializeUser(updated),
    });
  } catch (error) {
    return next(error);
  }
};

const requestOtp = async (req, res, next) => {
  try {
    const { email, purpose = "signup" } = req.body;

    if (!email) {
      res.status(400);
      throw new Error("Email is required");
    }

    if (String(purpose) !== "signup") {
      res.status(400);
      throw new Error("purpose must be signup");
    }

    let user = findUserByEmail(email);
    if (!user) {
      user = await hydrateUserFromSupabaseByEmail(email);
    }

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const otpDelivery = await sendVerificationChallenge({
      user,
      purpose,
    });

    return res.status(200).json({
      success: true,
      message: "Verification code sent",
      verificationRequired: true,
      nextRoute: "/auth/otp-verify",
      user: serializeUser(user),
      otpDelivery,
      devOtp: otpDelivery.devOtp,
      note: otpDelivery.smtpConfigured
        ? "OTP was sent using SMTP email delivery."
        : "SMTP is not configured, so the OTP was logged to the backend console for development.",
    });
  } catch (error) {
    return next(error);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp, purpose = "signup" } = req.body;

    if (!email || !otp) {
      res.status(400);
      throw new Error("Email and OTP are required");
    }

    if (String(purpose) !== "signup") {
      res.status(400);
      throw new Error("purpose must be signup");
    }

    const otpCheck = verifyChallenge({
      email,
      purpose,
      otp,
    });

    if (!otpCheck.ok) {
      res.status(401);
      throw new Error(otpCheck.reason);
    }

    let user = findUserByEmail(email);
    if (!user) {
      user = await hydrateUserFromSupabaseByEmail(email);
    }

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const verifiedUser = markVerified(user);
    clearChallenge(email, purpose);
    await syncVerificationToSupabase(verifiedUser);

    await writeAuditLog({
      actorUserId: verifiedUser.id,
      action: "auth.email_verified",
      entityType: "users",
      entityId: verifiedUser.id,
      details: {
        email: verifiedUser.email,
        role: verifiedUser.role,
        purpose,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      token: issueSession(verifiedUser),
      user: serializeUser(verifiedUser),
      verificationRequired: false,
      nextRoute: resolveNextRoute(verifiedUser.role),
    });
  } catch (error) {
    return next(error);
  }
};

const me = async (req, res, next) => {
  try {
    let user = findUserById(req.user.id);

    if (!user && req.user?.email) {
      user = await hydrateUserFromSupabaseByEmail(req.user.email);
    }

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    return res.status(200).json({
      success: true,
      user: serializeUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id || req.body?.id || req.query?.id;
    const email = req.body?.email || req.query?.email;

    if (!id && !email) {
      res.status(400);
      throw new Error("Provide either user id or email");
    }

    const existingUser = id ? findUserById(id) : findUserByEmail(email);
    if (!existingUser) {
      res.status(404);
      throw new Error("User not found");
    }

    const removed = id ? removeUserById(id) : removeUserByEmail(email);
    if (!removed) {
      res.status(404);
      throw new Error("User not found");
    }

    clearChallenge(removed.email, "signup");
    clearChallenge(removed.email, "login");

    const supabaseDelete = await deleteSupabaseUser(removed.id);

    await writeAuditLog({
      actorUserId: req.user?.id || null,
      action: "auth.user_deleted",
      entityType: "users",
      entityId: removed.id,
      details: {
        email: removed.email,
        role: removed.role,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      deletedUser: {
        id: removed.id,
        email: removed.email,
        role: removed.role,
      },
      supabaseDelete,
    });
  } catch (error) {
    return next(error);
  }
};

const getAdmins = async (req, res, next) => {
  try {
    const admins = [
      ...listUsersByRole("admin"),
      ...listUsersByRole("volunteer_inspector"),
    ].map((user) => serializeUser(user));

    await writeAuditLog({
      actorUserId: req.user?.id || null,
      action: "auth.admins_listed",
      entityType: "users",
      entityId: null,
      details: {
        count: admins.length,
      },
    });

    return res.status(200).json({
      success: true,
      count: admins.length,
      admins,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  signup,
  login,
  requestOtp,
  verifyOtp,
  me,
  getAdmins,
  deleteUser,
  updateUserSuspension,
};
