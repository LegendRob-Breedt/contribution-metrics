import { getMeter } from '../instrumentation/metrics.js';
import type { Counter, Histogram, UpDownCounter } from '@opentelemetry/api';

/**
 * Common application metrics
 */
export class ApplicationMetrics {
  private meter = getMeter('contribution-metrics-app', '1.0.0');

  // HTTP request metrics
  public readonly httpRequestsTotal: Counter;
  public readonly httpRequestDuration: Histogram;
  public readonly httpRequestsInFlight: UpDownCounter;

  // Database metrics
  public readonly dbConnectionsActive: UpDownCounter;
  public readonly dbQueriesTotal: Counter;
  public readonly dbQueryDuration: Histogram;

  // Business metrics
  public readonly githubOrganizationsTotal: UpDownCounter;
  public readonly githubContributorsTotal: UpDownCounter;
  public readonly usersTotal: UpDownCounter;

  constructor() {
    // Initialize HTTP metrics
    this.httpRequestsTotal = this.meter.createCounter('http_requests_total', {
      description: 'Total number of HTTP requests',
    });

    this.httpRequestDuration = this.meter.createHistogram('http_request_duration_seconds', {
      description: 'Duration of HTTP requests in seconds',
      unit: 's',
    });

    this.httpRequestsInFlight = this.meter.createUpDownCounter('http_requests_in_flight', {
      description: 'Number of HTTP requests currently being processed',
    });

    // Initialize database metrics
    this.dbConnectionsActive = this.meter.createUpDownCounter('db_connections_active', {
      description: 'Number of active database connections',
    });

    this.dbQueriesTotal = this.meter.createCounter('db_queries_total', {
      description: 'Total number of database queries executed',
    });

    this.dbQueryDuration = this.meter.createHistogram('db_query_duration_seconds', {
      description: 'Duration of database queries in seconds',
      unit: 's',
    });

    // Initialize business metrics
    this.githubOrganizationsTotal = this.meter.createUpDownCounter('github_organizations_total', {
      description: 'Total number of GitHub organizations',
    });

    this.githubContributorsTotal = this.meter.createUpDownCounter('github_contributors_total', {
      description: 'Total number of GitHub contributors',
    });

    this.usersTotal = this.meter.createUpDownCounter('users_total', {
      description: 'Total number of users',
    });
  }
}

// Export a singleton instance
export const applicationMetrics = new ApplicationMetrics();
