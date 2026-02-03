#!/usr/bin/env powershell

# 🚀 Script de inicio rápido para gastosfront

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          💼 Gestor de Gastos y Presupuestos             ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js no está instalado" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js versión: $(node -v)" -ForegroundColor Green

# Verificar npm
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm no está instalado" -ForegroundColor Red
    exit 1
}

Write-Host "✅ npm versión: $(npm -v)" -ForegroundColor Green
Write-Host ""

# Instalar dependencias
Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencias instaladas" -ForegroundColor Green
} else {
    Write-Host "❌ Error al instalar dependencias" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 ¡Listo para comenzar!" -ForegroundColor Green
Write-Host ""
Write-Host "Comandos disponibles:" -ForegroundColor Cyan
Write-Host "  npm start      - Inicia el servidor de desarrollo (http://localhost:4200)" -ForegroundColor White
Write-Host "  npm test       - Ejecuta los tests" -ForegroundColor White
Write-Host "  npm run build  - Crea una compilación para producción" -ForegroundColor White
Write-Host ""
Write-Host "📖 Documentación:" -ForegroundColor Cyan
Write-Host "  - SETUP.md  - Guía completa de la aplicación" -ForegroundColor White
Write-Host "  - MEJORAS.md - Mejoras adicionales opcionales" -ForegroundColor White
Write-Host ""
