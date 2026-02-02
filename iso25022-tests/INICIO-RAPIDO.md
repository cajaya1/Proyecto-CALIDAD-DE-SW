# 🚀 INICIO RÁPIDO - Pruebas ISO 25022

## ✅ Pasos para ver las pruebas en el navegador

### Opción 1: Página Principal (Recomendado)
1. Navega a la carpeta `iso25022-tests`
2. Haz doble clic en el archivo `index.html`
3. Desde ahí podrás acceder a:
   - 📈 Reporte de pruebas ejecutadas
   - 📘 Guía completa de ISO 25022
   - 📖 Documentación técnica

### Opción 2: Ejecutar nuevas pruebas
1. Abre PowerShell o Terminal
2. Ejecuta los siguientes comandos:

```powershell
cd iso25022-tests
npm install
npm test
```

3. Abre el reporte generado en: `reports/iso25022-report.html`

### Opción 3: Ejecutar y abrir automáticamente
```powershell
cd iso25022-tests
npm run test:html
```

## 📂 Archivos HTML Disponibles

### En la raíz de `iso25022-tests/`:

1. **index.html** - Página principal
   - Portal de acceso a todos los recursos
   - Resumen de métricas
   - Enlaces a reportes y documentación

2. **guia-iso25022.html** - Guía del estándar
   - Explicación detallada de ISO 25022
   - Descripción de categorías y métricas
   - Beneficios y mejores prácticas

### En `iso25022-tests/reports/`:

3. **iso25022-report.html** - Reporte de pruebas
   - Resultados detallados de las 14 métricas
   - Gráficos y estadísticas
   - Estado de aprobación/fallo de cada métrica

## 🎯 ¿Qué Archivo Abrir?

- **Para empezar**: `index.html` (página principal)
- **Para ver resultados**: `reports/iso25022-report.html`
- **Para aprender sobre ISO 25022**: `guia-iso25022.html`

## 🔧 Requisitos Previos

Para ejecutar nuevas pruebas, asegúrate de:
1. ✅ Tener Node.js instalado
2. ✅ El backend corriendo en `http://localhost:3000`
3. ✅ Las dependencias instaladas (`npm install`)

## 📊 Métricas Evaluadas

### 🎯 Efectividad (2 métricas)
- Completitud de Tareas
- Efectividad de Funcionalidades

### ⚡ Eficiencia (4 métricas)
- Tiempo de Respuesta Promedio
- Eficiencia de Procesamiento
- Utilización de Recursos
- Capacidad de Carga

### 😊 Satisfacción (4 métricas)
- Utilidad Percibida
- Confiabilidad Percibida
- Facilidad de Uso
- Completitud de Información

### 🛡️ Ausencia de Riesgo (4 métricas)
- Seguridad de Autenticación
- Validación de Entrada
- Manejo de Errores
- Disponibilidad del Sistema

## 💡 Ayuda

Si tienes problemas:
1. Verifica que el backend esté corriendo
2. Revisa que las dependencias estén instaladas
3. Consulta el archivo `README.md` para más detalles
4. Revisa los logs en la consola al ejecutar `npm test`

## 📞 Comandos Útiles

```powershell
# Instalar dependencias
npm install

# Ejecutar pruebas (solo consola)
npm test

# Ejecutar y abrir reporte HTML
npm run test:html

# Ver la versión de Node.js
node --version
```

---

**¡Listo!** Ahora puedes abrir cualquiera de los archivos HTML en tu navegador favorito.
