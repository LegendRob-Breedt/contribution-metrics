import { err, ok, type Result } from 'neverthrow';
import { Repository } from 'typeorm';
import { GitHubContributor } from '../../../modules/github-contributor/domains/github-contributor.domain.js';
import type { GitHubContributorRepository } from '../../../modules/github-contributor/ports/github-contributor.repository.ports.js';
import { DatabaseError, NotFoundError } from '../../../shared/errors/index.js';
import { GitHubContributorEntity } from '../entities/github-contributor.entity.js';

export class GitHubContributorRepositoryImpl implements GitHubContributorRepository {
  constructor(private readonly repository: Repository<GitHubContributorEntity>) {}

  async create(contributor: GitHubContributor): Promise<Result<GitHubContributor, DatabaseError>> {
    try {
      const entity = this.domainToEntity(contributor);
      const savedEntity = await this.repository.save(entity);
      return ok(this.entityToDomain(savedEntity));
    } catch (error) {
      return err(new DatabaseError(`Failed to create GitHub contributor: ${String(error)}`));
    }
  }

  async findAll(): Promise<Result<GitHubContributor[], DatabaseError>> {
    try {
      const entities = await this.repository.find();
      const contributors = entities.map(entity => this.entityToDomain(entity));
      return ok(contributors);
    } catch (error) {
      return err(new DatabaseError(`Failed to find GitHub contributors: ${String(error)}`));
    }
  }

  async findById(
    id: string
  ): Promise<Result<GitHubContributor | null, DatabaseError | NotFoundError>> {
    try {
      const entity = await this.repository.findOne({ where: { id } });
      if (!entity) {
        return ok(null);
      }
      return ok(this.entityToDomain(entity));
    } catch (error) {
      return err(new DatabaseError(`Failed to find GitHub contributor by ID: ${String(error)}`));
    }
  }

  async findByUserId(userId: string): Promise<Result<GitHubContributor[], DatabaseError>> {
    try {
      const entities = await this.repository.find({ where: { userId } });
      const contributors = entities.map(entity => this.entityToDomain(entity));
      return ok(contributors);
    } catch (error) {
      return err(
        new DatabaseError(`Failed to find GitHub contributors by user ID: ${String(error)}`)
      );
    }
  }

  async findByCurrentUsername(
    username: string
  ): Promise<Result<GitHubContributor | null, DatabaseError | NotFoundError>> {
    try {
      const entity = await this.repository.findOne({ where: { currentUsername: username } });
      if (!entity) {
        return ok(null);
      }
      return ok(this.entityToDomain(entity));
    } catch (error) {
      return err(
        new DatabaseError(`Failed to find GitHub contributor by username: ${String(error)}`)
      );
    }
  }

  async findByCurrentEmail(
    email: string
  ): Promise<Result<GitHubContributor | null, DatabaseError | NotFoundError>> {
    try {
      const entity = await this.repository.findOne({ where: { currentEmail: email } });
      if (!entity) {
        return ok(null);
      }
      return ok(this.entityToDomain(entity));
    } catch (error) {
      return err(new DatabaseError(`Failed to find GitHub contributor by email: ${String(error)}`));
    }
  }

  async findByAnyUsername(username: string): Promise<Result<GitHubContributor[], DatabaseError>> {
    try {
      // Find by current username or historical usernames
      const entities = await this.repository
        .createQueryBuilder('contributor')
        .where('contributor.current_username = :username', { username })
        .orWhere(':username = ANY(contributor.historical_usernames)', { username })
        .getMany();

      const contributors = entities.map(entity => this.entityToDomain(entity));
      return ok(contributors);
    } catch (error) {
      return err(
        new DatabaseError(`Failed to find GitHub contributors by any username: ${String(error)}`)
      );
    }
  }

  async findByAnyEmail(email: string): Promise<Result<GitHubContributor[], DatabaseError>> {
    try {
      // Find by current email or historical emails
      const entities = await this.repository
        .createQueryBuilder('contributor')
        .where('contributor.current_email = :email', { email })
        .orWhere(':email = ANY(contributor.historical_emails)', { email })
        .getMany();

      const contributors = entities.map(entity => this.entityToDomain(entity));
      return ok(contributors);
    } catch (error) {
      return err(
        new DatabaseError(`Failed to find GitHub contributors by any email: ${String(error)}`)
      );
    }
  }

  async update(
    id: string,
    updates: Partial<GitHubContributor>
  ): Promise<Result<GitHubContributor, DatabaseError | NotFoundError>> {
    try {
      const existingEntity = await this.repository.findOne({ where: { id } });
      if (!existingEntity) {
        return err(new NotFoundError(`GitHub contributor with ID ${id} not found`));
      }

      // Apply updates to entity
      const updatedEntity = { ...existingEntity };
      if (updates.currentUsername) updatedEntity.currentUsername = updates.currentUsername;
      if (updates.currentEmail) updatedEntity.currentEmail = updates.currentEmail;
      if (updates.currentName) updatedEntity.currentName = updates.currentName;
      if (updates.historicalUsernames)
        updatedEntity.historicalUsernames = [...updates.historicalUsernames];
      if (updates.historicalEmails) updatedEntity.historicalEmails = [...updates.historicalEmails];
      if (updates.historicalNames) updatedEntity.historicalNames = [...updates.historicalNames];
      if (updates.userId) updatedEntity.userId = updates.userId;

      updatedEntity.updatedAt = new Date();

      const savedEntity = await this.repository.save(updatedEntity);
      return ok(this.entityToDomain(savedEntity));
    } catch (error) {
      return err(new DatabaseError(`Failed to update GitHub contributor: ${String(error)}`));
    }
  }

  async delete(id: string): Promise<Result<void, DatabaseError | NotFoundError>> {
    try {
      const result = await this.repository.delete(id);
      if (result.affected === 0) {
        return err(new NotFoundError(`GitHub contributor with ID ${id} not found`));
      }
      return ok(undefined);
    } catch (error) {
      return err(new DatabaseError(`Failed to delete GitHub contributor: ${String(error)}`));
    }
  }

  private domainToEntity(contributor: GitHubContributor): GitHubContributorEntity {
    const entity = new GitHubContributorEntity();
    entity.id = contributor.id;
    entity.currentUsername = contributor.currentUsername;
    entity.currentEmail = contributor.currentEmail;
    entity.currentName = contributor.currentName;
    entity.historicalUsernames = [...contributor.historicalUsernames];
    entity.historicalEmails = [...contributor.historicalEmails];
    entity.historicalNames = [...contributor.historicalNames];
    entity.userId = contributor.userId;
    entity.createdAt = contributor.createdAt;
    entity.updatedAt = contributor.updatedAt;
    return entity;
  }

  private entityToDomain(entity: GitHubContributorEntity): GitHubContributor {
    return new GitHubContributor(
      entity.id,
      entity.currentUsername,
      entity.currentEmail,
      entity.currentName,
      entity.historicalUsernames || [],
      entity.historicalEmails || [],
      entity.historicalNames || [],
      entity.userId,
      entity.createdAt,
      entity.updatedAt
    );
  }
}
