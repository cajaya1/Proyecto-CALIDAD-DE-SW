const express = require('express');
const router = express.Router();
const ReviewController = require('../controller/ReviewController');
const verifyToken = require('../middleware/auth');
const verifyAdmin = require('../middleware/adminAuth');

// Rutas públicas (no requieren autenticación)
router.get('/product/:productId', ReviewController.getProductReviews);

// Rutas protegidas (requieren autenticación)
router.post('/', verifyToken, ReviewController.createReview);
router.get('/user/:userId', verifyToken, ReviewController.getUserReviews);
router.put('/:reviewId', verifyToken, ReviewController.updateReview);
router.delete('/:reviewId', verifyToken, ReviewController.deleteReview);

// Rutas de administrador
router.get('/stats', verifyToken, verifyAdmin, ReviewController.getStats);

module.exports = router;
