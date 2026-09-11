import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().transform(Number).default('4000'),
  API_URL: z.string().url().default('http://localhost:4000'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  REDIS_URL: z.string().optional().default('redis://localhost:6379'),
  AUTH_SECRET: z.string().min(16, 'AUTH_SECRET must be at least 16 characters').default('development_secret_key_change_in_production'),
  SESSION_SECRET: z.string().min(16, 'SESSION_SECRET must be at least 16 characters').default('development_session_secret_change_in_production'),
  CORS_ORIGINS: z.string().default('http://localhost:3000,https://cyberstyle.net'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  // In development, provide helpful fallback warning instead of crashing if default works
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

export const env = _env.success ? _env.data : envSchema.parse({
  ...process.env,
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/cyberstyle_db?schema=public',
});
