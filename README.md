# Contribution Metrics Service

A Node.js service for tracking GitHub contribution metrics, managing user data, and linking GitHub contributors to internal users.

## Features

- 🏢 **GitHub Organization Management**: Store and manage GitHub organization access tokens with expiration tracking
- 👥 **User Management**: Comprehensive user data management with roles, teams, and organizational hierarchy
- 🔗 **GitHub Contributor Linking**: Connect GitHub identities to internal users with historical data tracking
- 📊 **Metrics Tracking**: Track and analyze GitHub contribution metrics
- 🔒 **Secure Token Management**: Safe storage and management of GitHub API tokens
- 📖 **OpenAPI Documentation**: Auto-generated API documentation with Swagger UI
- 🔍 **Observability**: Built-in logging, tracing, and monitoring capabilities

## Technology Stack

- **Runtime**: Node.js 22
- **Language**: TypeScript (ES2022)
- **Package Manager**: PNPM
- **Web Framework**: Fastify
- **API Documentation**: OpenAPI v3 with Swagger UI
- **Schema Validation**: Zod with fastify-zod-openapi
- **Database**: PostgreSQL with TypeORM
- **Testing**: Vitest
- **Error Handling**: neverthrow
- **GitHub APIs**: Octokit
- **Code Quality**: ESLint + Prettier
- **Environment Config**: zod-config
- **Observability**: OpenTelemetry + Pino logging
- **Development**: Docker Compose

## Quick Start

### Prerequisites

- Node.js 22+
- PNPM 9+
- Docker & Docker Compose

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd contribution-metrics
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start local development services**
   ```bash
   pnpm docker:up
   ```

5. **Run database migrations**
   ```bash
   pnpm db:migrate
   ```

6. **Start the development server**
   ```bash
   pnpm dev
   ```

The API will be available at `http://localhost:3000` with documentation at `http://localhost:3000/documentation`.

## Data Models

### GitHub Organizations
Store GitHub organization access tokens and metadata:
- Organization name
- Access token for GitHub APIs
- Token expiration timestamp
- Automatic expiration notifications

### Users
Comprehensive user/employee data management:
- **Basic Info**: Email (primary key), name, company
- **Role Information**: 
  - Role: Product Engineer, WordPress Engineer, Architect, etc.
  - Role Type: IC (Individual Contributor) or MG (Manager)
  - Growth Level: IC-6, IC-5, MG-5, etc.
- **Organization Structure**:
  - Org Function: Engineering, Content, Design, Data
  - Pillar: Business division
  - Tribe: Department/group
  - Squad: Team assignment
- **Hierarchy**: Manager relationships
- **Access Control**: App access roles (administrator, HO, EM, IC)

### GitHub Contributors
Link GitHub identities to internal users:
- Current GitHub username, email, and name
- Historical usernames, emails, and names
- Link to internal user record
- Complete audit trail of identity changes

## API Endpoints

### Health Check
- `GET /health` - Service health status

### GitHub Organizations
- `POST /organizations` - Create new GitHub organization
- `GET /organizations` - List all organizations
- `GET /organizations/:id` - Get organization by ID
- `PUT /organizations/:id` - Update organization
- `DELETE /organizations/:id` - Delete organization

### Users
- `POST /users` - Create new user
- `GET /users` - List all users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### GitHub Contributors
- `POST /contributors` - Create new contributor
- `GET /contributors` - List all contributors
- `GET /contributors/:id` - Get contributor by ID
- `PUT /contributors/:id` - Update contributor
- `DELETE /contributors/:id` - Delete contributor

## Development

### Scripts

```bash
# Development
pnpm dev              # Start development server with hot reload
pnpm build            # Build TypeScript to JavaScript
pnpm start            # Start production server

# Testing
pnpm test             # Run tests
pnpm test:coverage    # Run tests with coverage report

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm format           # Format code with Prettier
pnpm typecheck        # Type check without building

# Database
pnpm db:migrate       # Run database migrations
pnpm db:revert        # Revert last migration
pnpm db:generate      # Generate new migration

# Docker
pnpm docker:up        # Start development services
pnpm docker:down      # Stop development services
```

### Project Structure

```
src/
├── config/           # Environment configuration with zod-config
├── entities/         # TypeORM database entities
├── schemas/          # Zod schemas for request/response validation
├── services/         # Business logic with neverthrow error handling
├── routes/           # Fastify route handlers with OpenAPI docs
├── plugins/          # Fastify plugins (zod-openapi, etc.)
├── utils/            # Utility functions and helpers
├── types/            # TypeScript type definitions
└── migrations/       # Database migration files
```

### Environment Variables

```bash
# Application
NODE_ENV=development
PORT=3000
HOST=localhost
LOG_LEVEL=info

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=contribution_metrics

# OpenTelemetry
OTEL_SERVICE_NAME=contribution-metrics
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:14268/api/traces

# GitHub API (Optional)
GITHUB_APP_ID=your_app_id
GITHUB_PRIVATE_KEY=your_private_key
GITHUB_WEBHOOK_SECRET=your_webhook_secret
```

### Testing

The project uses Vitest for testing with coverage reporting:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Generate coverage report
pnpm test:coverage
```

### Code Quality

- **ESLint**: Configured with TypeScript and neverthrow rules
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict type checking with ES2022 target
- **neverthrow**: Functional error handling patterns

### Observability

- **Logging**: Structured logging with Pino
- **Tracing**: OpenTelemetry integration with Jaeger
- **Metrics**: Fastify metrics and custom business metrics
- **Health Checks**: Built-in health endpoint

## Docker Services

The `docker-compose.yml` provides:

- **PostgreSQL**: Main database (port 5432)
- **Redis**: Caching and session storage (port 6379)
- **Jaeger**: Distributed tracing UI (port 16686)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add/update tests
5. Ensure code quality checks pass
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

