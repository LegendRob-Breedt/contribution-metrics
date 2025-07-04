import type { Result } from 'neverthrow';
import type { GitHubContributor } from '../domains/github-contributor.domain.js';
import type { DatabaseError, NotFoundError } from '../../../shared/errors/index.js';

export interface GitHubContributorService {
  create(contributor: GitHubContributor): Promise<Result<GitHubContributor, DatabaseError>>;
  findAll(limit?: number, offset?: number): Promise<Result<GitHubContributor[], DatabaseError>>;
  findById(id: string): Promise<Result<GitHubContributor, DatabaseError | NotFoundError>>;
  findByUserId(userId: string): Promise<Result<GitHubContributor[], DatabaseError>>;
  findByCurrentUsername(
    username: string
  ): Promise<Result<GitHubContributor, DatabaseError | NotFoundError>>;
  findByCurrentEmail(
    email: string
  ): Promise<Result<GitHubContributor, DatabaseError | NotFoundError>>;
  findByAnyUsername(username: string): Promise<Result<GitHubContributor[], DatabaseError>>;
  findByAnyEmail(email: string): Promise<Result<GitHubContributor[], DatabaseError>>;
  update(
    id: string,
    contributor: Partial<GitHubContributor>
  ): Promise<Result<GitHubContributor, DatabaseError | NotFoundError>>;
  delete(id: string): Promise<Result<void, DatabaseError | NotFoundError>>;
}
