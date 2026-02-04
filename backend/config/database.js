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

// Soporte para Cloud SQL (Unix socket) en Cloud Run
const socketPath = process.env.DB_SOCKET_PATH ||
  (process.env.CLOUD_SQL_CONNECTION_NAME
    ? `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`
    : null);

if (process.env.DATABASE_URL) {
  // Si hay una URI completa, parsearla
  const parsedUrl = parseDbUrl(process.env.DATABASE_URL);
  dbConfig = {
    ...parsedUrl,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
  if (socketPath) {
    delete dbConfig.host;
    delete dbConfig.port;
    dbConfig.socketPath = socketPath;
  }
} else {
  // Si no hay URI, usar variables individuales (para desarrollo local o Cloud SQL)
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
  if (socketPath) {
    delete dbConfig.host;
    delete dbConfig.port;
    dbConfig.socketPath = socketPath;
  }
}

const pool = mysql.createPool(dbConfig);

module.exports = pool;
