/**
 * Script Principal de Ejecución de Pruebas ISO 25022
 * Ejecuta todas las métricas y genera el reporte HTML
 */

const EffectivenessMetrics = require('./metrics/effectiveness-metrics');
const EfficiencyMetrics = require('./metrics/efficiency-metrics');
const SatisfactionMetrics = require('./metrics/satisfaction-metrics');
const FreedomFromRiskMetrics = require('./metrics/freedom-from-risk-metrics');
const HTMLReportGenerator = require('./report-generator');
const path = require('path');
const fs = require('fs');

function createRunId(date = new Date()) {
  // Windows-friendly filename (no ':' or '.')
  return date
    .toISOString()
    .replace(/[:.]/g, '-')
    .replace(/Z$/, 'Z');
}

function safeReadJSON(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

async function runISO25022Tests() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║     ISO 25022 - Pruebas de Calidad en Uso del Software  ║');
  console.log('║         Tennis Store - Tienda de Sneakers Online        ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  const baseURL = process.env.API_URL || 'http://localhost:3000/api';
  console.log(`🌐 URL de la API: ${baseURL}\n`);

  // Inicializar generador de reportes
  const reportGenerator = new HTMLReportGenerator();

  try {
    // 1. Métricas de Efectividad
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 EFECTIVIDAD (Effectiveness)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    const effectivenessMetrics = new EffectivenessMetrics(baseURL);
    const effectivenessResults = await effectivenessMetrics.runAllTests();
    reportGenerator.addCategory(effectivenessResults);
    displayCategoryResults(effectivenessResults);

    // 2. Métricas de Eficiencia
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚡ EFICIENCIA (Efficiency)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    const efficiencyMetrics = new EfficiencyMetrics(baseURL);
    const efficiencyResults = await efficiencyMetrics.runAllTests();
    reportGenerator.addCategory(efficiencyResults);
    displayCategoryResults(efficiencyResults);

    // 3. Métricas de Satisfacción
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('😊 SATISFACCIÓN (Satisfaction)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    const satisfactionMetrics = new SatisfactionMetrics(baseURL);
    const satisfactionResults = await satisfactionMetrics.runAllTests();
    reportGenerator.addCategory(satisfactionResults);
    displayCategoryResults(satisfactionResults);

    // 4. Métricas de Ausencia de Riesgo
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🛡️  AUSENCIA DE RIESGO (Freedom from Risk)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    const riskMetrics = new FreedomFromRiskMetrics(baseURL);
    const riskResults = await riskMetrics.runAllTests();
    reportGenerator.addCategory(riskResults);
    displayCategoryResults(riskResults);

    // Generar reporte HTML + registro histórico
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📄 GENERANDO REPORTE HTML');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const reportsDir = path.join(__dirname, 'reports');
    const runsDir = path.join(reportsDir, 'runs');
    ensureDir(reportsDir);
    ensureDir(runsDir);

    const runId = createRunId(new Date());
    const latestReportPath = path.join(reportsDir, 'iso25022-report.html');
    const runReportFileName = `iso25022-report-${runId}.html`;
    const runReportPath = path.join(reportsDir, runReportFileName);

    const summary = reportGenerator.reportData.summary;
    const successRate = summary.totalMetrics > 0
      ? Number(((summary.passedMetrics / summary.totalMetrics) * 100).toFixed(2))
      : 0;

    const runJsonPath = path.join(runsDir, `${runId}.json`);
    fs.writeFileSync(
      runJsonPath,
      JSON.stringify(
        {
          runId,
          timestamp: reportGenerator.reportData.timestamp,
          apiUrl: baseURL,
          successRate,
          reportHtml: runReportFileName,
          reportData: reportGenerator.reportData
        },
        null,
        2
      ),
      'utf8'
    );

    const historyPath = path.join(reportsDir, 'history.json');
    const history = safeReadJSON(historyPath, { runs: [] });
    const nextRun = {
      runId,
      timestamp: reportGenerator.reportData.timestamp,
      apiUrl: baseURL,
      successRate,
      summary,
      reportHtml: runReportFileName,
      runJson: `runs/${runId}.json`
    };

    const updatedRuns = [nextRun, ...(Array.isArray(history.runs) ? history.runs : [])]
      .filter(r => r && r.runId)
      .slice(0, 50);

    fs.writeFileSync(historyPath, JSON.stringify({ runs: updatedRuns }, null, 2), 'utf8');

    // Inyectar historial al reporte HTML
    reportGenerator.setHistory(updatedRuns);

    // Guardar un HTML “por ejecución” y el “último” (puntero)
    reportGenerator.saveReport(runReportPath);
    reportGenerator.saveReport(latestReportPath);

    // Resumen final
    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║                     RESUMEN FINAL                        ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');
    
    // Resumen final
    // (nota: summary ya fue calculado arriba para la persistencia)
    console.log(`📊 Total de métricas evaluadas: ${summary.totalMetrics}`);
    console.log(`✅ Aprobadas (PASS):            ${summary.passedMetrics}`);
    console.log(`⚠️  Advertencias (WARN):        ${summary.warnedMetrics}`);
    console.log(`❌ Fallidas (FAIL):             ${summary.failedMetrics}`);
    console.log(`🔴 Errores (ERROR):             ${summary.errorMetrics}`);

    console.log(`\n🎯 Tasa de éxito: ${successRate}%`);

    console.log(`\n📁 Reporte (último) guardado en: ${latestReportPath}`);
    console.log(`📁 Reporte (run) guardado en:    ${runReportPath}`);
    console.log(`🗂️  Historial guardado en:        ${historyPath}`);
    console.log('\n💡 Para ver el reporte, ejecuta: npm run test:html');
    console.log('   O abre directamente el archivo HTML en tu navegador.\n');

    return {
      success: true,
      reportPath: latestReportPath,
      runReportPath,
      runId,
      summary
    };

  } catch (error) {
    console.error('\n❌ Error durante la ejecución de las pruebas:');
    console.error(error);
    
    return {
      success: false,
      error: error.message
    };
  }
}

function displayCategoryResults(categoryResults) {
  categoryResults.metrics.forEach(metric => {
    const statusSymbol = getStatusSymbol(metric.status);
    console.log(`${statusSymbol} ${metric.name}`);
    console.log(`   Valor: ${metric.value} | Objetivo: ${metric.target}`);
    console.log(`   ${metric.description}`);
    console.log('');
  });
}

function getStatusSymbol(status) {
  const symbols = {
    'PASS': '✅',
    'WARN': '⚠️ ',
    'FAIL': '❌',
    'ERROR': '🔴'
  };
  return symbols[status] || '❓';
}

// Verificar si se ejecuta directamente
if (require.main === module) {
  runISO25022Tests()
    .then(result => {
      if (result.success) {
        process.exit(0);
      } else {
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { runISO25022Tests };
