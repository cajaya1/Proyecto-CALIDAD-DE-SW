const mysql = require('mysql2/promise');

// Función para parsear la URI de MySQL
function parseDbUrl(url) {
  const match = url.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (match) {
    return {
      user: match[1],
      password: match[2],
      host: match[3],
      port: parseInt(match[4]),
      database: match[5]
    };
  }
  return null;
}

// Configuración de la base de datos
let dbConfig;

if (process.env.DATABASE_URL) {
  // Si hay una URI completa, parsearla
  const parsedUrl = parseDbUrl(process.env.DATABASE_URL);
  dbConfig = {
    ...parsedUrl,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
} else {
  // Si no hay URI, usar variables individuales (para desarrollo local)
  dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tennis_store',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
}

const pool = mysql.createPool(dbConfig);

module.exports = pool;
