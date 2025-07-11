
---
applyTo: '**'
---
- Coding standards, domain knowledge, and preferences that AI should follow.
- When implementing changes only do what I ask. You can suggest additional changes with number options but there must always be a Do Not Implement Option and a REMEMBER FOR LATER IMPLEMENTATION option.
- If errors are encountered on service startup whilst making development changes, confirm the changes with me before proceeding.
- Do not MOCK any code that will be used in production. Use the actual code and ensure it is tested.
- Defer to using functionality that is already provided by existing frameworks and libraries, such as Fastify, TypeORM, and neverthrow rather than generating custom implementations unless absolutely necessary.
- Do not use any experimental or untested features unless specifically requested.
- Do not use any code that is not compatible with the current technology stack.
- Add improvements to copilot instruction based on the changes.
- Always lookup latest versions of libraries, frameworks & containers and ensure compatibility with the specified technology stack. 
  - **Primary sources for version checking** (in order of priority):
    1. Official project website (e.g., grafana.com, prometheus.io, opentelemetry.io)
    2. Official GitHub releases page
    3. Docker Hub official image tags
    4. Package registries (npm, PyPI, etc.)
  - If latest version is younger than 30 days, use the last stable version.
  - **Docker image validation requirement**: Always verify that the specific image:tag combination exists on Docker Hub before using it
    - Use Docker Hub API or docker pull to verify image existence
    - Check for correct image repository names (e.g., `grafana/tempo` for Tempo, `grafana/grafana` for Grafana)
    - Validate that the tag exists for the specific repository
    - Document the verified image reference in changelogs
  - **30-day rule enforcement**: Always check the release date of the latest version before updating
    - Look for "last week", "X days ago", specific dates within the last 30 days
    - If unsure about release date, check multiple sources (GitHub releases, changelog dates)
    - **When 30-day rule is violated**: Prompt user with version options and documentation links:
      - Present the latest version with release date and reason for exclusion
      - Suggest the most recent version that meets the 30-day criteria
      - Provide quick access links to release notes and documentation for review
      - Ask user to choose between suggested version, alternative version, or defer update
    - Only use versions that are definitively older than 30 days
    - Document the version choice and date verification in changelogs
  - Never use `latest` tags in production configurations - always specify exact version numbers.
  - **Verification requirement**: Always verify version information from at least 2 sources before updating.
- Always lookup the latest documentation for the libraries, frameworks & containers used in the project to ensure compatibility and best practices.
  - **Documentation sources** (check official sources first):
    1. Official project documentation websites
    2. GitHub repository documentation
    3. Release notes and changelogs
    4. Migration guides for major version updates


# Contribution Metrics Service - Copilot Instructions

This service is built with the following technology stack and should follow these patterns:

## Technology Stack
Where possible use the latest stable versions of the libraries and frameworks above what is specified here (following the 30-day rule for new releases):
- **Runtime**: Node.js 22
- **Language**: TypeScript targeting ES2022
- **Package Manager**: NPM
- **Web Framework**: Fastify 5.x
- **API Documentation**: OpenAPI v3 with @fastify/swagger and @fastify/swagger-ui
- **Schema Management**: fastify-zod-openapi 4.x (registered as Fastify plugin)
- **Database**: PostgreSQL with TypeORM 0.3.x
- **Testing**: Vitest for unit and integration testing
- **Error Handling**: neverthrow 6.x for functional error handling
- **GitHub APIs**: Octokit (@octokit/core, @octokit/rest, @octokit/graphql)
- **Linting**: ESLint and Prettier with eslint-plugin-neverthrow
- **Environment Configuration**: zod-config 1.x
- **Tracing**: OpenTelemetry with @opentelemetry/auto-instrumentations-node
- **Logging**: Pino 9.x with @opentelemetry/instrumentation-pino integration
- **Metrics**: OpenTelemetry metrics with @opentelemetry/sdk-metrics and OTLP export
- **Observability Pipeline**: OpenTelemetry Collector for centralized telemetry collection
- **Metrics Storage**: Prometheus with OTLP remote write endpoint
- **Tracing Storage**: Grafana Tempo with OTLP HTTP & gRPC endpoints
- **Log Storage**: Loki with HTTP API
- **Visualization**: Grafana for metrics, traces, and logs
- **Dependency Injection**: @fastify/awilix 8.x for service management
- **Local Development**: Docker Compose

## Code Patterns
The project follows a hexagonal domain-driven design (DDD) approach with a focus on modularity and separation of concerns.
Each core domain should have its own modules directory structure.

