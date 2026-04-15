const express = require("express");
const { getHealth } = require("../controllers/systemController");

const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "LPG backend API is up",
  });
});

router.get("/health", getHealth);

module.exports = router;
