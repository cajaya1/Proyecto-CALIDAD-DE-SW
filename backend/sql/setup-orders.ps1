# Script para crear la tabla orders en la base de datos
# Ejecutar: .\backend\sql\setup-orders.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Configuración de Tabla Orders" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Pedir credenciales de MySQL
$dbUser = Read-Host "Ingresa el usuario de MySQL (default: root)"
if ([string]::IsNullOrWhiteSpace($dbUser)) {
    $dbUser = "root"
}

$dbPassword = Read-Host "Ingresa la contraseña de MySQL" -AsSecureString
$dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword))

$dbName = Read-Host "Ingresa el nombre de la base de datos (default: tienda_sneakers)"
if ([string]::IsNullOrWhiteSpace($dbName)) {
    $dbName = "tienda_sneakers"
}

Write-Host ""
Write-Host "Conectando a MySQL..." -ForegroundColor Yellow

# Ruta al archivo SQL
$sqlFile = Join-Path $PSScriptRoot "create-orders-table.sql"

# Ejecutar el script SQL
try {
    # Crear el comando MySQL
    $mysqlCmd = "mysql -u $dbUser -p$dbPasswordPlain $dbName"
    
    # Ejecutar el script
    Get-Content $sqlFile | & mysql -u $dbUser -p"$dbPasswordPlain" $dbName 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Tabla 'orders' creada exitosamente!" -ForegroundColor Green
        Write-Host "✅ Tabla 'order_items' creada exitosamente!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Ahora puedes ejecutar los tests ISO25022:" -ForegroundColor Cyan
        Write-Host "  npm run test:iso25022:html" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "❌ Error al crear las tablas" -ForegroundColor Red
        Write-Host "Verifica que la base de datos '$dbName' exista y que tengas los permisos necesarios" -ForegroundColor Yellow
        Write-Host ""
    }
} catch {
    Write-Host ""
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Solución manual:" -ForegroundColor Yellow
    Write-Host "1. Abre MySQL Workbench o consola MySQL" -ForegroundColor White
    Write-Host "2. Conecta a la base de datos $dbName" -ForegroundColor White
    Write-Host "3. Ejecuta el contenido de: backend\sql\create-orders-table.sql" -ForegroundColor White
    Write-Host ""
}

# Limpiar la contraseña de la memoria
$dbPasswordPlain = $null
