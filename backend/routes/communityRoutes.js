const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  listPosts,
  getPost,
  createPost,
  deletePost,
  addComment,
} = require("../controllers/communityController");

const router = express.Router();

router.get("/posts", listPosts);
router.get("/posts/:id", getPost);
router.post("/posts", protect, createPost);
router.delete("/posts/:id", protect, deletePost);
router.post("/posts/:id/comments", protect, addComment);

module.exports = router;
