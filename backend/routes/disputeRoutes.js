const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const {
  createDispute,
  getDisputes,
  updateDispute,
} = require("../controllers/disputeController");

const router = express.Router();

router.post("/", protect, createDispute);
router.get("/", protect, getDisputes);
router.patch(
  "/:id",
  protect,
  requireRole(["admin", "volunteer_inspector"]),
  updateDispute
);

module.exports = router;
