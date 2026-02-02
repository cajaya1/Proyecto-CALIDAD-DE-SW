/**
 * ISO 25022 - Métricas de Ausencia de Riesgo (Freedom from Risk)
 * Mide el grado en que el sistema mitiga riesgos potenciales
 */

const axios = require('axios');

class FreedomFromRiskMetrics {
  constructor(baseURL) {
    this.baseURL = baseURL || 'http://localhost:3000/api';
    this.results = {
      category: 'Ausencia de Riesgo (Freedom from Risk)',
      description: 'Medición del grado de mitigación de riesgos potenciales',
      metrics: []
    };
  }

  /**
   * Métrica: Seguridad de autenticación
   * Evalúa la protección de endpoints que requieren autenticación
   */
  async measureAuthenticationSecurity() {
    const protectedEndpoints = [
      { name: 'Carrito', endpoint: '/cart' },
      { name: 'Órdenes', endpoint: '/orders' },
      { name: 'Crear orden', endpoint: '/orders', method: 'POST' },
      { name: 'Perfil de usuario', endpoint: '/auth/profile' },
      { name: 'Historial de chat', endpoint: '/chatbot/history/1' }
    ];

    let securedEndpoints = 0;
    const securityResults = [];

    for (const endpoint of protectedEndpoints) {
      try {
        const method = endpoint.method || 'GET';
        const response = await axios({
          method: method,
          url: `${this.baseURL}${endpoint.endpoint}`,
          data: method === 'POST' ? {} : undefined,
          validateStatus: () => true // Aceptamos cualquier código de estado
        });

        // Si devuelve 401 (no autorizado), el endpoint está protegido correctamente
        if (response.status === 401) {
          securedEndpoints++;
          securityResults.push({ 
            endpoint: endpoint.name, 
            status: 'Protegido correctamente',
            code: 401
          });
        } else if (response.status === 200) {
          securityResults.push({ 
            endpoint: endpoint.name, 
            status: 'Vulnerable - no requiere autenticación',
            code: 200
          });
        } else {
          securityResults.push({ 
            endpoint: endpoint.name, 
            status: `Código inesperado: ${response.status}`,
            code: response.status
          });
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          securedEndpoints++;
          securityResults.push({ 
            endpoint: endpoint.name, 
            status: 'Protegido correctamente',
            code: 401
          });
        } else {
          securityResults.push({ 
            endpoint: endpoint.name, 
            status: 'Error en verificación',
            error: error.message
          });
        }
      }
    }

    const securityScore = (securedEndpoints / protectedEndpoints.length) * 100;

    this.results.metrics.push({
      name: 'Seguridad de Autenticación',
      description: 'Protección de endpoints que requieren autenticación',
      value: `${securityScore.toFixed(2)}%`,
      rawValue: securityScore,
      target: '100%',
      status: securityScore === 100 ? 'PASS' : securityScore >= 80 ? 'WARN' : 'FAIL',
      details: securityResults
    });

    return securityScore;
  }

  /**
   * Métrica: Validación de entrada
   * Evalúa la validación de datos de entrada
   */
  async measureInputValidation() {
    const validationTests = [
      {
        name: 'Email inválido en registro',
        test: async () => {
          try {
            await axios.post(`${this.baseURL}/auth/register`, {
              username: 'Test',
              email: 'invalid-email',
              password: '12345'
            });
            return { validated: false, reason: 'Acepta email inválido' };
          } catch (error) {
            if (error.response && error.response.status === 400) {
              return { validated: true, reason: 'Rechaza email inválido' };
            }
            return { validated: false, reason: 'Error inesperado' };
          }
        }
      },
      {
        name: 'Datos incompletos en registro',
        test: async () => {
          try {
            await axios.post(`${this.baseURL}/auth/register`, {
              email: 'test@test.com'
            });
            return { validated: false, reason: 'Acepta datos incompletos' };
          } catch (error) {
            if (error.response && error.response.status === 400) {
              return { validated: true, reason: 'Rechaza datos incompletos' };
            }
            return { validated: false, reason: 'Error inesperado' };
          }
        }
      },
      {
        name: 'SQL Injection básica',
        test: async () => {
          try {
            await axios.post(`${this.baseURL}/auth/login`, {
              email: "admin' OR '1'='1",
              password: "anything"
            });
            return { validated: false, reason: 'Vulnerable a SQL injection' };
          } catch (error) {
            if (error.response && (error.response.status === 400 || error.response.status === 401)) {
              return { validated: true, reason: 'Protegido contra SQL injection básico' };
            }
            return { validated: true, reason: 'Protegido' };
          }
        }
      }
    ];

    let passedValidations = 0;
    const validationResults = [];

    for (const test of validationTests) {
      const result = await test.test();
      if (result.validated) passedValidations++;
      validationResults.push({
        test: test.name,
        status: result.validated ? 'Protegido' : 'Vulnerable',
        details: result.reason
      });
    }

    const validationScore = (passedValidations / validationTests.length) * 100;

    this.results.metrics.push({
      name: 'Validación de Entrada',
      description: 'Validación y sanitización de datos de entrada',
      value: `${validationScore.toFixed(2)}%`,
      rawValue: validationScore,
      target: '≥ 80%',
      status: validationScore >= 80 ? 'PASS' : validationScore >= 60 ? 'WARN' : 'FAIL',
      details: validationResults
    });

    return validationScore;
  }

