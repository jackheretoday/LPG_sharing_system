const express = require("express");
const { signup, login, requestOtp, verifyOtp, me, getAdmins, deleteUser, updateUserSuspension } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);
router.get("/me", protect, me);
router.get("/admins", protect, requireRole(["admin", "volunteer_inspector"]), getAdmins);
router.delete("/users/:id", protect, requireRole(["admin", "volunteer_inspector"]), deleteUser);
router.delete("/users", protect, requireRole(["admin", "volunteer_inspector"]), deleteUser);
router.patch("/users/:id/suspension", protect, requireRole(["admin", "volunteer_inspector"]), updateUserSuspension);

module.exports = router;
