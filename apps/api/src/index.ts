import { createServer } from './server';
import { env } from './config/env';
import { prisma } from './config/db';
import { getRedisClient } from './config/redis';
import { emailQueue } from './queues/email.queue';

const app = createServer();
const port = env.PORT || 4000;

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 CYBERSTYLE Express API running in [${env.NODE_ENV}] mode on http://0.0.0.0:${port}`);
  console.log(`📡 Health probe: http://localhost:${port}/api/health`);
  console.log(`📡 Ready probe:  http://localhost:${port}/api/ready`);
});

// Graceful Shutdown Handler
let isShuttingDown = false;

const handleShutdown = async (signal: string) => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`\n🛑 [API] Received ${signal}. Initiating graceful shutdown...`);

  // Force exit fallback if connections refuse to terminate within 8 seconds
  const forceExitTimer = setTimeout(() => {
    console.error('⚠️ [API] Graceful shutdown timeout exceeded (8s). Forcing termination.');
    process.exit(1);
  }, 8000);
  forceExitTimer.unref();

  try {
    // 1. Stop receiving new HTTP requests & drain in-flight connections
    await new Promise<void>((resolve) => {
      server.close((err) => {
        if (err) {
          console.warn('⚠️ [API] HTTP server close error:', err.message);
        } else {
          console.log('✅ [API] HTTP server closed: No longer accepting new connections.');
        }
        resolve();
      });
    });

    // 2. Close BullMQ queue connection
    try {
      await emailQueue.close();
      console.log('✅ [API] BullMQ queue connection closed.');
    } catch (e: any) {
      console.warn('⚠️ [API] BullMQ close notice:', e?.message || e);
    }

    // 3. Disconnect Redis client cleanly
    try {
      const redis = getRedisClient();
      if (redis && redis.status !== 'end') {
        await redis.quit().catch(() => redis.disconnect());
        console.log('✅ [API] Redis client disconnected cleanly.');
      }
    } catch (e: any) {
      console.warn('⚠️ [API] Redis disconnect notice:', e?.message || e);
    }

    // 4. Disconnect PostgreSQL Prisma connection pool
    try {
      await prisma.$disconnect();
      console.log('✅ [API] PostgreSQL (Prisma) connection pool disconnected cleanly.');
    } catch (e: any) {
      console.warn('⚠️ [API] Prisma disconnect notice:', e?.message || e);
    }

    console.log('🏁 [API] Graceful shutdown completed cleanly. Exiting.');
    clearTimeout(forceExitTimer);
    process.exit(0);
  } catch (error) {
    console.error('❌ [API] Fatal error during graceful shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

