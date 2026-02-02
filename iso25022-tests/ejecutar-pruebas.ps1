# Script para ejecutar pruebas ISO 25022
# Este script levanta el servidor mock y ejecuta las pruebas

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "   ISO 25022 - Sistema de Pruebas de Calidad en Uso" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Detener procesos Node.js existentes
Write-Host "Deteniendo procesos Node.js existentes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Levantar el servidor mock en segundo plano
Write-Host "Iniciando servidor mock..." -ForegroundColor Green
$backendPath = Join-Path $PSScriptRoot "..\backend"
$job = Start-Job -ScriptBlock {
    param($path)
    Set-Location $path
    node mock-server.js
} -ArgumentList $backendPath

# Esperar a que el servidor inicie
Write-Host "Esperando a que el servidor inicie..." -ForegroundColor Yellow
Start-Sleep -Seconds 4

# Verificar que el servidor está corriendo
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/" -UseBasicParsing -TimeoutSec 5
    Write-Host "Servidor mock corriendo correctamente - StatusCode: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Advertencia: No se pudo verificar el servidor, pero continuando..." -ForegroundColor Yellow
}

Write-Host ""
# Ejecutar las pruebas
Write-Host "Ejecutando pruebas ISO 25022..." -ForegroundColor Cyan
Write-Host "----------------------------------------------------------------" -ForegroundColor Gray
Write-Host ""

node run-tests.js

# Abrir el reporte HTML
Write-Host ""
Write-Host "Abriendo reporte HTML..." -ForegroundColor Green
Start-Process "reports\iso25022-report.html"

# Detener el servidor mock
Write-Host ""
Write-Host "Deteniendo servidor mock..." -ForegroundColor Yellow
Stop-Job $job -ErrorAction SilentlyContinue
Remove-Job $job -ErrorAction SilentlyContinue
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Proceso completado! El reporte se ha abierto en tu navegador." -ForegroundColor Green
Write-Host ""
