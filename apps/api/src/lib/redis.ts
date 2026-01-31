import Redis from 'ioredis';
import { config } from '../config';

// Create Redis client
const redis = new Redis(config.redis.url, {
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

// Handle connection events
redis.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redis.on('error', (error: Error) => {
  console.error('❌ Redis error:', error.message);
});

redis.on('close', () => {
  console.log('⚠️ Redis connection closed');
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await redis.quit();
});

export { redis };
export default redis;
