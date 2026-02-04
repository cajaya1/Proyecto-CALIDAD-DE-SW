const pool = require('../config/database');

class Chatbot {
  static async create({ userId = null, userMessage, botResponse, intent = 'general', resolved = false }) {
    const [result] = await pool.execute(
      `INSERT INTO chatbots (user_id, user_message, bot_response, intent, resolved)
       VALUES (?, ?, ?, ?, ?);`,
      [userId, userMessage, botResponse, intent, resolved]
    );

    const insertedId = result.insertId;
    return this.findByPk(insertedId);
  }

  static async findAll({ where = {}, order = [['createdAt', 'DESC']], limit = 100 } = {}) {
    const conditions = [];
    const params = [];

    if (where.userId) {
      conditions.push('user_id = ?');
      params.push(where.userId);
    }
    if (where.resolved !== undefined) {
      conditions.push('resolved = ?');
      params.push(where.resolved);
    }

    const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    // Support order by createdAt DESC/ASC
    const direction = order?.[0]?.[1]?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const [rows] = await pool.execute(
      `SELECT id, user_id AS userId, user_message AS userMessage, bot_response AS botResponse, intent, resolved, created_at AS createdAt
       FROM chatbots
       ${whereSql}
       ORDER BY created_at ${direction}
       LIMIT ?;`,
      [...params, limit]
    );
    return rows;
  }

  static async findByPk(id) {
    const [rows] = await pool.execute(
      `SELECT id, user_id AS userId, user_message AS userMessage, bot_response AS botResponse, intent, resolved, created_at AS createdAt
       FROM chatbots WHERE id = ? LIMIT 1;`,
      [id]
    );
    return rows[0] || null;
  }

  static async count({ where = {} } = {}) {
    const conditions = [];
    const params = [];

    if (where.resolved !== undefined) {
      conditions.push('resolved = ?');
      params.push(where.resolved);
    }

    const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [rows] = await pool.execute(
      `SELECT COUNT(*) AS total FROM chatbots ${whereSql};`,
      params
    );
    return rows[0]?.total || 0;
  }

  static async update(id, data) {
    const updates = [];
    const params = [];

    if (data.resolved !== undefined) {
      updates.push('resolved = ?');
      params.push(data.resolved);
    }
    if (data.intent !== undefined) {
      updates.push('intent = ?');
      params.push(data.intent);
    }

    if (updates.length === 0) {
      throw new Error('No hay datos para actualizar');
    }

    params.push(id);

    const [result] = await pool.execute(
      `UPDATE chatbots SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    if (result.affectedRows === 0) {
      throw new Error('Mensaje no encontrado');
    }

    return this.findByPk(id);
  }
}

module.exports = Chatbot;
