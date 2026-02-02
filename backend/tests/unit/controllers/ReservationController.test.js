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
const Reservation = require('../../../model/Reservation');
const Product = require('../../../model/Product');

describe('ReservationController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/reservations', () => {
    it('debería crear una nueva reserva', async () => {
      const reservationData = {
        userId: 1,
        productId: 1,
        quantity: 2,
        reservationDate: new Date('2025-01-15'),
        notes: 'Necesito antes del fin de semana'
      };

      Product.findByPk = jest.fn().mockResolvedValue({ id: 1, stock: 10, name: 'Zapatilla X' });
      Reservation.create = jest.fn().mockResolvedValue({
        id: 1,
        ...reservationData,
        status: 'pending'
      });

      const response = await request(app)
        .post('/api/reservations')
        .set('Authorization', 'Bearer user_token')
        .send(reservationData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('pending');
    });

    it('debería rechazar si no hay stock suficiente', async () => {
      const reservationData = {
        userId: 1,
        productId: 1,
        quantity: 15,
        reservationDate: new Date('2025-01-15')
      };

      Product.findByPk = jest.fn().mockResolvedValue({ id: 1, stock: 5, name: 'Zapatilla X' });

      const response = await request(app)
        .post('/api/reservations')
        .set('Authorization', 'Bearer user_token')
        .send(reservationData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Stock insuficiente');
    });

    it('debería rechazar si falta el producto', async () => {
      const reservationData = {
        userId: 1,
        productId: 999,
        quantity: 2,
        reservationDate: new Date('2025-01-15')
      };

      Product.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .post('/api/reservations')
        .set('Authorization', 'Bearer user_token')
        .send(reservationData);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Producto no encontrado');
    });
  });

  describe('GET /api/reservations/user/:userId', () => {
    it('debería obtener las reservas del usuario', async () => {
      const mockReservations = [
        { id: 1, userId: 1, productId: 1, quantity: 2, status: 'pending' },
        { id: 2, userId: 1, productId: 2, quantity: 1, status: 'confirmed' }
      ];

      Reservation.findAll = jest.fn().mockResolvedValue(mockReservations);

      const response = await request(app)
        .get('/api/reservations/user/1')
        .set('Authorization', 'Bearer user_token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });
  });

  describe('PUT /api/reservations/:reservationId', () => {
    it('debería actualizar el estado de la reserva', async () => {
      const updateData = { status: 'ready', pickupDate: new Date('2025-01-20') };

      Reservation.findByPk = jest.fn().mockResolvedValue({
        id: 1,
        status: 'pending',
        save: jest.fn().mockResolvedValue()
      });

      const response = await request(app)
        .put('/api/reservations/1')
        .set('Authorization', 'Bearer admin_token')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('debería rechazar estado no válido', async () => {
      const response = await request(app)
        .put('/api/reservations/1')
        .set('Authorization', 'Bearer admin_token')
        .send({ status: 'invalid_status' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Estado no válido');
    });
  });

  describe('DELETE /api/reservations/:reservationId', () => {
    it('debería cancelar una reserva', async () => {
      Reservation.findByPk = jest.fn().mockResolvedValue({
        id: 1,
        status: 'pending',
        save: jest.fn().mockResolvedValue()
      });

      const response = await request(app)
        .delete('/api/reservations/1')
        .set('Authorization', 'Bearer user_token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Reserva cancelada correctamente');
    });

    it('debería rechazar si la reserva ya está cancelada', async () => {
      Reservation.findByPk = jest.fn().mockResolvedValue({
        id: 1,
        status: 'cancelled'
      });

      const response = await request(app)
        .delete('/api/reservations/1')
        .set('Authorization', 'Bearer user_token');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('La reserva ya fue cancelada');
    });
  });

  describe('GET /api/reservations/stats', () => {
    it('debería obtener estadísticas de reservas', async () => {
      Reservation.count = jest.fn()
        .mockResolvedValueOnce(10) // pending
        .mockResolvedValueOnce(5)  // confirmed
        .mockResolvedValueOnce(3)  // ready
        .mockResolvedValueOnce(2)  // picked_up
        .mockResolvedValueOnce(1); // cancelled

      const response = await request(app)
        .get('/api/reservations/stats')
        .set('Authorization', 'Bearer admin_token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.stats).toBeDefined();
    });
  });
});
