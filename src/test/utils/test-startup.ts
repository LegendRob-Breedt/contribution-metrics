import 'reflect-metadata';
import Fastify from 'fastify';
import { config } from '../../shared/config/index.js';
import { initializeTracing } from '../../shared/instrumentation/tracing.js';

// Simple test to verify basic startup
async function testStartup() {
  console.log('Loading config...');
  const appConfig = await config;
  console.log('Config loaded:', appConfig.NODE_ENV, appConfig.PORT);

  console.log('Initializing tracing...');
  initializeTracing(
    appConfig.OTEL_SERVICE_NAME || 'contribution-metrics',
    appConfig.OTEL_SERVICE_VERSION || '1.0.0',
    appConfig.OTEL_EXPORTER_OTLP_ENDPOINT
  );
  console.log('Tracing initialized');

  console.log('Creating Fastify instance...');
  const fastify = Fastify({
    logger: true,
  });
  console.log('Fastify instance created');

  // Simple health endpoint
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });
  console.log('Health route registered');

  try {
    console.log('Starting server...');
    await fastify.listen({
      port: appConfig.PORT,
      host: appConfig.HOST,
    });
    console.log(`Server running on http://${appConfig.HOST}:${appConfig.PORT}`);
  } catch (err) {
    console.error('Server startup failed:', err);
    process.exit(1);
  }
}

testStartup().catch(error => {
  console.error('Startup failed:', error);
  process.exit(1);
});
