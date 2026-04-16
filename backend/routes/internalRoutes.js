const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const {
  exchangeCompleted,
  emergencyResponseLogged,
  runDisputeEscalation,
} = require("../controllers/internalController");

const router = express.Router();

router.post(
  "/run-escalation",
  protect,
  requireRole(["admin"]),
  runDisputeEscalation
);

router.post(
  "/exchange-completed",
  protect,
  requireRole(["admin", "volunteer_inspector"]),
  exchangeCompleted
);

router.post(
  "/emergency-response-logged",
  protect,
  requireRole(["admin", "volunteer_inspector"]),
  emergencyResponseLogged
);

module.exports = router;
