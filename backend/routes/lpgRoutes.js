const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
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
} = require("../controllers/lpgController");
const {
  submitPredictionFeedback,
  getPredictionFeedback,
  getModelMetrics,
  getPendingFeedbackPredictions,
} = require("../controllers/lpgFeedbackController");

const router = express.Router();

// All LPG routes require authentication
router.use(protect);

// Cylinder Management Routes
router.post("/cylinders", addCylinder);
router.get("/cylinders", getCylinders);
router.get("/cylinders/:cylinderId", getCylinderById);
router.patch("/cylinders/:cylinderId", updateCylinder);
router.delete("/cylinders/:cylinderId", deleteCylinder);

// Daily Usage Tracking Routes
router.post("/usage", logDailyUsage);
router.get("/usage/:cylinderId", getUsageHistory);

// Prediction Routes
router.post("/predict", predictEmptyDate);
router.get("/predict/:cylinderId", getLatestPrediction);

// Alert Routes
router.get("/alerts", getAlerts);
router.patch("/alerts/:alertId", markAlertRead);

// Alert Configuration Routes
router.get("/alert-config", getAlertSettings);
router.patch("/alert-config", updateAlertSettings);

// Prediction Feedback Routes (for model training)
router.post("/feedback", submitPredictionFeedback);
router.get("/feedback", getPredictionFeedback);
router.get("/feedback/pending", getPendingFeedbackPredictions);

// Model Metrics Routes
router.get("/metrics/model", getModelMetrics);

module.exports = router;
