const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');

router.post('/add', protect, resourceController.createResource);
router.get('/list', resourceController.getAllResources);
router.post('/request/:resourceId', protect, resourceController.requestResource);
router.get('/my-requests', protect, resourceController.getMyRequests);

module.exports = router;
