#!/bin/bash

# SberBank Online - Setup Script
# This script sets up the entire project from scratch

set -e

echo "🚀 Setting up SberBank Online project..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version 18+ is required. Current version: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js version: $(node -v)${NC}"

# Install root dependencies
echo -e "${YELLOW}📦 Installing root dependencies...${NC}"
npm install

# Install web app dependencies
echo -e "${YELLOW}📦 Installing web app dependencies...${NC}"
cd apps/web
npm install
cd ../..

# Install API dependencies
echo -e "${YELLOW}📦 Installing API dependencies...${NC}"
cd apps/api
npm install
cd ../..

# Start Docker containers
echo -e "${YELLOW}🐳 Starting Docker containers (PostgreSQL & Redis)...${NC}"
npm run db:up

# Wait for PostgreSQL to be ready
echo -e "${YELLOW}⏳ Waiting for PostgreSQL to be ready...${NC}"
sleep 5

# Setup environment files
echo -e "${YELLOW}⚙️  Setting up environment files...${NC}"

if [ ! -f apps/web/.env ]; then
    cp apps/web/.env.example apps/web/.env
    echo -e "${GREEN}✅ Created apps/web/.env${NC}"
else
    echo -e "${YELLOW}⚠️  apps/web/.env already exists${NC}"
fi

if [ ! -f apps/api/.env ]; then
    cp apps/api/.env.example apps/api/.env
    echo -e "${GREEN}✅ Created apps/api/.env${NC}"
else
    echo -e "${YELLOW}⚠️  apps/api/.env already exists${NC}"
fi

# Generate Prisma client
echo -e "${YELLOW}🔧 Generating Prisma client...${NC}"
npm run db:generate

# Run migrations
echo -e "${YELLOW}🗄️  Running database migrations...${NC}"
npm run db:migrate

# Seed database
echo -e "${YELLOW}🌱 Seeding database with test data...${NC}"
npm run db:seed

echo ""
echo -e "${GREEN}✅ Setup completed successfully!${NC}"
echo ""
echo "🎉 You can now start the application with:"
echo "   npm run dev"
echo ""
echo "📚 Test credentials:"
echo "   Email: user@example.com"
echo "   Password: password123"
echo ""
echo "📖 Documentation:"
echo "   - README.md"
echo "   - docs/SETUP.md"
echo "   - docs/API_SPEC.md"
