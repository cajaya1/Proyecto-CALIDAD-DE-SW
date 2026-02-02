/**
 * ISO 25022 - Métricas de Eficiencia (Efficiency)
 * Mide los recursos utilizados en relación con la efectividad lograda
 */

const axios = require('axios');

class EfficiencyMetrics {
  constructor(baseURL) {
    this.baseURL = baseURL || 'http://localhost:3000/api';
    this.results = {
      category: 'Eficiencia (Efficiency)',
      description: 'Medición de recursos utilizados en relación con la efectividad',
      metrics: []
    };
  }

  /**
   * Métrica: Tiempo de respuesta
   * Mide el tiempo promedio de respuesta de las operaciones principales
   */
  async measureResponseTime() {
    const operations = [
      { name: 'Listar productos', endpoint: '/products', method: 'GET' },
      { name: 'Obtener producto específico', endpoint: '/products/1', method: 'GET' },
      { name: 'Verificar estado de API', endpoint: '/', method: 'GET', baseURL: this.baseURL.replace('/api', '') },
      { name: 'Consultar chatbot', endpoint: '/chatbot/message', method: 'POST', data: { userMessage: 'Hola', userId: 1 } },
      { name: 'Obtener reseñas', endpoint: '/reviews/product/1', method: 'GET' }
    ];

    const responseTimes = [];

    for (const op of operations) {
      try {
        const startTime = Date.now();
        const url = op.baseURL ? `${op.baseURL}${op.endpoint}` : `${this.baseURL}${op.endpoint}`;
        
        if (op.method === 'GET') {
          await axios.get(url);
        } else if (op.method === 'POST') {
          await axios.post(url, op.data);
        }
        
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        responseTimes.push({
          operation: op.name,
          time: responseTime,
          status: responseTime < 1000 ? 'Excelente' : responseTime < 3000 ? 'Aceptable' : 'Lento'
        });
      } catch (error) {
        // Incluso si hay error (404, etc), registramos el tiempo de respuesta
        const endTime = Date.now();
        const responseTime = endTime - Date.now();
        responseTimes.push({
          operation: op.name,
          time: error.response ? responseTime : 'N/A',
          status: error.response ? 'Respondió con error' : 'Sin respuesta',
          error: error.message
        });
      }
    }

    const validTimes = responseTimes.filter(rt => typeof rt.time === 'number');
    const avgResponseTime = validTimes.length > 0 
      ? validTimes.reduce((sum, rt) => sum + rt.time, 0) / validTimes.length 
      : 0;

    this.results.metrics.push({
      name: 'Tiempo de Respuesta Promedio',
      description: 'Tiempo promedio de respuesta de operaciones principales',
      value: `${avgResponseTime.toFixed(2)} ms`,
      rawValue: avgResponseTime,
      target: '< 1000 ms',
      status: avgResponseTime < 1000 ? 'PASS' : avgResponseTime < 3000 ? 'WARN' : 'FAIL',
      details: responseTimes
    });

    return avgResponseTime;
  }

