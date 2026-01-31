# ==========================================
# 🏦 SBER Банк - Сидирование тестовых данных (Windows PowerShell)
# ==========================================

# Цвета для вывода
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Cyan"

Write-Host "==========================================" -ForegroundColor $Blue
Write-Host "🏦 SBER Банк - Сидирование тестовых данных" -ForegroundColor $Blue
Write-Host "==========================================" -ForegroundColor $Blue
Write-Host ""

# Переход в директорию API
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$apiDir = Join-Path (Split-Path -Parent $scriptDir) "apps\api"
Set-Location $apiDir

Write-Host "🌱 Запуск сидирования..." -ForegroundColor $Yellow
npx prisma db seed

Write-Host ""
Write-Host "✅ Тестовые данные успешно добавлены" -ForegroundColor $Green
Write-Host ""
Write-Host "Тестовые учетные записи:" -ForegroundColor $Blue
Write-Host ""
Write-Host "👤 Администратор:" -ForegroundColor $Green
Write-Host "  Email: admin@sberbank.ru"
Write-Host "  Пароль: Admin123!"
Write-Host ""
Write-Host "👤 Обычный пользователь:" -ForegroundColor $Green
Write-Host "  Email: user@example.com"
Write-Host "  Пароль: User123!"
Write-Host ""
