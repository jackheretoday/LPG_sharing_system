const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || null;

let publicClient = null;
let adminClient = null;

const createSupabase = (key) => {
  if (!supabaseUrl || !key) {
    return null;
  }

  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

const getSupabasePublicClient = () => {
  if (publicClient) {
    return publicClient;
  }

  publicClient = createSupabase(supabaseAnonKey);
  return publicClient;
};

const getSupabaseAdminClient = () => {
  if (adminClient) {
    return adminClient;
  }

  adminClient = createSupabase(supabaseServiceRoleKey || supabaseAnonKey);
  return adminClient;
};

const hasSupabaseConfig = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

const hasServiceRole = () => {
  return Boolean(supabaseServiceRoleKey);
};

// Backwards-compatible aliases for older modules.
const getSupabaseClient = getSupabasePublicClient;
const getSupabaseAdmin = getSupabaseAdminClient;

module.exports = {
  getSupabasePublicClient,
  getSupabaseAdminClient,
  getSupabaseClient,
  getSupabaseAdmin,
  hasSupabaseConfig,
  hasServiceRole,
};