## File Organization
```
src/modules/[coredomain]/
├── domains/          # Domain entities used by services and act as data transfer objects (DTOs) between routing and ports. File names should be named as `domain-name.domain.ts`. Class name should be 'DomainName'
├── ports/            # Interfaces for business logic services or external APIs/repositories. File names should be named as `name.(service|repository|api).ports.ts`. Interface name should be `NameService` or `NameRepository` or `NameApi`.
├── application/      # Business logic services implementing interfaces. File names should be named as `name.service.ts`. Class name should be `NameServiceImpl`.
├── schemas/          # Zod schemas for validation
├── routes/           # Fastify route handlers

src/adaptors/db/[coredomain]/
├── repositories/    # TypeORM repositories for database access - Implements the repository interfaces defined in ports
├── entities/        # TypeORM entities - Maps to the domain objects defined in domains
src/adaptors/api/[coredomain]/
├── rest/            # External Rest API adapters (e.g., GitHub API) - Implements the API interfaces defined in ports
├── graphql/         # External GraphQL API adapters (if applicable) - Implements the API interfaces defined in ports

src/shared/
├── schemas/          # Shared Zod schemas (e.g., error responses, common types)
├── container/        # Dependency injection container setup
├── logger/           # Logging setup
├── instrumentation/  # OpenTelemetry Instrumentation configuration (metrics, tracing, logs)
├── database/         # TypeORM data source and migrations
└── config/           # Configuration management
├── errors/           # Common errors
├── plugins/          # Fastify plugins (including HTTP metrics, health checks)
├── utils/            # Utility functions
└── tests/            # Test utilities and setup

Tests should be placed in the `test` directory, mimicking the structure of the `src` directory.
e.g. 
test/modules/[coredomain]/
├── domains/          # Domain tests
├── ports/            # Port interface tests
test/shared/
├── container/        # Dependency injection container tests
├── logger/           # Logging tests

```

## Development Guidelines
- When running the application, use `npm run dev` for development mode with hot reloading
- Use TypeScript with strict mode enabled
- Follow the hexagonal architecture principles
- Use domain-driven design (DDD) principles
- Use index.ts files to re-export modules for cleaner imports
- Use descriptive names for files, classes, methods, parameters & properties e.g. `GitHubOrganizationService`, `gitHubOrganizationRepo`, `createOrganization`, `getUserById` 
- Use functional programming patterns where applicable
- Use @modules to import modules from the `src/modules` directory
- Use @shared to import shared utilities, configurations, and services from the `src/shared`
- Use @adaptors to import adaptors from the `src/adaptors` directory

When implementing features:
1. Create domain objects
2. Implement port interfaces for business logic or external APIs or repositories
3. Define Zod schemas for validation of requests and responses
   - Use `.openapi({ ref: 'SchemaName' })` for OpenAPI integration
   - Import shared schemas from `@shared/schemas` to avoid duplicates
   - Follow consistent naming conventions (e.g., `CreateUserRequest`, `UserResponse`)
4. Implement route handlers with OpenAPI documentation
5. Create or update TypeORM entities
6. Implement TypeORM repositories and entities for database access
7. Implement API adapters for external services
8. Write comprehensive tests

Always prioritize type safety, error handling, and maintainability.


### Error Handling
- Always use neverthrow's `Result<T, E>` type for operations that can fail
- Return `ok(value)` for success cases and `err(error)` for failures
- Chain operations using `.map()`, `.mapErr()`, `.andThen()` methods
- Use `_unsafeUnwrap()` only in test code or when you're certain of success

### API Routes
- Use Fastify 5.x for routing
- Use OpenAPI v3 for API documentation
- Auto-generate OpenAPI Spec to 'docs/openapi.yaml'
- Use @fastify/swagger and @fastify/swagger-ui for OpenAPI documentation
- Use fastify pre-hooks for common functionality (e.g., database availability checks, error handling)
- Only register routes after ensuring the database is available
- Allow health check route, static files, and OpenAPI documentation to be accessible without database checks
- Use fastify-zod-openapi 4.x for schema validation and OpenAPI spec generation
- Define request/response schemas using Zod and zod-openapi
- Always validate input using Zod schemas
- Define OpenAPI route registration in `src/shared/plugins/routes.ts`

### API Design Best Practices
- Use RESTful conventions for endpoint naming and HTTP methods
- Implement consistent error response formats across all endpoints
- Use appropriate HTTP status codes (200, 201, 400, 401, 403, 404, 422, 500)
- Implement pagination for list endpoints with consistent parameters
- Use filtering and sorting parameters with proper validation
- Include rate limiting for public endpoints
- Implement request/response logging for debugging
- Use semantic versioning for API versions if needed
- Follow OpenAPI specification standards for documentation
- Implement health check endpoints for monitoring

### fastify-zod-openapi Integration (v4.x)
Follow these specific patterns for proper fastify-zod-openapi v4.x integration:

#### Plugin Registration
- Register the fastify-zod-openapi plugin in `src/shared/plugins/zod-openapi.ts`
- Use both `transform` and `transformObject` options:
  ```typescript
  await fastify.register(fastifyZodOpenApi, {
    transform: fastifyZodOpenApiTransform,
    transformObject: fastifyZodOpenApiTransformObject,
  });
  ```
- Use `serializerCompiler` and `validatorCompiler` from fastify-zod-openapi
- Register before route definitions to ensure proper schema compilation

#### Schema Definition
- Use `extendZodWithOpenApi(z)` in all schema files
- Define schemas with `.openapi({ ref: 'SchemaName' })` for OpenAPI registration
- Use shared schemas for common response types (e.g., ErrorResponse)
- Place shared schemas in `src/shared/schemas/` directory
- Import and re-export shared schemas in module-specific schema files

#### Route Registration
- Use `.withTypeProvider<FastifyZodOpenApiTypeProvider>()` on route registration
- Define routes with relative paths (e.g., `/users` not `/api/users`)
- Apply API prefix via Fastify registration: `{ prefix: '/api' }`
- Schema validation will be automatically applied through the type provider

#### Error Schema Management
- Create a centralized error schema in `src/shared/schemas/error.schema.ts`
- Use consistent error response format across all endpoints
- Import shared error schema in module-specific schema files to avoid duplicates
- Export both schema and type from shared location

