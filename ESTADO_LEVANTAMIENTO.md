# 🚀 ESTADO DEL SERVICIO - Levantamiento

## ✅ Verificación Completada

### 1. **Dependencias del Proyecto** ✅ 
```
✓ npm install ejecutado exitosamente
✓ 503 paquetes instalados
✓ Todas las dependencias críticas presentes:
  - express@5.1.0
  - mysql2@3.14.3
  - jsonwebtoken@9.0.2
  - bcryptjs@3.0.2
  - multer@2.0.2
  - cors@2.8.5
  - dotenv@16.6.1
```

### 2. **Configuración de Entorno** ✅
```
✓ Archivo .env creado en: backend/.env
✓ Variables de entorno configuradas:
  - DB_HOST=localhost
  - DB_PORT=3306
  - DB_NAME=tienda_sneakers
  - DB_USER=root
  - DB_PASSWORD=(sin contraseña)
  - NODE_ENV=development
  - PORT=3000
  - JWT_SECRET=definido
```

### 3. **Estructura del Proyecto** ✅
```
✓ Punto de entrada: backend/index.js
✓ Aplicación principal: backend/app.js
✓ Rutas configuradas:
  - /api/auth
  - /api/products
  - /api/cart
  - /api/orders
  - /api/chatbot
  - /api/reservations
  - /api/reviews
```

### 4. **Estado del Servidor Node.js** ⚠️
```
✓ Servidor inicia sin errores en puerto 3000
⚠️ No se puede conectar al servidor (Puerto no responde)
  → Probable causa: No hay conexión a MySQL
```

---

## ⚠️ BLOQUEANTE: Base de Datos MySQL

**Estado**: No se puede verificar

**Acciones Requeridas**:

1. **Verificar que MySQL está instalado y corriendo**
   ```powershell
   # Buscar proceso MySQL
   Get-Process | Where-Object {$_.Name -like "*mysql*"}
   
   # O verificar servicios
   Get-Service | Where-Object {$_.Name -like "*MySQL*"}
   ```

2. **Crear la base de datos y tablas**
   - Necesitas ejecutar los scripts SQL desde: `backend/sql/`
   - Scripts disponibles:
     - `schema.sql` (tablas principales)
     - `create-orders-table.sql` (tabla de órdenes)
     - `reviews-schema.sql` (tabla de reseñas)

3. **Actualizar la contraseña en `.env` si aplica**
   - Si tu MySQL tiene contraseña:
   ```
   DB_PASSWORD=tu_contraseña_actual
   ```

---

## 📋 Checklist Antes de Levantar el Servidor

- [ ] **MySQL instalado y corriendo**
  - Puedes verificar en: Servicios de Windows o MySQL Workbench

- [ ] **Base de datos `tienda_sneakers` creada**
  - Opción 1: Ejecutar `backend/sql/schema.sql` vía línea de comandos
  - Opción 2: Usar MySQL Workbench para ejecutar el script

- [ ] **Contraseña de BD actualizada en `.env`**
  - Si MySQL requiere contraseña, agregar en:
    `c:\Users\carlo\OneDrive\Desktop\Proyecto-CALIDAD-DE-SW\backend\.env`
    ```
    DB_PASSWORD=tu_password_real
    ```

- [ ] **Puerto 3000 disponible**
  - Verificar: `netstat -ano | findstr :3000`

---

## 🔧 Pasos para Levantar Correctamente

### Paso 1: Configurar MySQL (CRÍTICO)

**Opción A: Usando MySQL CLI (si está disponible)**
```powershell
cd backend/sql
mysql -u root -p < schema.sql
mysql -u root -p < create-orders-table.sql
mysql -u root -p < reviews-schema.sql
```

**Opción B: Usando MySQL Workbench**
1. Abrir MySQL Workbench
2. Conectar a localhost:3306
3. File → Open SQL Script → `backend/sql/schema.sql`
4. Ejecutar (Ctrl+Enter o botón Execute)
5. Repetir con los otros scripts

### Paso 2: Verificar conexión

Editar `.env` si es necesario y guardar:
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=tienda_sneakers
DB_USER=root
DB_PASSWORD=  (dejar en blanco si no tiene)
```

### Paso 3: Levantar el servidor

```powershell
cd c:\Users\carlo\OneDrive\Desktop\Proyecto-CALIDAD-DE-SW\backend
npm start
```

**Resultado esperado**:
```
> tennis-store-backend@1.0.0 start
> node index.js

Servidor corriendo en puerto 3000
```

### Paso 4: Probar la API

En otra terminal PowerShell:
```powershell
# Prueba básica
Invoke-WebRequest -Uri "http://localhost:3000" -Method GET

# Debe retornar:
# {"message":"API Tennis Store funcionando correctamente"}
```

---

## 📊 Información del Proyecto

| Aspecto | Valor |
|--------|-------|
| **Nombre** | tennis-store-backend |
| **Versión** | 1.0.0 |
| **Puerto** | 3000 |
| **Base de Datos** | MySQL 5.7+ |
| **Entorno** | Node.js 14+ |
| **Descripción** | Backend para tienda de tenis online |

---

## 🆘 Solución de Problemas

### "Servidor corriendo en puerto 3000" pero no responde

**Causa**: Conexión a BD bloqueada
**Solución**:
1. Verificar que MySQL está corriendo
2. Verificar credenciales en `.env`
3. Crear tablas con schema.sql

### "Port 3000 already in use"

**Causa**: Otro proceso usa el puerto
**Solución**:
```powershell
# Encontrar proceso en puerto 3000
netstat -ano | findstr :3000

# Matar el proceso (si PID es 1234)
taskkill /PID 1234 /F
```

### "Cannot find module 'mysql2'"

**Causa**: Dependencias no instaladas
**Solución**:
```powershell
cd backend
npm install
```

---

## 📞 Scripts Disponibles

```bash
npm start          # Producción
npm run dev        # Desarrollo (con nodemon)
npm test           # Ejecutar tests
npm run test:watch # Tests en modo observador
npm run test:coverage # Cobertura de tests
```

---

**Última verificación**: 3 de Febrero, 2026
**Estado**: Listo para levantar (pendiente de BD)
