import app from './app';
import { config } from './config';
import { logger } from './utils/logger';

const PORT = config.port;
const HOST = config.host;

// Start server
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://${HOST}:${PORT}`);
  logger.info(`📚 API documentation: http://${HOST}:${PORT}/api/v1/health`);
  logger.info(`🔧 Environment: ${config.env}`);
});

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    logger.error('Forced shutdown due to timeout');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

export default server;