### Database Operations
- Create a TypeOrm plugin to manage the TypeORM DataSource
- Use TypeORM entities with decorators
- Return Result types from service methods
- Handle database errors gracefully
- Use transactions for multi-step operations
- Use migration files for initial data seeding.
- Use migration files for schema changes once project is stable (above 1.0.0)
- Use TypeORM's `DataSource` for database connections and define the data source in `src/shared/database/index.ts` to enable migrations.


### Service Architecture
Each service should:
- Be responsible for a specific domain (e.g., GitHub organizations, users)
- Service methods should return `Result<T, E>` types
- Services method naming should be descriptive (e.g., `createOrganization`, `getUserById`)
- Services should not directly handle HTTP requests; they should be called from route handlers
- The service should handle business logic and data access.
- Use interfaces to define service contracts
- Implement concrete classes that adhere to the interfaces
- Use dependency injection to provide service instances with Awilix using Classic mode.
- Transformation logic from API controller should be encapsulated within the controller layer.
- Can you create domain objects that represent the core business entities and map them to TypeORM entities in the service layer.
- Use Fastify plugin architecture to register services
- Use Awilix for dependency injection to manage service instances

When a service integrates with external APIs (like GitHub) or OAuth, it should:
- Use a interface to define the expected behavior
- Implement the interface with concrete adapter classes that handle the API calls.
- Provide a development adapter for local testing without external dependencies.

### Environment Configuration
- Use zod-config 1.x for type-safe environment variables
- Load configuration with loadConfig() function and schema validation
- Validate all environment variables at startup
- Provide sensible defaults for development
- **ALWAYS reference configuration values instead of hardcoded values**
- **When encountering hardcoded values, propose new configuration options**
- **For any value that might change between environments, create a configuration entry**

#### Configuration Best Practices
- **Never hardcode values** that could vary between environments (URLs, ports, timeouts, API keys, etc.)
- **Always import and use config** from `@shared/config` in plugins, services, and utilities
- **Propose new config entries** when implementing features that use potentially variable values
- **Use descriptive configuration names** that clearly indicate their purpose
- **Group related configuration** logically (e.g., database config, API config, observability config)
- **Provide environment-specific defaults** for development, testing, and production
- **Document configuration options** in environment files and README

#### Common Configuration Categories
- **Server Configuration**: HOST, PORT, API_PREFIX
- **Database Configuration**: DATABASE_URL, CONNECTION_POOL_SIZE, QUERY_TIMEOUT
- **External API Configuration**: GITHUB_API_URL, API_RATE_LIMITS, TIMEOUT_VALUES
- **Observability Configuration**: OTEL_ENDPOINT, METRICS_INTERVAL, LOG_LEVEL
- **Grafana Configuration**: GRAFANA_URL, GRAFANA_API_KEY, DASHBOARD_REFRESH_INTERVAL
- **Security Configuration**: JWT_SECRET, CORS_ORIGINS, RATE_LIMIT_SETTINGS
- **Feature Flags**: ENABLE_FEATURE_X, DEBUG_MODE, MAINTENANCE_MODE

### Security Best Practices
- Never commit secrets or API keys to version control
- Use environment variables for all sensitive configuration
- Implement proper input validation and sanitization
- Use HTTPS in production environments
- Implement proper CORS configuration
- Use secure session management and JWT tokens
- Implement rate limiting to prevent abuse
- Validate and sanitize all user inputs
- Use parameterized queries to prevent SQL injection
- Implement proper error handling without exposing sensitive information
- Regular security dependency updates and vulnerability scanning

### Performance Optimization
- Implement database query optimization and indexing strategies
- Use connection pooling for database connections
- Implement caching strategies where appropriate (Redis, in-memory)
- Optimize API response times through efficient data fetching
- Use streaming for large data responses
- Implement compression for HTTP responses
- Monitor and optimize memory usage and garbage collection
- Use async/await patterns effectively to avoid blocking operations
- Implement proper error boundaries to prevent cascading failures
- Regular performance profiling and bottleneck identification

#### Implementation Pattern
When implementing any feature:
1. **Identify configurable values** (URLs, timeouts, limits, flags)
2. **Add to configuration schema** with appropriate validation
3. **Import and use config** in implementation
4. **Update environment files** with new variables
5. **Document configuration** in code comments

Example:
```typescript
// ❌ Bad - hardcoded values
const timeout = 30000;
const url = 'http://localhost:3000';

// ✅ Good - configuration-driven
const appConfig = await config;
const timeout = appConfig.API_TIMEOUT;
const url = `${appConfig.API_BASE_URL}:${appConfig.PORT}`;
```

