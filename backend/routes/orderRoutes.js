const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// In a real app, you'd add auth middleware here
router.post('/create', orderController.createOrder);
router.get('/user/:userId', orderController.getUserOrders);

module.exports = router;
