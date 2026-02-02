const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateChatbotIntents() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  console.log('Conectado a la base de datos');

  try {
    // Modificar la columna intent para incluir los nuevos valores
    await connection.execute(`
      ALTER TABLE chatbots 
      MODIFY COLUMN intent ENUM(
        'product_inquiry',
        'order_status',
        'shipping',
        'return',
        'payment',
        'support',
        'general'
      ) DEFAULT 'general'
    `);
    
    console.log('✓ Columna intent actualizada con nuevos valores: payment, support');

    // Verificar la estructura
    const [columns] = await connection.execute(`
      SHOW COLUMNS FROM chatbots LIKE 'intent'
    `);
    
    console.log('\nEstructura de la columna intent:');
    console.log(columns[0]);

  } catch (error) {
    console.error('Error:', error.message);
  }

  await connection.end();
  console.log('\n✓ Proceso completado');
}

updateChatbotIntents().catch(console.error);
