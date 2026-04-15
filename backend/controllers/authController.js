const bcrypt = require("bcryptjs");
const {
  getSupabasePublicClient,
  getSupabaseAdminClient,
  hasSupabaseConfig,
  hasServiceRole,
} = require("../config/supabaseClient");
const {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
  updateTrust,
} = require("../models/tempUserStore");
const { generateToken } = require("../utilis/token");

const allowedRoles = new Set([
  "household",
  "verified_reseller",
  "volunteer_inspector",
  "admin",
]);

const serializeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  trust: user.trust,
});

const persistSupabaseUser = async ({ id, name, email, role }) => {
  if (!hasSupabaseConfig() || !hasServiceRole()) {
    return { ok: false, skipped: true, errors: [] };
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return { ok: false, skipped: true, errors: [] };
  }

  const errors = [];

  const { error: usersError } = await supabase.from("users").upsert(
    {
      id,
      name,
    },
    { onConflict: "id" }
  );

  if (usersError) {
    errors.push({ table: "users", code: usersError.code, message: usersError.message });
  }

  const { error: verificationError } = await supabase.from("user_verifications").upsert(
    {
      user_id: id,
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
      user_id: id,
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

  return {
    ok: errors.length === 0,
    skipped: false,
    errors,
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

    if (role && !allowedRoles.has(role)) {
      res.status(400);
      throw new Error("Invalid role selected");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userRole = role || "household";

    let user = findUserByEmail(email);
    if (user) {
      res.status(409);
      throw new Error("User already exists with this email");
    }

    let supabaseMirror = { ok: false, skipped: true, errors: [] };

    if (hasSupabaseConfig() && hasServiceRole()) {
      const supabase = getSupabaseAdminClient();
      if (supabase) {
        const { data, error } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });

        if (error || !data?.user) {
          res.status(500);
          throw new Error(error?.message || "Failed to create Supabase user");
        }

        user = createUser({
          id: data.user.id,
          name,
          email,
          passwordHash,
          role: userRole,
        });

        supabaseMirror = await persistSupabaseUser({
          id: user.id,
          name,
          email,
          role: userRole,
        });
      }
    }

    if (!user) {
      user = createUser({
        name,
        email,
        passwordHash,
        role: userRole,
      });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
      user: serializeUser(user),
      supabaseMirror,
      note: "Signup mirrors the profile into Supabase when service-role config is available; login still uses the local user store for the dev flow.",
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

    if (hasSupabaseConfig()) {
      const supabase = getSupabasePublicClient();
      if (!supabase) {
        res.status(503);
        throw new Error("Supabase client not available");
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data?.user) {
        res.status(401);
        throw new Error("Invalid credentials");
      }

      const { data: profile } = await supabase
        .from("users")
        .select("id,name,email,role")
        .eq("id", data.user.id)
        .maybeSingle();

      user =
        profile ||
        user ||
        createUser({
          id: data.user.id,
          name: data.user.user_metadata?.name || data.user.email,
          email: data.user.email,
          passwordHash: await bcrypt.hash(password, 10),
          role: data.user.user_metadata?.role || "household",
        });

      updateUser(user.id, {
        email: data.user.email,
        name: profile?.name || data.user.user_metadata?.name || user.name,
        role: profile?.role || data.user.user_metadata?.role || user.role,
      });
    } else {
      if (!user) {
        res.status(401);
        throw new Error("Invalid credentials");
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        res.status(401);
        throw new Error("Invalid credentials");
      }
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: serializeUser(user),
      note: "Login uses Supabase Auth when configured; otherwise it falls back to in-memory auth.",
    });
  } catch (error) {
    return next(error);
  }
};

const me = (req, res, next) => {
  try {
    const user = findUserById(req.user.id);

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

module.exports = {
  signup,
  login,
  me,
};
