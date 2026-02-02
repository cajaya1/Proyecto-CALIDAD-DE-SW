// test-server.js - Script para probar el servidor sin BD
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    status: '✅ OK',
    message: 'Servidor backend funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Endpoint de salud
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Simulación de productos (sin BD)
app.get('/api/products', (req, res) => {
  const products = [
    { id: 1, name: 'Nike Air Max 90', price: 129.99, stock: 20, category: 'running' },
    { id: 2, name: 'Adidas Ultraboost', price: 179.99, stock: 15, category: 'running' },
    { id: 3, name: 'Puma RS-X', price: 99.99, stock: 30, category: 'casual' },
    { id: 4, name: 'New Balance 574', price: 89.99, stock: 25, category: 'casual' }
  ];
  res.json(products);
});

// Simulación de chatbot
app.post('/api/chatbot/message', (req, res) => {
  const { userMessage } = req.body;
  
  const response = {
    success: true,
    data: {
      id: Date.now(),
      userMessage: userMessage,
      botResponse: '¡Hola! Gracias por tu mensaje. Esta es una respuesta de prueba del chatbot.',
      intent: 'general',
      createdAt: new Date()
    }
  };
  
  res.status(201).json(response);
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log('');
  console.log('════════════════════════════════════════════════════');
  console.log('🚀 Servidor de Prueba Iniciado');
  console.log('════════════════════════════════════════════════════');
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
  console.log(`🛍️  Productos: http://localhost:${PORT}/api/products`);
  console.log(`💬 Chatbot: http://localhost:${PORT}/api/chatbot/message`);
  console.log('════════════════════════════════════════════════════');
  console.log('');
  console.log('✅ El servidor está funcionando correctamente');
  console.log('⚠️  Nota: Usando datos de prueba (sin base de datos)');
  console.log('');
  console.log('Presiona Ctrl+C para detener el servidor');
  console.log('');
});

// Manejo de cierre graceful
process.on('SIGINT', () => {
  console.log('\n\n🛑 Deteniendo servidor...');
  server.close(() => {
    console.log('✅ Servidor detenido correctamente');
    process.exit(0);
  });
});

module.exports = app;
