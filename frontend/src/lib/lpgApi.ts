const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
};

// ==================== Cylinder Management ====================

/**
 * Add a new LPG cylinder
 */
export const addCylinder = async (
  cylinderId: string,
  currentWeightKg: number,
  maxCapacityKg: number = 20
) => {
  const response = await fetch(`${API_BASE}/lpg/cylinders`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      cylinder_id: cylinderId,
      current_weight_kg: currentWeightKg,
      max_capacity_kg: maxCapacityKg,
    }),
  });
  return response.json();
};

/**
 * Get all cylinders for the current user
 */
export const getCylinders = async () => {
  const response = await fetch(`${API_BASE}/lpg/cylinders`, {
    headers,
  });
  return response.json();
};

/**
 * Get a specific cylinder by ID
 */
export const getCylinderById = async (cylinderId: string) => {
  const response = await fetch(`${API_BASE}/lpg/cylinders/${cylinderId}`, {
    headers,
  });
  return response.json();
};

/**
 * Update cylinder details
 */
export const updateCylinder = async (
  cylinderId: string,
  updates: Record<string, any>
) => {
  const response = await fetch(`${API_BASE}/lpg/cylinders/${cylinderId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(updates),
  });
  return response.json();
};

/**
 * Delete a cylinder
 */
export const deleteCylinder = async (cylinderId: string) => {
  const response = await fetch(`${API_BASE}/lpg/cylinders/${cylinderId}`, {
    method: 'DELETE',
    headers,
  });
  return response.json();
};

// ==================== Daily Usage Tracking ====================

/**
 * Log daily LPG usage
 */
export const logDailyUsage = async (
  cylinderId: string,
  usageKg: number,
  reason: string = 'general_use'
) => {
  const response = await fetch(`${API_BASE}/lpg/usage`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      cylinder_id: cylinderId,
      usage_kg: usageKg,
      usage_reason: reason,
    }),
  });
  return response.json();
};

/**
 * Get usage history for a cylinder
 */
export const getUsageHistory = async (cylinderId: string) => {
  const response = await fetch(`${API_BASE}/lpg/usage/${cylinderId}`, {
    headers,
  });
  return response.json();
};

// ==================== Predictions ====================

/**
 * Get prediction for when LPG will be empty
 */
export const predictEmptyDate = async (cylinderId: string) => {
  const response = await fetch(`${API_BASE}/lpg/predict`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      cylinder_id: cylinderId,
    }),
  });
  return response.json();
};

/**
 * Get the latest prediction for a cylinder
 */
export const getLatestPrediction = async (cylinderId: string) => {
  const response = await fetch(`${API_BASE}/lpg/predict/${cylinderId}`, {
    headers,
  });
  return response.json();
};

// ==================== Alerts ====================

/**
 * Get all unread alerts
 */
export const getAlerts = async () => {
  const response = await fetch(`${API_BASE}/lpg/alerts`, {
    headers,
  });
  return response.json();
};

/**
 * Mark an alert as read
 */
export const markAlertAsRead = async (alertId: string) => {
  const response = await fetch(`${API_BASE}/lpg/alerts/${alertId}`, {
    method: 'PATCH',
    headers,
  });
  return response.json();
};

// ==================== Alert Configuration ====================

/**
 * Get alert settings for the user
 */
export const getAlertSettings = async () => {
  const response = await fetch(`${API_BASE}/lpg/alert-config`, {
    headers,
  });
  return response.json();
};

/**
 * Update alert settings
 */
export const updateAlertSettings = async (settings: {
  alert_threshold_days?: number;
  alert_enabled?: boolean;
  notification_methods?: string[];
}) => {
  const response = await fetch(`${API_BASE}/lpg/alert-config`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(settings),

  // ==================== Prediction Feedback (Model Training) ====================

  /**
   * Submit prediction feedback for model training
   */
  export const submitPredictionFeedback = async (
    prediction_id: string,
    actual_empty_date: string,
    accuracy_percentage?: number,
    feedback_message?: string
  ) => {
    const response = await fetch(`${API_BASE}/lpg/feedback`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        prediction_id,
        actual_empty_date,
        accuracy_percentage,
        feedback_message,
      }),
    });
    return response.json();
  };

  /**
   * Get prediction feedback history
   */
  export const getPredictionFeedback = async () => {
    const response = await fetch(`${API_BASE}/lpg/feedback`, {
      headers,
    });
    return response.json();
  };

  /**
   * Get predictions pending feedback (past predicted date but no feedback yet)
   */
  export const getPendingFeedbackPredictions = async () => {
    const response = await fetch(`${API_BASE}/lpg/feedback/pending`, {
      headers,
    });
    return response.json();
  };

  /**
   * Get model performance metrics
   */
  export const getModelMetrics = async () => {
    const response = await fetch(`${API_BASE}/lpg/metrics/model`, {
      headers,
    });
    return response.json();
  };
  });
  return response.json();
};

export const lpgApi = {
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
  markAlertAsRead,
  getAlertSettings,
  updateAlertSettings,
  submitPredictionFeedback,
  getPredictionFeedback,
  getPendingFeedbackPredictions,
  getModelMetrics,
};
