import type { FastifyInstance, FastifyReply } from 'fastify';
import { z } from 'zod';
import type { AwilixContainer } from 'awilix';
import {
  CreateGitHubOrganizationSchema,
  UpdateGitHubOrganizationSchema,
  GitHubOrganizationResponseSchema,
  ErrorResponseSchema,
  type CreateGitHubOrganizationRequest,
  type UpdateGitHubOrganizationRequest,
  type GitHubOrganizationResponse,
} from '../schemas/github-organization.schema.js';
import type { GitHubOrganizationService } from '../ports/github-organization.service.ports.js';
import { GitHubOrganization } from '../domains/github-organization.domain.js';
import { ValidationError, NotFoundError } from '../../../shared/errors/index.js';

export async function githubOrganizationRoutes(
  fastify: FastifyInstance,
  options: { container: AwilixContainer }
) {
  const tags = ['GitHub Organizations'];

  // Helper function to transform domain object to response
  const transformToResponse = (org: GitHubOrganization): GitHubOrganizationResponse => ({
    id: org.id,
    name: org.name,
    tokenExpiresAt: org.tokenExpiresAt.toISOString(),
    createdAt: org.createdAt.toISOString(),
    updatedAt: org.updatedAt.toISOString(),
  });

  // Helper function to handle errors
  const handleError = (error: Error, reply: FastifyReply) => {
    if (error instanceof ValidationError) {
      reply.status(400);
      return { error: 'ValidationError', message: error.message };
    }
    if (error instanceof NotFoundError) {
      reply.status(404);
      return { error: 'NotFound', message: error.message };
    }
    fastify.log.error('Unexpected error:', error);
    reply.status(500);
    return { error: 'InternalServerError', message: 'An unexpected error occurred' };
  };

  // GET /api/github-organizations
  fastify.get(
    '/api/github-organizations',
    {
      schema: {
        tags,
        summary: 'List all GitHub organizations',
        description: 'Retrieve a list of all registered GitHub organizations',
        response: {
          200: z.array(GitHubOrganizationResponseSchema),
          500: ErrorResponseSchema,
          503: ErrorResponseSchema,
        },
      },
    },
    async (_request, reply) => {
      try {
        const service: GitHubOrganizationService = options.container.resolve(
          'gitHubOrganizationService'
        );
        const result = await service.getAllOrganizations();

        if (result.isErr()) {
          return handleError(result.error, reply);
        }

        return result.value.map(transformToResponse);
      } catch {
        reply.status(503);
        return { error: 'ServiceUnavailable', message: 'Service is not available' };
      }
    }
  );

  // GET /api/github-organizations/:id
  fastify.get(
    '/api/github-organizations/:id',
    {
      schema: {
        tags,
        summary: 'Get GitHub organization by ID',
        description: 'Retrieve a specific GitHub organization by its ID',
        params: z.object({
          id: z.string().uuid(),
        }),
        response: {
          200: GitHubOrganizationResponseSchema,
          400: ErrorResponseSchema,
          404: ErrorResponseSchema,
          500: ErrorResponseSchema,
          503: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string };
        const service: GitHubOrganizationService = options.container.resolve(
          'gitHubOrganizationService'
        );
        const result = await service.getOrganizationById(id);

        if (result.isErr()) {
          return handleError(result.error, reply);
        }

        return transformToResponse(result.value);
      } catch {
        reply.status(503);
        return { error: 'ServiceUnavailable', message: 'Service is not available' };
      }
    }
  );

  // POST /api/github-organizations
  fastify.post(
    '/api/github-organizations',
    {
      schema: {
        tags,
        summary: 'Create a new GitHub organization',
        description: 'Register a new GitHub organization with access token',
        body: CreateGitHubOrganizationSchema,
        response: {
          201: GitHubOrganizationResponseSchema,
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
          503: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const data = request.body as CreateGitHubOrganizationRequest;
        const service: GitHubOrganizationService = options.container.resolve(
          'gitHubOrganizationService'
        );
        const result = await service.createOrganization({
          ...data,
          tokenExpiresAt: new Date(data.tokenExpiresAt),
        });

        if (result.isErr()) {
          return handleError(result.error, reply);
        }

        reply.status(201);
        return transformToResponse(result.value);
      } catch {
        reply.status(503);
        return { error: 'ServiceUnavailable', message: 'Service is not available' };
      }
    }
  );

  // PUT /api/github-organizations/:id
  fastify.put(
    '/api/github-organizations/:id',
    {
      schema: {
        tags,
        summary: 'Update a GitHub organization',
        description: 'Update an existing GitHub organization',
        params: z.object({
          id: z.string().uuid(),
        }),
        body: UpdateGitHubOrganizationSchema,
        response: {
          200: GitHubOrganizationResponseSchema,
          400: ErrorResponseSchema,
          404: ErrorResponseSchema,
          500: ErrorResponseSchema,
          503: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string };
        const data = request.body as UpdateGitHubOrganizationRequest;
        const service: GitHubOrganizationService = options.container.resolve(
          'gitHubOrganizationService'
        );

        const updateData = {
          ...data,
          tokenExpiresAt: data.tokenExpiresAt ? new Date(data.tokenExpiresAt) : undefined,
        };

        const result = await service.updateOrganization(id, updateData);

        if (result.isErr()) {
          return handleError(result.error, reply);
        }

        return transformToResponse(result.value);
      } catch {
        reply.status(503);
        return { error: 'ServiceUnavailable', message: 'Service is not available' };
      }
    }
  );

  // DELETE /api/github-organizations/:id
  fastify.delete(
    '/api/github-organizations/:id',
    {
      schema: {
        tags,
        summary: 'Delete a GitHub organization',
        description: 'Remove a GitHub organization from the system',
        params: z.object({
          id: z.string().uuid(),
        }),
        response: {
          204: z.null(),
          400: ErrorResponseSchema,
          404: ErrorResponseSchema,
          500: ErrorResponseSchema,
          503: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string };
        const service: GitHubOrganizationService = options.container.resolve(
          'gitHubOrganizationService'
        );
        const result = await service.deleteOrganization(id);

        if (result.isErr()) {
          return handleError(result.error, reply);
        }

        reply.status(204);
        return;
      } catch {
        reply.status(503);
        return { error: 'ServiceUnavailable', message: 'Service is not available' };
      }
    }
  );
}
