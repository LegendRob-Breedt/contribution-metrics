import { z } from 'zod';

// Enums as Zod schemas
export const RoleSchema = z.enum([
  'Product Engineer',
  'Wordpress Product Engineer',
  'Architect/Principle',
  'Content Editor',
  'Data Engineer',
  'Data Analytics',
  'DWP Engineer',
  'Manager',
  'SRE Engineer',
]);

export const RoleTypeSchema = z.enum(['IC', 'MG']);

export const OrgFunctionSchema = z.enum(['Engineering', 'Content', 'Design', 'Data']);

export const AppAccessRoleSchema = z.enum(['administrator', 'HO', 'EM', 'IC']);

// User schemas
export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(1, 'Name is required'),
  company: z.string().optional(),
  role: RoleSchema.default('Product Engineer'),
  roleType: RoleTypeSchema.default('IC'),
  growthLevel: z.string().optional(),
  orgFunction: OrgFunctionSchema.optional(),
  pillar: z.string().optional(),
  tribe: z.string().optional(),
  squad: z.string().optional(),
  jobTitle: z.string().optional(),
  managerId: z.string().uuid().optional(),
  appAccessRole: AppAccessRoleSchema.default('IC'),
});

export const UpdateUserSchema = CreateUserSchema.partial().extend({
  email: z.string().email('Invalid email format').optional(),
});

export const UserResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  company: z.string().nullable(),
  role: RoleSchema,
  roleType: RoleTypeSchema,
  growthLevel: z.string().nullable(),
  orgFunction: OrgFunctionSchema.nullable(),
  pillar: z.string().nullable(),
  tribe: z.string().nullable(),
  squad: z.string().nullable(),
  jobTitle: z.string().nullable(),
  managerId: z.string().uuid().nullable(),
  appAccessRole: AppAccessRoleSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type CreateUserRequest = z.infer<typeof CreateUserSchema>;
export type UpdateUserRequest = z.infer<typeof UpdateUserSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
