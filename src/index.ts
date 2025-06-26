import 'reflect-metadata';
import Fastify from 'fastify';
import { config } from './config/index.js';
import { createAppDataSource } from './database/index.js';
import zodOpenApiPlugin from './plugins/zod-openapi.js';
import { initializeTracing, shutdownTracing } from './tracing.js';
import packackInfo from '../package.json' assert { type: 'json' };
import type { JSONObject } from '@fastify/swagger';
import type { DataSource } from 'typeorm';

// Main async function to initialize the application
async function startApplication() {
  // Load config
  const appConfig = await config;
  appConfig.OTEL_SERVICE_VERSION = packackInfo.version || appConfig.OTEL_SERVICE_VERSION;

  // Initialize OpenTelemetry tracing
  const sdk = initializeTracing(
    appConfig.OTEL_SERVICE_NAME || 'contribution-metrics',
    appConfig.OTEL_SERVICE_VERSION || '1.0.0',
    appConfig.OTEL_EXPORTER_OTLP_ENDPOINT
  );

  const fastify = Fastify({
    logger: true,
    ajv: {
      customOptions: {
        strict: 'log',
        keywords: ['example'],
      },
    },
  });

  // Register plugins
  await fastify.register(zodOpenApiPlugin);

  // Health check endpoint
  fastify.get('/health', async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: appConfig.OTEL_SERVICE_VERSION,
    } as JSONObject;
  });

  // Initialize database connection asynchronously (non-blocking)
  let AppDataSource: DataSource;
  const initializeDatabase = async () => {
    try {
      AppDataSource = await createAppDataSource();
      await AppDataSource.initialize();
      fastify.log.info('Database connection established');
    } catch (error) {
      fastify.log.error('Database connection failed:', error);
      // Don't exit the process - let the server run without database for now
    }
  };

  // Start database initialization but don't wait for it
  initializeDatabase();

  // Start server
  try {
    await fastify.listen({
      port: appConfig.PORT,
      host: appConfig.HOST,
    });
    fastify.log.info(`Server running on http://${appConfig.HOST}:${appConfig.PORT}`);
    fastify.log.info(
      `API documentation available at http://${appConfig.HOST}:${appConfig.PORT}/documentation`
    );
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  // Graceful shutdown handlers
  process.on('SIGINT', async () => {
    fastify.log.info('Received SIGINT, shutting down gracefully');
    await fastify.close();
    if (AppDataSource) {
      await AppDataSource.destroy();
    }
    await shutdownTracing(sdk);
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    fastify.log.info('Received SIGTERM, shutting down gracefully');
    await fastify.close();
    if (AppDataSource) {
      await AppDataSource.destroy();
    }
    await shutdownTracing(sdk);
    process.exit(0);
  });
}

// Start the application
startApplication().catch(error => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
