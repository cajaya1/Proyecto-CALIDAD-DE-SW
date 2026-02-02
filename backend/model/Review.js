const pool = require('../config/database');

class Review {
  /**
   * Obtener todas las reviews de un producto con información del usuario
   * @param {number} productId 
   * @returns {Promise<Array>}
   */
  static async findByProduct(productId) {
    const [rows] = await pool.execute(
      `SELECT r.*, u.username 
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC`,
      [productId]
    );
    return rows;
  }

  /**
   * Obtener promedio de rating y cantidad de reviews de un producto
   * @param {number} productId 
   * @returns {Promise<{average: number, count: number}>}
   */
  static async getProductRating(productId) {
    const [rows] = await pool.execute(
      `SELECT 
        COALESCE(AVG(rating), 0) as average,
        COUNT(*) as count
       FROM reviews
       WHERE product_id = ?`,
      [productId]
    );
    return {
      average: parseFloat(rows[0].average) || 0,
      count: rows[0].count || 0
    };
  }

  /**
   * Obtener todas las reviews de un usuario
   * @param {number} userId 
   * @returns {Promise<Array>}
   */
  static async findByUser(userId) {
    const [rows] = await pool.execute(
      `SELECT r.*, p.name as product_name, p.image as product_image
       FROM reviews r
       JOIN products p ON r.product_id = p.id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`,
      [userId]
    );
    return rows;
  }

  /**
   * Verificar si un usuario ya dejó review para un producto
   * @param {number} userId 
   * @param {number} productId 
   * @returns {Promise<boolean>}
   */
  static async userHasReview(userId, productId) {
    const [rows] = await pool.execute(
      'SELECT id FROM reviews WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    return rows.length > 0;
  }

  /**
   * Crear una nueva review
   * @param {number} productId 
   * @param {number} userId 
   * @param {number} rating 
   * @param {string} comment 
   * @returns {Promise<number>} ID de la review creada
   */
  static async create(productId, userId, rating, comment) {
    const [result] = await pool.execute(
      `INSERT INTO reviews (product_id, user_id, rating, comment)
       VALUES (?, ?, ?, ?)`,
      [productId, userId, rating, comment]
    );
    return result.insertId;
  }

  /**
   * Actualizar una review existente
   * @param {number} reviewId 
   * @param {number} rating 
   * @param {string} comment 
   * @returns {Promise<boolean>}
   */
  static async update(reviewId, rating, comment) {
    const [result] = await pool.execute(
      `UPDATE reviews 
       SET rating = ?, comment = ?
       WHERE id = ?`,
      [rating, comment, reviewId]
    );
    return result.affectedRows > 0;
  }

  /**
   * Eliminar una review
   * @param {number} reviewId 
   * @param {number} userId 
   * @returns {Promise<boolean>}
   */
  static async delete(reviewId, userId) {
    const [result] = await pool.execute(
      'DELETE FROM reviews WHERE id = ? AND user_id = ?',
      [reviewId, userId]
    );
    return result.affectedRows > 0;
  }

  /**
   * Obtener una review por ID
   * @param {number} reviewId 
   * @returns {Promise<Object|null>}
   */
  static async findById(reviewId) {
    const [rows] = await pool.execute(
      `SELECT r.*, u.username, p.name as product_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       JOIN products p ON r.product_id = p.id
       WHERE r.id = ?`,
      [reviewId]
    );
    return rows[0] || null;
  }

  /**
   * Obtener estadísticas generales de reviews
   * @returns {Promise<Object>}
   */
  static async getStats() {
    const [rows] = await pool.execute(
      `SELECT 
        COUNT(*) as total_reviews,
        AVG(rating) as average_rating,
        COUNT(DISTINCT user_id) as total_reviewers,
        COUNT(DISTINCT product_id) as products_with_reviews
       FROM reviews`
    );
    return rows[0];
  }
}

module.exports = Review;
