/**
 * Generador de Reportes HTML para ISO 25022
 * Genera un reporte visual en formato HTML con los resultados de las métricas
 */

const fs = require('fs');
const path = require('path');

class HTMLReportGenerator {
  constructor() {
    this.reportData = {
      timestamp: new Date().toISOString(),
      projectName: 'Tennis Store - Tienda de Sneakers Online (Actualizado 2026)',
      summary: {
        totalMetrics: 0,
        passedMetrics: 0,
        warnedMetrics: 0,
        failedMetrics: 0,
        errorMetrics: 0
      },
      categories: []
    };
  }

  addCategory(categoryResults) {
    this.reportData.categories.push(categoryResults);
    
    // Actualizar resumen
    categoryResults.metrics.forEach(metric => {
      this.reportData.summary.totalMetrics++;
      switch (metric.status) {
        case 'PASS':
          this.reportData.summary.passedMetrics++;
          break;
        case 'WARN':
          this.reportData.summary.warnedMetrics++;
          break;
        case 'FAIL':
          this.reportData.summary.failedMetrics++;
          break;
        case 'ERROR':
          this.reportData.summary.errorMetrics++;
          break;
      }
    });
  }

  generateHTML() {
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte ISO 25022 - ${this.reportData.projectName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }

        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        }

        .header .subtitle {
            font-size: 1.2em;
            opacity: 0.9;
            margin-bottom: 20px;
        }

