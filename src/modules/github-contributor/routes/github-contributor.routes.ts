import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { AwilixContainer } from 'awilix';
import type { GitHubContributorService } from '../ports/github-contributor.service.ports.js';
import {
  CreateGitHubContributorSchema,
  GitHubContributorListResponseSchema,
  GitHubContributorQuerySchema,
  GitHubContributorResponseSchema,
  UpdateGitHubContributorSchema,
  type CreateGitHubContributorSchemaType,
  type GitHubContributorQuerySchemaType,
  type UpdateGitHubContributorSchemaType,
} from '../schemas/github-contributor.schema.js';
import { GitHubContributor } from '../domains/github-contributor.domain.js';
import { randomUUID } from 'crypto';

interface GitHubContributorParamsSchema {
  id: string;
}

export async function githubContributorRoutes(
  fastify: FastifyInstance,
  options: { container: AwilixContainer }
): Promise<void> {
  const service = options.container.resolve<GitHubContributorService>('gitHubContributorService');

  // Get all GitHub contributors
  fastify.get(
    '/',
    {
      schema: {
        querystring: GitHubContributorQuerySchema,
        response: {
          200: GitHubContributorListResponseSchema,
        },
      },
    },
    async (
      request: FastifyRequest<{ Querystring: GitHubContributorQuerySchemaType }>,
      reply: FastifyReply
    ) => {
      const { userId, username, email, limit, offset } = request.query;

      let result;

      if (userId) {
        result = await service.findByUserId(userId);
        if (result.isErr()) {
          return reply.status(500).send({ error: result.error.message });
        }
        return reply.send({
          data: result.value,
          total: result.value.length,
          limit,
          offset,
        });
      }

      if (username) {
        result = await service.findByAnyUsername(username);
        if (result.isErr()) {
          return reply.status(500).send({ error: result.error.message });
        }
        return reply.send({
          data: result.value,
          total: result.value.length,
          limit,
          offset,
        });
      }

      if (email) {
        result = await service.findByAnyEmail(email);
        if (result.isErr()) {
          return reply.status(500).send({ error: result.error.message });
        }
        return reply.send({
          data: result.value,
          total: result.value.length,
          limit,
          offset,
        });
      }

      // Get all contributors with pagination
      result = await service.findAll(limit, offset);
      if (result.isErr()) {
        return reply.status(500).send({ error: result.error.message });
      }

      return reply.send({
        data: result.value,
        total: result.value.length,
        limit,
        offset,
      });
    }
  );

  // Get GitHub contributor by ID
  fastify.get<{ Params: GitHubContributorParamsSchema }>(
    '/:id',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
          required: ['id'],
        },
        response: {
          200: GitHubContributorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const result = await service.findById(id);

      if (result.isErr()) {
        if (result.error.name === 'NotFoundError') {
          return reply.status(404).send({ error: result.error.message });
        }
        return reply.status(500).send({ error: result.error.message });
      }

      return reply.send(result.value);
    }
  );

  // Create new GitHub contributor
  fastify.post(
    '/',
    {
      schema: {
        body: CreateGitHubContributorSchema,
        response: {
          201: GitHubContributorResponseSchema,
        },
      },
    },
    async (
      request: FastifyRequest<{ Body: CreateGitHubContributorSchemaType }>,
      reply: FastifyReply
    ) => {
      const {
        currentUsername,
        currentEmail,
        currentName,
        userId,
        allKnownUsernames = [],
        allKnownEmails = [],
        allKnownNames = [],
      } = request.body;

      try {
        const contributor = GitHubContributor.create(
          randomUUID(),
          currentUsername,
          currentEmail,
          currentName,
          userId,
          allKnownUsernames,
          allKnownEmails,
          allKnownNames
        );

        const result = await service.create(contributor);

        if (result.isErr()) {
          return reply.status(500).send({ error: result.error.message });
        }

        return reply.status(201).send(result.value);
      } catch (error) {
        return reply.status(400).send({ error: String(error) });
      }
    }
  );

  // Update GitHub contributor
  fastify.put<{ Params: GitHubContributorParamsSchema; Body: UpdateGitHubContributorSchemaType }>(
    '/:id',
    {
      schema: {
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
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const updates = request.body;

      const result = await service.update(id, updates);

      if (result.isErr()) {
        if (result.error.name === 'NotFoundError') {
          return reply.status(404).send({ error: result.error.message });
        }
        return reply.status(500).send({ error: result.error.message });
      }

      return reply.send(result.value);
    }
  );

  // Delete GitHub contributor
  fastify.delete<{ Params: GitHubContributorParamsSchema }>(
    '/:id',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
          required: ['id'],
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const result = await service.delete(id);

      if (result.isErr()) {
        if (result.error.name === 'NotFoundError') {
          return reply.status(404).send({ error: result.error.message });
        }
        return reply.status(500).send({ error: result.error.message });
      }

      return reply.status(204).send();
    }
  );
}
