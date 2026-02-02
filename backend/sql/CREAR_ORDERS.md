# 🔧 Crear Tabla Orders - Guía Rápida

## Problema
Los tests ISO25022 fallan porque la tabla `orders` no existe en la base de datos.

## Solución Rápida

### Opción 1: Script Automático (PowerShell)

```powershell
cd backend\sql
.\setup-orders.ps1
```

El script te pedirá:
- Usuario de MySQL (default: root)
- Contraseña de MySQL
- Nombre de la base de datos (default: tienda_sneakers)

### Opción 2: MySQL Workbench

1. Abre MySQL Workbench
2. Conecta a tu servidor MySQL
3. Selecciona la base de datos `tienda_sneakers`
4. Abre el archivo `backend/sql/create-orders-table.sql`
5. Ejecuta el script (botón ⚡ o Ctrl+Shift+Enter)

### Opción 3: Línea de Comandos MySQL

```bash
# Windows
mysql -u root -p tienda_sneakers < backend\sql\create-orders-table.sql

# Linux/Mac
mysql -u root -p tienda_sneakers < backend/sql/create-orders-table.sql
```

## Verificación

Después de crear la tabla, verifica que existe:

```sql
USE tienda_sneakers;
SHOW TABLES LIKE 'orders';
DESCRIBE orders;
```

Deberías ver:
- Tabla: `orders` con columnas: id, user_id, total, status, created_at
- Tabla: `order_items` con columnas: id, order_id, product_id, quantity, price, created_at

## Ejecutar Tests

Una vez creada la tabla:

```bash
npm run test:iso25022:html
```

Los tests de "Crear orden" deberían pasar ahora. ✅

## Problemas Comunes

### Error: Access denied
- Verifica que el usuario tenga permisos en la base de datos
- Usa: `GRANT ALL PRIVILEGES ON tienda_sneakers.* TO 'root'@'localhost';`

### Error: Base de datos no existe
- Crea la base de datos primero: `CREATE DATABASE tienda_sneakers;`
- Luego ejecuta el script de creación de tablas

### Error: Tabla users no existe
- La tabla orders requiere que exista la tabla users primero
- Ejecuta el schema completo: `backend/sql/schema.sql`

## Resultado Esperado

Después de crear las tablas, los tests ISO25022 deberían mostrar:

- ✅ Completitud de Tareas: **87.5%** (7/8 tareas)
- ✅ Crear orden: **Completada**
- 🎯 Tasa de éxito general: **~92%**
