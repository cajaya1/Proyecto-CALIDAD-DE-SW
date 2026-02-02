# Pruebas ISO 25022 - Calidad en Uso del Software

Sistema completo de evaluación de calidad en uso basado en el estándar **ISO/IEC 25022:2016** para el proyecto Tennis Store.

## 📋 Descripción

Este conjunto de pruebas implementa métricas de calidad en uso según la norma ISO 25022, evaluando cuatro categorías principales:

### 🎯 1. Efectividad (Effectiveness)
Mide la capacidad del sistema para permitir a los usuarios completar tareas con precisión.
- **Completitud de tareas**: Porcentaje de tareas completadas exitosamente
  - Obtener lista de productos
  - Registro de usuario
  - Login de usuario
  - Agregar producto al carrito
  - Crear orden
  - Chatbot - Enviar mensaje
  - Obtener reseñas de producto
  - Crear reservación
- **Efectividad de funcionalidades**: Precisión en el procesamiento de datos
  - Validación de autenticación
  - Integridad de datos de productos
  - Cálculo correcto de carrito
  - Validación de chatbot
  - Sistema de reseñas

### ⚡ 2. Eficiencia (Efficiency)
Mide los recursos utilizados en relación con la efectividad lograda.
- **Tiempo de respuesta**: Tiempo promedio de respuesta de operaciones
  - Listar productos
  - Obtener producto específico
  - Verificar estado de API
  - Consultar chatbot
  - Obtener reseñas
- **Eficiencia de procesamiento**: Capacidad de procesamiento (ops/seg)
- **Utilización de recursos**: Eficiencia en el uso de ancho de banda
- **Capacidad de carga**: Manejo de usuarios concurrentes

### 😊 3. Satisfacción (Satisfaction)
Mide el grado en que se satisfacen las necesidades del usuario.
- **Utilidad percibida**: Disponibilidad de funcionalidades útiles
  - Autenticación de usuarios
  - Catálogo de productos
  - Gestión de carrito
  - Sistema de órdenes
  - Sistema de chatbot
  - Sistema de reseñas
  - Sistema de reservaciones
- **Confiabilidad percibida**: Consistencia de las respuestas
- **Facilidad de uso**: Facilidad para completar operaciones
- **Completitud de información**: Completitud de datos proporcionados

### 🛡️ 4. Ausencia de Riesgo (Freedom from Risk)
Mide el grado en que el sistema mitiga riesgos potenciales.
- **Seguridad de autenticación**: Protección de endpoints
  - Carrito
  - Órdenes
  - Perfil de usuario
  - Crear reservación
  - Historial de chat
- **Validación de entrada**: Validación y sanitización de datos
- **Manejo de errores**: Manejo seguro sin exponer información sensible
- **Disponibilidad del sistema**: Disponibilidad ante múltiples peticiones

## 🚀 Instalación

### Opción 1: Instalación desde la raíz del proyecto

```bash
# Instala las dependencias de los tests ISO25022
npm run test:iso25022:install
```

### Opción 2: Instalación directa

```bash
# Navega al directorio de pruebas
cd iso25022-tests

# Instala las dependencias
npm install
```

## 📊 Ejecución de Pruebas

### Desde la raíz del proyecto:

```bash
# Ejecutar pruebas ISO25022 (solo consola)
npm run test:iso25022

# Ejecutar y abrir reporte HTML automáticamente
npm run test:iso25022:html
```

### Desde la carpeta iso25022-tests:

```bash
# Ejecutar pruebas (solo consola)
npm test

# Ejecutar y abrir reporte HTML automáticamente
npm run test:html
```

### Ejecución manual:
```bash
cd iso25022-tests

# Ejecutar las pruebas
node run-tests.js

# Abrir el reporte HTML (Windows)
start reports/iso25022-report.html

# Abrir el reporte HTML (Linux/Mac)
open reports/iso25022-report.html
```

## ⚙️ Configuración

### Requisitos previos:
1. **Backend en ejecución**: Asegúrate de que el backend esté corriendo en `http://localhost:3000`
2. **Base de datos**: La base de datos debe estar configurada y con datos de prueba
3. **Node.js**: Versión 14 o superior

### Configuración de URL de la API:

Por defecto, las pruebas se conectan a `http://localhost:3000/api`. 

Para cambiar la URL de la API, establece la variable de entorno `API_URL`:

```bash
# Windows PowerShell
$env:API_URL="http://tu-api.com/api"; npm test

# Windows CMD
set API_URL=http://tu-api.com/api && npm test

# Linux/Mac
API_URL=http://tu-api.com/api npm test
```

## 📁 Estructura del Proyecto

```
iso25022-tests/
├── package.json                    # Configuración del proyecto
├── run-tests.js                    # Script principal de ejecución
├── report-generator.js             # Generador de reportes HTML
├── README.md                       # Esta documentación
├── metrics/
│   ├── effectiveness-metrics.js    # Métricas de efectividad
│   ├── efficiency-metrics.js       # Métricas de eficiencia
│   ├── satisfaction-metrics.js     # Métricas de satisfacción
│   └── freedom-from-risk-metrics.js # Métricas de ausencia de riesgo
└── reports/
    └── iso25022-report.html        # Reporte generado (HTML)
```

## 📄 Reporte HTML

El reporte HTML generado incluye:

- **Resumen ejecutivo**: Estadísticas generales de las pruebas
- **Gráficos visuales**: Representación gráfica de los resultados
- **Detalles por categoría**: Resultados detallados de cada métrica
- **Estado de cada métrica**: PASS ✅ / WARN ⚠️ / FAIL ❌ / ERROR 🔴
- **Recomendaciones**: Sugerencias de mejora basadas en los resultados

