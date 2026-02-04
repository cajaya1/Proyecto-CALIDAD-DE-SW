const Reservation = require('../model/Reservation');
const Product = require('../model/Product');

class ReservationController {
  // Crear nueva reserva
  static async createReservation(req, res) {
    try {
      const { userId, productId, quantity, reservationDate, notes } = req.body;

      // Validar datos
      if (!userId || !productId || !quantity || !reservationDate) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
      }

      // Verificar que el producto existe
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      // Verificar disponibilidad de stock
      if (product.stock < quantity) {
        return res.status(400).json({
          error: 'Stock insuficiente',
          available: product.stock,
          requested: quantity
        });
      }

      const reservation = await Reservation.create({
        userId,
        productId,
        quantity,
        reservationDate: new Date(reservationDate),
        notes: notes || null,
        status: 'pending'
      });

      res.status(201).json({
        success: true,
        message: 'Reserva creada correctamente',
        data: reservation
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al crear la reserva',
        details: error.message
      });
    }
  }

  // Obtener reservas del usuario
  static async getUserReservations(req, res) {
    try {
      const { userId } = req.params;

      const reservations = await Reservation.findAll({
        where: { userId },
        include: [
          {
            model: Product,
            attributes: ['id', 'name', 'price', 'image']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.status(200).json({
        success: true,
        count: reservations.length,
        data: reservations
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener reservas',
        details: error.message
      });
    }
  }

  // Obtener todas las reservas (solo admin)
  static async getAllReservations(req, res) {
    try {
      const { status, limit = 50, offset = 0 } = req.query;

      const where = status ? { status } : {};

      const { count, rows } = await Reservation.findAndCountAll({
        where,
        include: [
          {
            model: Product,
            attributes: ['id', 'name', 'price', 'image']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      res.status(200).json({
        success: true,
        total: count,
        count: rows.length,
        data: rows
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener reservas',
        details: error.message
      });
    }
  }

  // Obtener reserva por ID
  static async getReservationById(req, res) {
    try {
      const { reservationId } = req.params;

      const reservation = await Reservation.findByPk(reservationId, {
        include: [
          {
            model: Product,
            attributes: ['id', 'name', 'price', 'image']
          }
        ]
      });

      if (!reservation) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }

      res.status(200).json({
        success: true,
        data: reservation
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener la reserva',
        details: error.message
      });
    }
  }

  // Actualizar estado de reserva
  static async updateReservationStatus(req, res) {
    try {
      const { reservationId } = req.params;
      const { status, pickupDate } = req.body;

      // Validar estado
      const validStatuses = ['pending', 'confirmed', 'ready', 'picked_up', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Estado no válido' });
      }

      const reservation = await Reservation.findByPk(reservationId);
      if (!reservation) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }

      const updateData = { status };
      if (pickupDate) {
        updateData.pickupDate = new Date(pickupDate);
      }
      const updatedReservation = await Reservation.update(reservationId, updateData);

      res.status(200).json({
        success: true,
        message: 'Reserva actualizada correctamente',
        data: updatedReservation
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al actualizar la reserva',
        details: error.message
      });
    }
  }

  // Cancelar reserva
  static async cancelReservation(req, res) {
    try {
      const { reservationId } = req.params;

      const reservation = await Reservation.findByPk(reservationId);
      if (!reservation) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }

      if (reservation.status === 'cancelled') {
        return res.status(400).json({ error: 'La reserva ya fue cancelada' });
      }

      const updatedReservation = await Reservation.update(reservationId, { status: 'cancelled' });

      res.status(200).json({
        success: true,
        message: 'Reserva cancelada correctamente',
        data: updatedReservation
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al cancelar la reserva',
        details: error.message
      });
    }
  }

  // Obtener estadísticas de reservas
  static async getReservationStats(req, res) {
    try {
      const statuses = ['pending', 'confirmed', 'ready', 'picked_up', 'cancelled'];
      const stats = {};

      for (const status of statuses) {
        stats[status] = await Reservation.count({ where: { status } });
      }

      const totalReservations = await Reservation.count();

      res.status(200).json({
        success: true,
        stats: {
          total: totalReservations,
          byStatus: stats
        }
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener estadísticas',
        details: error.message
      });
    }
  }
}

module.exports = ReservationController;
