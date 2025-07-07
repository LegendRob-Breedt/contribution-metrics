import 'reflect-metadata';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import { DataSource } from 'typeorm';
import { GitHubOrganizationEntity } from './src/adaptors/db/github-organization/entities/github-organization.entity.js';
import { GitHubOrganizationRepositoryImpl } from './src/adaptors/db/github-organization/repositories/github-organization.repository.js';
import { GitHubOrganizationServiceImpl } from './src/modules/github-organization/application/github-organization.service.js';
import zodOpenApiPlugin from './src/shared/plugins/zod-openapi.js';
import { createTestDataSource, cleanupTestDataSource, clearTestData } from './src/test/utils/test-database.js';

describe('Debug GitHub Organizations Routes', () => {
  let app: FastifyInstance;
  let dataSource: DataSource;

  beforeAll(async () => {
    // Create in-memory PostgreSQL database for testing using pg-mem
    dataSource = await createTestDataSource();

    // Create Fastify app
    app = Fastify({
      logger: true, // Enable logging to see detailed errors
    });

    // Register plugins
    await app.register(zodOpenApiPlugin);
    
    // Create a custom route handler that uses the actual GitHubOrganizationEntity
    await app.register(async function (fastify) {
      const typeormRepository = dataSource.getRepository(GitHubOrganizationEntity);
      const repository = new GitHubOrganizationRepositoryImpl(typeormRepository as any);
      const service = new GitHubOrganizationServiceImpl(repository);

      // POST /api/github-organizations
      fastify.post('/api/github-organizations', async (request, reply) => {
        try {
          console.log('Received request body:', JSON.stringify(request.body, null, 2));
          const data = request.body as any;
          
          // Convert string date to Date object if needed
          if (typeof data.tokenExpiresAt === 'string') {
            data.tokenExpiresAt = new Date(data.tokenExpiresAt);
            // Check if date is invalid
            if (isNaN(data.tokenExpiresAt.getTime())) {
              reply.status(400);
              return { error: 'Bad Request', message: 'Invalid tokenExpiresAt date format' };
            }
          }
          
          console.log('Data after processing:', JSON.stringify(data, null, 2));
          
          const result = await service.createOrganization(data);
          console.log('Service result:', result.isOk() ? 'OK' : 'ERROR', result.isErr() ? result.error : '');
          
          if (result.isErr()) {
            if (result.error.name === 'ValidationError') {
              reply.status(400);
              return { error: 'Bad Request', message: result.error.message };
            }
            reply.status(500);
            return { error: 'Internal Server Error', message: result.error.message };
          }
          reply.status(201);
          return result.value;
        } catch (error) {
          console.error('Route handler error:', error);
          reply.status(500);
          return { error: 'Internal Server Error', message: 'Failed to process request' };
        }
      });
    });

    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    await cleanupTestDataSource(dataSource);
  });

  beforeEach(async () => {
    // Clear data for each test
    await clearTestData(dataSource);
  });

  it('should create a new organization with debug info', async () => {
    const payload = {
      name: 'test-org',
      accessToken: 'token123', 
      tokenExpiresAt: '2025-12-31T23:59:59Z',
    };

    console.log('Sending payload:', JSON.stringify(payload, null, 2));

    const response = await app.inject({
      method: 'POST',
      url: '/api/github-organizations',
      payload,
    });

    console.log('Response status:', response.statusCode);
    console.log('Response body:', response.body);

    if (response.statusCode !== 201) {
      console.error('Expected 201, got', response.statusCode);
      console.error('Response body:', JSON.parse(response.body));
    }

    expect(response.statusCode).toBe(201);
  });
});
