import type { Repository } from 'typeorm';
import { Result, ok, err } from 'neverthrow';
import type { GitHubOrganizationRepository } from '../../../../modules/github-organization/ports/github-organization.repository.ports.js';
import { GitHubOrganization } from '../../../../modules/github-organization/domains/github-organization.domain.js';
import { GitHubOrganizationEntity } from '../entities/github-organization.entity.js';
import { DatabaseError, NotFoundError } from '../../../../shared/errors/index.js';

export class GitHubOrganizationRepositoryImpl implements GitHubOrganizationRepository {
  constructor(private readonly repository: Repository<GitHubOrganizationEntity>) {}

  private toDomain(entity: GitHubOrganizationEntity): GitHubOrganization {
    return GitHubOrganization.create(
      entity.id,
      entity.name,
      entity.tokenExpiresAt,
      entity.createdAt,
      entity.updatedAt
    );
  }

  private toEntity(domain: GitHubOrganization, accessToken: string): GitHubOrganizationEntity {
    const entity = new GitHubOrganizationEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.accessToken = accessToken;
    entity.tokenExpiresAt = domain.tokenExpiresAt;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }

  async create(
    organization: GitHubOrganization,
    accessToken: string
  ): Promise<Result<GitHubOrganization, DatabaseError>> {
    try {
      const entity = this.toEntity(organization, accessToken);
      const saved = await this.repository.save(entity);
      return ok(this.toDomain(saved));
    } catch (error) {
      return err(
        new DatabaseError(
          `Failed to create organization: ${(error as Error).message}`,
          error as Error
        )
      );
    }
  }

  async findAll(): Promise<Result<GitHubOrganization[], DatabaseError>> {
    try {
      const entities = await this.repository.find();
      return ok(entities.map(entity => this.toDomain(entity)));
    } catch (error) {
      return err(
        new DatabaseError(
          `Failed to find organizations: ${(error as Error).message}`,
          error as Error
        )
      );
    }
  }

  async findById(
    id: string
  ): Promise<Result<GitHubOrganization | null, DatabaseError | NotFoundError>> {
    try {
      const entity = await this.repository.findOne({ where: { id } });
      if (!entity) {
        return ok(null);
      }
      return ok(this.toDomain(entity));
    } catch (error) {
      return err(
        new DatabaseError(
          `Failed to find organization by ID: ${(error as Error).message}`,
          error as Error
        )
      );
    }
  }

  async findByName(
    name: string
  ): Promise<Result<GitHubOrganization | null, DatabaseError | NotFoundError>> {
    try {
      const entity = await this.repository.findOne({ where: { name: name.toUpperCase() } });
      if (!entity) {
        return ok(null);
      }
      return ok(this.toDomain(entity));
    } catch (error) {
      return err(
        new DatabaseError(
          `Failed to find organization by name: ${(error as Error).message}`,
          error as Error
        )
      );
    }
  }

  async update(
    id: string,
    organization: Partial<GitHubOrganization>
  ): Promise<Result<GitHubOrganization, DatabaseError | NotFoundError>> {
    try {
      const updateData: Partial<GitHubOrganizationEntity> = {};

      if (organization.name !== undefined) {
        updateData.name = organization.name;
      }
      if (organization.tokenExpiresAt !== undefined) {
        updateData.tokenExpiresAt = organization.tokenExpiresAt;
      }
      updateData.updatedAt = new Date();

      const updateResult = await this.repository.update(id, updateData);

      if (updateResult.affected === 0) {
        return err(new NotFoundError(`Organization with ID '${id}' not found`));
      }

      const entity = await this.repository.findOne({ where: { id } });
      if (!entity) {
        return err(new NotFoundError(`Organization with ID '${id}' not found after update`));
      }

      return ok(this.toDomain(entity));
    } catch (error) {
      return err(
        new DatabaseError(
          `Failed to update organization: ${(error as Error).message}`,
          error as Error
        )
      );
    }
  }

  async delete(id: string): Promise<Result<void, DatabaseError | NotFoundError>> {
    try {
      const deleteResult = await this.repository.delete(id);

      if (deleteResult.affected === 0) {
        return err(new NotFoundError(`Organization with ID '${id}' not found`));
      }

      return ok(undefined);
    } catch (error) {
      return err(
        new DatabaseError(
          `Failed to delete organization: ${(error as Error).message}`,
          error as Error
        )
      );
    }
  }
}
