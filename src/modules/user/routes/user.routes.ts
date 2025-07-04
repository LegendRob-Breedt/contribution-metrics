import type { FastifyInstance, FastifyReply } from 'fastify';
import { z } from 'zod';
import type { AwilixContainer } from 'awilix';
import {
  CreateUserSchema,
  UpdateUserSchema,
  UpdateUserEmailSchema,
  UserResponseSchema,
  ErrorResponseSchema,
  type CreateUserRequest,
  type UpdateUserRequest,
  type UpdateUserEmailRequest,
  type UserResponse,
} from '../schemas/user.schema.js';
import type { UserService, CreateUserData, UpdateUserData } from '../ports/user.service.ports.js';
import { User, Role, RoleType, OrgFunction, AppAccessRole } from '../domains/user.domain.js';
import { ValidationError, NotFoundError } from '../../../shared/errors/index.js';

// Helper functions to convert Zod schema types to domain types
const convertToRole = (role: string): Role => {
  return role as Role; // Since enum values match the string values
};

const convertToRoleType = (roleType: string): RoleType => {
  return roleType as RoleType; // Since enum values match the string values
};

const convertToOrgFunction = (orgFunction: string): OrgFunction => {
  return orgFunction as OrgFunction; // Since enum values match the string values
};

const convertToAppAccessRole = (appAccessRole: string): AppAccessRole => {
  return appAccessRole as AppAccessRole; // Since enum values match the string values
};

const convertCreateUserData = (data: CreateUserRequest): CreateUserData => {
  return {
    email: data.email,
    name: data.name,
    company: data.company,
    role: data.role ? convertToRole(data.role) : undefined,
    roleType: data.roleType ? convertToRoleType(data.roleType) : undefined,
    growthLevel: data.growthLevel,
    orgFunction: data.orgFunction ? convertToOrgFunction(data.orgFunction) : undefined,
    pillar: data.pillar,
    tribe: data.tribe,
    squad: data.squad,
    jobTitle: data.jobTitle,
    managerId: data.managerId,
    appAccessRole: data.appAccessRole ? convertToAppAccessRole(data.appAccessRole) : undefined,
  };
};

const convertUpdateUserData = (data: UpdateUserRequest): UpdateUserData => {
  return {
    name: data.name,
    company: data.company,
    role: data.role ? convertToRole(data.role) : undefined,
    roleType: data.roleType ? convertToRoleType(data.roleType) : undefined,
    growthLevel: data.growthLevel,
    orgFunction: data.orgFunction ? convertToOrgFunction(data.orgFunction) : undefined,
    pillar: data.pillar,
    tribe: data.tribe,
    squad: data.squad,
    jobTitle: data.jobTitle,
    managerId: data.managerId,
    appAccessRole: data.appAccessRole ? convertToAppAccessRole(data.appAccessRole) : undefined,
  };
};

export async function userRoutes(
  fastify: FastifyInstance,
  options: { container: AwilixContainer }
) {
  const tags = ['Users'];

  // Helper function to transform domain object to response
  const transformToResponse = (user: User): UserResponse => ({
    id: user.id,
    email: user.email,
    name: user.name,
    company: user.company,
    role: user.role,
    roleType: user.roleType,
    growthLevel: user.growthLevel,
    orgFunction: user.orgFunction,
    pillar: user.pillar,
    tribe: user.tribe,
    squad: user.squad,
    jobTitle: user.jobTitle,
    managerId: user.managerId,
    appAccessRole: user.appAccessRole,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
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
          500: ErrorResponseSchema,
          503: ErrorResponseSchema,
        },
      },
    },
    async (_request, reply) => {
      try {
        const service: UserService = options.container.resolve('userService');
        const result = await service.getAllUsers();

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
        const service: UserService = options.container.resolve('userService');
        const result = await service.getUserById(id);

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

  // GET /api/users/email/:email
  fastify.get(
    '/api/users/email/:email',
    {
      schema: {
        tags,
        summary: 'Get user by email',
        description: 'Retrieve a user by their email address',
        params: z.object({
          email: z.string().email(),
        }),
        response: {
          200: UserResponseSchema,
          400: ErrorResponseSchema,
          404: ErrorResponseSchema,
          500: ErrorResponseSchema,
          503: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const { email } = request.params as { email: string };
        const service: UserService = options.container.resolve('userService');
        const result = await service.getUserByEmail(email);

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

  // GET /api/users/:id/reports
  fastify.get(
    '/api/users/:id/reports',
    {
      schema: {
        tags,
        summary: 'Get users managed by a manager',
        description: 'Retrieve all users that report to a specific manager',
        params: z.object({
          id: z.string().uuid(),
        }),
        response: {
          200: z.array(UserResponseSchema),
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
        const service: UserService = options.container.resolve('userService');
        const result = await service.getUsersByManager(id);

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

  // POST /api/users
  fastify.post(
    '/api/users',
    {
      schema: {
        tags,
        summary: 'Create a new user',
        description: 'Register a new user in the system',
        body: CreateUserSchema,
        response: {
          201: UserResponseSchema,
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
          503: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const data = request.body as CreateUserRequest;
        const service: UserService = options.container.resolve('userService');
        const convertedData = convertCreateUserData(data);
        const result = await service.createUser(convertedData);

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

  // PUT /api/users/:id
  fastify.put(
    '/api/users/:id',
    {
      schema: {
        tags,
        summary: 'Update a user',
        description: 'Update an existing user profile',
        params: z.object({
          id: z.string().uuid(),
        }),
        body: UpdateUserSchema,
        response: {
          200: UserResponseSchema,
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
        const data = request.body as UpdateUserRequest;
        const service: UserService = options.container.resolve('userService');
        const convertedData = convertUpdateUserData(data);
        const result = await service.updateUser(id, convertedData);

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

  // PUT /api/users/:id/email
  fastify.put(
    '/api/users/:id/email',
    {
      schema: {
        tags,
        summary: 'Update user email',
        description: 'Update a user email address',
        params: z.object({
          id: z.string().uuid(),
        }),
        body: UpdateUserEmailSchema,
        response: {
          200: UserResponseSchema,
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
        const { email } = request.body as UpdateUserEmailRequest;
        const service: UserService = options.container.resolve('userService');
        const result = await service.updateUserEmail(id, email);

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

  // DELETE /api/users/:id
  fastify.delete(
    '/api/users/:id',
    {
      schema: {
        tags,
        summary: 'Delete a user',
        description: 'Remove a user from the system',
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
        const service: UserService = options.container.resolve('userService');
        const result = await service.deleteUser(id);

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
