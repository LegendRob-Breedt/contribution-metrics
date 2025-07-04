import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino';
import { FastifyInstrumentation } from '@opentelemetry/instrumentation-fastify';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';

// Initialize OpenTelemetry SDK
export function initializeTracing(
  serviceName: string,
  serviceVersion: string,
  otlpEndpoint?: string
) {
  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: serviceName,
      [ATTR_SERVICE_VERSION]: serviceVersion,
    }),
    traceExporter: otlpEndpoint
      ? new OTLPTraceExporter({
          url: otlpEndpoint,
          headers: {},
        })
      : undefined,
    instrumentations: [
      // Add Pino and Fastify instrumentations
      new PinoInstrumentation({
        logHook: (span, record) => {
          // Add trace context to log records
          const spanContext = span.spanContext();
          if (spanContext) {
            record['trace_id'] = spanContext.traceId;
            record['span_id'] = spanContext.spanId;
          }
        },
      }),
      new FastifyInstrumentation({
        // Configure Fastify instrumentation
        requestHook: (span, requestInfo) => {
          // Add custom attributes to spans safely
          try {
            const request = requestInfo.request as { headers?: Record<string, string> };
            if (request?.headers?.['content-length']) {
              span.setAttributes({
                'http.request.body.size': parseInt(request.headers['content-length'], 10) || 0,
              });
            }
          } catch {
            // Ignore errors in request hook
          }
        },
      }),
      // Add other auto-instrumentations but exclude pino and fastify to avoid conflicts
      ...getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-pino': {
          enabled: false,
        },
        '@opentelemetry/instrumentation-fastify': {
          enabled: false,
        },
      }),
    ],
  });

  // Start the SDK
  try {
    sdk.start();
    console.log('OpenTelemetry initialized successfully');
  } catch (error) {
    console.error('Failed to initialize OpenTelemetry:', error);
  }

  return sdk;
}

// Graceful shutdown
export function shutdownTracing(sdk: NodeSDK) {
  return sdk.shutdown();
}
