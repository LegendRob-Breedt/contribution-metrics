import type { Result } from 'neverthrow';
import type { GitHubOrganization } from '../domains/github-organization.domain.js';
import type { ValidationError, NotFoundError } from '../../../shared/errors/index.js';

export interface CreateOrganizationData {
  name: string;
  accessToken: string;
  tokenExpiresAt: Date;
}

export interface UpdateOrganizationData {
  name?: string;
  tokenExpiresAt?: Date;
}

export interface GitHubOrganizationService {
  createOrganization(
    data: CreateOrganizationData
  ): Promise<Result<GitHubOrganization, ValidationError>>;

  getAllOrganizations(): Promise<Result<GitHubOrganization[], Error>>;

  getOrganizationById(
    id: string
  ): Promise<Result<GitHubOrganization, NotFoundError | ValidationError>>;

  getOrganizationByName(
    name: string
  ): Promise<Result<GitHubOrganization, NotFoundError | ValidationError>>;

  updateOrganization(
    id: string,
    data: UpdateOrganizationData
  ): Promise<Result<GitHubOrganization, NotFoundError | ValidationError>>;

  deleteOrganization(id: string): Promise<Result<void, NotFoundError | ValidationError>>;
}
