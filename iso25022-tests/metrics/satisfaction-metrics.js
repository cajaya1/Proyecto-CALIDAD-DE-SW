/**
 * ISO 25022 - Métricas de Satisfacción (Satisfaction)
 * Mide el grado en que se satisfacen las necesidades del usuario
 */

const axios = require('axios');

class SatisfactionMetrics {
  constructor(baseURL) {
    this.baseURL = baseURL || 'http://localhost:3000/api';
    this.results = {
      category: 'Satisfacción (Satisfaction)',
      description: 'Medición del grado de satisfacción de las necesidades del usuario',
      metrics: []
    };
  }

  /**
   * Métrica: Utilidad percibida
   * Evalúa si las funcionalidades disponibles son útiles
   */
  async measurePerceivedUsefulness() {
    const requiredFeatures = [
      { name: 'Autenticación de usuarios', endpoint: '/auth/login', method: 'POST' },
      { name: 'Catálogo de productos', endpoint: '/products', method: 'GET' },
      { name: 'Gestión de carrito', endpoint: '/cart', method: 'GET' },
      { name: 'Sistema de órdenes', endpoint: '/orders', method: 'GET' },
      { name: 'Sistema de chatbot', endpoint: '/chatbot/message', method: 'POST' },
      { name: 'Sistema de reseñas', endpoint: '/reviews/product/1', method: 'GET' }
    ];

    const availableFeatures = [];
    let featuresCount = 0;

    for (const feature of requiredFeatures) {
      try {
        // Verificamos que el endpoint exista (aunque devuelva error de auth es válido)
        await axios({
          method: feature.method,
          url: `${this.baseURL}${feature.endpoint}`,
          data: feature.method === 'POST' ? {} : undefined,
          validateStatus: (status) => status < 500 // Aceptamos errores de cliente pero no de servidor
        });
        featuresCount++;
        availableFeatures.push({ feature: feature.name, status: 'Disponible' });
      } catch (error) {
        if (error.response && error.response.status < 500) {
          featuresCount++;
          availableFeatures.push({ feature: feature.name, status: 'Disponible (requiere auth)' });
        } else {
          availableFeatures.push({ feature: feature.name, status: 'No disponible' });
        }
      }
    }

    const usefulnessScore = (featuresCount / requiredFeatures.length) * 100;

    this.results.metrics.push({
      name: 'Utilidad Percibida',
      description: 'Porcentaje de funcionalidades útiles disponibles',
      value: `${usefulnessScore.toFixed(2)}%`,
      rawValue: usefulnessScore,
      target: '≥ 90%',
      status: usefulnessScore >= 90 ? 'PASS' : 'FAIL',
      details: availableFeatures
    });

    return usefulnessScore;
  }