### Logging and Tracing
- Use structured logging with Pino 9.x
- When logging objects, pino log function parameters are: `logger.level(object, 'message')` - object first, then message
- For message-only logging: `logger.level('message')`
- Include correlation IDs in logs
- Integrate with OpenTelemetry using @opentelemetry/instrumentation-pino
- Use OpenTelemetry for distributed tracing with proper endpoint configuration
- Use Grafana for metrics, tracing and logging visualization
- Use OTEL Collector as centralized telemetry hub, not direct exports to destinations
- Use OpenTelemetry Collector for metrics, logs and tracing collection. 
- Use Prometheus for metrics storage with OTLP remote write integration via OpenTelemetry Collector
- Use Grafana Tempo for tracing storage with OTLP HTTP & gRPC endpoints
- Use Loki for log storage with HTTP API
- Use @opentelemetry/sdk-metrics for metrics collection
- Use @opentelemetry/instrumentation-fastify for Fastify instrumentation
- Use @opentelemetry/instrumentation-http for HTTP instrumentation
- Use @opentelemetry/instrumentation-pg for PostgreSQL instrumentation
- Use @opentelemetry/instrumentation-redis for Redis instrumentation
- Use @opentelemetry/auto-instrumentations-node for automatic instrumentation
- Log at appropriate levels (error, warn, info, debug) using the LOG_LEVEL environment variable
- **CRITICAL**: Always use correct OTLP endpoint paths for exporters (see OpenTelemetry Configuration Best Practices above)
- Initialize OpenTelemetry before framework setup to ensure proper instrumentation

### Dependency Injection
- Use @fastify/awilix for dependency injection
- Configure the container in `src/shared/plugins/container.ts`
- Use Classic mode for service management
- Register services, repositories, and APIs in the container
- Route handlers should resolve services from the container only after the database is available
- Route handlers must be registered in the `src/modules/[coredomain]/routes` directory
- diContainer resolve should be done in each specific route handler.
- Routes must be registered in Fastify before the server starts

### Testing
- Write unit tests for services and utilities
- Write integration tests for API endpoints
- Use Vitest test runner with appropriate configuration
- Mock external dependencies (GitHub API, database) using proper mocking strategies
- Aim for high test coverage (>80% for critical business logic)
- Use pg-mem for in-memory PostgreSQL testing
- Implement test data factories for consistent test setup
- Use proper test isolation and cleanup procedures
- Write performance tests for critical API endpoints
- Implement contract testing for external API integrations

## Docker Compose
- Use Docker Compose for local development
- Define services for the application, database (Postgres), and Grafana Tempo for tracing
- Include OpenTelemetry Collector service for centralized telemetry collection
- Include Loki service for log aggregation
- Include Prometheus service for metrics storage
- Include Grafana service for observability visualization
- Define adminer service for database management
- Use volumes for persistent data storage
- Use environment variables for configuration
- Ensure all services can be started with `docker-compose up`
- **CRITICAL**: Use correct port mappings for OTEL Collector (e.g., `4320:4318` for HTTP)
- Use service names for inter-container communication (e.g., `tempo:3200`, `prometheus:9090`)
- Ensure proper service dependencies with `depends_on`
- **NEVER use `latest` tags** - always specify exact version numbers for all containers
- **Docker Image Validation**: Always verify image existence before using
  - Check Docker Hub for correct repository names (e.g., `grafana/tempo` for Tempo)
  - Verify the specific tag exists for the repository
  - Use `docker pull <image:tag>` to test image availability
  - Common image naming patterns:
    - Grafana Tempo: `grafana/tempo:X.Y.Z`
    - Prometheus: `prom/prometheus:vX.Y.Z` (with OTLP remote write support)
    - Grafana: `grafana/grafana:X.Y.Z`
    - Loki: `grafana/loki:X.Y.Z`
    - OTEL Collector: `otel/opentelemetry-collector-contrib:X.Y.Z`
- **Storage Strategy**:
  - Use bind mounts for persistent data that needs to survive container recreation (e.g., Loki data, Grafana dashboards)
  - Use Docker volumes for temporary or cache data
  - Ensure proper permissions for bind-mounted directories
- **Network Configuration**:
  - Use a dedicated Docker network for observability services
  - Configure proper DNS resolution between services
  - Implement network segmentation for security
- **Resource Management**:
  - Set appropriate CPU and memory limits for each service
  - Configure restart policies for automatic recovery
  - Monitor resource usage and adjust limits as needed

## Grafana Dashboard Management
- Create and maintain comprehensive dashboards for all observability data
- Use Grafana provisioning for dashboard-as-code approach
- Store dashboard JSON files in version control under `grafana/dashboards/`
- Use consistent naming conventions and organize dashboards by domain
- Implement proper dashboard lifecycle management
- Include alerting rules for critical metrics and error conditions
- Design dashboards for different audiences (developers, operations, business)
- Use Grafana's templating and variables for dynamic dashboards
- Ensure all dashboards have proper documentation and annotations
- Follow Grafana best practices for performance and usability

# Copilot Instructions
- Track changes made by the AI in a change log file by chat session.
  - Create new changelog files in `docs/changelogs/` directory
  - Use filename format: `YYYY-MM-DD_session-description.md`
  - Update the `docs/changelogs/README.md` index with new session entries
  - Document all file modifications, creations, and deletions
  - Include commands executed and verification steps
  - Mark completion status for major changes
  - Use the template provided in the changelogs README for consistency
  - **For observability changes**: Include container version updates, configuration changes, compatibility validation steps, and service health verification
  - **For version updates**: Document the specific versions chosen, compatibility verification performed, and any breaking changes encountered

# Production setup
- Ensure the application is production-ready with proper error handling, logging, and monitoring
- The application will be deployed using Helm charts and GitHub Actions and Runners for CI/CD
- Create liveness and readiness probes for Kubernetes deployment
  - These should be defined as part of the Fastify server configuration
  - Use the `/health` endpoint for liveness and readiness checks
- Use environment variables for configuration
- Create a Docker file for containerization and deployment
- Ensure the application can be run in production with minimal configuration changes
- Create GitHub Actions workflows for CI/CD
  - Include steps for linting, testing, building, and deploying
  - Use environment variables for sensitive information
  - Ensure workflows are triggered on pull requests and merges to main branch

