const pool = require('./config/database');

async function testReviewSystem() {
  try {
    console.log('=== Test del Sistema de Reseñas ===\n');

    // 1. Verificar usuarios
    console.log('1. Usuarios disponibles:');
    const [users] = await pool.execute(
      'SELECT id, username, email FROM users LIMIT 5'
    );
    console.table(users);

    // 2. Verificar productos
    console.log('\n2. Productos disponibles:');
    const [products] = await pool.execute(
      'SELECT id, name FROM products LIMIT 5'
    );
    console.table(products);

    // 3. Verificar reviews existentes
    console.log('\n3. Reviews existentes:');
    const [reviews] = await pool.execute(`
      SELECT r.id, r.product_id, r.user_id, u.username, r.rating, 
             LEFT(r.comment, 50) as comment_preview
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      LIMIT 5
    `);
    console.table(reviews);

    console.log('\n✓ Consulta completada');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
}

testReviewSystem();
