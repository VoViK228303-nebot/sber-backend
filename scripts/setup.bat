@echo off
chcp 65001 >nul

:: SberBank Online - Setup Script for Windows
:: This script sets up the entire project from scratch

echo 🚀 Setting up SberBank Online project...

:: Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker first.
    exit /b 1
)

:: Check Node.js
node -v >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

for /f "tokens=1 delims=." %%a in ('node -v') do (
    set NODE_MAJOR=%%a
)
set NODE_MAJOR=%NODE_MAJOR:v=%

if %NODE_MAJOR% LSS 18 (
    echo ❌ Node.js version 18+ is required.
    exit /b 1
)

echo ✅ Node.js version: 
node -v

:: Install root dependencies
echo 📦 Installing root dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install root dependencies
    exit /b 1
)

:: Install web app dependencies
echo 📦 Installing web app dependencies...
cd apps/web
call npm install
if errorlevel 1 (
    echo ❌ Failed to install web dependencies
    exit /b 1
)
cd ..\..

:: Install API dependencies
echo 📦 Installing API dependencies...
cd apps/api
call npm install
if errorlevel 1 (
    echo ❌ Failed to install API dependencies
    exit /b 1
)
cd ..\..

:: Start Docker containers
echo 🐳 Starting Docker containers (PostgreSQL ^& Redis)...
call npm run db:up
if errorlevel 1 (
    echo ❌ Failed to start Docker containers
    exit /b 1
)

:: Wait for PostgreSQL
echo ⏳ Waiting for PostgreSQL to be ready...
timeout /t 5 /nobreak >nul

:: Setup environment files
echo ⚙️ Setting up environment files...

if not exist apps\web\.env (
    copy apps\web\.env.example apps\web\.env
    echo ✅ Created apps/web/.env
) else (
    echo ⚠️ apps/web/.env already exists
)

if not exist apps\api\.env (
    copy apps\api\.env.example apps\api\.env
    echo ✅ Created apps/api/.env
) else (
    echo ⚠️ apps/api/.env already exists
)

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
echo ✅ Setup completed successfully!
echo.
echo 🎉 You can now start the application with:
echo    npm run dev
echo.
echo 📚 Test credentials:
echo    Email: user@example.com
echo    Password: password123
echo.
echo 📖 Documentation:
echo    - README.md
echo    - docs/SETUP.md
echo    - docs/API_SPEC.md

pause