### Deployment Best Practices
- Use multi-stage Docker builds for optimal image size
- Implement proper health checks in containerized environments
- Use rolling deployments to minimize downtime
- Implement proper secrets management in production
- Configure environment-specific settings through configuration
- Use infrastructure as code (Helm charts) for Kubernetes deployments
- Implement proper monitoring and alerting for production systems
- Use blue-green or canary deployment strategies for critical updates
- Implement proper backup and disaster recovery procedures
- Document deployment procedures and rollback strategies

### Observability Stack Management
When working with the observability stack (Prometheus, Grafana Tempo, OTEL Collector, Loki, Grafana):

#### Version Management
- **Always use specific version tags** - never use `latest` in any configuration
- **Follow the 30-day rule**: Only use versions released more than 30 days ago
- **Check official project websites first** for latest versions:
  - Grafana Tempo: https://grafana.com/docs/tempo/latest/ (check version in URL or release notes)
  - Prometheus: https://prometheus.io/download/ (check latest release)
  - Grafana: https://grafana.com/docs/grafana/latest/ (check version in URL or release notes)
  - Loki: https://grafana.com/docs/loki/latest/ (check with Grafana compatibility)
  - OTEL Collector: https://opentelemetry.io/docs/collector/ (check GitHub releases)
- **Cross-reference versions** from multiple sources:
  - Official website → GitHub releases → Docker Hub tags
  - Verify version exists and is stable (not pre-release)
  - Verify release date is older than 30 days
