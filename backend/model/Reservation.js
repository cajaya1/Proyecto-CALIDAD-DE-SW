const pool = require('../config/database');

function mapRow(row) {
  if (!row) return null;
  const base = {
    id: row.id,
    userId: row.user_id,
    productId: row.product_id,
    quantity: row.quantity,
    reservationDate: row.reservation_date,
    pickupDate: row.pickup_date,
    status: row.status,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };

  if (row.product_id && row.product_name !== undefined) {
    base.product = {
      id: row.product_id,
      name: row.product_name,
      price: row.product_price,
      image: row.product_image,
      stock: row.product_stock
    };
  }
  return base;
}

class Reservation {
  static async create({ userId, productId, quantity, reservationDate, pickupDate = null, status = 'pending', notes = null }) {
    const [result] = await pool.execute(
      `INSERT INTO reservations (user_id, product_id, quantity, reservation_date, pickup_date, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [userId, productId, quantity, reservationDate, pickupDate, status, notes]
    );
    return this.findByPk(result.insertId, { includeProduct: true });
  }

  static async findAll({ where = {}, includeProduct = false, order = [['createdAt', 'DESC']], limit = 50, offset = 0 } = {}) {
    const conditions = [];
    const params = [];

    if (where.userId) {
      conditions.push('r.user_id = ?');
      params.push(where.userId);
    }
    if (where.status) {
      conditions.push('r.status = ?');
      params.push(where.status);
    }

    const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const direction = order?.[0]?.[1]?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const selectProduct = includeProduct
      ? `, p.name AS product_name, p.price AS product_price, p.image AS product_image, p.stock AS product_stock`
      : '';

    const joinProduct = includeProduct ? 'LEFT JOIN products p ON p.id = r.product_id' : '';

    const [rows] = await pool.execute(
      `SELECT r.id, r.user_id, r.product_id, r.quantity, r.reservation_date, r.pickup_date, r.status, r.notes, r.created_at, r.updated_at
              ${selectProduct}
       FROM reservations r
       ${joinProduct}
       ${whereSql}
       ORDER BY r.created_at ${direction}
       LIMIT ? OFFSET ?;`,
      [...params, limit, offset]
    );

    return rows.map(mapRow);
  }

  static async findAndCountAll({ where = {}, include = [], limit = 50, offset = 0, order = [['createdAt', 'DESC']] } = {}) {
    const includeProduct = include?.length > 0;
    const rows = await this.findAll({ where, includeProduct, limit, offset, order });

    const total = await this.count({ where });
    return { count: total, rows };
  }

  static async findByPk(id, { includeProduct = false } = {}) {
    const selectProduct = includeProduct
      ? `, p.name AS product_name, p.price AS product_price, p.image AS product_image, p.stock AS product_stock`
      : '';
    const joinProduct = includeProduct ? 'LEFT JOIN products p ON p.id = r.product_id' : '';

    const [rows] = await pool.execute(
      `SELECT r.id, r.user_id, r.product_id, r.quantity, r.reservation_date, r.pickup_date, r.status, r.notes, r.created_at, r.updated_at
              ${selectProduct}
       FROM reservations r
       ${joinProduct}
       WHERE r.id = ?
       LIMIT 1;`,
      [id]
    );

    return mapRow(rows[0]);
  }

  static async count({ where = {} } = {}) {
    const conditions = [];
    const params = [];

    if (where.status) {
      conditions.push('status = ?');
      params.push(where.status);
    }

    const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [rows] = await pool.execute(`SELECT COUNT(*) AS total FROM reservations ${whereSql};`, params);
    return rows[0]?.total || 0;
  }

  static async update(id, data) {
    const updates = [];
    const params = [];

    if (data.status !== undefined) {
      updates.push('status = ?');
      params.push(data.status);
    }
    if (data.pickupDate !== undefined) {
      updates.push('pickup_date = ?');
      params.push(data.pickupDate);
    }
    if (data.notes !== undefined) {
      updates.push('notes = ?');
      params.push(data.notes);
    }

    if (updates.length === 0) {
      throw new Error('No hay datos para actualizar');
    }

    params.push(id);

    const [result] = await pool.execute(
      `UPDATE reservations SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    if (result.affectedRows === 0) {
      throw new Error('Reserva no encontrada');
    }

    return this.findByPk(id, { includeProduct: true });
  }
}

module.exports = Reservation;
