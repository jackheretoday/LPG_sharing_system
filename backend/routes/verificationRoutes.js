const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const {
  pinVerify,
  idUpload,
  idReview,
} = require("../controllers/verificationController");

const router = express.Router();

router.post("/pin-verify", protect, pinVerify);
router.post("/id-upload", protect, idUpload);
router.post(
  "/id-review",
  protect,
  requireRole(["admin", "volunteer_inspector"]),
  idReview
);

module.exports = router;
