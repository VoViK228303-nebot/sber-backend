import { PrismaClient } from '@prisma/client';
import { config } from '../config';

// Create Prisma client with logging in development
const prisma = new PrismaClient({
  log: config.env === 'development' 
    ? ['query', 'info', 'warn', 'error'] 
    : ['error'],
});

// Handle connection
prisma.$connect()
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  });

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export { prisma };
export default prisma;