  /**
   * Métrica: Confiabilidad percibida
   * Mide la consistencia de las respuestas del sistema
   */
  async measurePerceivedReliability() {
    const testRuns = 5;
    const consistentResults = [];
    let consistencyCount = 0;

    for (let i = 0; i < testRuns; i++) {
      try {
        const response = await axios.get(`${this.baseURL}/products`);
        if (response.status === 200 && Array.isArray(response.data)) {
          consistencyCount++;
          consistentResults.push({ 
            run: i + 1, 
            status: 'Consistente', 
            itemCount: response.data.length 
          });
        } else {
          consistentResults.push({ 
            run: i + 1, 
            status: 'Inconsistente' 
          });
        }
      } catch (error) {
        consistentResults.push({ 
          run: i + 1, 
          status: 'Error', 
          error: error.message 
        });
      }
      // Pequeña pausa entre peticiones
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const reliabilityScore = (consistencyCount / testRuns) * 100;

    this.results.metrics.push({
      name: 'Confiabilidad Percibida',
      description: 'Consistencia de las respuestas del sistema',
      value: `${reliabilityScore.toFixed(2)}%`,
      rawValue: reliabilityScore,
      target: '100%',
      status: reliabilityScore === 100 ? 'PASS' : reliabilityScore >= 80 ? 'WARN' : 'FAIL',
      details: consistentResults
    });

    return reliabilityScore;
  }

  /**
   * Métrica: Facilidad de uso
   * Evalúa la facilidad para completar operaciones básicas
   */
  async measureEaseOfUse() {
    const basicOperations = [
      { 
        name: 'Consultar productos', 
        complexity: 1, 
        test: async () => {
          const response = await axios.get(`${this.baseURL}/products`);
          return response.status === 200;
        }
      },
      { 
        name: 'Buscar producto específico', 
        complexity: 1, 
        test: async () => {
          try {
            await axios.get(`${this.baseURL}/products/1`);
            return true;
          } catch (error) {
            return error.response && error.response.status === 404; // Esperamos 404 si no existe
          }
        }
      },
      { 
        name: 'Verificar estructura de respuesta', 
        complexity: 2, 
        test: async () => {
          const response = await axios.get(`${this.baseURL}/products`);
          return Array.isArray(response.data);
        }
      }
    ];

    let totalComplexity = 0;
    let achievedComplexity = 0;
    const operationResults = [];

    for (const op of basicOperations) {
      totalComplexity += op.complexity;
      try {
        const success = await op.test();
        if (success) {
          achievedComplexity += op.complexity;
          operationResults.push({ operation: op.name, status: 'Fácil de usar' });
        } else {
          operationResults.push({ operation: op.name, status: 'Difícil' });
        }
      } catch (error) {
        operationResults.push({ operation: op.name, status: 'Error', error: error.message });
      }
    }

    const easeOfUseScore = totalComplexity > 0 ? (achievedComplexity / totalComplexity) * 100 : 0;

    this.results.metrics.push({
      name: 'Facilidad de Uso',
      description: 'Facilidad para completar operaciones básicas',
      value: `${easeOfUseScore.toFixed(2)}%`,
      rawValue: easeOfUseScore,
      target: '≥ 85%',
      status: easeOfUseScore >= 85 ? 'PASS' : 'WARN',
      details: operationResults
    });

    return easeOfUseScore;
  }

  /**
   * Métrica: Completitud de información
   * Evalúa si la información proporcionada es completa
   */
  async measureInformationCompleteness() {
    try {
      const response = await axios.get(`${this.baseURL}/products`);
      if (!Array.isArray(response.data) || response.data.length === 0) {
        this.results.metrics.push({
          name: 'Completitud de Información',
          description: 'Evaluación de la completitud de datos proporcionados',
          value: '0%',
          rawValue: 0,
          target: '≥ 80%',
          status: 'FAIL',
          details: { error: 'No hay productos disponibles para evaluar' }
        });
        return 0;
      }

      const requiredFields = ['id', 'name', 'price', 'description'];
      const optionalFields = ['image', 'category', 'brand', 'stock'];
      const allFields = [...requiredFields, ...optionalFields];

      const sample = response.data[0];
      let presentFields = 0;
      const fieldAnalysis = [];

      allFields.forEach(field => {
        const isPresent = sample.hasOwnProperty(field) && sample[field] !== null && sample[field] !== '';
        const isRequired = requiredFields.includes(field);
        
        if (isPresent) presentFields++;
        
        fieldAnalysis.push({
          field: field,
          type: isRequired ? 'Requerido' : 'Opcional',
          status: isPresent ? 'Presente' : 'Ausente'
        });
      });

      const completenessScore = (presentFields / allFields.length) * 100;

      this.results.metrics.push({
        name: 'Completitud de Información',
        description: 'Evaluación de la completitud de datos proporcionados',
        value: `${completenessScore.toFixed(2)}%`,
        rawValue: completenessScore,
        target: '≥ 80%',
        status: completenessScore >= 80 ? 'PASS' : completenessScore >= 60 ? 'WARN' : 'FAIL',
        details: fieldAnalysis
      });

      return completenessScore;
    } catch (error) {
      this.results.metrics.push({
        name: 'Completitud de Información',
        description: 'Evaluación de la completitud de datos proporcionados',
        value: 'N/A',
        rawValue: 0,
        target: '≥ 80%',
        status: 'ERROR',
        details: { error: error.message }
      });
      return 0;
    }
  }

  async runAllTests() {
    console.log('Ejecutando métricas de Satisfacción...');
    await this.measurePerceivedUsefulness();
    await this.measurePerceivedReliability();
    await this.measureEaseOfUse();
    await this.measureInformationCompleteness();
    return this.results;
  }
}

module.exports = SatisfactionMetrics;
