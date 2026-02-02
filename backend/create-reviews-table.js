const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

async function createReviewsTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
  });

  console.log('Conectado a la base de datos');

  try {
    // Crear tabla
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        user_id INT NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_reviews_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_product_review (user_id, product_id)
      ) ENGINE=InnoDB
    `);
    console.log('✓ Tabla reviews creada');

    // Crear índices (intentar, ignorar si ya existen)
    try {
      await connection.execute('CREATE INDEX idx_product_id ON reviews(product_id)');
      console.log('✓ Índice idx_product_id creado');
    } catch (e) {
      console.log('→ Índice idx_product_id ya existe');
    }
    
    try {
      await connection.execute('CREATE INDEX idx_user_id ON reviews(user_id)');
      console.log('✓ Índice idx_user_id creado');
    } catch (e) {
      console.log('→ Índice idx_user_id ya existe');
    }
    
    try {
      await connection.execute('CREATE INDEX idx_rating ON reviews(rating)');
      console.log('✓ Índice idx_rating creado');
    } catch (e) {
      console.log('→ Índice idx_rating ya existe');
    }

    // Insertar algunas reviews de ejemplo
    const [users] = await connection.execute('SELECT id FROM users LIMIT 2');
    if (users.length > 0) {
      const userId = users[0].id;
      
      await connection.execute(`
        INSERT INTO reviews (product_id, user_id, rating, comment) VALUES
        (1, ?, 5, 'Excelentes zapatillas, muy cómodas y el diseño es increíble'),
        (2, ?, 4, 'Muy buena calidad, aunque un poco caras'),
        (3, ?, 5, 'Me encantaron! Super estilo y comodidad')
        ON DUPLICATE KEY UPDATE rating=rating
      `, [userId, userId, userId]);
      
      console.log('✓ Reviews de ejemplo insertadas');
    }

    // Mostrar reviews
    const [reviews] = await connection.execute(`
      SELECT r.*, u.username, p.name as product_name 
      FROM reviews r 
      JOIN users u ON r.user_id = u.id 
      JOIN products p ON r.product_id = p.id
    `);
    console.log('\nReviews en la base de datos:');
    console.table(reviews);

  } catch (error) {
    console.error('Error:', error.message);
  }

  await connection.end();
  console.log('\n✓ Proceso completado');
}

createReviewsTable().catch(console.error);