  /**
   * Métrica: Manejo de errores
   * Evalúa cómo el sistema maneja errores sin exponer información sensible
   */
  async measureErrorHandling() {
    const errorTests = [
      {
        name: 'Endpoint inexistente',
        test: async () => {
          try {
            const response = await axios.get(`${this.baseURL}/nonexistent`, {
              validateStatus: () => true
            });
            // Debe devolver 404, no 500
            return { 
              safe: response.status === 404,
              status: response.status,
              exposesSensitiveInfo: this.checkSensitiveInfo(response.data)
            };
          } catch (error) {
            return { 
              safe: false, 
              status: 'error',
              reason: 'Error no manejado' 
            };
          }
        }
      },
      {
        name: 'ID de producto inválido',
        test: async () => {
          try {
            const response = await axios.get(`${this.baseURL}/products/invalid-id`, {
              validateStatus: () => true
            });
            return { 
              safe: response.status >= 400 && response.status < 500,
              status: response.status,
              exposesSensitiveInfo: this.checkSensitiveInfo(response.data)
            };
          } catch (error) {
            return { 
              safe: true, 
              status: 'handled',
              reason: 'Error manejado' 
            };
          }
        }
      }
    ];

    let safeErrorHandling = 0;
    const errorResults = [];

    for (const test of errorTests) {
      const result = await test.test();
      if (result.safe && !result.exposesSensitiveInfo) safeErrorHandling++;
      
      errorResults.push({
        test: test.name,
        status: result.safe ? 'Seguro' : 'Inseguro',
        httpStatus: result.status,
        exposeInfo: result.exposesSensitiveInfo ? 'Sí' : 'No'
      });
    }

    const errorHandlingScore = (safeErrorHandling / errorTests.length) * 100;

    this.results.metrics.push({
      name: 'Manejo de Errores',
      description: 'Manejo seguro de errores sin exponer información sensible',
      value: `${errorHandlingScore.toFixed(2)}%`,
      rawValue: errorHandlingScore,
      target: '100%',
      status: errorHandlingScore === 100 ? 'PASS' : errorHandlingScore >= 75 ? 'WARN' : 'FAIL',
      details: errorResults
    });

    return errorHandlingScore;
  }

  /**
   * Métrica: Disponibilidad del sistema
   * Evalúa la disponibilidad del sistema ante múltiples peticiones
   */
  async measureSystemAvailability() {
    const attempts = 10;
    let successfulAttempts = 0;
    const availabilityResults = [];

    for (let i = 0; i < attempts; i++) {
      try {
        const startTime = Date.now();
        const response = await axios.get(`${this.baseURL.replace('/api', '')}/`);
        const endTime = Date.now();
        
        if (response.status === 200) {
          successfulAttempts++;
          availabilityResults.push({
            attempt: i + 1,
            status: 'Disponible',
            responseTime: `${endTime - startTime} ms`
          });
        } else {
          availabilityResults.push({
            attempt: i + 1,
            status: 'No disponible',
            httpStatus: response.status
          });
        }
      } catch (error) {
        availabilityResults.push({
          attempt: i + 1,
          status: 'Error',
          error: error.message
        });
      }
      
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    const availabilityScore = (successfulAttempts / attempts) * 100;

    this.results.metrics.push({
      name: 'Disponibilidad del Sistema',
      description: 'Disponibilidad del sistema ante múltiples peticiones',
      value: `${availabilityScore.toFixed(2)}%`,
      rawValue: availabilityScore,
      target: '≥ 99%',
      status: availabilityScore >= 99 ? 'PASS' : availabilityScore >= 95 ? 'WARN' : 'FAIL',
      details: {
        totalAttempts: attempts,
        successfulAttempts: successfulAttempts,
        samples: availabilityResults.slice(0, 5) // Mostrar solo primeras 5 muestras
      }
    });

    return availabilityScore;
  }

  checkSensitiveInfo(data) {
    if (typeof data !== 'string') {
      data = JSON.stringify(data);
    }
    
    const sensitivePatterns = [
      /password/i,
      /secret/i,
      /token/i,
      /key/i,
      /stack trace/i,
      /Error:/i
    ];

    return sensitivePatterns.some(pattern => pattern.test(data));
  }

  async runAllTests() {
    console.log('Ejecutando métricas de Ausencia de Riesgo...');
    await this.measureAuthenticationSecurity();
    await this.measureInputValidation();
    await this.measureErrorHandling();
    await this.measureSystemAvailability();
    return this.results;
  }
}

module.exports = FreedomFromRiskMetrics;
