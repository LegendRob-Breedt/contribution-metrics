import { err, ok, type Result } from 'neverthrow';
import type { GitHubContributor } from '../domains/github-contributor.domain.js';
import type { GitHubContributorRepository } from '../ports/github-contributor.repository.ports.js';
import type { GitHubContributorService } from '../ports/github-contributor.service.ports.js';
import { DatabaseError, NotFoundError } from '../../../shared/errors/index.js';

export class GitHubContributorServiceImpl implements GitHubContributorService {
  constructor(private readonly repository: GitHubContributorRepository) {}

  async create(contributor: GitHubContributor): Promise<Result<GitHubContributor, DatabaseError>> {
    return this.repository.create(contributor);
  }

  async findAll(limit = 10, offset = 0): Promise<Result<GitHubContributor[], DatabaseError>> {
    const result = await this.repository.findAll();
    if (result.isErr()) {
      return err(result.error);
    }

    // Apply pagination
    const contributors = result.value.slice(offset, offset + limit);
    return ok(contributors);
  }

  async findById(id: string): Promise<Result<GitHubContributor, DatabaseError | NotFoundError>> {
    const result = await this.repository.findById(id);
    if (result.isErr()) {
      return err(result.error);
    }

    if (result.value === null) {
      return err(new NotFoundError(`GitHub contributor with ID ${id} not found`));
    }

    return ok(result.value);
  }

  async findByUserId(userId: string): Promise<Result<GitHubContributor[], DatabaseError>> {
    return this.repository.findByUserId(userId);
  }

  async findByCurrentUsername(
    username: string
  ): Promise<Result<GitHubContributor, DatabaseError | NotFoundError>> {
    const result = await this.repository.findByCurrentUsername(username);
    if (result.isErr()) {
      return err(result.error);
    }

    if (result.value === null) {
      return err(new NotFoundError(`GitHub contributor with username ${username} not found`));
    }

    return ok(result.value);
  }

  async findByCurrentEmail(
    email: string
  ): Promise<Result<GitHubContributor, DatabaseError | NotFoundError>> {
    const result = await this.repository.findByCurrentEmail(email);
    if (result.isErr()) {
      return err(result.error);
    }

    if (result.value === null) {
      return err(new NotFoundError(`GitHub contributor with email ${email} not found`));
    }

    return ok(result.value);
  }

  async findByAnyUsername(username: string): Promise<Result<GitHubContributor[], DatabaseError>> {
    return this.repository.findByAnyUsername(username);
  }

  async findByAnyEmail(email: string): Promise<Result<GitHubContributor[], DatabaseError>> {
    return this.repository.findByAnyEmail(email);
  }

  async update(
    id: string,
    contributor: Partial<GitHubContributor>
  ): Promise<Result<GitHubContributor, DatabaseError | NotFoundError>> {
    return this.repository.update(id, contributor);
  }

  async delete(id: string): Promise<Result<void, DatabaseError | NotFoundError>> {
    return this.repository.delete(id);
  }
}
