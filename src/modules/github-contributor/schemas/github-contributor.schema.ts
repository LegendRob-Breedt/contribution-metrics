import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

// Base schema for GitHub Contributor
export const GitHubContributorSchema = z
  .object({
    id: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    currentUsername: z
      .string()
      .min(1)
      .max(255)
      .openapi({ example: 'johndoe', description: 'Current GitHub username' }),
    currentEmail: z
      .string()
      .email()
      .openapi({ example: 'john@example.com', description: 'Current email address' }),
    currentName: z
      .string()
      .min(1)
      .max(255)
      .openapi({ example: 'John Doe', description: 'Current display name' }),
    historicalUsernames: z
      .array(z.string())
      .default([])
      .openapi({
        example: ['oldusername', 'previousname'],
        description: 'List of historical usernames',
      }),
    historicalEmails: z
      .array(z.string().email())
      .default([])
      .openapi({
        example: ['old@example.com', 'previous@example.com'],
        description: 'List of historical emails',
      }),
    historicalNames: z
      .array(z.string())
      .default([])
      .openapi({ example: ['Old Name', 'Previous Name'], description: 'List of historical names' }),
    userId: z.string().uuid().openapi({ example: '456e7890-e89b-12d3-a456-426614174000' }),
    createdAt: z.date().openapi({ example: '2023-01-01T00:00:00.000Z' }),
    updatedAt: z.date().openapi({ example: '2023-01-01T00:00:00.000Z' }),
  })
  .openapi({ ref: 'GitHubContributor' });

// Schema for creating a new GitHub Contributor
export const CreateGitHubContributorSchema = GitHubContributorSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).openapi({ ref: 'CreateGitHubContributor' });

// Schema for updating a GitHub Contributor
export const UpdateGitHubContributorSchema = GitHubContributorSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
  .partial()
  .openapi({ ref: 'UpdateGitHubContributor' });

// Schema for GitHub Contributor query parameters
export const GitHubContributorQuerySchema = z
  .object({
    userId: z.string().uuid().optional(),
    username: z.string().optional(),
    email: z.string().email().optional(),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    offset: z.coerce.number().int().min(0).default(0),
  })
  .openapi({ ref: 'GitHubContributorQuery' });

// Schema for GitHub Contributor response
export const GitHubContributorResponseSchema = GitHubContributorSchema.openapi({
  ref: 'GitHubContributorResponse',
});

// Schema for GitHub Contributor list response
export const GitHubContributorListResponseSchema = z
  .object({
    data: z.array(GitHubContributorResponseSchema),
    total: z.number().int().min(0),
    limit: z.number().int().min(1),
    offset: z.number().int().min(0),
  })
  .openapi({ ref: 'GitHubContributorListResponse' });

// Type exports
export type GitHubContributorSchemaType = z.infer<typeof GitHubContributorSchema>;
export type CreateGitHubContributorSchemaType = z.infer<typeof CreateGitHubContributorSchema>;
export type UpdateGitHubContributorSchemaType = z.infer<typeof UpdateGitHubContributorSchema>;
export type GitHubContributorQuerySchemaType = z.infer<typeof GitHubContributorQuerySchema>;
export type GitHubContributorResponseSchemaType = z.infer<typeof GitHubContributorResponseSchema>;
export type GitHubContributorListResponseSchemaType = z.infer<
  typeof GitHubContributorListResponseSchema
>;
