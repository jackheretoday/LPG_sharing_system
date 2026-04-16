const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  listActiveRequests,
  createEmergencyRequest,
  getEmergencyRequest,
} = require("../controllers/emergencyController");

const router = express.Router();

router.get("/requests", protect, listActiveRequests);
router.post("/requests", protect, createEmergencyRequest);
router.get("/requests/:id", protect, getEmergencyRequest);

module.exports = router;
