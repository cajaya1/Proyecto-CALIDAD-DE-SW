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

    this.historyRuns = [];
  }

  setHistory(runs) {
    this.historyRuns = Array.isArray(runs) ? runs : [];
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

          .history {
            margin-bottom: 50px;
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .history-header {
            background: linear-gradient(135deg, #111827 0%, #374151 100%);
            color: white;
            padding: 22px 25px;
            font-size: 1.2em;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
          }

          .history-header small {
            font-weight: 500;
            opacity: 0.85;
          }

          .history-body {
            padding: 20px 25px;
          }

          .history-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.92em;
          }

          .history-table th {
            background: #f3f4f6;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            color: #374151;
            border-bottom: 2px solid #e5e7eb;
            white-space: nowrap;
          }

          .history-table td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
            color: #4b5563;
          }

          .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 999px;
            font-weight: 700;
            font-size: 0.85em;
            letter-spacing: 0.3px;
          }

          .badge.pass { background: #10b981; color: white; }
          .badge.warn { background: #f59e0b; color: white; }
          .badge.fail { background: #ef4444; color: white; }
          .badge.error { background: #8b5cf6; color: white; }

          .history-link a {
            color: #2563eb;
            text-decoration: none;
            font-weight: 600;
          }

          .history-link a:hover {
            text-decoration: underline;
          }

          .trends {
            margin-bottom: 50px;
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .trends-header {
            background: linear-gradient(135deg, #0f172a 0%, #1f2937 100%);
            color: white;
            padding: 22px 25px;
            font-size: 1.2em;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
          }

          .trends-header small {
            font-weight: 500;
            opacity: 0.85;
          }

          .trends-body {
            padding: 20px 25px;
            background: #f8fafc;
          }

          .trends-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 18px;
          }

          .chart-card {
            background: white;
            border-radius: 12px;
            padding: 16px;
            border: 1px solid #e5e7eb;
          }

          .chart-title {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 10px;
          }

          .chart-title h3 {
            font-size: 1.05em;
            color: #111827;
          }

          .chart-title span {
            font-size: 0.85em;
            color: #6b7280;
          }

          .chart-wrap {
            width: 100%;
          }

          canvas.chart {
            width: 100%;
            height: 220px;
            display: block;
            background: #ffffff;
            border-radius: 10px;
          }

          .chart-legend {
            display: flex;
            flex-wrap: wrap;
            gap: 10px 14px;
            margin-top: 10px;
            font-size: 0.85em;
            color: #374151;
          }

          .legend-item {
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }

          .legend-dot {
            width: 10px;
            height: 10px;
            border-radius: 999px;
            display: inline-block;
          }

          .dot-pass { background: #10b981; }
          .dot-warn { background: #f59e0b; }
          .dot-fail { background: #ef4444; }
          .dot-error { background: #8b5cf6; }

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
          ${this.generateHistoryHTML()}
          ${this.generateTrendsHTML()}
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

  generateTrendsHTML() {
    if (!this.historyRuns || this.historyRuns.length < 2) return '';

    const maxPoints = 30;
    const runs = this.historyRuns.slice(0, maxPoints).reverse();

    // Embebemos datos mínimos para gráficos
    const trendData = runs.map(r => {
      const summary = r.summary || {};
      return {
        runId: r.runId,
        timestamp: r.timestamp,
        apiUrl: r.apiUrl,
        successRate: typeof r.successRate === 'number' ? r.successRate : Number(r.successRate),
        pass: Number(summary.passedMetrics ?? 0),
        warn: Number(summary.warnedMetrics ?? 0),
        fail: Number(summary.failedMetrics ?? 0),
        error: Number(summary.errorMetrics ?? 0),
        total: Number(summary.totalMetrics ?? 0)
      };
    });

    // Inyectar JSON sin HTML-escaping para que JSON.parse funcione.
    // Protegemos contra cierre accidental del script tag.
    const dataJson = JSON.stringify(trendData)
      .replace(/</g, '\\u003c')
      .replace(/-->/g, '--\\u003e')
      .replace(/<\//g, '\\u003c/');

    return `
      <div class="trends">
        <div class="trends-header">
          <div>📈 Tendencias históricas</div>
          <small>Últimos ${Math.min(maxPoints, this.historyRuns.length)} runs</small>
        </div>
        <div class="trends-body">
          <div class="trends-grid">
            <div class="chart-card">
              <div class="chart-title">
                <h3>% de éxito por ejecución</h3>
                <span>Línea</span>
              </div>
              <div class="chart-wrap">
                <canvas class="chart" id="chart-success" height="220"></canvas>
              </div>
            </div>
            <div class="chart-card">
              <div class="chart-title">
                <h3>Distribución de estados</h3>
                <span>Barras apiladas (PASS/WARN/FAIL/ERROR)</span>
              </div>
              <div class="chart-wrap">
                <canvas class="chart" id="chart-status" height="220"></canvas>
              </div>
              <div class="chart-legend">
                <span class="legend-item"><span class="legend-dot dot-pass"></span>PASS</span>
                <span class="legend-item"><span class="legend-dot dot-warn"></span>WARN</span>
                <span class="legend-item"><span class="legend-dot dot-fail"></span>FAIL</span>
                <span class="legend-item"><span class="legend-dot dot-error"></span>ERROR</span>
              </div>
            </div>
          </div>
          <script type="application/json" id="trend-data">${dataJson}</script>
          <script>
            (function() {
              function getTrendData() {
                try {
                  var el = document.getElementById('trend-data');
                  if (!el) return [];
                  return JSON.parse(el.textContent || '[]');
                } catch (e) {
                  return [];
                }
              }

              function setupCanvas(canvas) {
                var ctx = canvas.getContext('2d');
                var dpr = window.devicePixelRatio || 1;
                var rect = canvas.getBoundingClientRect();
                var width = Math.max(300, rect.width);
                var height = canvas.height || 220;
                canvas.width = Math.floor(width * dpr);
                canvas.height = Math.floor(height * dpr);
                // Evitar acumulación de escala si re-renderizamos
                if (typeof ctx.setTransform === 'function') {
                  ctx.setTransform(1, 0, 0, 1, 0, 0);
                }
                ctx.scale(dpr, dpr);
                return { ctx: ctx, width: width, height: height };
              }

              function drawGrid(ctx, width, height, padding) {
                ctx.save();
                ctx.strokeStyle = '#e5e7eb';
                ctx.lineWidth = 1;
                ctx.setLineDash([4, 4]);
                var lines = 4;
                for (var i = 0; i <= lines; i++) {
                  var y = padding.top + (i * (height - padding.top - padding.bottom) / lines);
                  ctx.beginPath();
                  ctx.moveTo(padding.left, y);
                  ctx.lineTo(width - padding.right, y);
                  ctx.stroke();
                }
                ctx.restore();
              }

              function drawAxesLabels(ctx, width, height, padding, minY, maxY, formatter) {
                ctx.save();
                ctx.fillStyle = '#6b7280';
                ctx.font = '12px Segoe UI, Tahoma, sans-serif';
                var lines = 4;
                for (var i = 0; i <= lines; i++) {
                  var value = maxY - (i * (maxY - minY) / lines);
                  var y = padding.top + (i * (height - padding.top - padding.bottom) / lines);
                  ctx.fillText(formatter(value), 8, y + 4);
                }
                ctx.restore();
              }

              function drawLineChart(canvasId, data) {
                var canvas = document.getElementById(canvasId);
                if (!canvas) return;
                var s = setupCanvas(canvas);
                var ctx = s.ctx;
                var width = s.width;
                var height = s.height;
                ctx.clearRect(0, 0, width, height);

                var padding = { top: 12, right: 12, bottom: 26, left: 44 };
                drawGrid(ctx, width, height, padding);

                var values = data.map(function(d) {
                  return Number.isFinite(d.successRate) ? d.successRate : 0;
                });
                var minY = 0;
                var maxY = 100;
                drawAxesLabels(ctx, width, height, padding, minY, maxY, function(v) { return Math.round(v) + '%'; });

                var plotW = width - padding.left - padding.right;
                var plotH = height - padding.top - padding.bottom;
                var n = Math.max(1, values.length);

                function x(i) {
                  if (n === 1) return padding.left + plotW / 2;
                  return padding.left + (i * plotW / (n - 1));
                }
                function y(v) {
                  return padding.top + ((maxY - v) * plotH / (maxY - minY));
                }

                // Línea
                ctx.save();
                ctx.strokeStyle = '#2563eb';
                ctx.lineWidth = 2;
                ctx.beginPath();
                for (var i = 0; i < values.length; i++) {
                  var xv = x(i);
                  var yv = y(values[i]);
                  if (i === 0) ctx.moveTo(xv, yv);
                  else ctx.lineTo(xv, yv);
                }
                ctx.stroke();
                ctx.restore();

                // Puntos
                ctx.save();
                for (var j = 0; j < values.length; j++) {
                  var xv2 = x(j);
                  var yv2 = y(values[j]);
                  var color = values[j] >= 80 ? '#10b981' : values[j] >= 50 ? '#f59e0b' : '#ef4444';
                  ctx.fillStyle = color;
                  ctx.beginPath();
                  ctx.arc(xv2, yv2, 4, 0, Math.PI * 2);
                  ctx.fill();
                }
                ctx.restore();

                // Etiquetas del eje X (primera y última)
                ctx.save();
                ctx.fillStyle = '#6b7280';
                ctx.font = '12px Segoe UI, Tahoma, sans-serif';
                if (data.length >= 1) {
                  var first = data[0].timestamp ? new Date(data[0].timestamp).toLocaleDateString('es-ES') : '';
                  var last = data[data.length - 1].timestamp ? new Date(data[data.length - 1].timestamp).toLocaleDateString('es-ES') : '';
                  ctx.fillText(first, padding.left, height - 8);
                  var lastW = ctx.measureText(last).width;
                  ctx.fillText(last, width - padding.right - lastW, height - 8);
                }
                ctx.restore();
              }

              function drawStackedBars(canvasId, data) {
                var canvas = document.getElementById(canvasId);
                if (!canvas) return;
                var s = setupCanvas(canvas);
                var ctx = s.ctx;
                var width = s.width;
                var height = s.height;
                ctx.clearRect(0, 0, width, height);

                var padding = { top: 12, right: 12, bottom: 26, left: 44 };
                drawGrid(ctx, width, height, padding);

                // Eje Y: total métricas
                var maxTotal = 0;
                for (var i = 0; i < data.length; i++) {
                  maxTotal = Math.max(maxTotal, data[i].total || (data[i].pass + data[i].warn + data[i].fail + data[i].error));
                }
                maxTotal = Math.max(1, maxTotal);
                drawAxesLabels(ctx, width, height, padding, 0, maxTotal, function(v) { return String(Math.round(v)); });

                var plotW = width - padding.left - padding.right;
                var plotH = height - padding.top - padding.bottom;
                var n = Math.max(1, data.length);
                var gap = 6;
                var barW = Math.max(8, (plotW - gap * (n - 1)) / n);

                function x(i) {
                  return padding.left + i * (barW + gap);
                }
                function y(v) {
                  return padding.top + ((maxTotal - v) * plotH / maxTotal);
                }

                var colors = {
                  pass: '#10b981',
                  warn: '#f59e0b',
                  fail: '#ef4444',
                  error: '#8b5cf6'
                };

                for (var j = 0; j < data.length; j++) {
                  var d = data[j];
                  var total = d.total || (d.pass + d.warn + d.fail + d.error);
                  if (!total) total = 1;
                  var x0 = x(j);
                  var base = 0;
                  var segments = [
                    { key: 'pass', value: d.pass || 0 },
                    { key: 'warn', value: d.warn || 0 },
                    { key: 'fail', value: d.fail || 0 },
                    { key: 'error', value: d.error || 0 }
                  ];

                  for (var k = 0; k < segments.length; k++) {
                    var seg = segments[k];
                    if (seg.value <= 0) continue;
                    var y1 = y(base + seg.value);
                    var y0 = y(base);
                    var h = Math.max(0, y0 - y1);
                    ctx.fillStyle = colors[seg.key];
                    ctx.fillRect(x0, y1, barW, h);
                    base += seg.value;
                  }
                }

                // Etiquetas del eje X (primera y última)
                ctx.save();
                ctx.fillStyle = '#6b7280';
                ctx.font = '12px Segoe UI, Tahoma, sans-serif';
                if (data.length >= 1) {
                  var first = data[0].timestamp ? new Date(data[0].timestamp).toLocaleDateString('es-ES') : '';
                  var last = data[data.length - 1].timestamp ? new Date(data[data.length - 1].timestamp).toLocaleDateString('es-ES') : '';
                  ctx.fillText(first, padding.left, height - 8);
                  var lastW = ctx.measureText(last).width;
                  ctx.fillText(last, width - padding.right - lastW, height - 8);
                }
                ctx.restore();
              }

              function renderAll() {
                var data = getTrendData();
                if (!data || data.length < 2) return;
                drawLineChart('chart-success', data);
                drawStackedBars('chart-status', data);
              }

              // Render inicial y en resize
              renderAll();
              var resizeTimer;
              window.addEventListener('resize', function() {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(renderAll, 150);
              });
            })();
          </script>
        </div>
      </div>
    `;
  }

  generateHistoryHTML() {
    if (!this.historyRuns || this.historyRuns.length === 0) return '';

    const maxRows = 15;
    const rows = this.historyRuns.slice(0, maxRows);

    return `
      <div class="history">
        <div class="history-header">
          <div>🗂️ Historial de ejecuciones</div>
          <small>Últimas ${Math.min(maxRows, this.historyRuns.length)} de ${this.historyRuns.length}</small>
        </div>
        <div class="history-body">
          <table class="history-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>API</th>
                <th>Éxito</th>
                <th>PASS</th>
                <th>WARN</th>
                <th>FAIL</th>
                <th>ERROR</th>
                <th>Reporte</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map(run => {
                const timestamp = run.timestamp ? new Date(run.timestamp).toLocaleString('es-ES') : 'N/A';
                const api = run.apiUrl || 'N/A';
                const successRateNum = typeof run.successRate === 'number' ? run.successRate : Number(run.successRate);
                const successRate = Number.isFinite(successRateNum) ? `${successRateNum.toFixed(2)}%` : (run.successRate || 'N/A');
                const successBadge = Number.isFinite(successRateNum)
                  ? (successRateNum >= 80 ? 'pass' : successRateNum >= 50 ? 'warn' : 'fail')
                  : 'error';
                const summary = run.summary || {};
                const pass = summary.passedMetrics ?? 'N/A';
                const warn = summary.warnedMetrics ?? 'N/A';
                const fail = summary.failedMetrics ?? 'N/A';
                const error = summary.errorMetrics ?? 'N/A';

                return `
                  <tr>
                    <td>${timestamp}</td>
                    <td title="${this.escapeHtml(api)}">${this.escapeHtml(api)}</td>
                    <td><span class="badge ${successBadge}">${successRate}</span></td>
                    <td>${pass}</td>
                    <td>${warn}</td>
                    <td>${fail}</td>
                    <td>${error}</td>
                    <td class="history-link">${run.reportHtml ? `<a href="${this.escapeAttr(run.reportHtml)}" target="_blank" rel="noopener">Abrir</a>` : 'N/A'}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
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

  escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  escapeAttr(value) {
    // Atributos HTML: reutilizamos escapeHtml
    return this.escapeHtml(value);
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
