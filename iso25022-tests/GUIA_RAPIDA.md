# 🚀 Guía Rápida - Tests ISO25022

## ⚡ Inicio Rápido

### 1️⃣ Preparación
Asegúrate de que el backend esté corriendo:

```bash
# En una terminal, navega al backend y ejecuta:
cd backend
npm install
npm start
```

El backend debe estar corriendo en `http://localhost:3000`

### 2️⃣ Instalar dependencias

**Desde la raíz del proyecto:**
```bash
npm run test:iso25022:install
```

**O directamente en la carpeta:**
```bash
cd iso25022-tests
npm install
```

### 3️⃣ Ejecutar las pruebas

**Desde la raíz del proyecto:**
```bash
# Solo ver resultados en consola
npm run test:iso25022

# Ver resultados + abrir reporte HTML
npm run test:iso25022:html
```

**Desde la carpeta iso25022-tests:**
```bash
# Solo ver resultados en consola
npm test

# Ver resultados + abrir reporte HTML
npm run test:html
```

## 📊 Qué esperar

Las pruebas evaluarán:
- ✅ **Efectividad**: 8 tareas principales del sistema
- ⚡ **Eficiencia**: Tiempo de respuesta y capacidad de carga
- 😊 **Satisfacción**: 7 funcionalidades disponibles
- 🛡️ **Seguridad**: 6 endpoints protegidos

## 🎯 Interpretación de Resultados

### En la Consola:
- ✅ **PASS**: Todo correcto
- ⚠️ **WARN**: Funcional pero por debajo del objetivo
- ❌ **FAIL**: No cumple con el estándar
- 🔴 **ERROR**: Error al ejecutar la prueba

### En el Reporte HTML:
1. Abre `iso25022-tests/reports/iso25022-report.html`
2. Revisa el **Resumen Ejecutivo** en la parte superior
3. Navega por cada categoría para ver detalles
4. Revisa las métricas con estado FAIL o WARN

## ⚠️ Problemas Comunes

### Error: "ECONNREFUSED"
**Solución**: El backend no está corriendo. Inicia el backend primero.

### Error: "Cannot find module 'axios'"
**Solución**: Instala las dependencias con `npm install` en la carpeta `iso25022-tests`

### Muchas pruebas fallan
**Solución**: Verifica que:
- El backend esté en `http://localhost:3000`
- La base de datos tenga datos de prueba
- Todos los módulos del backend estén funcionando

## 🔧 Configuración Avanzada

### Cambiar la URL de la API:

```bash
# Windows PowerShell
$env:API_URL="http://localhost:4000/api"; npm run test:iso25022

# Linux/Mac  
API_URL=http://localhost:4000/api npm run test:iso25022
```

### Ejecutar solo en modo consola (sin HTML):

```bash
cd iso25022-tests
node run-tests.js
```

## 📈 Siguientes Pasos

1. **Revisa el reporte HTML** para entender el estado actual
2. **Identifica métricas FAIL o WARN** que necesitan atención
3. **Prioriza mejoras** basándote en las categorías más críticas
4. **Ejecuta las pruebas regularmente** para monitorear el progreso

## 💡 Consejos

- Ejecuta las pruebas después de cada cambio importante
- Usa el reporte HTML para presentaciones o documentación
- Las pruebas ISO25022 complementan (no reemplazan) otros tests
- Objetivo mínimo: 80% de métricas en PASS

---

**¿Listo para empezar?** → `npm run test:iso25022:html` 🚀
