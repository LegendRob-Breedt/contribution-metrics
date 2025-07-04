import 'reflect-metadata';
import Fastify from 'fastify';
import { config } from './shared/config/index.js';
import { createAppDataSource } from './shared/database/index.js';
import zodOpenApiPlugin from './shared/plugins/zod-openapi.js';
import { initializeTracing, shutdownTracing } from './shared/instrumentation/tracing.js';
import { initializeMetrics, shutdownMetrics } from './shared/instrumentation/metrics.js';
import { createAppContainer } from './shared/container/index.js';
import { githubOrganizationRoutes } from './modules/github-organization/routes/github-organization.routes.js';
import { userRoutes } from './modules/user/routes/user.routes.js';
import { githubContributorRoutes } from './modules/github-contributor/routes/github-contributor.routes.js';
import packackInfo from '../package.json' with { type: 'json' };
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

  // Initialize OpenTelemetry metrics
  initializeMetrics(
    appConfig.OTEL_SERVICE_NAME || 'contribution-metrics',
    appConfig.OTEL_SERVICE_VERSION || '1.0.0'
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

  fastify.log.info(appConfig.SHOW_ENV_CONFIG);
  if (appConfig.SHOW_ENV_CONFIG)
    fastify.log.info('Loaded configuration:' + JSON.stringify(appConfig));

  // Register plugins
  await fastify.register(zodOpenApiPlugin);

  // Initialize database connection first
  let appDataSource: DataSource | undefined;
  try {
    appDataSource = await createAppDataSource();
    fastify.log.info('Database connection initializing...');
    await appDataSource.initialize();
    if (appDataSource.isInitialized) {
      fastify.log.info('Database connection established');
    }
  } catch (error) {
    fastify.log.error('Database connection failed:');
    fastify.log.error(error);
    fastify.log.info('Routes will run with mock data');
    // Don't exit the process - let the server run without database for now
  }

  // Register API routes with container
  if (appDataSource?.isInitialized) {
    const container = createAppContainer(appDataSource);
    await fastify.register(githubOrganizationRoutes, { container });
    await fastify.register(userRoutes, { container });
    await fastify.register(githubContributorRoutes, { container });
  }

  // Health check endpoint
  fastify.get('/health', async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: appConfig.OTEL_SERVICE_VERSION,
    } as JSONObject;
  });

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
    if (appDataSource) {
      await appDataSource.destroy();
    }
    await shutdownMetrics();
    await shutdownTracing(sdk);
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    fastify.log.info('Received SIGTERM, shutting down gracefully');
    await fastify.close();
    if (appDataSource) {
      await appDataSource.destroy();
    }
    await shutdownMetrics();
    await shutdownTracing(sdk);
    process.exit(0);
  });
}

// Start the application
startApplication().catch(error => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
