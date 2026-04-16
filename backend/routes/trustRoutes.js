const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const {
  getMyTrust,
  getUserTrust,
  listProviders,
  recomputeUserTrust,
  overrideUserTrust,
} = require("../controllers/trustController");

const router = express.Router();

router.get("/me", protect, getMyTrust);
router.get("/user/:id", protect, getUserTrust);
router.get("/providers", protect, listProviders);
router.post(
  "/recompute/:userId",
  protect,
  requireRole(["admin", "volunteer_inspector"]),
  recomputeUserTrust
);
router.patch(
  "/override/:userId",
  protect,
  requireRole(["admin", "volunteer_inspector"]),
  overrideUserTrust
);

module.exports = router;
