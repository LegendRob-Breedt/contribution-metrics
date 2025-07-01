# Usage Tips:
Start with the assessment prompt to understand current state
Use individual prompts for targeted improvements  
Use the master prompt for greenfield projects or complete overhauls
Use the master refactoring prompt for existing projects that need architectural improvements
Adapt service names and specifics to your project
Run in sequence for systematic modernization
Entity refactoring prompts can be used independently or as a complete sequence

# Complete Modernization Prompt Set
## Initial Project Assessment & Setup
I have a Node.js/TypeScript Fastify service that needs modernization. Please audit the current setup and identify any deprecated configurations, outdated dependencies, or configuration mismatches. Focus on:
- Fastify configuration and logging setup
- OpenTelemetry tracing configuration
- ESLint and linting setup
- Package dependencies and versions
- TypeScript configuration compliance

## OpenTelemetry Modernization
Please modernize the OpenTelemetry setup for this service:
- Replace any deprecated Jaeger exporters with OTLP HTTP exporters
- Update Docker Compose to support OTLP endpoints (4317/4318)
- Configure NodeSDK with proper Pino and Fastify instrumentation
- Ensure trace context appears in logs
- Set up proper resource configuration using resourceFromAttributes with semantic conventions
- Use environment variables for service name and version configuration
## ESLint V9 Migration
Please migrate the ESLint configuration to version 9 flat config format:
- Update ESLint to version 9 and migrate from legacy config
- Update all ESLint-related dependencies to compatible versions
- Configure @typescript-eslint/parser and @typescript-eslint/eslint-plugin for TypeScript support
- Add neverthrow plugin (@ninoseki/eslint-plugin-neverthrow) with proper enforcement rules
- Ensure compatibility with project-aware TypeScript parsing
## Development Environment Setup
Please set up a proper development environment configuration:
- Create separate .env.dev file with development-specific settings (debug logging, dev service names)
- Update package.json dev script to use .env.dev automatically
- Add debug script for Node.js inspector support
- Configure different log levels and service names for dev vs production
## VS Code Debugging Configuration
Please create comprehensive VS Code debugging configurations:
- Set up launch.json with multiple debug scenarios (dev server, production build, tests)
- Configure TypeScript debugging with tsx and source map support
- Set up environment file loading for debug sessions
- Include auto-restart and proper skip files configuration
- Add debug configurations for both development and production builds
## Docker Infrastructure Enhancement
Please enhance the Docker Compose setup with essential services:
- Add Adminer for database management
- Configure Jaeger with proper OTLP support (HTTP and gRPC endpoints)
- Set up PostgreSQL and Redis with health checks
- Ensure proper service dependencies and networking
- Configure environment variables for service integration
## TypeScript & Import Modernization
Please modernize the TypeScript configuration and imports:
- Update any deprecated import syntax (assert to with for JSON imports)
- Ensure compliance with verbatimModuleSyntax settings
- Fix any type-only import issues
- Update to modern ES module syntax throughout
- Verify TypeScript compilation with strict settings
## Tracing Configuration Best Practices
Please implement OpenTelemetry tracing best practices:
- Configure tracing to accept service name and version as parameters
- Use proper semantic conventions (ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION)
- Set up trace context injection in logs
- Configure OTLP exporter with proper error handling
- Add graceful shutdown for tracing SDK
## Functional Error Handling Setup
Please set up neverthrow for functional error handling:
- Install and configure neverthrow package
- Add ESLint rules to enforce Result<T, E> usage
- Configure lint rules to prevent unsafe unwrap operations
- Set up proper error handling patterns throughout the codebase
- Ensure type safety with functional error handling
## Production-Ready Configuration
Please ensure the service is production-ready:
- Set up proper environment variable configuration with zod-config
- Configure structured logging with Pino
- Add health check endpoints
- Set up graceful shutdown handlers
- Configure proper TypeORM settings for development vs production
- Add comprehensive error handling and validation

# All-in-One Master Prompt (For Complete Setup)
Please modernize this Node.js/TypeScript Fastify service to production standards:

1. **OpenTelemetry**: Migrate from deprecated Jaeger to OTLP HTTP, configure NodeSDK with Pino/Fastify instrumentation, use resourceFromAttributes with semantic conventions

2. **ESLint**: Upgrade to v9 flat config, add neverthrow enforcement, configure TypeScript parsing

3. **Development Setup**: Create .env.dev, update dev scripts, add VS Code debug configurations with TypeScript support

4. **Docker**: Add Adminer, configure Jaeger for OTLP (4317/4318), set up health checks

5. **TypeScript**: Fix deprecated imports (assert → with), ensure verbatimModuleSyntax compliance

6. **Environment Config**: Use zod-config for type-safe environment variables, separate dev/prod settings

7. **Error Handling**: Set up neverthrow with lint enforcement for functional error handling

8. **Logging**: Configure structured Pino logging with trace context injection

9. **Entity Architecture**: Extract BaseEntity with common fields, standardize naming conventions, use TypeORM UUID generation

