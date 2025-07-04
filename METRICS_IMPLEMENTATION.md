# OpenTelemetry Metrics Implementation

This document describes the OpenTelemetry metrics implementation added to the Contribution Metrics Service.

## Overview

The service now includes comprehensive metrics collection using OpenTelemetry SDK with Prometheus exporter for monitoring and observability.

## Implementation Details

### Dependencies Added
- `@opentelemetry/sdk-metrics` - OpenTelemetry metrics SDK (replaces deprecated `@opentelemetry/sdk-metrics-base`)
- `@opentelemetry/exporter-prometheus` - Prometheus metrics exporter

### Files Created/Modified

#### New Files
1. **`src/shared/instrumentation/metrics.ts`** - Core metrics initialization and management
2. **`src/shared/instrumentation/application-metrics.ts`** - Application-specific metrics definitions
3. **`prometheus.yml`** - Prometheus configuration for local development

#### Modified Files
1. **`src/index.ts`** - Added metrics initialization and graceful shutdown
2. **`src/modules/github-organization/application/github-organization.service.ts`** - Added metrics tracking example
3. **`docker-compose.yml`** - Added Prometheus service
4. **`.github/copilot-instructions.md`** - Updated to reference correct package

### Metrics Exposed

#### HTTP Metrics
- `http_requests_total` - Total number of HTTP requests
- `http_request_duration_seconds` - Duration of HTTP requests
- `http_requests_in_flight` - Number of HTTP requests currently being processed

#### Database Metrics
- `db_connections_active` - Number of active database connections
- `db_queries_total` - Total number of database queries executed
- `db_query_duration_seconds` - Duration of database queries

#### Business Metrics
- `github_organizations_total` - Total number of GitHub organizations
- `github_contributors_total` - Total number of GitHub contributors
- `users_total` - Total number of users

### Metrics Endpoint

The metrics are exposed at:
- **URL**: `http://localhost:9464/metrics`
- **Format**: Prometheus format
- **Access**: Public endpoint (no authentication required)

### Prometheus Integration

The service is configured to work with Prometheus for metrics collection:

1. **Metrics Collection**: Prometheus scrapes metrics from the service every 5 seconds
2. **Service Discovery**: Configured to discover the service at `host.docker.internal:9464`
3. **Local Development**: Prometheus UI available at `http://localhost:9090`

### Usage Examples

#### Basic Metrics Usage
```typescript
import { applicationMetrics } from '../../../shared/instrumentation/application-metrics.js';

// Increment a counter
applicationMetrics.githubOrganizationsTotal.add(1);

// Record a duration
const startTime = Date.now();
// ... perform operation ...
const duration = (Date.now() - startTime) / 1000;
applicationMetrics.dbQueryDuration.record(duration, {
  operation: 'create_organization',
});
```

#### Creating Custom Metrics
```typescript
import { getMeter } from '../../../shared/instrumentation/metrics.js';

const meter = getMeter('my-module', '1.0.0');
const customCounter = meter.createCounter('my_custom_metric', {
  description: 'Description of my custom metric',
});

customCounter.add(1, { label: 'value' });
```

### Development Setup

1. **Start Services**: `docker-compose up -d`
2. **Run Application**: `pnpm dev`
3. **View Metrics**: Visit `http://localhost:9464/metrics`
4. **Prometheus UI**: Visit `http://localhost:9090`

### Production Considerations

1. **Security**: Consider adding authentication to the metrics endpoint in production
2. **Performance**: Metrics collection has minimal performance impact
3. **Storage**: Prometheus will store metrics locally; configure retention as needed
4. **Alerting**: Set up alerting rules based on business metrics
5. **Dashboards**: Create Grafana dashboards for visualization

### Next Steps

1. Add HTTP middleware to automatically track request metrics
2. Implement database query metrics at the repository level
3. Add custom business logic metrics to other services
4. Set up alerting rules for critical metrics
5. Create monitoring dashboards

## Architecture Compliance

This implementation follows the architecture guidelines specified in `copilot-instructions.md`:
- ✅ Uses `@opentelemetry/sdk-metrics` for metrics collection
- ✅ Integrates with Prometheus for metrics export
- ✅ Follows the hexagonal architecture pattern
- ✅ Uses proper separation of concerns
- ✅ Includes graceful shutdown handling
