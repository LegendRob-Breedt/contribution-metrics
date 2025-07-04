import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

// Request schemas
export const CreateGitHubOrganizationSchema = z
  .object({
    name: z.string().min(1, 'Organization name is required').openapi({
      description: 'The name of the GitHub organization',
      example: 'my-org',
    }),
    accessToken: z.string().min(1, 'Access token is required').openapi({
      description: 'GitHub access token for the organization',
      example: 'ghp_xxxxxxxxxxxxxxxxxxxx',
    }),
    tokenExpiresAt: z.string().datetime('Invalid datetime format').openapi({
      description: 'When the access token expires',
      example: '2024-12-31T23:59:59Z',
    }),
  })
  .openapi({ ref: 'CreateGitHubOrganizationRequest' });

export const UpdateGitHubOrganizationSchema = CreateGitHubOrganizationSchema.partial().openapi({
  ref: 'UpdateGitHubOrganizationRequest',
});

// Response schemas
export const GitHubOrganizationResponseSchema = z
  .object({
    id: z.string().uuid().openapi({
      description: 'Unique identifier for the organization',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    name: z.string().openapi({
      description: 'The name of the GitHub organization',
      example: 'MY-ORG',
    }),
    tokenExpiresAt: z.string().datetime().openapi({
      description: 'When the access token expires',
      example: '2024-12-31T23:59:59Z',
    }),
    createdAt: z.string().datetime().openapi({
      description: 'When the organization was created',
      example: '2024-01-01T00:00:00Z',
    }),
    updatedAt: z.string().datetime().openapi({
      description: 'When the organization was last updated',
      example: '2024-01-01T00:00:00Z',
    }),
  })
  .openapi({ ref: 'GitHubOrganizationResponse' });

// Error schemas
export const ErrorResponseSchema = z
  .object({
    error: z.string().openapi({
      description: 'Error type',
      example: 'ValidationError',
    }),
    message: z.string().openapi({
      description: 'Error message',
      example: 'Organization name is required',
    }),
  })
  .openapi({ ref: 'ErrorResponse' });

// Type exports
export type CreateGitHubOrganizationRequest = z.infer<typeof CreateGitHubOrganizationSchema>;
export type UpdateGitHubOrganizationRequest = z.infer<typeof UpdateGitHubOrganizationSchema>;
export type GitHubOrganizationResponse = z.infer<typeof GitHubOrganizationResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
