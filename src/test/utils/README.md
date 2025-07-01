# Test Utilities

This directory contains utility scripts for testing and development purposes.

## Files

### `test-db-connection.mjs`
A simple script to test PostgreSQL database connectivity. This is useful for:
- Verifying database connection settings
- Checking if the database server is running
- Debugging connection issues

**Usage:**
```bash
pnpm test:db
```

### `test-startup.ts`
A basic server startup test that:
- Loads application configuration
- Initializes OpenTelemetry tracing
- Creates a Fastify instance
- Starts the server with a health endpoint

**Usage:**
```bash
pnpm test:startup
```

## Purpose

These utilities are separate from the main test suite and are intended for:
- Manual testing during development
- Debugging infrastructure issues
- Verifying environment setup
- Quick smoke tests

They are not part of the automated test suite but can be run manually when needed.
