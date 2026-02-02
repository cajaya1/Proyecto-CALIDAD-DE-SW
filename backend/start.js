#!/usr/bin/env node

require('dotenv').config();

try {
  console.log('1. Environment:', {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME,
    NODE_ENV: process.env.NODE_ENV
  });

  console.log('2. Loading app...');
  const app = require('./app');
  
  console.log('3. Starting server...');
  const PORT = process.env.PORT || 3000;
  
  const server = app.listen(PORT, () => {
    console.log(`✓ Servidor corriendo en puerto ${PORT}`);
  });

  // Handle unhandled rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
  });

} catch (error) {
  console.error('Fatal error:', error.message);
  console.error(error.stack);
  process.exit(1);
}