  /**
   * Métrica: Eficiencia de procesamiento
   * Mide la cantidad de operaciones completadas por unidad de tiempo
   */
  async measureProcessingEfficiency() {
    const iterations = 10;
    const startTime = Date.now();
    let successfulRequests = 0;

    for (let i = 0; i < iterations; i++) {
      try {
        const response = await axios.get(`${this.baseURL}/products`);
        if (response.status === 200) {
          successfulRequests++;
        }
      } catch (error) {
        // Continuar con el siguiente
      }
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;
    const throughput = (successfulRequests / totalTime) * 1000; // operaciones por segundo
    const successRate = (successfulRequests / iterations) * 100;

    this.results.metrics.push({
      name: 'Eficiencia de Procesamiento',
      description: 'Capacidad de procesamiento del sistema (ops/seg)',
      value: `${throughput.toFixed(2)} ops/s`,
      rawValue: throughput,
      target: '> 5 ops/s',
      status: throughput > 5 ? 'PASS' : 'FAIL',
      details: {
        totalRequests: iterations,
        successfulRequests: successfulRequests,
        totalTime: `${totalTime} ms`,
        successRate: `${successRate.toFixed(2)}%`
      }
    });

    return throughput;
  }

  /**
   * Métrica: Utilización de recursos
   * Evalúa el uso eficiente de recursos (simulado con tamaño de respuestas)
   */
  async measureResourceUtilization() {
    try {
      const response = await axios.get(`${this.baseURL}/products`);
      const responseSize = JSON.stringify(response.data).length;
      const dataCount = Array.isArray(response.data) ? response.data.length : 1;
      const avgSizePerItem = dataCount > 0 ? responseSize / dataCount : responseSize;

      this.results.metrics.push({
        name: 'Utilización de Recursos',
        description: 'Eficiencia en el uso de ancho de banda',
        value: `${avgSizePerItem.toFixed(2)} bytes/item`,
        rawValue: avgSizePerItem,
        target: '< 5000 bytes/item',
        status: avgSizePerItem < 5000 ? 'PASS' : 'WARN',
        details: {
          totalResponseSize: `${responseSize} bytes`,
          itemCount: dataCount,
          averageSizePerItem: `${avgSizePerItem.toFixed(2)} bytes`
        }
      });

      return avgSizePerItem;
    } catch (error) {
      this.results.metrics.push({
        name: 'Utilización de Recursos',
        description: 'Eficiencia en el uso de ancho de banda',
        value: 'N/A',
        rawValue: 0,
        target: '< 5000 bytes/item',
        status: 'ERROR',
        details: { error: error.message }
      });
      return 0;
    }
  }

  /**
   * Métrica: Capacidad de carga
   * Simula múltiples usuarios concurrentes
   */
  async measureLoadCapacity() {
    const concurrentUsers = 5;
    const requestsPerUser = 3;
    
    const startTime = Date.now();
    const userPromises = [];

    for (let i = 0; i < concurrentUsers; i++) {
      const userRequests = [];
      for (let j = 0; j < requestsPerUser; j++) {
        userRequests.push(
          axios.get(`${this.baseURL}/products`).catch(err => ({ error: true }))
        );
      }
      userPromises.push(Promise.all(userRequests));
    }

    const results = await Promise.all(userPromises);
    const endTime = Date.now();
    const totalTime = endTime - startTime;

    let successfulRequests = 0;
    results.forEach(userResults => {
      userResults.forEach(result => {
        if (!result.error && result.status === 200) {
          successfulRequests++;
        }
      });
    });

    const totalRequests = concurrentUsers * requestsPerUser;
    const successRate = (successfulRequests / totalRequests) * 100;
    const avgTimePerRequest = totalTime / totalRequests;

    this.results.metrics.push({
      name: 'Capacidad de Carga',
      description: 'Capacidad para manejar usuarios concurrentes',
      value: `${successRate.toFixed(2)}% éxito`,
      rawValue: successRate,
      target: '≥ 95%',
      status: successRate >= 95 ? 'PASS' : successRate >= 80 ? 'WARN' : 'FAIL',
      details: {
        concurrentUsers: concurrentUsers,
        requestsPerUser: requestsPerUser,
        totalRequests: totalRequests,
        successfulRequests: successfulRequests,
        totalTime: `${totalTime} ms`,
        avgTimePerRequest: `${avgTimePerRequest.toFixed(2)} ms`
      }
    });

    return successRate;
  }

  async runAllTests() {
    console.log('Ejecutando métricas de Eficiencia...');
    await this.measureResponseTime();
    await this.measureProcessingEfficiency();
    await this.measureResourceUtilization();
    await this.measureLoadCapacity();
    return this.results;
  }
}

module.exports = EfficiencyMetrics;
