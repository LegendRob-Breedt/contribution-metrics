import { MeterProvider } from '@opentelemetry/sdk-metrics';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { metrics } from '@opentelemetry/api';

let meterProvider: MeterProvider | null = null;
let prometheusExporter: PrometheusExporter | null = null;

/**
 * Initialize OpenTelemetry metrics collection with Prometheus exporter
 * @param serviceName - Name of the service
 * @param serviceVersion - Version of the service
 * @param prometheusEndpoint - Prometheus metrics endpoint (default: '/metrics')
 * @param prometheusPort - Port for Prometheus metrics server (default: 9464)
 */
export function initializeMetrics(
  serviceName: string,
  serviceVersion: string,
  prometheusEndpoint = '/metrics',
  prometheusPort = 9464
) {
  try {
    // Create resource
    const resource = resourceFromAttributes({
      [ATTR_SERVICE_NAME]: serviceName,
      [ATTR_SERVICE_VERSION]: serviceVersion,
    });

    // Create Prometheus exporter
    prometheusExporter = new PrometheusExporter({
      endpoint: prometheusEndpoint,
      port: prometheusPort,
    });

    // Create meter provider
    meterProvider = new MeterProvider({
      resource,
      readers: [prometheusExporter],
    });

    // Set global meter provider
    metrics.setGlobalMeterProvider(meterProvider);

    console.log(
      `OpenTelemetry metrics initialized successfully on port ${prometheusPort}${prometheusEndpoint}`
    );
    
    return meterProvider;
  } catch (error) {
    console.error('Failed to initialize OpenTelemetry metrics:', error);
    throw error;
  }
}

/**
 * Get the global meter instance for creating metrics instruments
 * @param name - Name of the meter (usually the module or service name)
 * @param version - Version of the meter
 */
export function getMeter(name: string, version?: string) {
  return metrics.getMeter(name, version);
}

/**
 * Shutdown metrics collection
 */
export async function shutdownMetrics() {
  try {
    if (meterProvider) {
      await meterProvider.shutdown();
      console.log('OpenTelemetry metrics shut down successfully');
    }
  } catch (error) {
    console.error('Error shutting down OpenTelemetry metrics:', error);
  }
}

/**
 * Force collection of metrics (useful for testing)
 */
export async function forceMetricsCollection() {
  try {
    if (meterProvider) {
      await meterProvider.forceFlush();
    }
  } catch (error) {
    console.error('Error forcing metrics collection:', error);
  }
}
