const { getSupabaseAdminClient } = require("../config/supabaseClient");

/**
 * Submit feedback on prediction accuracy
 * Called after the predicted date passes
 */
const submitPredictionFeedback = async (req, res, next) => {
  try {
    const { prediction_id, actual_empty_date, accuracy_percentage, feedback_message } = req.body;
    const user_id = req.user.id;

    if (!prediction_id || !actual_empty_date) {
      res.status(400);
      return next(new Error("prediction_id and actual_empty_date are required"));
    }

    const supabase = getSupabaseAdminClient();

    // Get the prediction record
    const { data: prediction, error: predError } = await supabase
      .from("lpg_predictions")
      .select("*")
      .eq("id", prediction_id)
      .eq("user_id", user_id)
      .single();

    if (predError) {
      res.status(404);
      return next(new Error("Prediction not found"));
    }

    // Calculate difference
    const predicted = new Date(prediction.predicted_empty_date);
    const actual = new Date(actual_empty_date);
    const actualDaysDifference = Math.floor(
      (actual - predicted) / (1000 * 60 * 60 * 24)
    );

    // Determine if accurate (within ±2 days is considered accurate)
    const isAccurate = Math.abs(actualDaysDifference) <= 2;

    // Create or update feedback record
    const { data: feedback, error: fbError } = await supabase
      .from("lpg_prediction_feedback")
      .upsert(
        [
          {
            user_id,
            prediction_id,
            cylinder_id: prediction.cylinder_id,
            predicted_empty_days: prediction.predicted_empty_days,
            predicted_empty_date: prediction.predicted_empty_date,
            predicted_daily_avg_kg: prediction.daily_avg_usage_kg,
            actual_empty_date: actual_empty_date,
            actual_days_difference: actualDaysDifference,
            was_accurate: isAccurate,
            feedback_message: feedback_message || null,
            accuracy_percentage: accuracy_percentage || null,
            feedback_provided_at: new Date().toISOString(),
          },
        ],
        { onConflict: "prediction_id" }
      )
      .select()
      .single();

    if (fbError) {
      res.status(400);
      return next(new Error(fbError.message));
    }

    // Update model metrics
    await updateModelMetrics();

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback,
      analysis: {
        isAccurate,
        actualDaysDifference,
        message:
          actualDaysDifference > 0
            ? `Prediction was accurate! Empty date was ${actualDaysDifference} days later than predicted.`
            : actualDaysDifference < 0
              ? `Prediction was early. Gas emptied ${Math.abs(actualDaysDifference)} days earlier than predicted.`
              : `Excellent prediction! Gas emptied exactly on the predicted date.`,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get prediction feedback history
 */
const getPredictionFeedback = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from("lpg_prediction_feedback")
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
 * Get model performance metrics
 */
const getModelMetrics = async (req, res, next) => {
  try {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from("lpg_model_metrics")
      .select("*")
      .order("metric_date", { ascending: false })
      .limit(30);

    if (error) {
      res.status(400);
      return next(new Error(error.message));
    }

    // Calculate overall metrics
    let totalPredictions = 0;
    let accuratePredictions = 0;
    let totalError = 0;

    const allFeedback = await supabase
      .from("lpg_prediction_feedback")
      .select("actual_days_difference, was_accurate");

    if (!allFeedback.error && allFeedback.data) {
      totalPredictions = allFeedback.data.length;
      accuratePredictions = allFeedback.data.filter((f) => f.was_accurate).length;
      totalError = allFeedback.data.reduce((sum, f) => sum + Math.abs(f.actual_days_difference || 0), 0);
    }

    return res.status(200).json({
      success: true,
      metrics: {
        historical: data || [],
        overall: {
          totalPredictions,
          accuratePredictions,
          accuracy_percentage:
            totalPredictions > 0
              ? ((accuratePredictions / totalPredictions) * 100).toFixed(2)
              : 0,
          average_error_days:
            totalPredictions > 0
              ? (totalError / totalPredictions).toFixed(2)
              : 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Calculate and update model metrics (called after each feedback)
 */
const updateModelMetrics = async () => {
  try {
    const supabase = getSupabaseAdminClient();

    // Get today's feedback
    const today = new Date().toISOString().split("T")[0];

    const { data: feedbackData, error: feedError } = await supabase
      .from("lpg_prediction_feedback")
      .select("*")
      .gte("feedback_provided_at", `${today}T00:00:00`)
      .lte("feedback_provided_at", `${today}T23:59:59`);

    if (feedError) {
      console.error("Error fetching feedback:", feedError);
      return;
    }

    if (!feedbackData || feedbackData.length === 0) {
      return;
    }

    // Calculate metrics
    const total = feedbackData.length;
    const accurate = feedbackData.filter((f) => f.was_accurate).length;
    const inaccurate = total - accurate;

    const errors = feedbackData.map((f) => Math.abs(f.actual_days_difference || 0));
    const mae = (errors.reduce((a, b) => a + b, 0) / total).toFixed(2);
    const rmse = Math.sqrt(errors.reduce((sum, e) => sum + e * e, 0) / total).toFixed(2);
    const avgAccuracy = ((accurate / total) * 100).toFixed(2);

    // Upsert metrics
    await supabase.from("lpg_model_metrics").upsert(
      [
        {
          metric_date: today,
          total_predictions: total,
          accurate_predictions: accurate,
          inaccurate_predictions: inaccurate,
          average_error_days: mae,
          average_accuracy_percentage: avgAccuracy,
          mae_mean_absolute_error: mae,
          rmse_root_mean_squared_error: rmse,
        },
      ],
      { onConflict: "metric_date" }
    );

    console.log(`✅ Model metrics updated for ${today}: ${avgAccuracy}% accuracy`);
  } catch (error) {
    console.error("Error updating model metrics:", error);
  }
};

/**
 * Get predictions pending feedback (past predicted date but no feedback yet)
 */
const getPendingFeedbackPredictions = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const supabase = getSupabaseAdminClient();

    // Get predictions that are past their predicted date and have no feedback
    const { data: predictions, error: predError } = await supabase
      .from("lpg_predictions")
      .select(
        `
        id,
        cylinder_id,
        predicted_empty_date,
        predicted_empty_days,
        daily_avg_usage_kg,
        created_at,
        lpg_cylinders!inner(cylinder_id)
      `
      )
      .eq("user_id", user_id)
      .lt("predicted_empty_date", new Date().toISOString().split("T")[0]);

    if (predError) {
      res.status(400);
      return next(new Error(predError.message));
    }

    // Filter out predictions that already have feedback
    const { data: feedbackIds, error: fbError } = await supabase
      .from("lpg_prediction_feedback")
      .select("prediction_id")
      .eq("user_id", user_id);

    if (fbError) {
      res.status(400);
      return next(new Error(fbError.message));
    }

    const feedbackPredictionIds = new Set(feedbackIds.map((f) => f.prediction_id));
    const pending = predictions.filter((p) => !feedbackPredictionIds.has(p.id));

    return res.status(200).json({
      success: true,
      count: pending.length,
      data: pending,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitPredictionFeedback,
  getPredictionFeedback,
  getModelMetrics,
  getPendingFeedbackPredictions,
  updateModelMetrics,
};
