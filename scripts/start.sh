#!/bin/bash

# ==========================================
# 🏦 SBER Банк - Запуск приложения
# ==========================================

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==========================================${NC}"
echo -e "${BLUE}🏦 SBER Банк - Запуск приложения${NC}"
echo -e "${BLUE}==========================================${NC}"
echo ""

# Проверка наличия Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker не установлен. Пожалуйста, установите Docker.${NC}"
    exit 1
fi

# Проверка наличия Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js не установлен. Пожалуйста, установите Node.js.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker найден${NC}"
echo -e "${GREEN}✅ Node.js найден${NC}"
echo ""

# Переход в корневую директорию проекта
cd "$(dirname "$0")/.."

# Запуск Docker Compose
echo -e "${YELLOW}🐳 Запуск PostgreSQL и Redis...${NC}"
docker-compose up -d
echo -e "${GREEN}✅ База данных и Redis запущены${NC}"
echo ""

# Ожидание запуска БД
echo -e "${YELLOW}⏳ Ожидание запуска базы данных (5 секунд)...${NC}"
sleep 5

# Применение миграций Prisma
echo -e "${YELLOW}🔄 Применение миграций Prisma...${NC}"
cd apps/api
npx prisma migrate deploy || echo -e "${YELLOW}⚠️  Миграции уже применены или требуется их создание${NC}"
echo ""

# Генерация Prisma Client
echo -e "${YELLOW}🔄 Генерация Prisma Client...${NC}"
npx prisma generate
echo ""

# Сидирование базы данных
echo -e "${YELLOW}🌱 Сидирование базы данных...${NC}"
npx prisma db seed || echo -e "${YELLOW}⚠️  Ошибка сидирования, возможно данные уже существуют${NC}"
echo ""

cd ../..

# Установка зависимостей
echo -e "${YELLOW}📦 Проверка зависимостей...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Установка корневых зависимостей...${NC}"
    npm install
fi

if [ ! -d "apps/api/node_modules" ]; then
    echo -e "${YELLOW}📦 Установка зависимостей API...${NC}"
    cd apps/api && npm install && cd ../..
fi

if [ ! -d "apps/web/node_modules" ]; then
    echo -e "${YELLOW}📦 Установка зависимостей Web...${NC}"
    cd apps/web && npm install && cd ../..
fi

echo ""

# Запуск приложения
echo -e "${BLUE}==========================================${NC}"
echo -e "${BLUE}🚀 Запуск приложения...${NC}"
echo -e "${BLUE}==========================================${NC}"
echo ""
echo -e "${GREEN}📱 Фронтенд будет доступен на: http://localhost:5173${NC}"
echo -e "${GREEN}🔌 API будет доступен на: http://localhost:3001${NC}"
echo -e "${GREEN}📊 Prisma Studio: http://localhost:5555 (запустите отдельно: npm run db:studio)${NC}"
echo ""
echo -e "${YELLOW}Тестовые данные для входа:${NC}"
echo -e "${YELLOW}  Email: admin@sberbank.ru${NC}"
echo -e "${YELLOW}  Пароль: Admin123!${NC}"
echo ""
echo -e "${YELLOW}  Email: user@example.com${NC}"
echo -e "${YELLOW}  Пароль: User123!${NC}"
echo ""
echo -e "${RED}Нажмите Ctrl+C для остановки${NC}"
echo ""

npm run dev
