import { z } from 'zod';

// GitHub Contributor schemas
export const CreateGitHubContributorSchema = z.object({
  currentUsername: z.string().min(1, 'Current username is required'),
  currentEmail: z.string().email('Invalid email format'),
  currentName: z.string().min(1, 'Current name is required'),
  historicalUsernames: z.array(z.string()).default([]),
  historicalEmails: z.array(z.string().email()).default([]),
  historicalNames: z.array(z.string()).default([]),
  userId: z.string().uuid('Invalid user ID format'),
});

export const UpdateGitHubContributorSchema = CreateGitHubContributorSchema.partial().extend({
  userId: z.string().uuid('Invalid user ID format').optional(),
});

export const GitHubContributorResponseSchema = z.object({
  id: z.string().uuid(),
  currentUsername: z.string(),
  currentEmail: z.string().email(),
  currentName: z.string(),
  historicalUsernames: z.array(z.string()),
  historicalEmails: z.array(z.string()),
  historicalNames: z.array(z.string()),
  userId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type CreateGitHubContributorRequest = z.infer<typeof CreateGitHubContributorSchema>;
export type UpdateGitHubContributorRequest = z.infer<typeof UpdateGitHubContributorSchema>;
export type GitHubContributorResponse = z.infer<typeof GitHubContributorResponseSchema>;
