// Load environment variables from backend/.env
require('dotenv').config({ path: './backend/.env' });
const pool = require('./backend/config/database');

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('DB config:', {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });
    
    // Test simple query
    const [rows] = await pool.execute('SELECT 1 as test');
    console.log('✓ Database connected:', rows);
    
    // Check if chatbots table exists
    const [tables] = await pool.execute("SHOW TABLES LIKE 'chatbots'");
    if (tables.length === 0) {
      console.log('✗ Table "chatbots" does not exist');
      console.log('\nCreating table...');
      
      await pool.execute(`
        CREATE TABLE IF NOT EXISTS chatbots (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NULL,
          user_message TEXT NOT NULL,
          bot_response TEXT NOT NULL,
          intent ENUM('product_inquiry','order_status','shipping','return','general') DEFAULT 'general',
          resolved TINYINT(1) NOT NULL DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✓ Table created');
    } else {
      console.log('✓ Table "chatbots" exists');
    }
    
    // List sample products to verify seeding
    try {
      const [products] = await pool.execute(
        'SELECT id, name, price, stock, category FROM products ORDER BY created_at DESC LIMIT 5'
      );
      console.log('Products sample:', products);
    } catch (e) {
      console.warn('Products query failed (table may not exist yet):', e.message);
    }

    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

testConnection();
