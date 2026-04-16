const { getSupabaseAdminClient } = require("../config/supabaseClient");

/**
 * Make a prediction using the ML model
 * @param {number} currentWeight - Current available LPG weight in kg
 * @param {number} dailyAverageUsage - Average daily usage in kg
 * @returns {Object} - Prediction result with days_remaining and confidence
 */
const makePrediction = async (currentWeight, dailyAverageUsage) => {
  try {
    if (dailyAverageUsage <= 0) {
      return {
        success: true,
        daysRemaining: 999,
        confidence: 0.1,
        emptyDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      };
    }

    // Basic depletion logic
    const daysRemaining = Math.max(0, Math.floor(currentWeight / dailyAverageUsage));
    
    // Confidence logic:
    // High confidence if usage is stable and horizon is short
    // Lower confidence for long-term predictions
    let confidence = 0.95;
    if (daysRemaining > 15) confidence = 0.85;
    if (daysRemaining > 30) confidence = 0.70;
    if (daysRemaining > 60) confidence = 0.50;

    return {
      success: true,
      daysRemaining,
      confidence,
      emptyDate: new Date(Date.now() + daysRemaining * 24 * 60 * 60 * 1000),
    };
  } catch (error) {
    console.error("Error in makePrediction:", error.message);
    throw error;
  }
};

/**
 * Calculate weighed average daily usage from historical data
 * Recent usage is weighed more heavily to detect patterns
 */
const calculateAverageDailyUsage = async (userId, cylinderId, days = 30) => {
  try {
    const supabase = getSupabaseAdminClient();
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: logs, error } = await supabase
      .from("lpg_daily_usage")
      .select("usage_kg, usage_date")
      .eq("user_id", userId)
      .eq("cylinder_id", cylinderId)
      .gte("usage_date", startDate.toISOString().split("T")[0])
      .order("usage_date", { ascending: true });

    if (error) throw error;

    if (!logs || logs.length < 2) {
      return 0.5; // Default safe average
    }

    // Group usage by date (in case of multiple logs per day)
    const dailyMap = new Map();
    logs.forEach(log => {
      const date = log.usage_date.split('T')[0];
      dailyMap.set(date, (dailyMap.get(date) || 0) + parseFloat(log.usage_kg));
    });

    const dailyUsageArray = Array.from(dailyMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    
    if (dailyUsageArray.length < 2) return 0.5;

    // Calculate time-weighted average
    // We weigh the most recent 20% of the period 2x more than the rest
    let totalWeightedUsage = 0;
    let totalWeight = 0;
    
    const firstDate = new Date(dailyUsageArray[0][0]);
    const lastDate = new Date(dailyUsageArray[dailyUsageArray.length - 1][0]);
    const totalDaysSpan = Math.max(1, Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24)));
    
    // If span is too small, just average
    if (totalDaysSpan < 3) {
      const total = dailyUsageArray.reduce((s, r) => s + r[1], 0);
      return total / totalDaysSpan;
    }

    dailyUsageArray.forEach(([dateStr, usage]) => {
      const d = new Date(dateStr);
      const daysFromStart = Math.ceil((d - firstDate) / (1000 * 60 * 60 * 24));
      
      // Weighting factor: Increases as we get closer to the current date
      const weight = 1 + (daysFromStart / totalDaysSpan); // Weight goes from 1 to 2
      totalWeightedUsage += usage * weight;
      totalWeight += weight;
    });

    // The average daily usage is (Total Weighted Usage) / (Effective Weighted Days)
    // We normalize by the weight distribution to get a realistic daily rate
    const rawAverage = dailyUsageArray.reduce((s, r) => s + r[1], 0) / totalDaysSpan;
    const weightedAverage = (totalWeightedUsage / totalWeight) * (dailyUsageArray.length / totalDaysSpan);

    // Return a blend of raw average and weighted average for stability
    return Math.max(0.01, (rawAverage * 0.3) + (weightedAverage * 0.7));
  } catch (error) {
    console.error("Error in calculateAverageDailyUsage:", error.message);
    throw error;
  }
};

/**
 * Handle prediction feedback and trigger accuracy analytics
 */
