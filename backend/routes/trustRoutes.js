const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const {
  getMyTrust,
  getUserTrust,
  recomputeUserTrust,
} = require("../controllers/trustController");

const router = express.Router();

router.get("/me", protect, getMyTrust);
router.get("/user/:id", protect, getUserTrust);
router.post(
  "/recompute/:userId",
  protect,
  requireRole(["admin", "volunteer_inspector"]),
  recomputeUserTrust
);

module.exports = router;
