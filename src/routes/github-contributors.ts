import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import {
  CreateGitHubContributorSchema,
  UpdateGitHubContributorSchema,
  GitHubContributorResponseSchema,
  type CreateGitHubContributorRequest,
  type UpdateGitHubContributorRequest,
} from '../schemas/github-contributor.js';

export async function githubContributorRoutes(fastify: FastifyInstance) {
  const tags = ['GitHub Contributors'];

  // GET /api/github-contributors
  fastify.get(
    '/api/github-contributors',
    {
      schema: {
        tags,
        summary: 'List all GitHub contributors',
        description: 'Retrieve a list of all GitHub contributors',
        response: {
          200: z.array(GitHubContributorResponseSchema),
        },
      },
    },
    async (_request, _reply) => {
      // TODO: Implement with database service
      return [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          currentUsername: 'johndoe',
          currentEmail: 'john.doe@example.com',
          currentName: 'John Doe',
          historicalUsernames: ['john-doe-old', 'jdoe'],
          historicalEmails: ['john.old@example.com'],
          historicalNames: ['J. Doe'],
          userId: '456e7890-e89b-12d3-a456-426614174000',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ];
    }
  );

  // GET /api/github-contributors/:id
  fastify.get(
    '/api/github-contributors/:id',
    {
      schema: {
        tags,
        summary: 'Get GitHub contributor by ID',
        description: 'Retrieve a specific GitHub contributor by their ID',
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
          required: ['id'],
        },
        response: {
          200: GitHubContributorResponseSchema,
          404: {
            type: 'object',
            properties: {
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      // TODO: Implement with database service
      if (id === '123e4567-e89b-12d3-a456-426614174000') {
        return {
          id,
          currentUsername: 'johndoe',
          currentEmail: 'john.doe@example.com',
          currentName: 'John Doe',
          historicalUsernames: ['john-doe-old', 'jdoe'],
          historicalEmails: ['john.old@example.com'],
          historicalNames: ['J. Doe'],
          userId: '456e7890-e89b-12d3-a456-426614174000',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        };
      }

      reply.status(404);
      return { error: 'Not Found', message: 'GitHub contributor not found' };
    }
  );

  // POST /api/github-contributors
  fastify.post(
    '/api/github-contributors',
    {
      schema: {
        tags,
        summary: 'Create a new GitHub contributor',
        description: 'Create a new GitHub contributor record',
        body: CreateGitHubContributorSchema,
        response: {
          201: GitHubContributorResponseSchema,
          400: {
            type: 'object',
            properties: {
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const data = request.body as CreateGitHubContributorRequest;

      // TODO: Implement with database service
      const newContributor = {
        id: '123e4567-e89b-12d3-a456-426614174001',
        currentUsername: data.currentUsername,
        currentEmail: data.currentEmail,
        currentName: data.currentName,
        historicalUsernames: data.historicalUsernames,
        historicalEmails: data.historicalEmails,
        historicalNames: data.historicalNames,
        userId: data.userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      reply.status(201);
      return newContributor;
    }
  );

  // PUT /api/github-contributors/:id
  fastify.put(
    '/api/github-contributors/:id',
    {
      schema: {
        tags,
        summary: 'Update GitHub contributor',
        description: 'Update an existing GitHub contributor',
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
          required: ['id'],
        },
        body: UpdateGitHubContributorSchema,
        response: {
          200: GitHubContributorResponseSchema,
          404: {
            type: 'object',
            properties: {
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const data = request.body as UpdateGitHubContributorRequest;

      // TODO: Implement with database service
      if (id === '123e4567-e89b-12d3-a456-426614174000') {
        return {
          id,
          currentUsername: data.currentUsername || 'johndoe',
          currentEmail: data.currentEmail || 'john.doe@example.com',
          currentName: data.currentName || 'John Doe',
          historicalUsernames: data.historicalUsernames || ['john-doe-old', 'jdoe'],
          historicalEmails: data.historicalEmails || ['john.old@example.com'],
          historicalNames: data.historicalNames || ['J. Doe'],
          userId: data.userId || '456e7890-e89b-12d3-a456-426614174000',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: new Date().toISOString(),
        };
      }

      reply.status(404);
      return { error: 'Not Found', message: 'GitHub contributor not found' };
    }
  );

  // DELETE /api/github-contributors/:id
  fastify.delete(
    '/api/github-contributors/:id',
    {
      schema: {
        tags,
        summary: 'Delete GitHub contributor',
        description: 'Delete a GitHub contributor',
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
          required: ['id'],
        },
        response: {
          204: {
            type: 'null',
            description: 'GitHub contributor deleted successfully',
          },
          404: {
            type: 'object',
            properties: {
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      // TODO: Implement with database service
      if (id === '123e4567-e89b-12d3-a456-426614174000') {
        reply.status(204);
        return;
      }

      reply.status(404);
      return { error: 'Not Found', message: 'GitHub contributor not found' };
    }
  );
}