const submitPredictionFeedback = async (userId, feedbackData) => {
  try {
    const supabase = getSupabaseAdminClient();
    const { predictionId, actualEmptyDate, wasAccurate, message } = feedbackData;

    const { data: prediction, error: predError } = await supabase
      .from("lpg_predictions")
      .select("*")
      .eq("id", predictionId)
      .single();

    if (predError) throw predError;

    const predDate = new Date(prediction.predicted_empty_date);
    const actualDate = new Date(actualEmptyDate);
    
    // Day difference: +ve means it lasted longer, -ve means it finished early
    const actualDaysRemainingAtTimeOfPrediction = Math.floor((actualDate - new Date(prediction.created_at)) / (1000 * 60 * 60 * 24));
    const predDaysRemaining = prediction.predicted_empty_days;
    
    const dayDiff = actualDaysRemainingAtTimeOfPrediction - predDaysRemaining;
    
    // Accuracy calculation: Based on deviation from actual lifespan
    const errorDays = Math.abs(dayDiff);
    const actualTotalDays = Math.max(1, actualDaysRemainingAtTimeOfPrediction);
    const accuracyPercentage = Math.max(0, 100 * (1 - (errorDays / actualTotalDays)));

    const { data, error } = await supabase
      .from("lpg_prediction_feedback")
      .insert([
        {
          user_id: userId,
          prediction_id: predictionId,
          cylinder_id: prediction.cylinder_id,
          predicted_empty_days: prediction.predicted_empty_days,
          predicted_empty_date: prediction.predicted_empty_date,
          predicted_daily_avg_kg: prediction.daily_avg_usage_kg,
          actual_empty_date: actualEmptyDate,
          actual_days_difference: dayDiff,
          was_accurate: wasAccurate || (errorDays <= 2),
          feedback_message: message,
          accuracy_percentage: accuracyPercentage,
          feedback_provided_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;

    await updateGlobalModelMetrics();
    return data;
  } catch (error) {
    console.error("Error in submitPredictionFeedback:", error.message);
    throw error;
  }
};

/**
 * Aggregates model telemetry for platform-wide metrics
 */
const updateGlobalModelMetrics = async () => {
  try {
    const supabase = getSupabaseAdminClient();
    
    const { data: feedback, error } = await supabase
      .from("lpg_prediction_feedback")
      .select("was_accurate, actual_days_difference, accuracy_percentage");

    if (error || !feedback || feedback.length === 0) return;

    const total = feedback.length;
    const accurateCount = feedback.filter(f => f.was_accurate).length;
    const avgAccuracy = feedback.reduce((sum, f) => sum + parseFloat(f.accuracy_percentage || 0), 0) / total;
    const avgError = feedback.reduce((sum, f) => sum + Math.abs(f.actual_days_difference || 0), 0) / total;

    const today = new Date().toISOString().split("T")[0];

    await supabase.from("lpg_model_metrics").upsert({
      metric_date: today,
      total_predictions: total,
      accurate_predictions: accurateCount,
      inaccurate_predictions: total - accurateCount,
      average_accuracy_percentage: avgAccuracy,
      average_error_days: avgError
    }, { onConflict: 'metric_date' });

  } catch (error) {
    console.error("Global Metrics Sync Error:", error.message);
  }
};

const getModelPerformanceMetrics = async () => {
  try {
    const supabase = getSupabaseAdminClient();
    const { data: overall } = await supabase
      .from("lpg_model_metrics")
      .select("*")
      .order("metric_date", { ascending: false })
      .limit(1)
      .single();

    const { data: historical } = await supabase
      .from("lpg_model_metrics")
      .select("*")
      .order("metric_date", { ascending: false })
      .limit(30);

    return {
      overall: overall ? {
        totalPredictions: overall.total_predictions,
        accuratePredictions: overall.accurate_predictions,
        accuracy_percentage: parseFloat(overall.average_accuracy_percentage || 0).toFixed(1),
        average_error_days: parseFloat(overall.average_error_days || 0).toFixed(1)
      } : {
        totalPredictions: 0,
        accuratePredictions: 0,
        accuracy_percentage: "0",
        average_error_days: "0"
      },
      historical: historical || []
    };
  } catch (error) {
    return { overall: null, historical: [] };
  }
};

const savePrediction = async (userId, cylinderId, predictionData) => {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("lpg_predictions")
      .insert([{
        user_id: userId,
        cylinder_id: cylinderId,
        current_weight_kg: predictionData.currentWeight,
        daily_avg_usage_kg: predictionData.dailyAverageUsage,
        predicted_empty_days: predictionData.daysRemaining,
        predicted_empty_date: predictionData.emptyDate.toISOString().split("T")[0],
        confidence_score: predictionData.confidence,
        alert_status: false,
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) { throw error; }
};

const shouldTriggerAlert = (prediction, alertThresholdDays = 7) => {
  return prediction.predicted_empty_days <= alertThresholdDays;
};

const createAlert = async (userId, cylinderId, prediction) => {
  try {
    const supabase = getSupabaseAdminClient();
    const alertMessage = `CRITICAL: Your LPG node ${cylinderId} will reach depletion in ${prediction.predicted_empty_days} days. Order refill.`;
    const { data, error } = await supabase
      .from("lpg_alerts")
      .insert([{
        user_id: userId,
        cylinder_id: cylinderId,
        alert_type: "low_stock",
        message: alertMessage,
        is_read: false,
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) { throw error; }
};

const getAlertConfig = async (userId) => {
  try {
    const supabase = getSupabaseAdminClient();
    let { data, error } = await supabase.from("lpg_alert_config").select("*").eq("user_id", userId).single();
    if (error && error.code === "PGRST116") {
      const { data: n } = await supabase.from("lpg_alert_config").insert([{ user_id: userId, alert_threshold_days: 7, alert_enabled: true }]).select().single();
      return n;
    }
    return data;
  } catch (error) { throw error; }
};

const updateAlertConfig = async (userId, updateData) => {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase.from("lpg_alert_config").update(updateData).eq("user_id", userId).select().single();
    if (error) throw error;
    return data;
  } catch (error) { throw error; }
};

const getUnreadAlerts = async (userId) => {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase.from("lpg_alerts").select("*").eq("user_id", userId).eq("is_read", false).order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) { throw error; }
};

const markAlertAsRead = async (alertId) => {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase.from("lpg_alerts").update({ is_read: true }).eq("id", alertId).select().single();
    if (error) throw error;
    return data;
  } catch (error) { throw error; }
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
  submitPredictionFeedback,
  getModelPerformanceMetrics
};
