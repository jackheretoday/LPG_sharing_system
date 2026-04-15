const express = require("express");
const { getDbStatus, getDbSnapshot } = require("../controllers/dbController");

const router = express.Router();

router.get("/status", getDbStatus);
router.get("/snapshot", getDbSnapshot);

module.exports = router;
