import type { Result } from 'neverthrow';
import type { GitHubOrganization } from '../domains/github-organization.domain.js';
import type { DatabaseError, NotFoundError } from '../../../shared/errors/index.js';

export interface GitHubOrganizationRepository {
  create(
    organization: GitHubOrganization,
    accessToken: string
  ): Promise<Result<GitHubOrganization, DatabaseError>>;
  findAll(): Promise<Result<GitHubOrganization[], DatabaseError>>;
  findById(id: string): Promise<Result<GitHubOrganization | null, DatabaseError | NotFoundError>>;
  findByName(
    name: string
  ): Promise<Result<GitHubOrganization | null, DatabaseError | NotFoundError>>;
  update(
    id: string,
    organization: Partial<GitHubOrganization>
  ): Promise<Result<GitHubOrganization, DatabaseError | NotFoundError>>;
  delete(id: string): Promise<Result<void, DatabaseError | NotFoundError>>;
}
