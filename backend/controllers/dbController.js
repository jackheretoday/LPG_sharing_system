const {
  getSupabaseAdminClient,
  hasSupabaseConfig,
  hasServiceRole,
} = require("../config/supabaseClient");

const getDbStatus = async (req, res, next) => {
  try {
    if (!hasSupabaseConfig()) {
      return res.status(503).json({
        success: false,
        connected: false,
        message: "Supabase environment variables are not configured",
      });
    }

    const supabase = hasServiceRole()
      ? getSupabaseAdminClient()
      : null;

    if (!supabase) {
      return res.status(503).json({
        success: false,
        connected: false,
        message: "Supabase admin client could not be initialized",
      });
    }

    const tablesToProbe = [
      "users",
      "user_verifications",
      "trust_metrics",
      "user_badges",
      "disputes",
    ];

    const tables = {};
    for (const table of tablesToProbe) {
      const { error } = await supabase.from(table).select("*").limit(1);
      tables[table] = error
        ? { exists: false, code: error.code, message: error.message }
        : { exists: true };
    }

    const anyTableExists = Object.values(tables).some((entry) => entry.exists);

    if (!anyTableExists) {
      return res.status(200).json({
        success: true,
        connected: true,
        message: "Supabase reachable, but the trust tables are not present yet",
        tables,
      });
    }

    return res.status(200).json({
      success: true,
      connected: true,
      message: "Supabase connected successfully",
      tables,
    });
  } catch (error) {
    return next(error);
  }
};

const getDbSnapshot = async (req, res, next) => {
  try {
    if (!hasSupabaseConfig() || !hasServiceRole()) {
      return res.status(503).json({
        success: false,
        message: "Supabase admin access is not configured",
      });
    }

    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      return res.status(503).json({
        success: false,
        message: "Supabase admin client could not be initialized",
      });
    }

    const tablesToProbe = [
      "users",
      "user_verifications",
      "trust_metrics",
      "user_badges",
      "disputes",
    ];

    const tables = {};

    for (const table of tablesToProbe) {
      const { data, error } = await supabase.from(table).select("*").limit(5);

      tables[table] = error
        ? { exists: false, code: error.code, message: error.message, rows: [] }
        : { exists: true, rows: data || [] };
    }

    return res.status(200).json({
      success: true,
      tables,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getDbStatus,
  getDbSnapshot,
};
