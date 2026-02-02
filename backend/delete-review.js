require('dotenv').config();
const mysql = require('mysql2/promise');

async function deleteUserReview() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'rootroot',
      database: process.env.DB_NAME || 'tienda_sneakers'
    });
    
    console.log('Conectado a la base de datos');
    console.log('Eliminando reseña del usuario cajaya1 para producto 2...');
    
    const [result] = await connection.execute(
      'DELETE FROM reviews WHERE user_id = 1 AND product_id = 2'
    );
    
    console.log(`✓ Reseña eliminada. Filas afectadas: ${result.affectedRows}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (connection) await connection.end();
    process.exit(0);
  }
}

deleteUserReview();
