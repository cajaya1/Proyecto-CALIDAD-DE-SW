const request = require('supertest');

// Mock auth middlewares to bypass JWT during unit tests
jest.mock('../../../middleware/auth', () => (req, res, next) => {
  req.userId = 1;
  req.user = { id: 1, username: 'User', role: 'user' };
  next();
});

jest.mock('../../../middleware/adminAuth', () => (req, res, next) => {
  req.userId = 1;
  req.user = { id: 1, username: 'Admin', role: 'admin' };
  next();
});

const app = require('../../../app');
const Chatbot = require('../../../model/Chatbot');

describe('ChatbotController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/chatbot/message', () => {
    it('debería crear un nuevo mensaje de chat', async () => {
      const messageData = {
        userId: 1,
        userMessage: '¿Cuál es el precio de las zapatillas?'
      };

      // Mock del modelo
      Chatbot.create = jest.fn().mockResolvedValue({
        id: 1,
        ...messageData,
        botResponse: 'Te puedo ayudar con información sobre precios.',
        intent: 'product_inquiry',
        resolved: false
      });

      const response = await request(app)
        .post('/api/chatbot/message')
        .send(messageData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });

    it('debería rechazar mensaje vacío', async () => {
      const response = await request(app)
        .post('/api/chatbot/message')
        .send({ userId: 1, userMessage: '' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('El mensaje no puede estar vacío');
    });
  });

  describe('GET /api/chatbot/history/:userId', () => {
    it('debería obtener historial de chat del usuario', async () => {
      const mockMessages = [
        { id: 1, userId: 1, userMessage: 'Hola', botResponse: 'Hola, ¿cómo te ayudo?' },
        { id: 2, userId: 1, userMessage: 'Precio', botResponse: 'Los precios varían...' }
      ];

      Chatbot.findAll = jest.fn().mockResolvedValue(mockMessages);

      const response = await request(app)
        .get('/api/chatbot/history/1')
        .set('Authorization', 'Bearer token123');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });
  });

  describe('GET /api/chatbot/stats', () => {
    it('debería obtener estadísticas del chatbot', async () => {
      Chatbot.count = jest.fn()
        .mockResolvedValueOnce(100) // totalMessages
        .mockResolvedValueOnce(75); // resolvedMessages

      Chatbot.findAll = jest.fn().mockResolvedValue([
        { intent: 'product_inquiry' },
        { intent: 'order_status' },
        { intent: 'general' }
      ]);

      const response = await request(app)
        .get('/api/chatbot/stats')
        .set('Authorization', 'Bearer admin_token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.stats).toBeDefined();
    });
  });
});