10. **Type System**: Simplify by removing branded types while maintaining UUID validation and type safety

11. **Test Organization**: Move test utilities to proper structure, add development testing scripts

12. **Code Structure**: Implement consistent naming patterns and eliminate technical debt

Follow modern Node.js 22, TypeScript ES2022, and Fastify 5.x best practices throughout.

# Master Refactoring Prompt (For Existing Projects)
Please refactor this existing Node.js/TypeScript Fastify service for better maintainability and modern standards:

1. **Entity Refactoring**: Extract BaseEntity, standardize naming (kebab-case), implement TypeORM UUID generation

2. **Type System**: Maintain simple string-based UUID types with runtime validation (branded types were briefly explored but removed)

3. **Test Infrastructure**: Organize test utilities in proper directory structure, add development testing scripts

4. **Code Quality**: Ensure consistent naming conventions, eliminate duplicate code, improve maintainability

5. **Documentation**: Update all documentation to reflect architectural changes and improvements

This should result in cleaner, more maintainable code with the same functionality and comprehensive test coverage.

# Entity Refactoring & Code Structure Improvements

## Base Entity Extraction
Please extract common entity fields into a reusable base entity:
- Create a BaseEntity class with common fields (id, createdAt, updatedAt)
- Update all entities to extend BaseEntity and remove duplicate fields
- Ensure TypeORM decorators are properly configured
- Update all imports and ensure type safety
- Maintain database compatibility with existing schema

## Entity Naming Convention Standardization
Please standardize entity and service naming conventions:
- Rename all entities to use the format: name-extendedname.entity.ts
- Rename all services to use the format: name-extendedname.service.ts
- Update all imports and references throughout the codebase
- Ensure consistent naming patterns across the project
- Update test files to match new naming conventions

## UUID Generation Strategy Migration
Please migrate from manual UUID generation to TypeORM-managed UUIDs:
- Change from @PrimaryColumn('uuid') to @PrimaryGeneratedColumn('uuid')
- Remove manual UUID generation lifecycle hooks (@BeforeInsert)
- Update entity base class to use database-generated UUIDs
- Preserve UUID validation utilities for runtime validation
- Ensure all tests continue to pass with the new approach
- Verify database compatibility between PostgreSQL and SQLite

## Branded Types Implementation and Removal
Please implement and then remove branded types for entity IDs:

### Phase 1: Add Branded Types
- Add branded type definitions for entity IDs (e.g., UserId, GitHubOrganizationId)
- Create utility functions for branded type conversion and validation
- Update all service methods to use branded types for type safety
- Update routes to convert string IDs to branded types with validation
- Add comprehensive tests for branded type utilities

### Phase 2: Remove Branded Types
- Remove all branded type definitions from entities
- Update service methods to use plain string types
- Remove branded type conversion utilities
- Update routes to use direct UUID validation instead of branded type conversion
- Remove branded type utility files and tests
- Simplify type system while maintaining UUID validation

## Test Organization and Utilities
Please organize test utilities and improve test structure:
- Move development testing scripts to src/test/utils/ directory
- Create proper documentation for test utilities
- Add npm scripts for easy access to test utilities (test:db, test:startup)
- Update package.json with convenient test utility commands
- Ensure test utilities are properly documented and organized
- Clean up root directory by moving test files to appropriate locations

## Database Connection and Startup Testing
Please create utilities for testing database connectivity and application startup:
- Create a PostgreSQL connection test script that verifies database connectivity
- Create a server startup test that validates configuration loading and basic server functionality
- Include proper error handling and informative output
- Make utilities easily runnable via npm scripts
- Document usage and purpose of each utility script

# Recent Refactoring Summary Prompts

## Complete Entity Architecture Refactoring
Please refactor the entity architecture for better maintainability:
1. **Extract Base Entity**: Create BaseEntity with id, createdAt, updatedAt fields
2. **Standardize Naming**: Update all entities/services to use kebab-case naming convention
3. **Modernize UUID Generation**: Switch to TypeORM's @PrimaryGeneratedColumn('uuid')
4. **Simplify Type System**: Remove branded types while maintaining UUID validation
5. **Organize Test Infrastructure**: Move test utilities to proper directory structure
6. **Update Documentation**: Ensure all changes are reflected in test summaries and documentation

This refactoring should result in:
- Cleaner, more maintainable entity structure
- Consistent naming conventions across the project
- More efficient UUID generation via database
- Simplified type system without branded type complexity
- Better organized test utilities and development tools
- Comprehensive documentation of changes

## Project Structure Modernization
Please modernize the project structure and eliminate technical debt:
- Remove unnecessary complexity from type system (branded types)
- Standardize file naming conventions throughout the project
- Extract common patterns into reusable base classes
- Improve test organization and utility structure
- Update documentation to reflect architectural changes
- Ensure all TypeScript compilation, linting, and tests pass after changes

Focus on simplicity, maintainability, and developer experience while preserving all existing functionality and test coverage.

