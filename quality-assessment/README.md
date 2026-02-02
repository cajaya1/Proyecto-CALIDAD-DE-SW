# 📈 Herramienta de Evaluación CICS - Histórico de Calidad

Herramienta interactiva en Streamlit para evaluar la calidad del proyecto **Tienda de Sneakers Online** con métricas basadas en ISO 29110, ISO 9001 e ISO 25010.

## 📋 Descripción

Esta aplicación permite:
- **Evaluar procesos** (ISO 29110): Cumplimiento de actividades planificadas
- **Auditoría de calidad** (ISO 9001): Detección de no conformidades
- **Calidad del producto** (ISO 25010): Fiabilidad, rendimiento, seguridad, mantenibilidad
- **Experiencia de usuario**: Medición de tasa de éxito en tareas
- **Histórico y gráficas**: Seguimiento de evolución en diferentes versiones

## 🚀 Instalación

### Requisitos previos
- Python 3.8 o superior
- pip (gestor de paquetes de Python)

### Pasos de instalación

1. **Navega a la carpeta del proyecto:**
```bash
cd quality-assessment
```

2. **Crea un entorno virtual (recomendado):**
```bash
python -m venv venv
```

3. **Activa el entorno virtual:**

   **Windows (PowerShell):**
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```

   **Windows (CMD):**
   ```cmd
   venv\Scripts\activate.bat
   ```

   **Linux/Mac:**
   ```bash
   source venv/bin/activate
   ```

4. **Instala las dependencias:**
```bash
pip install -r requirements.txt
```

## ▶️ Ejecución

Ejecuta la aplicación con:
```bash
streamlit run app.py
```

La aplicación se abrirá automáticamente en tu navegador (generalmente en `http://localhost:8501`).

## 📊 Uso de la Herramienta

### Pestaña 1: Procesos
- **ISO 29110 (ICP)**: Ingresa actividades planificadas vs realizadas
- **ISO 9001 (NC)**: Registra procesos auditados y no conformidades

### Pestaña 2: Producto Técnico
- **Fiabilidad (MTBF)**: Mean Time Between Failures en horas
- **Rendimiento (TPR)**: Tiempo promedio de respuesta en ms
- **Seguridad (IVC)**: Índice de vulnerabilidades críticas
- **Mantenibilidad (CC)**: Complejidad ciclomática

### Pestaña 3: Experiencia de Uso
- **Usabilidad**: Porcentaje de tareas completadas exitosamente

### Pestaña 4: Reporte Final
- Resumen visual con color-coding:
  - 🟢 Verde: Métricas óptimas
  - 🔴 Rojo: Métricas en riesgo o críticas

### Pestaña 5: Gráficas Históricas
- **Línea de tendencias**: Para métricas porcentuales (ICP, NC, IVC, Usabilidad)
- **Gráficas de barras**: Evolución de rendimiento y fiabilidad

## 💾 Guardado de Datos

1. En la **barra lateral**, ingresa el nombre de la versión (ej: "v1.0", "Sprint 2", etc.)
2. Modifica los valores en cualquier pestaña
3. Haz clic en **"📸 Guardar Snapshot en Histórico"**
4. Los datos se guardan en la sesión actual (se pierden al cerrar)

## 🔗 Integración con tu Proyecto

Esta herramienta evalúa tu proyecto **Tienda de Sneakers Online**:

### Backend (Node.js + Express)
- Usa los datos del archivo `backend/coverage/coverage-final.json` para TPR y fiabilidad
- Consulta los tests en `backend/tests/` para ICP y NC
- Analiza la complejidad del código en `backend/controller/` y `backend/routes/`

### Frontend (Angular)
- Evalúa la usabilidad basada en tests en `tennis-frontend/src/app/tests/`
- Mide el rendimiento del bundle en `tennis-frontend/build/`

### K6 Tests
- Los reportes de carga en `k6-tests/reports/` contienen datos para evaluar rendimiento bajo estrés

## 📈 Ejemplo de Uso

1. **Primera evaluación**: Ingresa métricas baseline de tu proyecto
2. **Guarda como**: "v1.0-Baseline"
3. **Realiza mejoras** en el código o procesos
4. **Segunda evaluación**: Ingresa nuevas métricas
5. **Guarda como**: "v1.1-PostMejora"
6. **Ve gráficas**: Observa la evolución en la pestaña 5

## 🎯 Umbrales Recomendados

| Métrica | Óptimo | Riesgo | Crítico |
|---------|--------|--------|---------|
| ICP (%) | ≥85% | ≥68% | <68% |
| NC (%) | 0% | <1.5% | ≥1.5% |
| MTBF (h) | >72h | 24-72h | <24h |
| TPR (ms) | ≤200 | ≤1000 | >1000 |
| IVC (%) | 0% | <10% | ≥10% |
| Complejidad | ≤10 | 11-20 | >20 |
| Usabilidad (%) | >80% | 50-80% | <50% |

## 🛠️ Estructura del Proyecto

```
quality-assessment/
├── app.py                 # Aplicación principal
├── requirements.txt       # Dependencias
└── README.md             # Este archivo
```

## ⚠️ Notas Importantes

- Los datos se almacenan **en memoria** (session state) y se pierden al cerrar
- Para persistencia, considera integrar con una base de datos
- Asegúrate de que tu entorno virtual esté activado antes de ejecutar

## 📞 Soporte

Para errores o mejoras, revisa el archivo `app.py` y ajusta los umbrales según tus necesidades específicas.

---

**Última actualización**: Diciembre 2024
