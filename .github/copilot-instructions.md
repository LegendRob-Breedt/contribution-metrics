---
applyTo: '**'
---
Coding standards, domain knowledge, and preferences that AI should follow.

# Contribution Metrics Service - Copilot Instructions

This service is built with the following technology stack and should follow these patterns:

## Technology Stack
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
- **Metrics**: Use of OpenTelemetry for metrics collection and integratesion with Prometheus
- **Dependency Injection**: Awilix for service management
- **Local Development**: Docker Compose

## Code Patterns
The project follows a hexagonal domain-driven design (DDD) approach with a focus on modularity and separation of concerns.
Each core domain should have its own modules directory structure.

## File Organization
```
src/modules/[coredomain]/
├── domains/          # Domain entities used by services and act as data transfer objects (DTOs) between routing and ports. File names should be named as `domain-name.domain.ts`. Class name should be 'DomainName'
├── ports/            # Interfaces for business logic services or external APIs/reposititories. File names should be named as `name.[service|repository|api]).ports.ts`. Interface name should be `NameService` or `NameRepository` or `NameApi`.
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
├── container/        # Dependency injection container setup
├── logger/           # Logging setup
├── instrumentation/  # OpenTelemetry Instrumentation configuration
├── database/         # TypeORM data source and migrations
└── config/           # Configuration management
├── errors/           # Common errors
├── plugins/          # Fastify plugins
├── utils/            # Utility functions
└── tests/            # Test utilities and setup

Tests should be placed in the `tests` directory, mimicking the structure of the `src` directory.
```

## Development Guidelines
- Use TypeScript with strict mode enabled
- Follow the hexagonal architecture principles
- Use domain-driven design (DDD) principles
- Use index.ts files to re-export modules for cleaner imports
- Use descriptive names for files, classes, and methods
- Use functional programming patterns where applicable
- Use @modules to import modules from the `src/modules` directory
- Use @shared to import shared utilities, configurations, and services from the `src/shared`
- Use @adaptors to import adaptors from the `src/adaptors` directory

When implementing features:
1. Create domain objects
2. Implement port interfaces for business logic or external APIs or repositories
3. Define Zod schemas for validation of requests and responses
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
- Use fastify-zod-openapi 4.x for schema validation and OpenAPI spec generation
- Define request/response schemas using Zod and zod-openapi
- Register routes with proper OpenAPI metadata using fastifyZodOpenApiTransform
- Always validate input using Zod schemas
- Use serializerCompiler and validatorCompiler from fastify-zod-openapi

### Database Operations
- Use TypeORM entities with decorators
- Return Result types from service methods
- Handle database errors gracefully
- Use transactions for multi-step operations
- Use migration files for initial data seeding.
- Use migration files for schema changes once project is stable (above 1.0.0)

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

When a service integrates with external APIs (like GitHub) or OAuth, it should:
- Use a interface to define the expected behavior
- Implement the interface with concrete adapter classes that handle the API calls.
- Provide a development adapter for local testing without external dependencies.

### Environment Configuration
- Use zod-config 1.x for type-safe environment variables
- Load configuration with loadConfig() function and schema validation
- Validate all environment variables at startup
- Provide sensible defaults for development

### Logging and Tracing
- Use structured logging with Pino 9.x
- Include correlation IDs in logs
- Integrate with OpenTelemetry using @opentelemetry/instrumentation-pino
- Use OpenTelemetry for distributed tracing
- Use Jaeger for tracing visualization
- Use OpenTelemetry for metrics collection and integration with Prometheus
- Use @opentelemetry/sdk-metrics for metrics collection
- Use @opentelemetry/instrumentation-fastify for Fastify instrumentation
- Use @opentelemetry/instrumentation-http for HTTP instrumentation
- Use @opentelemetry/instrumentation-pg for PostgreSQL instrumentation
- Use @opentelemetry/instrumentation-redis for Redis instrumentation
- Use @opentelemetry/auto-instrumentations-node for automatic instrumentation
- Log at appropriate levels (error, warn, info, debug)

### Testing
- Write unit tests for services and utilities
- Write integration tests for API endpoints
- Use Vitest test runner
- Mock external dependencies (GitHub API, database)
- Aim for high test coverage
- Use pg-mem for in-memory PostgreSQL testing

## Docker Compose
- Use Docker Compose for local development
- Define services for the application, database (Postgres), and Jaeger (2.7.0) for tracing
- Define adminer service for database management
- Use volumes for persistent data storage
- Use environment variables for configuration
- Ensure all services can be started with `docker-compose up`

# Copilot Instructions
- Track changes made by the AI in a change log file by chat session.
  - Create new changelog files in `docs/changelogs/` directory
  - Use filename format: `YYYY-MM-DD_session-description.md`
  - Update the `docs/changelogs/README.md` index with new session entries
  - Document all file modifications, creations, and deletions
  - Include commands executed and verification steps
  - Mark completion status for major changes
  - Use the template provided in the changelogs README for consistency