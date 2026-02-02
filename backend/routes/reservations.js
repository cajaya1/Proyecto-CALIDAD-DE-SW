const express = require('express');
const router = express.Router();
const ReservationController = require('../controller/ReservationController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/adminAuth');

// Crear nueva reserva (requiere autenticación)
router.post('/', authMiddleware, ReservationController.createReservation);

// Obtener reservas del usuario actual (requiere autenticación)
router.get('/user/:userId', authMiddleware, ReservationController.getUserReservations);

// Obtener todas las reservas (solo admin)
router.get('/', adminMiddleware, ReservationController.getAllReservations);

// Obtener estadísticas de reservas (solo admin) - definido antes de rutas con params para evitar coincidencias
router.get('/stats', adminMiddleware, ReservationController.getReservationStats);

// Obtener reserva por ID (requiere autenticación)
router.get('/:reservationId', authMiddleware, ReservationController.getReservationById);

// Actualizar estado de reserva (solo admin)
router.put('/:reservationId', adminMiddleware, ReservationController.updateReservationStatus);

// Cancelar reserva (requiere autenticación)
router.delete('/:reservationId', authMiddleware, ReservationController.cancelReservation);

module.exports = router;
