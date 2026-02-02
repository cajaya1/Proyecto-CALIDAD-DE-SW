const Review = require('../model/Review');
const Product = require('../model/Product');

class ReviewController {
  /**
   * Obtener todas las reviews de un producto
   * GET /api/reviews/product/:productId
   */
  static async getProductReviews(req, res) {
    try {
      const { productId } = req.params;
      
      // Verificar que el producto existe
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      const reviews = await Review.findByProduct(productId);
      const rating = await Review.getProductRating(productId);

      res.json({
        reviews,
        rating: {
          average: parseFloat(rating.average.toFixed(1)),
          count: rating.count
        }
      });
    } catch (error) {
      console.error('Error al obtener reviews del producto:', error);
      res.status(500).json({ error: 'Error al obtener reviews' });
    }
  }

  /**
   * Obtener las reviews de un usuario
   * GET /api/reviews/user/:userId
   */
  static async getUserReviews(req, res) {
    try {
      const { userId } = req.params;
      
      // Verificar que el usuario autenticado pueda ver sus propias reviews
      if (req.user.id !== parseInt(userId) && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'No tienes permiso para ver estas reviews' });
      }

      const reviews = await Review.findByUser(userId);
      res.json(reviews);
    } catch (error) {
      console.error('Error al obtener reviews del usuario:', error);
      res.status(500).json({ error: 'Error al obtener reviews' });
    }
  }

  /**
   * Crear una nueva review
   * POST /api/reviews
   */
  static async createReview(req, res) {
    try {
      console.log('[ReviewController] Datos recibidos:', {
        body: req.body,
        user: req.user,
        userId: req.userId
      });

      const { productId, rating, comment } = req.body;
      
      if (!req.user || !req.user.id) {
        console.error('[ReviewController] req.user no está definido');
        return res.status(401).json({ error: 'Usuario no autenticado' });
      }
      
      const userId = req.user.id;

      // Validaciones
      if (!productId || !rating) {
        return res.status(400).json({ error: 'Producto y rating son requeridos' });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'El rating debe estar entre 1 y 5' });
      }

      console.log('[ReviewController] Verificando producto...');
      // Verificar que el producto existe
      const product = await Product.findById(productId);
      console.log('[ReviewController] Producto encontrado:', product);
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      console.log('[ReviewController] Verificando si ya tiene review...');
      // Verificar si el usuario ya dejó una review para este producto
      const hasReview = await Review.userHasReview(userId, productId);
      console.log('[ReviewController] Ya tiene review:', hasReview);
      if (hasReview) {
        console.log('[ReviewController] Enviando error 400 - review duplicada');
        return res.status(400).json({ 
          error: 'Ya has dejado una reseña para este producto. Puedes editarla en su lugar.' 
        });
      }

      console.log('[ReviewController] Creando review...');
      const reviewId = await Review.create(productId, userId, rating, comment || '');
      console.log('[ReviewController] Review creada con ID:', reviewId);
      
      const review = await Review.findById(reviewId);
      console.log('[ReviewController] Review recuperada:', review);

      console.log('[ReviewController] Enviando respuesta exitosa');
      res.status(201).json({
        message: 'Review creada exitosamente',
        review
      });
    } catch (error) {
      console.error('Error al crear review:', error);
      res.status(500).json({ error: 'Error al crear review' });
    }
  }

  /**
   * Actualizar una review existente
   * PUT /api/reviews/:reviewId
   */
  static async updateReview(req, res) {
    try {
      const { reviewId } = req.params;
      const { rating, comment } = req.body;
      const userId = req.user.id;

      // Validaciones
      if (!rating) {
        return res.status(400).json({ error: 'Rating es requerido' });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'El rating debe estar entre 1 y 5' });
      }

      // Verificar que la review existe y pertenece al usuario
      const existingReview = await Review.findById(reviewId);
      if (!existingReview) {
        return res.status(404).json({ error: 'Review no encontrada' });
      }

      if (existingReview.user_id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'No tienes permiso para editar esta review' });
      }

      const success = await Review.update(reviewId, rating, comment || '');
      if (!success) {
        return res.status(500).json({ error: 'No se pudo actualizar la review' });
      }

      const updatedReview = await Review.findById(reviewId);
      res.json({
        message: 'Review actualizada exitosamente',
        review: updatedReview
      });
    } catch (error) {
      console.error('Error al actualizar review:', error);
      res.status(500).json({ error: 'Error al actualizar review' });
    }
  }

  /**
   * Eliminar una review
   * DELETE /api/reviews/:reviewId
   */
  static async deleteReview(req, res) {
    try {
      const { reviewId } = req.params;
      const userId = req.user.id;

      // Verificar que la review existe
      const review = await Review.findById(reviewId);
      if (!review) {
        return res.status(404).json({ error: 'Review no encontrada' });
      }

      // Verificar permisos
      if (review.user_id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'No tienes permiso para eliminar esta review' });
      }

      const success = await Review.delete(reviewId, userId);
      if (!success) {
        return res.status(500).json({ error: 'No se pudo eliminar la review' });
      }

      res.json({ message: 'Review eliminada exitosamente' });
    } catch (error) {
      console.error('Error al eliminar review:', error);
      res.status(500).json({ error: 'Error al eliminar review' });
    }
  }

  /**
   * Obtener estadísticas de reviews (solo admin)
   * GET /api/reviews/stats
   */
  static async getStats(req, res) {
    try {
      const stats = await Review.getStats();
      res.json(stats);
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
  }
}

module.exports = ReviewController;
