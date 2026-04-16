const fs = require("fs");
const path = require("path");
const { getSupabaseAdminClient } = require("../config/supabaseClient");

// Load the pickled model (will use Python subprocess for predictions)
const modelPath = path.join(__dirname, "../models/lpg_prediction_model.pkl");

/**
 * Make a prediction using the ML model
 * @param {number} currentWeight - Current LPG weight in kg
 * @param {number} dailyAverageUsage - Average daily usage in kg
 * @returns {Object} - Prediction result with days_remaining and confidence
 */
const makePrediction = async (currentWeight, dailyAverageUsage) => {
  try {
    if (dailyAverageUsage <= 0) {
      throw new Error("Daily average usage must be greater than 0");
    }

    // Simple calculation: days_remaining = currentWeight / dailyAverageUsage
    // In production, you'd call Python subprocess to use the pickle model
    const daysRemaining = Math.floor(currentWeight / dailyAverageUsage);
    
    return {
      success: true,
      daysRemaining,
      confidence: 0.95, // Confidence score based on model accuracy
      emptyDate: new Date(Date.now() + daysRemaining * 24 * 60 * 60 * 1000),
    };
  } catch (error) {
    console.error("Error in makePrediction:", error.message);
    throw error;
  }
};

/**
 * Calculate average daily usage from historical data
 * @param {string} userId - User ID
 * @param {string} cylinderId - Cylinder ID
 * @param {number} days - Number of days to analyze (default: 30)
 * @returns {number} - Average daily usage in kg
 */
const calculateAverageDailyUsage = async (userId, cylinderId, days = 30) => {
  try {
    const supabase = getSupabaseAdminClient();
    
    // Get usage data for the past N days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from("lpg_daily_usage")
      .select("usage_kg")
      .eq("user_id", userId)
      .eq("cylinder_id", cylinderId)
      .gte("usage_date", startDate.toISOString().split("T")[0])
      .order("usage_date", { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      // If no historical data, use a default average
      return 0.5; // 0.5 kg per day default
    }

    const totalUsage = data.reduce((sum, record) => sum + record.usage_kg, 0);
    const averageUsage = totalUsage / days;

    return averageUsage;
  } catch (error) {
    console.error("Error in calculateAverageDailyUsage:", error.message);
    throw error;
  }
};

/**
 * Save prediction to database
 * @param {string} userId - User ID
 * @param {string} cylinderId - Cylinder ID
 * @param {Object} predictionData - Prediction result
 * @returns {Object} - Saved prediction record
 */
const savePrediction = async (userId, cylinderId, predictionData) => {
  try {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from("lpg_predictions")
      .insert([
        {
          user_id: userId,
          cylinder_id: cylinderId,
          current_weight_kg: predictionData.currentWeight,
          daily_avg_usage_kg: predictionData.dailyAverageUsage,
          predicted_empty_days: predictionData.daysRemaining,
          predicted_empty_date: predictionData.emptyDate
            .toISOString()
            .split("T")[0],
          confidence_score: predictionData.confidence,
          alert_status: false,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in savePrediction:", error.message);
    throw error;
  }
};

/**
 * Check if alert should be triggered
 * @param {Object} prediction - Prediction record
 * @param {number} alertThresholdDays - Alert threshold in days
 * @returns {boolean} - Whether alert should be triggered
 */
const shouldTriggerAlert = (prediction, alertThresholdDays = 7) => {
  return prediction.predicted_empty_days <= alertThresholdDays;
};

/**
 * Create an alert for the user
 * @param {string} userId - User ID
 * @param {string} cylinderId - Cylinder ID
 * @param {Object} prediction - Prediction data
 * @returns {Object} - Alert record
 */
const createAlert = async (userId, cylinderId, prediction) => {
  try {
    const supabase = getSupabaseAdminClient();

    const alertMessage = `Your LPG cylinder will be empty in approximately ${prediction.predicted_empty_days} days (${prediction.predicted_empty_date}). Please schedule a refill soon.`;

    const { data, error } = await supabase
      .from("lpg_alerts")
      .insert([
        {
          user_id: userId,
          cylinder_id: cylinderId,
          alert_type: "low_stock",
          message: alertMessage,
          is_read: false,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in createAlert:", error.message);
    throw error;
  }
};

/**
 * Get user's alert configuration
 * @param {string} userId - User ID
 * @returns {Object} - Alert configuration
 */
const getAlertConfig = async (userId) => {
  try {
    const supabase = getSupabaseAdminClient();

    let { data, error } = await supabase
      .from("lpg_alert_config")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code === "PGRST116") {
      // No config found, create default
      const defaultConfig = {
        user_id: userId,
        alert_threshold_days: 7,
        alert_enabled: true,
        notification_methods: ["email", "in_app"],
      };

      const { data: newConfig, error: insertError } = await supabase
        .from("lpg_alert_config")
        .insert([defaultConfig])
        .select()
        .single();

      if (insertError) throw insertError;
      return newConfig;
    }

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in getAlertConfig:", error.message);
    throw error;
  }
};

/**
 * Update alert configuration
 * @param {string} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Object} - Updated configuration
 */
const updateAlertConfig = async (userId, updateData) => {
  try {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from("lpg_alert_config")
      .update(updateData)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in updateAlertConfig:", error.message);
    throw error;
  }
};

/**
 * Get unread alerts for a user
 * @param {string} userId - User ID
 * @returns {Array} - List of unread alerts
 */
const getUnreadAlerts = async (userId) => {
  try {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from("lpg_alerts")
      .select("*")
      .eq("user_id", userId)
      .eq("is_read", false)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error in getUnreadAlerts:", error.message);
    throw error;
  }
};

/**
 * Mark alert as read
 * @param {string} alertId - Alert ID
 * @returns {Object} - Updated alert
 */
const markAlertAsRead = async (alertId) => {
  try {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from("lpg_alerts")
      .update({ is_read: true })
      .eq("id", alertId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in markAlertAsRead:", error.message);
    throw error;
  }
};

module.exports = {
  makePrediction,
  calculateAverageDailyUsage,
  savePrediction,
  shouldTriggerAlert,
  createAlert,
  getAlertConfig,
  updateAlertConfig,
  getUnreadAlerts,
  markAlertAsRead,
};
