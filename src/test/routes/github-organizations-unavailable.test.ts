import { describe, it, expect } from 'vitest';
import Fastify from 'fastify';
import { githubOrganizationRoutes } from '../../modules/github-organization/routes/github-organization.routes.js';
import zodOpenApiPlugin from '../../shared/plugins/zod-openapi.js';
import { createContainer } from 'awilix';

describe('GitHub Organizations Routes - Service Unavailable', () => {
  it('should return 503 when database service is not available', async () => {
    const app = Fastify({ logger: false });
    
    // Register plugins
    await app.register(zodOpenApiPlugin);
    
    // Create container without services (service unavailable)
    const container = createContainer();
    
    // Register routes without proper container setup
    await app.register(githubOrganizationRoutes, { container });

    const response = await app.inject({
      method: 'GET',
      url: '/api/github-organizations',
    });

    expect(response.statusCode).toBe(503);
    const body = JSON.parse(response.body);
    expect(body).toMatchObject({
      error: 'ServiceUnavailable',
      message: 'Service is not available',
    });

    await app.close();
  });

  it('should return 503 for POST when service is unavailable', async () => {
    const app = Fastify({ logger: false });
    
    // Register plugins
    await app.register(zodOpenApiPlugin);
    
    // Create container without services (service unavailable)
    const container = createContainer();
    
    // Register routes without proper container setup
    await app.register(githubOrganizationRoutes, { container });

    const response = await app.inject({
      method: 'POST',
      url: '/api/github-organizations',
      payload: {
        name: 'test-org',
        accessToken: 'token123',
        tokenExpiresAt: '2025-12-31T23:59:59Z',
      },
    });

    expect(response.statusCode).toBe(503);
    const body = JSON.parse(response.body);
    expect(body).toMatchObject({
      error: 'ServiceUnavailable',
      message: 'Service is not available',
    });

    await app.close();
  });
});
