# 🚀 Guía de Prueba Local - Tienda Sneakers Online

## 📋 Prerequisitos

Asegúrate de tener instalado:
- ✅ Node.js (v16 o superior)
- ✅ MySQL (v8 o superior)
- ✅ npm o yarn
- ✅ Git

---

## 🗄️ Paso 1: Configurar la Base de Datos

### 1.1 Iniciar MySQL
```powershell
# Verifica que MySQL esté corriendo
mysql --version
```

### 1.2 Crear la base de datos y tablas
```sql
# Conéctate a MySQL
mysql -u root -p

# Crear base de datos
CREATE DATABASE tienda_sneakers;
USE tienda_sneakers;

# Crear tabla de usuarios
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

# Crear tabla de productos
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  image VARCHAR(255),
  category VARCHAR(100),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

# Crear tabla de carritos
CREATE TABLE carts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  productId INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (productId) REFERENCES products(id)
);

# Crear tabla de órdenes
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  shippingAddress TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);

# Crear tabla de chatbot
CREATE TABLE chatbots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  userMessage TEXT NOT NULL,
  botResponse TEXT NOT NULL,
  intent ENUM('product_inquiry', 'order_status', 'shipping', 'return', 'general') DEFAULT 'general',
  resolved BOOLEAN DEFAULT FALSE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);

# Crear tabla de reservas
CREATE TABLE reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  productId INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  reservationDate DATETIME NOT NULL,
  pickupDate DATETIME,
  status ENUM('pending', 'confirmed', 'ready', 'picked_up', 'cancelled') DEFAULT 'pending',
  notes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (productId) REFERENCES products(id)
);

# Insertar usuario admin de prueba (password: admin123)
INSERT INTO users (email, password, name, role) 
VALUES ('admin@tienda.com', '$2a$10$XYZ...', 'Admin', 'admin');

# Insertar productos de prueba
INSERT INTO products (name, description, price, stock, category) VALUES
('Nike Air Max 90', 'Zapatillas clásicas con gran comodidad', 129.99, 20, 'running'),
('Adidas Ultraboost', 'Máxima amortiguación para correr', 179.99, 15, 'running'),
('Puma RS-X', 'Estilo retro con tecnología moderna', 99.99, 30, 'casual'),
('New Balance 574', 'Diseño icónico y versátil', 89.99, 25, 'casual');
```

---

## ⚙️ Paso 2: Configurar Backend

### 2.1 Navegar a la carpeta backend
```powershell
cd backend
```

### 2.2 Instalar dependencias
```powershell
npm install
```

### 2.3 Crear archivo .env
```powershell
# Copia el ejemplo
copy .env.example .env

# Edita .env con tus credenciales
# Usa Notepad o VS Code
notepad .env
```

**Contenido del .env:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_mysql
DB_NAME=tienda_sneakers
DB_PORT=3306
JWT_SECRET=mi_secreto_super_seguro_123
PORT=3000
NODE_ENV=development
```

### 2.4 Iniciar el servidor backend
```powershell
# Modo desarrollo (con auto-reload)
npm run dev

# O modo producción
npm start
```

**Resultado esperado:**
```
Servidor corriendo en puerto 3000
```

### 2.5 Probar endpoints
Abre un navegador o usa Postman:

```
http://localhost:3000
```

Deberías ver:
```json
{
  "message": "API Tennis Store funcionando correctamente"
}
```

---

## 🎨 Paso 3: Configurar Frontend

### 3.1 Abrir nueva terminal y navegar a frontend
```powershell
cd tennis-frontend
```

### 3.2 Instalar dependencias
```powershell
npm install
```

### 3.3 Configurar variables de entorno
Edita `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

### 3.4 Iniciar el servidor de desarrollo
```powershell
ng serve
```

**O si prefieres:**
```powershell
npm start
```

**Resultado esperado:**
```
** Angular Live Development Server is listening on localhost:4200 **
✔ Compiled successfully.
```

### 3.5 Abrir en navegador
Navega a:
```
http://localhost:4200
```

