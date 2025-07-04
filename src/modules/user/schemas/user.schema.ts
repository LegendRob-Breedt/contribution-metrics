import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

// Enums as Zod schemas
export const RoleSchema = z
  .enum([
    'Product Engineer',
    'Wordpress Product Engineer',
    'Architect/Principle',
    'Content Editor',
    'Data Engineer',
    'Data Analytics',
    'DWP Engineer',
    'Manager',
    'SRE Engineer',
  ])
  .openapi({
    description: 'User role within the organization',
    example: 'Product Engineer',
  });

export const RoleTypeSchema = z.enum(['IC', 'MG']).openapi({
  description: 'Role type - IC (Individual Contributor) or MG (Manager)',
  example: 'IC',
});

export const OrgFunctionSchema = z.enum(['Engineering', 'Content', 'Design', 'Data']).openapi({
  description: 'Organizational function/department',
  example: 'Engineering',
});

export const AppAccessRoleSchema = z.enum(['administrator', 'HO', 'EM', 'IC']).openapi({
  description: 'Application access role level',
  example: 'IC',
});

// Request schemas
export const CreateUserSchema = z
  .object({
    email: z.string().email('Invalid email format').openapi({
      description: 'User email address',
      example: 'john.doe@example.com',
    }),
    name: z.string().min(1, 'Name is required').openapi({
      description: 'Full name of the user',
      example: 'John Doe',
    }),
    company: z.string().optional().openapi({
      description: 'Company name',
      example: 'Acme Corp',
    }),
    role: RoleSchema.default('Product Engineer'),
    roleType: RoleTypeSchema.default('IC'),
    growthLevel: z.string().optional().openapi({
      description: 'Growth level (e.g., IC-6, MG-5)',
      example: 'IC-6',
    }),
    orgFunction: OrgFunctionSchema.optional(),
    pillar: z.string().optional().openapi({
      description: 'Business pillar/division',
      example: 'Platform',
    }),
    tribe: z.string().optional().openapi({
      description: 'Tribe within the organization',
      example: 'Core Platform',
    }),
    squad: z.string().optional().openapi({
      description: 'Squad/team name',
      example: 'Infrastructure',
    }),
    jobTitle: z.string().optional().openapi({
      description: 'Official job title',
      example: 'Senior Software Engineer',
    }),
    managerId: z.string().uuid().optional().openapi({
      description: 'UUID of the manager',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    appAccessRole: AppAccessRoleSchema.default('IC'),
  })
  .openapi({ ref: 'CreateUserRequest' });

export const UpdateUserSchema = CreateUserSchema.partial()
  .extend({
    email: z.string().email('Invalid email format').optional(),
  })
  .openapi({ ref: 'UpdateUserRequest' });

export const UpdateUserEmailSchema = z
  .object({
    email: z.string().email('Invalid email format').openapi({
      description: 'New email address',
      example: 'john.newemail@example.com',
    }),
  })
  .openapi({ ref: 'UpdateUserEmailRequest' });

// Response schemas
export const UserResponseSchema = z
  .object({
    id: z.string().uuid().openapi({
      description: 'Unique identifier for the user',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    email: z.string().email().openapi({
      description: 'User email address',
      example: 'john.doe@example.com',
    }),
    name: z.string().openapi({
      description: 'Full name of the user',
      example: 'John Doe',
    }),
    company: z.string().nullable().openapi({
      description: 'Company name',
      example: 'Acme Corp',
    }),
    role: RoleSchema,
    roleType: RoleTypeSchema,
    growthLevel: z.string().nullable().openapi({
      description: 'Growth level',
      example: 'IC-6',
    }),
    orgFunction: OrgFunctionSchema.nullable(),
    pillar: z.string().nullable().openapi({
      description: 'Business pillar/division',
      example: 'Platform',
    }),
    tribe: z.string().nullable().openapi({
      description: 'Tribe within the organization',
      example: 'Core Platform',
    }),
    squad: z.string().nullable().openapi({
      description: 'Squad/team name',
      example: 'Infrastructure',
    }),
    jobTitle: z.string().nullable().openapi({
      description: 'Official job title',
      example: 'Senior Software Engineer',
    }),
    managerId: z.string().uuid().nullable().openapi({
      description: 'UUID of the manager',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    appAccessRole: AppAccessRoleSchema,
    createdAt: z.string().datetime().openapi({
      description: 'When the user was created',
      example: '2024-01-01T00:00:00Z',
    }),
    updatedAt: z.string().datetime().openapi({
      description: 'When the user was last updated',
      example: '2024-01-01T00:00:00Z',
    }),
  })
  .openapi({ ref: 'UserResponse' });

// Error schemas
export const ErrorResponseSchema = z
  .object({
    error: z.string().openapi({
      description: 'Error type',
      example: 'ValidationError',
    }),
    message: z.string().openapi({
      description: 'Error message',
      example: 'Invalid email format',
    }),
  })
  .openapi({ ref: 'ErrorResponse' });

// Type exports
export type CreateUserRequest = z.infer<typeof CreateUserSchema>;
export type UpdateUserRequest = z.infer<typeof UpdateUserSchema>;
export type UpdateUserEmailRequest = z.infer<typeof UpdateUserEmailSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
