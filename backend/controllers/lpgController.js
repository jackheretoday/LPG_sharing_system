const { getSupabaseAdminClient } = require("../config/supabaseClient");
const {
  makePrediction,
  calculateAverageDailyUsage,
  savePrediction,
  shouldTriggerAlert,
  createAlert,
  getAlertConfig,
  updateAlertConfig,
  getUnreadAlerts,
  markAlertAsRead,
} = require("../services/lpgService");

/**
 * Add a new LPG cylinder for the user
 * POST /api/lpg/cylinders
 */
const addCylinder = async (req, res, next) => {
  try {
    const { cylinder_id, current_weight_kg, max_capacity_kg } = req.body;
    const user_id = req.user.id;

    if (!cylinder_id || !current_weight_kg) {
      res.status(400);
      return next(new Error("cylinder_id and current_weight_kg are required"));
    }

    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from("lpg_cylinders")
      .insert([
        {
          user_id,
          cylinder_id,
          current_weight_kg: parseFloat(current_weight_kg),
          max_capacity_kg: parseFloat(max_capacity_kg) || 20.0,
        },
      ])
      .select()
      .single();

    if (error) {
      res.status(400);
      return next(new Error(error.message));
    }

    return res.status(201).json({
      success: true,
      message: "Cylinder added successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all cylinders for the user
 * GET /api/lpg/cylinders
 */
const getCylinders = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from("lpg_cylinders")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) {
      res.status(400);
      return next(new Error(error.message));
    }

    return res.status(200).json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific cylinder by ID
 * GET /api/lpg/cylinders/:cylinderId
 */
const getCylinderById = async (req, res, next) => {
  try {
    const { cylinderId } = req.params;
    const user_id = req.user.id;
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from("lpg_cylinders")
      .select("*")
      .eq("id", cylinderId)
      .eq("user_id", user_id)
      .single();

    if (error) {
      res.status(404);
      return next(new Error("Cylinder not found"));
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update cylinder weight/status
 * PATCH /api/lpg/cylinders/:cylinderId
 */
const updateCylinder = async (req, res, next) => {
  try {
    const { cylinderId } = req.params;
    const user_id = req.user.id;
    const updateData = req.body;

    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from("lpg_cylinders")
      .update(updateData)
      .eq("id", cylinderId)
      .eq("user_id", user_id)
      .select()
      .single();

    if (error) {
      res.status(400);
      return next(new Error(error.message));
    }

    return res.status(200).json({
      success: true,
      message: "Cylinder updated successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Log daily LPG usage
 * POST /api/lpg/usage
 */
const logDailyUsage = async (req, res, next) => {
  try {
    const { cylinder_id, usage_kg, usage_reason } = req.body;
    const user_id = req.user.id;

    if (!cylinder_id || !usage_kg) {
      res.status(400);
      return next(new Error("cylinder_id and usage_kg are required"));
    }

    const supabase = getSupabaseAdminClient();

    // Get cylinder details
    const { data: cylinder, error: cylError } = await supabase
      .from("lpg_cylinders")
      .select("id")
      .eq("user_id", user_id)
      .eq("cylinder_id", cylinder_id)
      .single();

    if (cylError) {
      res.status(404);
      return next(new Error("Cylinder not found"));
    }

    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("lpg_daily_usage")
      .insert([
        {
          user_id,
          cylinder_id: cylinder.id,
          usage_date: today,
          usage_kg: parseFloat(usage_kg),
          usage_reason: usage_reason || "general_use",
        },
      ])
      .select()
      .single();

    if (error) {
      res.status(400);
      return next(new Error(error.message));
    }

    return res.status(201).json({
      success: true,
      message: "Usage logged successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get daily usage history for a cylinder
 * GET /api/lpg/usage/:cylinderId
 */
const getUsageHistory = async (req, res, next) => {
  try {
    const { cylinderId } = req.params;
    const user_id = req.user.id;
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from("lpg_daily_usage")
      .select("*")
      .eq("cylinder_id", cylinderId)
      .eq("user_id", user_id)
      .order("usage_date", { ascending: false });

    if (error) {
      res.status(400);
      return next(new Error(error.message));
    }

    return res.status(200).json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Predict when LPG will be empty
 * POST /api/lpg/predict
 */
const predictEmptyDate = async (req, res, next) => {
  try {
    const { cylinder_id } = req.body;
    const user_id = req.user.id;

    if (!cylinder_id) {
      res.status(400);
      return next(new Error("cylinder_id is required"));
    }

    const supabase = getSupabaseAdminClient();

    // Get cylinder details
    const { data: cylinder, error: cylError } = await supabase
      .from("lpg_cylinders")
      .select("*")
      .eq("user_id", user_id)
      .eq("cylinder_id", cylinder_id)
      .single();

    if (cylError) {
      res.status(404);
      return next(new Error("Cylinder not found"));
    }

    // Calculate average daily usage
    const avgDailyUsage = await calculateAverageDailyUsage(
      user_id,
      cylinder.id,
      30
    );

    // Make prediction
    const prediction = await makePrediction(
      cylinder.current_weight_kg,
      avgDailyUsage
    );

    // Save prediction to database
    const savedPrediction = await savePrediction(user_id, cylinder.id, {
      currentWeight: cylinder.current_weight_kg,
      dailyAverageUsage: avgDailyUsage,
      daysRemaining: prediction.daysRemaining,
      emptyDate: prediction.emptyDate,
      confidence: prediction.confidence,
    });

    // Check if alert should be triggered
    const config = await getAlertConfig(user_id);
    if (
      config.alert_enabled &&
      shouldTriggerAlert(savedPrediction, config.alert_threshold_days)
    ) {
      await createAlert(user_id, cylinder.id, savedPrediction);
    }

    return res.status(200).json({
      success: true,
      message: "Prediction completed",
      data: {
        ...savedPrediction,
        alertTriggered: shouldTriggerAlert(
          savedPrediction,
          config.alert_threshold_days
        ),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get latest prediction for a cylinder
 * GET /api/lpg/predict/:cylinderId
 */
const getLatestPrediction = async (req, res, next) => {
  try {
    const { cylinderId } = req.params;
    const user_id = req.user.id;
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from("lpg_predictions")
      .select("*")
      .eq("cylinder_id", cylinderId)
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      res.status(400);
      return next(new Error(error.message));
    }

    return res.status(200).json({
      success: true,
      data: data || null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all unread alerts for user
 * GET /api/lpg/alerts
 */
const getAlerts = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const alerts = await getUnreadAlerts(user_id);

    return res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark alert as read
 * PATCH /api/lpg/alerts/:alertId
 */
const markAlertRead = async (req, res, next) => {
  try {
    const { alertId } = req.params;

    const alert = await markAlertAsRead(alertId);

    return res.status(200).json({
      success: true,
      message: "Alert marked as read",
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get alert configuration
 * GET /api/lpg/alert-config
 */
const getAlertSettings = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const config = await getAlertConfig(user_id);

    return res.status(200).json({
      success: true,
      data: config,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update alert configuration
 * PATCH /api/lpg/alert-config
 */
const updateAlertSettings = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const updateData = req.body;

    const config = await updateAlertConfig(user_id, updateData);

    return res.status(200).json({
      success: true,
      message: "Alert settings updated",
      data: config,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a cylinder
 * DELETE /api/lpg/cylinders/:cylinderId
 */
const deleteCylinder = async (req, res, next) => {
  try {
    const { cylinderId } = req.params;
    const user_id = req.user.id;

    const supabase = getSupabaseAdminClient();

    const { error } = await supabase
      .from("lpg_cylinders")
      .delete()
      .eq("id", cylinderId)
      .eq("user_id", user_id);

    if (error) {
      res.status(400);
      return next(new Error(error.message));
    }

    return res.status(200).json({
      success: true,
      message: "Cylinder deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addCylinder,
  getCylinders,
  getCylinderById,
  updateCylinder,
  deleteCylinder,
  logDailyUsage,
  getUsageHistory,
  predictEmptyDate,
  getLatestPrediction,
  getAlerts,
  markAlertRead,
  getAlertSettings,
  updateAlertSettings,
};
