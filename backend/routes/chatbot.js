const express = require('express');
const router = express.Router();
const ChatbotController = require('../controller/ChatbotController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/adminAuth');

// Crear mensaje de chat (público)
router.post('/message', ChatbotController.createMessage);

// Obtener historial de chat del usuario (requiere autenticación)
router.get('/history/:userId', authMiddleware, ChatbotController.getChatHistory);

// Obtener todos los mensajes (solo admin)
router.get('/all', adminMiddleware, ChatbotController.getAllMessages);

// Obtener estadísticas (solo admin)
router.get('/stats', adminMiddleware, ChatbotController.getChatStats);

// Marcar mensaje como resuelto (solo admin)
router.put('/:chatId/resolve', adminMiddleware, ChatbotController.markAsResolved);

module.exports = router;
