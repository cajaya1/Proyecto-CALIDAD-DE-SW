# 📋 Verificación para Levantar el Servicio

## ✅ Estado de Verificación - 3 de Febrero, 2026

### 1. **Dependencias** ✅
- **NPM Packages**: Instalados exitosamente (503 paquetes)
  - Express 5.1.0 - Framework web
  - MySQL2 3.14.3 - Driver de base de datos
  - bcryptjs 3.0.2 - Encriptación de contraseñas
  - jsonwebtoken 9.0.2 - Autenticación JWT
  - Multer 2.0.2 - Carga de archivos
  - Cors 2.8.5 - Control de origen cruzado
  - dotenv 16.6.1 - Variables de entorno

### 2. **Archivo .env** ✅
- **Ubicación**: `/backend/.env`
- **Estado**: Creado con configuración de desarrollo
- **Valores por defecto**:
  - `DB_HOST`: localhost
  - `DB_PORT`: 3306
  - `DB_NAME`: tienda_sneakers
  - `DB_USER`: root
  - `NODE_ENV`: development
  - `PORT`: 3000

### 3. **Base de Datos** ⚠️ IMPORTANTE
**Pendiente de verificación**:
- [ ] MySQL debe estar ejecutándose en `localhost:3306`
- [ ] Base de datos `tienda_sneakers` debe existir
- [ ] Tablas deben estar creadas con el schema en `/backend/sql/schema.sql`

**Archivos SQL disponibles**:
- `schema.sql` - Schema principal
- `create-orders-table.sql` - Tabla de órdenes
- `reviews-schema.sql` - Tabla de reseñas

### 4. **Rutas API Configuradas** ✅
- `/api/auth` - Autenticación
- `/api/products` - Productos
- `/api/cart` - Carrito
- `/api/orders` - Órdenes
- `/api/chatbot` - Chatbot
- `/api/reservations` - Reservaciones
- `/api/reviews` - Reseñas
- `/uploads` - Servir archivos estáticos

### 5. **Punto de Entrada** ✅
- **Archivo**: `/backend/index.js`
- **Script de inicio**: `npm start` (node index.js)
- **Script de desarrollo**: `npm run dev` (nodemon index.js)

---

## 🚀 Próximos Pasos para Levantar el Servicio

### Paso 1: Verificar MySQL
```powershell
# Verificar que MySQL está corriendo
mysql -u root -p -h localhost -e "SELECT VERSION();"
```

### Paso 2: Crear la Base de Datos (si no existe)
```powershell
# En PowerShell:
cd backend/sql
mysql -u root -p < schema.sql
mysql -u root -p < create-orders-table.sql
mysql -u root -p < reviews-schema.sql
```

### Paso 3: Actualizar .env si es necesario
Si tu MySQL tiene contraseña o usuario diferente, editar:
```
c:\Users\carlo\OneDrive\Desktop\Proyecto-CALIDAD-DE-SW\backend\.env
```

### Paso 4: Levantar el Servidor
```powershell
cd backend
npm start
# O con nodemon para desarrollo:
npm run dev
```

El servidor estará disponible en: **http://localhost:3000**

---

## ⚙️ Configuración de Base de Datos

El servicio soporta dos modos:

1. **Desarrollo Local** (actual):
   - Variables individuales: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`

2. **Producción/Cloud**:
   - URL completa: `DATABASE_URL=mysql://user:password@host:port/database`

---

## 🔐 Variables de Entorno Críticas

| Variable | Valor Actual | Acción Recomendada |
|----------|-------------|-------------------|
| `DB_HOST` | localhost | ✅ Verificar que MySQL corra aquí |
| `DB_USER` | root | ⚠️ Cambiar en producción |
| `DB_PASSWORD` | (vacío) | ⚠️ Agregar contraseña si aplica |
| `DB_NAME` | tienda_sneakers | ✅ Crear esta BD |
| `JWT_SECRET` | (cambiar) | ⚠️ Cambiar en producción |
| `NODE_ENV` | development | ✅ Correcto para dev |
| `PORT` | 3000 | ✅ Personalizable |

---

## 📊 Scripts Disponibles

```json
{
  "start": "node index.js",           // Producción
  "dev": "nodemon index.js",          // Desarrollo (recarga automática)
  "test": "jest --verbose",           // Ejecutar tests
  "test:coverage": "nyc npm test",    // Cobertura de tests
  "test:watch": "jest --watch"        // Tests en modo observador
}
```

---

## ⚠️ Posibles Problemas y Soluciones

### Error: "connect ECONNREFUSED 127.0.0.1:3306"
→ MySQL no está corriendo. Iniciar el servicio MySQL.

### Error: "ER_BAD_DB_ERROR: Unknown database 'tienda_sneakers'"
→ La BD no existe. Ejecutar el schema.sql

### Error: "Port 3000 already in use"
→ Cambiar `PORT=3000` a otro puerto en `.env` o matar el proceso en el puerto.

---

## ✨ Checklist Final

- [x] Dependencias instaladas
- [x] Archivo .env creado
- [ ] MySQL verificado y corriendo
- [ ] Base de datos `tienda_sneakers` creada
- [ ] Tablas creadas desde schema.sql
- [ ] Contrasena de DB actualizada en .env (si aplica)
- [ ] Puerto 3000 disponible

**Estado**: Listo para levantar ✅
