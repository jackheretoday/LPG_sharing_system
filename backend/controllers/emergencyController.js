const { getSupabaseAdminClient } = require("../config/supabaseClient");

const listActiveRequests = async (req, res, next) => {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("emergency_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    const userIds = [
      ...new Set(
        (data || [])
          .flatMap((item) => [item.user_id, item.assigned_provider_id])
          .filter(Boolean)
      ),
    ];

    const { data: users } = userIds.length
      ? await supabase.from("users").select("id,name,role,is_verified").in("id", userIds)
      : { data: [] };
    const usersById = new Map((users || []).map((user) => [user.id, user]));

    const requests = (data || []).map((item) => ({
      ...item,
      reporter: item.user_id ? usersById.get(item.user_id) || null : null,
      assigned_provider: item.assigned_provider_id ? usersById.get(item.assigned_provider_id) || null : null,
    }));

    return res.status(200).json({ success: true, requests });
  } catch (error) {
    return next(error);
  }
};

const createEmergencyRequest = async (req, res, next) => {
  try {
    const supabase = getSupabaseAdminClient();
    const { intensity, sound, duration, location } = req.body || {};
    const severity =
      intensity === "Very Strong" ? "high" : intensity === "Noticeable" ? "medium" : "low";

    const { data: providers } = await supabase
      .from("users")
      .select("id,name")
      .in("role", ["mechanic", "admin"])
      .limit(1);

    const assignedProviderId = providers?.[0]?.id || null;

    const { data, error } = await supabase
      .from("emergency_requests")
      .insert([
        {
          user_id: req.user.id,
          intensity: intensity || null,
          leakage_sound: sound || null,
          duration: duration || null,
          severity,
          location: location || "Unknown",
          assigned_provider_id: assignedProviderId,
          notes: "Emergency created from assessment flow",
        },
      ])
      .select("*")
      .single();

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    return res.status(201).json({ success: true, request: data });
  } catch (error) {
    return next(error);
  }
};

const getEmergencyRequest = async (req, res, next) => {
  try {
    const supabase = getSupabaseAdminClient();
    const { id } = req.params;

    const { data, error } = await supabase
      .from("emergency_requests")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      res.status(404);
      throw new Error("Emergency request not found");
    }

    let provider = null;
    if (data.assigned_provider_id) {
      const { data: providerData } = await supabase
        .from("users")
        .select("id,name,role,is_verified")
        .eq("id", data.assigned_provider_id)
        .maybeSingle();
      provider = providerData || null;
    }

    return res.status(200).json({ success: true, request: data, provider });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listActiveRequests,
  createEmergencyRequest,
  getEmergencyRequest,
};
