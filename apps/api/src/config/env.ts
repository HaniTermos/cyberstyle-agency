import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const rawNodeEnv = process.env.NODE_ENV || 'development';
const isProductionOrStaging = rawNodeEnv === 'production' || rawNodeEnv === 'staging';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
  PORT: z.string().transform(Number).default('4000'),
  API_URL: z.string().url().default('http://localhost:4000'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  REDIS_URL: z.string().optional().default('redis://localhost:6379'),
  AUTH_SECRET: z
    .string()
    .min(32, 'AUTH_SECRET must be at least 32 characters in production')
    .refine(
      (val) => !isProductionOrStaging || !val.includes('development_secret'),
      'In production/staging, AUTH_SECRET must not use development placeholder keys'
    ),
  SESSION_SECRET: z
    .string()
    .min(32, 'SESSION_SECRET must be at least 32 characters in production')
    .refine(
      (val) => !isProductionOrStaging || !val.includes('development_session'),
      'In production/staging, SESSION_SECRET must not use development placeholder keys'
    ),
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET must be at least 32 characters in production')
    .refine(
      (val) => !isProductionOrStaging || (!val.includes('change_me') && !val.includes('development_jwt')),
      'In production/staging, JWT_SECRET must not use development placeholder keys'
    )
    .default(isProductionOrStaging ? '' : 'development_jwt_secret_change_in_production_min_32_bytes!'),
  COOKIE_DOMAIN: z.string().optional(),
  CORS_ORIGINS: z.string().default('http://localhost:3000,https://cyberstyle.net'),
  SMTP_HOST: z.string().default('smtp.hostinger.com'),
  SMTP_PORT: z.string().transform(Number).default('465'),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().default('CYBERSTYLE <hello@cyberstyle.net>'),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  ALERT_WEBHOOK_URL: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
});

const parseTarget = {
  ...process.env,
  NODE_ENV: rawNodeEnv,
  AUTH_SECRET: process.env.AUTH_SECRET || (isProductionOrStaging ? '' : 'development_secret_key_change_in_production_min_32_bytes!'),
  SESSION_SECRET: process.env.SESSION_SECRET || (isProductionOrStaging ? '' : 'development_session_secret_change_in_production_min_32_bytes!'),
  JWT_SECRET: process.env.JWT_SECRET || (isProductionOrStaging ? '' : 'development_jwt_secret_change_in_production_min_32_bytes!'),
  DATABASE_URL: process.env.DATABASE_URL || (isProductionOrStaging ? '' : 'postgresql://postgres:postgres@localhost:5432/cyberstyle_db?schema=public'),
};

const _env = envSchema.safeParse(parseTarget);

if (!_env.success) {
  console.error('❌ FATAL: Invalid or insecure environment configuration:');
  console.error(JSON.stringify(_env.error.format(), null, 2));
  if (isProductionOrStaging) {
    process.exit(1);
  }
}

export const env = _env.success
  ? _env.data
  : envSchema.parse({
      ...parseTarget,
      AUTH_SECRET: 'development_secret_key_change_in_production_min_32_bytes!',
      SESSION_SECRET: 'development_session_secret_change_in_production_min_32_bytes!',
      JWT_SECRET: 'development_jwt_secret_change_in_production_min_32_bytes!',
      DATABASE_URL: parseTarget.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/cyberstyle_db?schema=public',
    });

