import { createServer } from './server';
import { env } from './config/env';

const app = createServer();
const port = env.PORT || 4000;

const server = app.listen(port, () => {
  console.log(`🚀 CYBERSTYLE Express API running in [${env.NODE_ENV}] mode on http://localhost:${port}`);
  console.log(`📡 Health probe: http://localhost:${port}/api/health`);
  console.log(`📡 Ready probe:  http://localhost:${port}/api/ready`);
});

// Graceful Shutdown
const handleShutdown = (signal: string) => {
  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('✅ HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
