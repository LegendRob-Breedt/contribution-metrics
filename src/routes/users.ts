import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import {
  CreateUserSchema,
  UpdateUserSchema,
  UserResponseSchema,
  type CreateUserRequest,
  type UpdateUserRequest,
} from '../schemas/user.js';

export async function userRoutes(fastify: FastifyInstance) {
  const tags = ['Users'];

  // GET /api/users
  fastify.get(
    '/api/users',
    {
      schema: {
        tags,
        summary: 'List all users',
        description: 'Retrieve a list of all users',
        response: {
          200: z.array(UserResponseSchema),
        },
      },
    },
    async (_request, _reply) => {
      // TODO: Implement with database service
      return [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'john.doe@example.com',
          name: 'John Doe',
          company: 'Example Corp',
          role: 'Product Engineer',
          roleType: 'IC',
          growthLevel: 'Senior',
          orgFunction: 'Engineering',
          pillar: 'Platform',
          tribe: 'Core',
          squad: 'Infrastructure',
          jobTitle: 'Senior Product Engineer',
          managerId: null,
          appAccessRole: 'IC',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ];
    }
  );

  // GET /api/users/:id
  fastify.get(
    '/api/users/:id',
    {
      schema: {
        tags,
        summary: 'Get user by ID',
        description: 'Retrieve a specific user by their ID',
        params: z.object({
          id: z.string().uuid(),
        }),
        response: {
          200: UserResponseSchema,
          404: z.object({
            error: z.string(),
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      // TODO: Implement with database service
      if (id === '123e4567-e89b-12d3-a456-426614174000') {
        return {
          id,
          email: 'john.doe@example.com',
          name: 'John Doe',
          company: 'Example Corp',
          role: 'Product Engineer',
          roleType: 'IC',
          growthLevel: 'Senior',
          orgFunction: 'Engineering',
          pillar: 'Platform',
          tribe: 'Core',
          squad: 'Infrastructure',
          jobTitle: 'Senior Product Engineer',
          managerId: null,
          appAccessRole: 'IC',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        };
      }

      reply.status(404);
      return { error: 'Not Found', message: 'User not found' };
    }
  );

  // POST /api/users
  fastify.post(
    '/api/users',
    {
      schema: {
        tags,
        summary: 'Create a new user',
        description: 'Create a new user in the system',
        body: CreateUserSchema,
        response: {
          201: UserResponseSchema,
          400: z.object({
            error: z.string(),
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const data = request.body as CreateUserRequest;

      // TODO: Implement with database service
      const newUser = {
        id: '123e4567-e89b-12d3-a456-426614174001',
        email: data.email,
        name: data.name,
        company: data.company || null,
        role: data.role,
        roleType: data.roleType,
        growthLevel: data.growthLevel || null,
        orgFunction: data.orgFunction || null,
        pillar: data.pillar || null,
        tribe: data.tribe || null,
        squad: data.squad || null,
        jobTitle: data.jobTitle || null,
        managerId: data.managerId || null,
        appAccessRole: data.appAccessRole,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      reply.status(201);
      return newUser;
    }
  );

  // PUT /api/users/:id
  fastify.put(
    '/api/users/:id',
    {
      schema: {
        tags,
        summary: 'Update user',
        description: 'Update an existing user',
        params: z.object({
          id: z.string().uuid(),
        }),
        body: UpdateUserSchema,
        response: {
          200: UserResponseSchema,
          404: z.object({
            error: z.string(),
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const data = request.body as UpdateUserRequest;

      // TODO: Implement with database service
      if (id === '123e4567-e89b-12d3-a456-426614174000') {
        return {
          id,
          email: data.email || 'john.doe@example.com',
          name: data.name || 'John Doe',
          company: data.company || 'Example Corp',
          role: data.role || 'Product Engineer',
          roleType: data.roleType || 'IC',
          growthLevel: data.growthLevel || 'Senior',
          orgFunction: data.orgFunction || 'Engineering',
          pillar: data.pillar || 'Platform',
          tribe: data.tribe || 'Core',
          squad: data.squad || 'Infrastructure',
          jobTitle: data.jobTitle || 'Senior Product Engineer',
          managerId: data.managerId || null,
          appAccessRole: data.appAccessRole || 'IC',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: new Date().toISOString(),
        };
      }

      reply.status(404);
      return { error: 'Not Found', message: 'User not found' };
    }
  );

  // DELETE /api/users/:id
  fastify.delete(
    '/api/users/:id',
    {
      schema: {
        tags,
        summary: 'Delete user',
        description: 'Delete a user',
        params: z.object({
          id: z.string().uuid(),
        }),
        response: {
          204: z.null(),
          404: z.object({
            error: z.string(),
            message: z.string(),
          }),
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
      return { error: 'Not Found', message: 'User not found' };
    }
  );
}
