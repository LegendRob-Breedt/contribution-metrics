import { z } from 'zod';

// GitHub Organization schemas
export const CreateGitHubOrganizationSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
  accessToken: z.string().min(1, 'Access token is required'),
  tokenExpiresAt: z.string().datetime('Invalid datetime format'),
});

export const UpdateGitHubOrganizationSchema = CreateGitHubOrganizationSchema.partial();

export const GitHubOrganizationResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  tokenExpiresAt: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type CreateGitHubOrganizationRequest = z.infer<typeof CreateGitHubOrganizationSchema>;
export type UpdateGitHubOrganizationRequest = z.infer<typeof UpdateGitHubOrganizationSchema>;
export type GitHubOrganizationResponse = z.infer<typeof GitHubOrganizationResponseSchema>;