- **When 30-day rule is violated for observability components**: Present user with:
  - Latest version details: version number, release date, and exclusion reason
  - Recommended alternative: most recent version meeting 30-day criteria
  - Quick documentation links for review:
    - **Grafana Tempo**: [Release Notes](https://github.com/grafana/tempo/releases), [Migration Guide](https://grafana.com/docs/tempo/latest/operations/upgrade/)
    - **Prometheus**: [Release Notes](https://github.com/prometheus/prometheus/releases), [Migration Guide](https://prometheus.io/docs/prometheus/latest/migration/)
    - **Grafana**: [Release Notes](https://github.com/grafana/grafana/releases), [Upgrade Guide](https://grafana.com/docs/grafana/latest/upgrade-guide/)
    - **Loki**: [Release Notes](https://github.com/grafana/loki/releases), [Upgrade Guide](https://grafana.com/docs/loki/latest/operations/upgrade/)
    - **OTEL Collector**: [Release Notes](https://github.com/open-telemetry/opentelemetry-collector-releases/releases), [Migration Guide](https://opentelemetry.io/docs/collector/migration/)
  - Options: Use recommended version, specify alternative version, or defer update
- **Check compatibility matrices** before updating versions:
  - OTEL Collector with exporters (Tempo, Prometheus remote write, Loki)
  - Grafana with datasource plugins
  - Tempo with OTLP protocol versions
  - Prometheus OTLP remote write compatibility
- **Systematic updates**: Update one component at a time and validate functionality
- **Document changes**: Record version updates, release dates, and compatibility validation in changelogs

#### Configuration Best Practices
- **Environment-driven configuration**: All endpoints, ports, and settings should be configurable via environment variables
- **Centralized collection**: Use OTEL Collector as the single telemetry hub - avoid direct exports from application to destinations
- **Proper endpoint paths**: Always use correct OTLP paths (`/v1/traces`, `/v1/metrics`, `/v1/logs`)
- **Service discovery**: Use Docker service names for inter-container communication
- **Health monitoring**: Include health checks for all observability services
- **Prometheus OTLP Integration**: Configure Prometheus to receive metrics via OTLP remote write from OpenTelemetry Collector

#### Validation Requirements
When implementing or updating observability components:
1. **Service health**: Verify all containers start and remain healthy
2. **Endpoint connectivity**: Test OTLP endpoints with curl/telnet
3. **Data flow**: Confirm telemetry data flows from app → collector → destinations
4. **UI accessibility**: Validate web interfaces (Grafana, Tempo, Prometheus) are accessible
5. **Dashboard functionality**: Ensure Grafana dashboards display live data from all datasources
6. **Alert validation**: Verify alerting rules are properly configured and firing when expected
7. **Log correlation**: Verify logs are properly correlated with traces and metrics

#### Troubleshooting Approach
Follow systematic debugging for observability issues:
1. **Application logs**: Check OpenTelemetry initialization and export messages
2. **Network connectivity**: Test OTLP endpoints from application context
3. **Collector logs**: Verify OTEL Collector receives and processes telemetry data
4. **Destination logs**: Check Tempo/Prometheus/Loki for incoming data
5. **UI validation**: Confirm data appears in respective user interfaces
6. **Debug exporters**: Use OTEL Collector debug exporters for detailed troubleshooting

#### Documentation Requirements
- **Configuration changes**: Document all observability configuration modifications
- **Version updates**: Record container version changes with compatibility notes
- **Dashboard changes**: Track Grafana dashboard modifications and provisioning updates
- **Performance impact**: Note any performance implications of observability changes

### Grafana Dashboard Development and Maintenance
When creating and managing Grafana dashboards for the contributor metrics service:

#### Dashboard Organization Structure
```
grafana/
├── dashboards/
│   ├── application/          # Application-specific dashboards
│   │   ├── contributor-metrics-overview.json
│   │   ├── github-api-metrics.json
│   │   ├── database-performance.json
│   │   └── api-endpoints.json
│   ├── infrastructure/       # Infrastructure and system dashboards
│   │   ├── docker-containers.json
│   │   ├── system-resources.json
│   │   └── network-performance.json
│   ├── observability/        # Observability stack dashboards
│   │   ├── otel-collector.json
│   │   ├── prometheus-metrics.json
│   │   └── loki-logs.json
│   └── business/            # Business metrics dashboards
│       ├── contributor-trends.json
│       ├── repository-analytics.json
│       └── organization-metrics.json
├── provisioning/
│   ├── dashboards/
│   │   └── dashboards.yml   # Dashboard provisioning configuration
│   └── datasources/
│       └── datasources.yml  # Datasource provisioning configuration
└── alerting/
    ├── rules/               # Alert rule definitions
    └── notifications/       # Notification channel configurations
```

#### Dashboard Development Guidelines
- **Naming Conventions**: Use descriptive, kebab-case names (e.g., `contributor-metrics-overview.json`)
- **Unique UIDs**: Generate unique UIDs for each dashboard to avoid conflicts
- **Version Control**: Store all dashboard JSON files in version control
- **Environment Variables**: Use Grafana variables for environment-specific values
- **Consistent Styling**: Apply consistent color schemes, fonts, and layout patterns
- **Responsive Design**: Ensure dashboards work well on different screen sizes

#### Dashboard Content Standards
- **Overview Panels**: Start with high-level KPIs and summary metrics
- **Drill-down Capability**: Provide links to detailed views for investigation
- **Time Range Controls**: Include appropriate time range selectors
- **Annotations**: Add annotations for deployments, incidents, and major events
- **Documentation**: Include panel descriptions and dashboard documentation
- **Thresholds**: Set appropriate warning and critical thresholds for metrics

#### Required Dashboard Categories

**1. Application Performance Dashboards**
- **API Performance**: Request rates, response times, error rates by endpoint
- **Database Metrics**: Query performance, connection pools, slow queries
- **GitHub API Integration**: Rate limits, API response times, error tracking
- **TypeORM Metrics**: Entity operations, transaction performance, migration status
- **Fastify Metrics**: Route performance, plugin execution times, memory usage

**2. Infrastructure Dashboards**
- **Container Health**: CPU, memory, disk usage for all containers
- **Network Performance**: Inter-service communication, latency, throughput
- **Resource Utilization**: System resources, container limits, scaling metrics
- **Docker Compose Services**: Service status, restart counts, health checks

**3. Observability Stack Dashboards**
- **OpenTelemetry Collector**: Ingestion rates, processing latency, export errors
- **Prometheus Metrics**: Storage usage, query performance, scraping status
- **Grafana Tempo**: Trace ingestion, storage usage, query performance
- **Loki Logs**: Log ingestion rates, query performance, retention status

**4. Business Metrics Dashboards**
- **Contributor Analytics**: Active contributors, contribution patterns, geographic distribution
- **Repository Metrics**: Commit frequency, pull request analytics, issue tracking
- **Organization Insights**: Team productivity, project velocity, code quality metrics
- **GitHub API Usage**: API consumption patterns, rate limit utilization, cost tracking

#### Dashboard Provisioning Configuration
- **Automatic Deployment**: Use Grafana provisioning to deploy dashboards automatically
- **Environment-Specific**: Configure different dashboards for dev/staging/production
- **Datasource Mapping**: Map datasources correctly across environments
- **Folder Organization**: Use Grafana folders to organize dashboards logically
- **Permissions**: Set appropriate dashboard permissions for different user roles

#### Alert Configuration
- **Critical Alerts**: Application down, database connection failures, API errors > 5%
- **Warning Alerts**: High response times, resource utilization > 80%, GitHub API rate limits
- **Information Alerts**: Deployment notifications, scaling events, configuration changes
- **Alert Routing**: Configure different notification channels for different alert severities
- **Escalation Policies**: Define escalation procedures for unacknowledged alerts

#### Dashboard Testing and Validation
- **Data Validation**: Verify all panels display correct data from datasources
- **Performance Testing**: Ensure dashboards load quickly with large datasets
- **Cross-browser Testing**: Test dashboard functionality across different browsers
- **Mobile Responsiveness**: Verify dashboards work on mobile devices
- **User Acceptance**: Gather feedback from dashboard users and iterate

#### Dashboard Maintenance Procedures
- **Regular Reviews**: Schedule monthly dashboard reviews for relevance and accuracy
- **Performance Optimization**: Monitor dashboard query performance and optimize slow panels
- **Data Retention**: Align dashboard time ranges with data retention policies
- **Version Management**: Use semantic versioning for major dashboard changes
- **Documentation Updates**: Keep dashboard documentation current with application changes
- **Deprecation Process**: Properly deprecate and remove unused dashboards

#### Best Practices for Dashboard Design
- **Single Purpose**: Each dashboard should serve a specific purpose or audience
- **Logical Flow**: Arrange panels in a logical top-to-bottom, left-to-right flow
- **Consistent Units**: Use consistent units and formatting across related panels
- **Color Coding**: Use consistent color schemes (green=good, yellow=warning, red=critical)
- **Panel Titles**: Use descriptive, actionable panel titles
- **Tooltip Information**: Provide helpful tooltips and descriptions
- **Link Integration**: Include links to related dashboards, logs, and documentation

#### Advanced Dashboard Features
- **Template Variables**: Use variables for dynamic filtering (environment, service, time range)
- **Panel Links**: Create drill-down links between related dashboards
- **Data Transformations**: Apply appropriate data transformations for better visualization
- **Custom Visualizations**: Use appropriate visualization types for different data types
- **Dashboard Playlists**: Create playlists for rotating displays and presentations
- **Snapshot Management**: Use snapshots for sharing specific time-based views

#### Dashboard Security and Access Control
- **Role-Based Access**: Configure dashboard access based on user roles
- **Sensitive Data**: Protect dashboards containing sensitive business metrics
- **Anonymous Access**: Configure public dashboards for general metrics where appropriate
- **Audit Logging**: Enable audit logging for dashboard changes and access
- **Export Controls**: Manage dashboard export permissions appropriately

### OpenTelemetry Configuration Best Practices
When configuring OpenTelemetry exporters, always use the correct endpoint paths:
- **Traces**: `${baseEndpoint}/v1/traces` 
- **Metrics**: `${baseEndpoint}/v1/metrics`
- **Logs**: `${baseEndpoint}/v1/logs`

❌ Incorrect: `url: otlpEndpoint`
✅ Correct: `url: `${otlpEndpoint}/v1/traces``

This is critical for proper telemetry data export to OTEL Collector.

### Fastify Plugin Pattern Requirements
When creating Fastify plugins, always follow the standard pattern:
1. Import `fastify-plugin` (fp)
2. Create the plugin function (not exported)
3. Export using `fp()` wrapper with metadata
4. Use default exports in plugin index

❌ Incorrect:
```typescript
export async function myPlugin(fastify: FastifyInstance) { ... }
```

✅ Correct:
```typescript
import fp from 'fastify-plugin';

async function myPlugin(fastify: FastifyInstance) { ... }

export default fp(myPlugin, {
  name: 'my-plugin',
  fastify: '5.x',
});
```

This pattern is required for proper plugin registration and lifecycle management.

### Singleton Pattern for Application Services
For application-wide services (like metrics, logging), use proper singleton patterns:

❌ Incorrect: Direct exports
```typescript
export const applicationMetrics = new ApplicationMetrics();
```

✅ Correct: Initialize-then-access pattern
```typescript
let instance: ApplicationMetrics | null = null;

export function initializeApplicationMetrics(name: string, version: string) {
  if (!instance) {
    instance = new ApplicationMetrics(name, version);
  }
  return instance;
}

export function getApplicationMetrics(): ApplicationMetrics {
  if (!instance) {
    throw new Error('Must initialize first');
  }
  return instance;
}
```

This ensures proper initialization order and configuration injection.

### Docker Container Networking
When configuring services in Docker Compose:
- Use service names for inter-container communication
- Map ports correctly for external access
- Example: OTEL Collector listening on `0.0.0.0:4318` inside container, mapped to `4320:4318` for host access

In OTEL Collector config:
```yaml
receivers:
  otlp:
    protocols:
      http:
        endpoint: 0.0.0.0:4318  # Inside container
```

In Docker Compose:
```yaml
ports:
  - "4320:4318"  # Host:Container
```

Application uses: `http://localhost:4320` (host port)

### Observability Debugging Methodology
When debugging observability issues, follow this systematic approach:
1. Check if data is being **generated** (application logs)
2. Check if data is being **sent** (network/endpoint tests)
3. Check if data is being **received** (collector logs)
4. Check if data is being **forwarded** (destination logs)
5. Check if data is being **stored** (destination UI/API)

Use debug exporters in OTEL Collector config for troubleshooting:
```yaml
exporters:
  debug:
    verbosity: detailed
```

### OpenTelemetry Initialization Order
OpenTelemetry initialization must follow this strict order:
1. **SDK initialization** (tracing, metrics, logs)
2. **Application metrics setup** (custom metrics)
3. **Framework setup** (Fastify, plugins)
4. **Route registration**

This ensures all instrumentation is active before the application starts handling requests.

### Plugin Registration Best Practices
When registering Fastify plugins:
- Register core plugins first (instrumentation, database)
- Register business plugins second (metrics, monitoring)
- Register route plugins last
- Always use `await` for plugin registration
- Handle plugin registration errors appropriately

```typescript
// Correct order
await fastify.register(typeormPlugin);
await fastify.register(httpMetricsPlugin);
await fastify.register(routesPlugin);
```

### Observability Validation Steps
When implementing observability features, validate each component:

**Metrics**: 
- Query metrics endpoint: `curl http://localhost:9090/api/v1/query?query=metric_name`
- Check OTEL Collector logs for metrics export via OTLP remote write
- Verify Prometheus is receiving metrics via remote write endpoint

**Traces**:
- Check Tempo services API: `curl http://localhost:3200/api/search/tags`
- Verify traces exist: `curl http://localhost:3200/api/traces/{trace-id}`

**Logs**:
- Check Loki for log ingestion
- Verify log correlation with traces

### Environment Configuration Consistency
Ensure environment files are consistent:
- Use same service name across all configs
- Use correct port mappings for Docker vs local development
- Validate OTLP endpoints are accessible from application context

Test connectivity: `curl -X POST http://localhost:4320/v1/traces`

## Common Pitfalls and How to Avoid Them

### Observability Stack Issues
- **Version incompatibility**: Always check compatibility matrices between OTEL Collector and destination services
- **Latest tag usage**: Never use `latest` tags - specify exact versions and validate compatibility
- **Outdated version information**: Always check official project websites first (tempo.grafana.com, prometheus.io, etc.) before GitHub or Docker Hub
- **Single source verification**: Always cross-reference version information from at least 2 sources (website + GitHub releases)
- **Missing health checks**: Include health checks for all observability services to detect issues early
- **Configuration drift**: Use environment variables for all configurable values to maintain consistency across environments
- **Dashboard duplication**: Avoid duplicate dashboard files with same UID - use unique identifiers and proper provisioning
- **Storage persistence**: Use appropriate storage strategies (bind mounts vs volumes) based on data persistence requirements
- **Prometheus OTLP Configuration**: Ensure Prometheus is properly configured to receive metrics via OTLP remote write
- **Dashboard Performance**: Monitor dashboard query performance and optimize slow-loading panels
- **Broken Dashboard Links**: Validate dashboard panel links and drill-down functionality after updates

### OpenTelemetry Issues
- **Missing endpoint paths**: Always append `/v1/traces`, `/v1/metrics`, `/v1/logs` to OTLP endpoints
- **Wrong initialization order**: Initialize OpenTelemetry SDK before creating Fastify instance
- **Missing plugin wrappers**: Use `fastify-plugin` for all custom plugins
- **Port mapping confusion**: Use correct ports for Docker vs local development

### Plugin Registration Issues
- **Export pattern mismatch**: Use default exports with `fastify-plugin` wrapper
- **Registration order**: Core plugins first, then business plugins, then routes
- **Missing await**: Always await plugin registration to handle errors properly

### Singleton Pattern Issues
- **Direct instantiation**: Use initialization functions instead of direct exports
- **Missing error handling**: Always check if singleton is initialized before use
- **Configuration timing**: Pass configuration during initialization, not after

### Docker Networking Issues
- **Service name confusion**: Use service names for inter-container communication
- **Port mapping**: Map container ports correctly for external access
- **Network isolation**: Ensure services are on same Docker network

### Debugging Approach
When facing issues, always:
1. Check application logs for initialization messages
2. Verify endpoint connectivity with curl
3. Check collector logs for data reception
4. Validate destination (Tempo/Prometheus) for data storage
5. Use debug exporters for detailed troubleshooting

### Version Selection Template
When the 30-day rule is violated, use this standardized prompt format:

```
⚠️ **Version Update Required - 30-Day Rule Violated**

**Component**: [Component Name]
**Latest Version**: [X.Y.Z] (Released: [Date] - [Days] days ago)
**Exclusion Reason**: Version is younger than 30 days

**Recommended Alternative**: [Previous Version] (Released: [Date] - [Days] days ago)

**📚 Quick Documentation Links**:
- 📋 Release Notes: `[Component-specific release notes URL]`
- 🔄 Migration Guide: `[Component-specific migration guide URL]`
- 🔗 Official Documentation: `[Component-specific documentation URL]`

**Options**:
1. ✅ **Use Recommended Version** ([Previous Version])
2. 🔧 **Specify Alternative Version** (provide specific version)
3. ⏸️ **Defer Update** (keep current version)
4. 🔄 **Remember for Later** (add to future update list)

Please select option (1-4):
```

This template ensures consistent communication and provides all necessary information for informed decision-making.

#### Common Version Selection Scenarios

**Example 1: Grafana Tempo Version Update**
```
⚠️ **Version Update Required - 30-Day Rule Violated**

**Component**: Grafana Tempo
**Latest Version**: 2.8.0 (Released: December 15, 2024 - 26 days ago)
**Exclusion Reason**: Version is younger than 30 days

**Recommended Alternative**: 2.7.0 (Released: November 8, 2024 - 63 days ago)

**📚 Quick Documentation Links**:
- 📋 [Release Notes](https://github.com/grafana/tempo/releases/tag/v2.8.0)
- 🔄 [Migration Guide](https://grafana.com/docs/tempo/latest/operations/upgrade/)
- 🔗 [Official Documentation](https://grafana.com/docs/tempo/latest/)

**Options**:
1. ✅ **Use Recommended Version** (2.7.0)
2. 🔧 **Specify Alternative Version** (provide specific version)
3. ⏸️ **Defer Update** (keep current 2.0.0)
4. 🔄 **Remember for Later** (check again in 7 days)
```

**Example 2: Prometheus Version Update**
```
⚠️ **Version Update Required - 30-Day Rule Violated**

**Component**: Prometheus
**Latest Version**: 2.55.0 (Released: December 20, 2024 - 21 days ago)
**Exclusion Reason**: Version is younger than 30 days

**Recommended Alternative**: 2.54.1 (Released: November 18, 2024 - 53 days ago)

**📚 Quick Documentation Links**:
- 📋 [Release Notes](https://github.com/prometheus/prometheus/releases/tag/v2.55.0)
- 🔄 [Migration Guide](https://prometheus.io/docs/prometheus/latest/migration/)
- 🔗 [Official Documentation](https://prometheus.io/docs/)

**Options**:
1. ✅ **Use Recommended Version** (2.54.1)
2. 🔧 **Specify Alternative Version** (provide specific version)
3. ⏸️ **Defer Update** (keep current v2.54.1)
4. 🔄 **Remember for Later** (check again in 10 days)
```