        .header .timestamp {
            font-size: 0.9em;
            opacity: 0.8;
            font-style: italic;
        }

        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 40px;
            background: #f8f9fa;
        }

        .summary-card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
        }

        .summary-card:hover {
            transform: translateY(-5px);
        }

        .summary-card .number {
            font-size: 3em;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .summary-card .label {
            font-size: 0.9em;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .summary-card.total .number { color: #667eea; }
        .summary-card.pass .number { color: #10b981; }
        .summary-card.warn .number { color: #f59e0b; }
        .summary-card.fail .number { color: #ef4444; }
        .summary-card.error .number { color: #8b5cf6; }

        .content {
            padding: 40px;
        }

        .category {
            margin-bottom: 50px;
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .category-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            font-size: 1.5em;
            font-weight: bold;
        }

        .category-description {
            padding: 20px 25px;
            background: #f8f9fa;
            color: #666;
            font-style: italic;
            border-bottom: 2px solid #e5e7eb;
        }

        .metrics {
            padding: 25px;
        }

        .metric {
            background: #f9fafb;
            border-left: 5px solid #667eea;
            border-radius: 10px;
            padding: 25px;
            margin-bottom: 25px;
            transition: all 0.3s ease;
        }

        .metric:hover {
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            transform: translateX(5px);
        }

        .metric.pass { border-left-color: #10b981; background: #f0fdf4; }
        .metric.warn { border-left-color: #f59e0b; background: #fffbeb; }
        .metric.fail { border-left-color: #ef4444; background: #fef2f2; }
        .metric.error { border-left-color: #8b5cf6; background: #faf5ff; }

        .metric-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .metric-name {
            font-size: 1.3em;
            font-weight: bold;
            color: #1f2937;
        }

        .metric-status {
            padding: 8px 20px;
            border-radius: 25px;
            font-weight: bold;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .metric-status.pass {
            background: #10b981;
            color: white;
        }

        .metric-status.warn {
            background: #f59e0b;
            color: white;
        }

        .metric-status.fail {
            background: #ef4444;
            color: white;
        }

        .metric-status.error {
            background: #8b5cf6;
            color: white;
        }

        .metric-description {
            color: #6b7280;
            margin-bottom: 15px;
            font-size: 0.95em;
        }

        .metric-values {
            display: flex;
            gap: 30px;
            margin-bottom: 15px;
            flex-wrap: wrap;
        }

        .metric-value {
            display: flex;
            flex-direction: column;
        }

        .metric-value .label {
            font-size: 0.85em;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }

        .metric-value .value {
            font-size: 1.5em;
            font-weight: bold;
            color: #1f2937;
        }

        .metric-details {
            margin-top: 20px;
            padding: 20px;
            background: white;
            border-radius: 10px;
            border: 1px solid #e5e7eb;
        }

        .metric-details h4 {
            color: #374151;
            margin-bottom: 15px;
            font-size: 1.1em;
        }

        .detail-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.9em;
        }

        .detail-table th {
            background: #f3f4f6;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            color: #374151;
            border-bottom: 2px solid #e5e7eb;
        }

        .detail-table td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
            color: #4b5563;
        }

        .detail-table tr:last-child td {
            border-bottom: none;
        }

        .detail-table tr:hover {
            background: #f9fafb;
        }

        .detail-item {
            margin-bottom: 10px;
            padding: 10px;
            background: #f9fafb;
            border-radius: 5px;
        }

        .detail-item strong {
            color: #374151;
        }

        .footer {
            background: #1f2937;
            color: white;
            text-align: center;
            padding: 30px;
            font-size: 0.9em;
        }

        .footer a {
            color: #667eea;
            text-decoration: none;
        }

        .footer a:hover {
            text-decoration: underline;
        }

        .score-gauge {
            display: inline-block;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: conic-gradient(
                #10b981 0deg,
                #10b981 calc(var(--score) * 3.6deg),
                #e5e7eb calc(var(--score) * 3.6deg),
                #e5e7eb 360deg
            );
            position: relative;
            margin: 10px;
        }

        .score-gauge::before {
            content: attr(data-score) '%';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 1.2em;
        }

        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .container {
                box-shadow: none;
            }
            
            .metric:hover {
                transform: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Reporte ISO 25022</h1>
            <div class="subtitle">Métricas de Calidad en Uso del Software</div>
            <div class="subtitle">${this.reportData.projectName}</div>
            <div class="timestamp">Generado: ${new Date(this.reportData.timestamp).toLocaleString('es-ES')}</div>
        </div>

        <div class="summary">
            <div class="summary-card total">
                <div class="number">${this.reportData.summary.totalMetrics}</div>
                <div class="label">Total Métricas</div>
            </div>
            <div class="summary-card pass">
                <div class="number">${this.reportData.summary.passedMetrics}</div>
                <div class="label">Aprobadas</div>
            </div>
            <div class="summary-card warn">
                <div class="number">${this.reportData.summary.warnedMetrics}</div>
                <div class="label">Advertencias</div>
            </div>
            <div class="summary-card fail">
                <div class="number">${this.reportData.summary.failedMetrics}</div>
                <div class="label">Fallidas</div>
            </div>
            <div class="summary-card error">
                <div class="number">${this.reportData.summary.errorMetrics}</div>
                <div class="label">Errores</div>
            </div>
        </div>

        <div class="content">
            ${this.generateCategoriesHTML()}
        </div>

        <div class="footer">
            <p><strong>ISO/IEC 25022:2016</strong> - Measurement of quality in use</p>
            <p>Estándar internacional para la medición de calidad en uso de productos de software</p>
            <p style="margin-top: 10px; opacity: 0.8;">
                Categorías evaluadas: Efectividad, Eficiencia, Satisfacción, Ausencia de Riesgo
            </p>
        </div>
    </div>
</body>
</html>`;

    return html;
  }

  generateCategoriesHTML() {
    return this.reportData.categories.map(category => `
      <div class="category">
        <div class="category-header">
          ${this.getCategoryIcon(category.category)} ${category.category}
        </div>
        <div class="category-description">
          ${category.description}
        </div>
        <div class="metrics">
          ${this.generateMetricsHTML(category.metrics)}
        </div>
      </div>
    `).join('');
  }

  generateMetricsHTML(metrics) {
    return metrics.map(metric => `
      <div class="metric ${metric.status.toLowerCase()}">
        <div class="metric-header">
          <div class="metric-name">${metric.name}</div>
          <div class="metric-status ${metric.status.toLowerCase()}">${metric.status}</div>
        </div>
        <div class="metric-description">${metric.description}</div>
        <div class="metric-values">
          <div class="metric-value">
            <div class="label">Valor Obtenido</div>
            <div class="value">${metric.value}</div>
          </div>
          <div class="metric-value">
            <div class="label">Objetivo</div>
            <div class="value">${metric.target}</div>
          </div>
        </div>
        ${this.generateDetailsHTML(metric.details)}
      </div>
    `).join('');
  }

  generateDetailsHTML(details) {
    if (!details) return '';

    if (Array.isArray(details)) {
      if (details.length === 0) return '';
      
      // Determinar si es una tabla
      const firstItem = details[0];
      if (typeof firstItem === 'object' && !Array.isArray(firstItem)) {
        const keys = Object.keys(firstItem);
        return `
          <div class="metric-details">
            <h4>Detalles:</h4>
            <table class="detail-table">
              <thead>
                <tr>
                  ${keys.map(key => `<th>${this.formatKey(key)}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${details.map(item => `
                  <tr>
                    ${keys.map(key => `<td>${this.formatValue(item[key])}</td>`).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
      }
    } else if (typeof details === 'object') {
      return `
        <div class="metric-details">
          <h4>Detalles:</h4>
          ${Object.entries(details).map(([key, value]) => `
            <div class="detail-item">
              <strong>${this.formatKey(key)}:</strong> ${this.formatValue(value)}
            </div>
          `).join('')}
        </div>
      `;
    }

    return '';
  }

  formatKey(key) {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  formatValue(value) {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  getCategoryIcon(category) {
    const icons = {
      'Efectividad (Effectiveness)': '🎯',
      'Eficiencia (Efficiency)': '⚡',
      'Satisfacción (Satisfaction)': '😊',
      'Ausencia de Riesgo (Freedom from Risk)': '🛡️'
    };
    return icons[category] || '📊';
  }

  saveReport(outputPath) {
    const html = this.generateHTML();
    
    // Crear directorio si no existe
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, html, 'utf8');
    console.log(`✅ Reporte generado: ${outputPath}`);
    return outputPath;
  }
}

module.exports = HTMLReportGenerator;
