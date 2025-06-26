<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Contribution Metrics Service - Copilot Instructions

This service is built with the following technology stack and should follow these patterns:

## Technology Stack
- **Runtime**: Node.js 22
- **Language**: TypeScript targeting ES2022
- **Package Manager**: PNPM
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
- **Local Development**: Docker Compose

## Code Patterns

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

### Service Architecture
The service manages:

1. **GitHub Organizations**: Store access tokens and expiration timestamps
2. **Users**: Employee/contributor information with roles, teams, and hierarchy
3. **GitHub Contributors**: Link GitHub identities to internal users

### Database Schema
- `github_organizations`: GitHub org tokens and metadata
- `users`: Internal user/employee data with roles and team structure
- `github_contributors`: GitHub identity information linked to users

### Environment Configuration
- Use zod-config 1.x for type-safe environment variables
- Load configuration with loadConfig() function and schema validation
- Validate all environment variables at startup
- Provide sensible defaults for development

### Logging and Tracing
- Use structured logging with Pino 9.x
- Include correlation IDs in logs
- Integrate with OpenTelemetry using @opentelemetry/instrumentation-pino
- Use @opentelemetry/auto-instrumentations-node for automatic instrumentation
- Log at appropriate levels (error, warn, info, debug)

### Testing
- Write unit tests for services and utilities
- Write integration tests for API endpoints
- Use Vitest test runner
- Mock external dependencies (GitHub API, database)
- Aim for high test coverage

## File Organization
```
src/
├── config/           # Environment configuration
├── entities/         # TypeORM entities
├── schemas/          # Zod schemas for validation
├── services/         # Business logic services
├── routes/           # Fastify route handlers
├── plugins/          # Fastify plugins
├── utils/            # Utility functions
├── types/            # TypeScript type definitions
└── migrations/       # Database migrations
```

When implementing features:
1. Define Zod schemas first
2. Create or update TypeORM entities
3. Implement service methods with proper error handling
4. Create route handlers with OpenAPI documentation
5. Write comprehensive tests

Always prioritize type safety, error handling, and maintainability.
