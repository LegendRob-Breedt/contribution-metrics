import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import type { DataSource } from 'typeorm';
import {
  CreateGitHubOrganizationSchema,
  UpdateGitHubOrganizationSchema,
  GitHubOrganizationResponseSchema,
  type CreateGitHubOrganizationRequest,
  type UpdateGitHubOrganizationRequest,
} from '../schemas/github-organization.js';
import { GitHubOrganizationService } from '../services/github-organization.service.js';
import { isValidUUID } from '../shared/entities/index.js';
import { GitHubOrganization as GitHubOrganizationEntity } from '../shared/entities/github-organization.entity.js';

export async function githubOrganizationRoutes(
  fastify: FastifyInstance,
  options: { dataSource?: DataSource }
) {
  const tags = ['GitHub Organizations'];

  // Create service instance if dataSource is available
  let service: GitHubOrganizationService | null = null;
  if (options.dataSource?.isInitialized) {
    const repository = options.dataSource.getRepository(GitHubOrganizationEntity);
    service = new GitHubOrganizationService(repository);
  }

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
          500: z.object({
            error: z.string(),
            message: z.string(),
          }),
          503: z.object({
            error: z.string(),
            message: z.string(),
          }),
        },
      },
    },
    async (_request, reply) => {
      if (!service) {
        reply.status(503);
        return { error: 'Service Unavailable', message: 'Database service is not available' };
      }

      const result = await service.findAll();
      if (result.isErr()) {
        fastify.log.error('Failed to fetch organizations:', result.error);
        reply.status(500);
        return { error: 'Internal Server Error', message: 'Failed to fetch organizations' };
      }
      return result.value;
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
          404: z.object({
            error: z.string(),
            message: z.string(),
          }),
          500: z.object({
            error: z.string(),
            message: z.string(),
          }),
          503: z.object({
            error: z.string(),
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      if (!service) {
        reply.status(503);
        return { error: 'Service Unavailable', message: 'Database service is not available' };
      }

      try {
        if (!isValidUUID(id)) {
          reply.status(400);
          return { error: 'Bad Request', message: 'Invalid ID format' };
        }

        const result = await service.findById(id);

        if (result.isErr()) {
          fastify.log.error('Failed to fetch organization:', result.error);
          reply.status(500);
          return { error: 'Internal Server Error', message: 'Failed to fetch organization' };
        }

        if (!result.value) {
          reply.status(404);
          return { error: 'Not Found', message: 'Organization not found' };
        }

        return result.value;
      } catch (error) {
        fastify.log.error('Invalid organization ID format:', error);
        reply.status(400);
        return { error: 'Bad Request', message: 'Invalid organization ID format' };
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
          400: z.object({
            error: z.string(),
            message: z.string(),
          }),
          503: z.object({
            error: z.string(),
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const data = request.body as CreateGitHubOrganizationRequest;

      if (!service) {
        reply.status(503);
        return { error: 'Service Unavailable', message: 'Database service is not available' };
      }

      const result = await service.create(data);
      if (result.isErr()) {
        fastify.log.error('Failed to create organization:', result.error);
        reply.status(400);
        return { error: 'Bad Request', message: 'Failed to create organization' };
      }

      reply.status(201);
      return result.value;
    }
  );

  // PUT /api/github-organizations/:id
  fastify.put(
    '/api/github-organizations/:id',
    {
      schema: {
        tags,
        summary: 'Update GitHub organization',
        description: 'Update an existing GitHub organization',
        params: z.object({
          id: z.string().uuid(),
        }),
        body: UpdateGitHubOrganizationSchema,
        response: {
          200: GitHubOrganizationResponseSchema,
          404: z.object({
            error: z.string(),
            message: z.string(),
          }),
          500: z.object({
            error: z.string(),
            message: z.string(),
          }),
          503: z.object({
            error: z.string(),
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const data = request.body as UpdateGitHubOrganizationRequest;

      if (!service) {
        reply.status(503);
        return { error: 'Service Unavailable', message: 'Database service is not available' };
      }

      try {
        if (!isValidUUID(id)) {
          reply.status(400);
          return { error: 'Bad Request', message: 'Invalid ID format' };
        }

        const result = await service.update(id, data);

        if (result.isErr()) {
          fastify.log.error('Failed to update organization:', result.error);
          reply.status(500);
          return { error: 'Internal Server Error', message: 'Failed to update organization' };
        }

        if (!result.value) {
          reply.status(404);
          return { error: 'Not Found', message: 'Organization not found' };
        }

        return result.value;
      } catch (error) {
        fastify.log.error('Invalid organization ID format:', error);
        reply.status(400);
        return { error: 'Bad Request', message: 'Invalid organization ID format' };
      }
    }
  );

  // DELETE /api/github-organizations/:id
  fastify.delete(
    '/api/github-organizations/:id',
    {
      schema: {
        tags,
        summary: 'Delete GitHub organization',
        description: 'Delete a GitHub organization',
        params: z.object({
          id: z.string().uuid(),
        }),
        response: {
          204: z.null(),
          404: z.object({
            error: z.string(),
            message: z.string(),
          }),
          500: z.object({
            error: z.string(),
            message: z.string(),
          }),
          503: z.object({
            error: z.string(),
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      if (!service) {
        reply.status(503);
        return { error: 'Service Unavailable', message: 'Database service is not available' };
      }

      try {
        if (!isValidUUID(id)) {
          reply.status(400);
          return { error: 'Bad Request', message: 'Invalid ID format' };
        }

        const result = await service.delete(id);

        if (result.isErr()) {
          fastify.log.error('Failed to delete organization:', result.error);
          reply.status(500);
          return { error: 'Internal Server Error', message: 'Failed to delete organization' };
        }

        if (!result.value) {
          reply.status(404);
          return { error: 'Not Found', message: 'Organization not found' };
        }

        reply.status(204);
      } catch (error) {
        fastify.log.error('Invalid organization ID format:', error);
        reply.status(400);
        return { error: 'Bad Request', message: 'Invalid organization ID format' };
      }
      return;
    }
  );
}
