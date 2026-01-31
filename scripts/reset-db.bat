@echo off
chcp 65001 >nul

:: SberBank Online - Database Reset Script for Windows
:: This script resets the database and re-runs migrations and seeds

echo 🗑️ Resetting database...

:: Stop containers
echo 🛑 Stopping Docker containers...
call npm run db:down

:: Remove volumes
echo 🧹 Removing Docker volumes...
docker volume rm sber_postgres_data sber_redis_data 2>nul || echo Volumes already removed or not found

:: Start containers
echo 🐳 Starting Docker containers...
call npm run db:up
if errorlevel 1 (
    echo ❌ Failed to start Docker containers
    exit /b 1
)

:: Wait for PostgreSQL
echo ⏳ Waiting for PostgreSQL to be ready...
timeout /t 5 /nobreak >nul

:: Generate Prisma client
echo 🔧 Generating Prisma client...
call npm run db:generate
if errorlevel 1 (
    echo ❌ Failed to generate Prisma client
    exit /b 1
)

:: Run migrations
echo 🗄️ Running database migrations...
call npm run db:migrate
if errorlevel 1 (
    echo ❌ Failed to run migrations
    exit /b 1
)

:: Seed database
echo 🌱 Seeding database with test data...
call npm run db:seed
if errorlevel 1 (
    echo ❌ Failed to seed database
    exit /b 1
)

echo.
echo ✅ Database reset completed successfully!
echo.
echo 📚 Test credentials:
echo    Email: user@example.com
echo    Password: password123

pause
