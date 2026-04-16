const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { bootstrapConversation, postMessage } = require("../controllers/chatController");

const router = express.Router();

router.get("/bootstrap", protect, bootstrapConversation);
router.post("/conversations/:conversationId/messages", protect, postMessage);

module.exports = router;
