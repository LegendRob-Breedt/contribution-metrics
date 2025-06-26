import { loadConfig } from 'zod-config';
import { z } from 'zod';

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('localhost'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),

  // Database configuration
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5432),
  DB_USERNAME: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('password'),
  DB_DATABASE: z.string().default('contribution_metrics'),

  // OpenTelemetry configuration
  OTEL_SERVICE_NAME: z.string().default('contribution-metrics'),
  OTEL_SERVICE_VERSION: z.string().default('1.0.0'),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().optional(),

  // GitHub API configuration
  GITHUB_APP_ID: z.string().optional(),
  GITHUB_PRIVATE_KEY: z.string().optional(),
  GITHUB_WEBHOOK_SECRET: z.string().optional(),
});

export const config = loadConfig({
  schema: configSchema,
  adapters: [],
});

export type Config = z.infer<typeof configSchema>;