## 🔧 Integración con CI/CD

Puedes integrar estas pruebas en tu pipeline de CI/CD:

```yaml
# Ejemplo para GitHub Actions
- name: Run ISO25022 Quality Tests
  run: |
    npm run test:iso25022:install
    npm run test:iso25022
```

## 📊 Interpretación de Resultados

### Estados de las métricas:
- **PASS** ✅: La métrica cumple con el objetivo establecido
- **WARN** ⚠️: La métrica está por debajo del objetivo pero dentro de un rango aceptable
- **FAIL** ❌: La métrica no cumple con el objetivo mínimo
- **ERROR** 🔴: Hubo un error al ejecutar la prueba

### Objetivos por categoría:
- **Efectividad**: ≥ 80% de tareas completadas, ≥ 90% de precisión
- **Eficiencia**: < 1000ms tiempo de respuesta, > 5 ops/seg
- **Satisfacción**: ≥ 90% utilidad percibida, ≥ 85% facilidad de uso
- **Ausencia de Riesgo**: 100% seguridad de autenticación, ≥ 99% disponibilidad

## 🆕 Nuevas Funcionalidades Probadas

Esta versión actualizada incluye pruebas para:
- ✨ Sistema de chatbot con IA
- ✨ Sistema de reseñas de productos
- ✨ Sistema de reservaciones
- ✨ Historial de conversaciones del chatbot
- ✨ Validación mejorada de seguridad

## 📞 Soporte

Para problemas o preguntas sobre las pruebas ISO25022:
1. Verifica que el backend esté en ejecución
2. Asegúrate de que la base de datos tenga datos de prueba
3. Revisa la configuración de la URL de la API
4. Consulta el reporte HTML para detalles específicos de errores

## 📝 Notas de Versión

**Versión 2.0.0** (Enero 2026)
- ✅ Actualización completa de endpoints para la versión actual
- ✅ Nuevas pruebas para chatbot, reseñas y reservaciones
- ✅ Mejoras en la seguridad y validación
- ✅ Integración mejorada con el proyecto principal
- ✅ Documentación actualizada

---

**Desarrollado con ❤️ para Tennis Store - Evaluación ISO/IEC 25022:2016**

El reporte HTML generado incluye:

- ✅ **Resumen visual** con estadísticas generales
- 📊 **Métricas detalladas** por categoría
- 🎨 **Código de colores** para identificar estado de métricas:
  - 🟢 Verde (PASS): Cumple con el objetivo
  - 🟡 Amarillo (WARN): Advertencia - cerca del objetivo
  - 🔴 Rojo (FAIL): No cumple con el objetivo
  - 🟣 Morado (ERROR): Error en la ejecución
- 📈 **Detalles expandidos** de cada métrica evaluada
- 🖨️ **Diseño optimizado** para impresión y exportación

## 🎯 Objetivos de Calidad (Targets)

Cada métrica tiene objetivos definidos según mejores prácticas:

| Categoría | Métrica | Objetivo |
|-----------|---------|----------|
| Efectividad | Completitud de tareas | ≥ 80% |
| Efectividad | Efectividad de funcionalidades | ≥ 90% |
| Eficiencia | Tiempo de respuesta | < 1000 ms |
| Eficiencia | Eficiencia de procesamiento | > 5 ops/s |
| Eficiencia | Utilización de recursos | < 5000 bytes/item |
| Eficiencia | Capacidad de carga | ≥ 95% |
| Satisfacción | Utilidad percibida | ≥ 90% |
| Satisfacción | Confiabilidad percibida | 100% |
| Satisfacción | Facilidad de uso | ≥ 85% |
| Satisfacción | Completitud de información | ≥ 80% |
| Ausencia de Riesgo | Seguridad de autenticación | 100% |
| Ausencia de Riesgo | Validación de entrada | ≥ 80% |
| Ausencia de Riesgo | Manejo de errores | 100% |
| Ausencia de Riesgo | Disponibilidad del sistema | ≥ 99% |

## 🔧 Requisitos Previos

Antes de ejecutar las pruebas, asegúrate de que:

1. ✅ El servidor backend esté ejecutándose (por defecto en `http://localhost:3000`)
2. ✅ La base de datos esté configurada y accesible
3. ✅ Node.js esté instalado (versión 14 o superior)

## 📖 Referencia ISO 25022

Este sistema de pruebas se basa en el estándar internacional **ISO/IEC 25022:2016** - "Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — Measurement of quality in use".

El estándar define un modelo de calidad en uso que consta de cinco características principales (este proyecto implementa cuatro):
- Efectividad
- Eficiencia  
- Satisfacción
- Ausencia de riesgo
- Cobertura de contexto (no implementada en esta versión)

## 💡 Ejemplos de Uso

### Ver resultados en consola
```bash
npm test
```

### Generar y abrir reporte HTML
```bash
npm run test:html
```

### Personalizar URL de la API
```bash
$env:API_URL="http://localhost:4000/api"; npm test
```

## 🤝 Contribuciones

Para agregar nuevas métricas:

1. Crea una nueva clase de métrica en el directorio `metrics/`
2. Implementa los métodos de medición siguiendo el patrón existente
3. Agrega la métrica al script `run-tests.js`
4. Actualiza la documentación

## 📞 Soporte

Para problemas o preguntas sobre las pruebas ISO 25022, consulta:
- Documentación del estándar ISO/IEC 25022:2016
- Código fuente de las métricas en el directorio `metrics/`

## ⚖️ Licencia

Este sistema de pruebas es parte del proyecto Tennis Store.

---

**Generado por el sistema de pruebas ISO 25022 para Tennis Store - Tienda de Sneakers Online**