---

## 🧪 Paso 4: Ejecutar Tests

### Backend Tests
```powershell
cd backend

# Tests básicos
npm test

# Tests con cobertura
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

**Resultado esperado:**
```
Test Suites: X passed, X total
Tests:       X passed, X total
Coverage:    > 90%
```

---

## 🔍 Paso 5: Verificar Funcionalidades

### 5.1 Probar API con cURL o Postman

**Registrar usuario:**
```powershell
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{\"email\":\"test@test.com\",\"password\":\"123456\",\"name\":\"Test User\"}'
```

**Login:**
```powershell
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{\"email\":\"test@test.com\",\"password\":\"123456\"}'
```

**Obtener productos:**
```powershell
curl http://localhost:3000/api/products
```

**Enviar mensaje al chatbot:**
```powershell
curl -X POST http://localhost:3000/api/chatbot/message -H "Content-Type: application/json" -d '{\"userId\":1,\"userMessage\":\"Hola, necesito ayuda\"}'
```

**Crear reserva (requiere token):**
```powershell
curl -X POST http://localhost:3000/api/reservations -H "Authorization: Bearer TU_TOKEN" -H "Content-Type: application/json" -d '{\"userId\":1,\"productId\":1,\"quantity\":2,\"reservationDate\":\"2025-01-15\"}'
```

### 5.2 Probar Frontend

1. **Abrir** `http://localhost:4200`
2. **Registrarse** o hacer login
3. **Ver productos**
4. **Agregar al carrito**
5. **Crear una orden**
6. **Probar el chatbot**
7. **Crear una reserva**

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"
```powershell
# Verifica que MySQL esté corriendo
mysql --version
mysql -u root -p

# Verifica las credenciales en .env
```

### Error: "Port 3000 already in use"
```powershell
# Encuentra y cierra el proceso
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# O cambia el puerto en .env
PORT=3001
```

### Error: "npm not found"
```powershell
# Instala Node.js
# https://nodejs.org/

# Verifica instalación
node --version
npm --version
```

### Error: "Module not found"
```powershell
# Elimina node_modules y reinstala
rm -r node_modules
rm package-lock.json
npm install
```

### Error de CORS
Verifica que el backend tenga configurado CORS:
```javascript
// En app.js
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
```

---

## 📊 Verificar Métricas de Calidad

### Ejecutar herramienta de evaluación
```powershell
cd quality-assessment

# Activar entorno virtual (si aplica)
.\venv\Scripts\Activate.ps1

# Extraer métricas
python extraer_metricas.py

# Iniciar Streamlit
python -m streamlit run app.py
```

Abre `http://localhost:8501` para ver las métricas de calidad.

---

## ✅ Checklist de Verificación

- [ ] MySQL instalado y corriendo
- [ ] Base de datos creada con todas las tablas
- [ ] Backend instalado y corriendo en puerto 3000
- [ ] Frontend instalado y corriendo en puerto 4200
- [ ] Tests del backend pasando
- [ ] API respondiendo correctamente
- [ ] Frontend carga sin errores
- [ ] Registro de usuario funciona
- [ ] Login funciona
- [ ] Productos se muestran
- [ ] Carrito funciona
- [ ] Chatbot responde
- [ ] Reservas se crean correctamente

---

## 📱 Estructura de URLs

| Servicio | URL | Descripción |
|----------|-----|-------------|
| Backend API | http://localhost:3000 | Servidor Express |
| Frontend | http://localhost:4200 | Aplicación Angular |
| Métricas | http://localhost:8501 | Dashboard Streamlit |

---

## 🔐 Credenciales de Prueba

**Admin:**
- Email: admin@tienda.com
- Password: admin123

**Usuario Test:**
- Email: test@test.com
- Password: 123456

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en la consola
2. Verifica las credenciales en `.env`
3. Asegúrate de que todos los servicios estén corriendo
4. Revisa la documentación en `NUEVOS_MODULOS.md`

---

**¡Listo para usar!** 🚀
