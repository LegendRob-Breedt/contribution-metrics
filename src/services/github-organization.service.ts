import type { Repository } from 'typeorm';
import { Result, ok, err } from 'neverthrow';
import { GitHubOrganization } from '../entities/index.js';
import type {
  CreateGitHubOrganizationRequest,
  UpdateGitHubOrganizationRequest,
  GitHubOrganizationResponse,
} from '../schemas/index.js';

export class GitHubOrganizationService {
  constructor(private readonly repository: Repository<GitHubOrganization>) {}

  private transformToResponse(entity: GitHubOrganization): GitHubOrganizationResponse {
    return {
      id: entity.id,
      name: entity.name,
      // Don't expose the access token in responses
      tokenExpiresAt: entity.tokenExpiresAt.toISOString(),
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  async create(
    data: CreateGitHubOrganizationRequest
  ): Promise<Result<GitHubOrganizationResponse, Error>> {
    try {
      const organization = this.repository.create({
        ...data,
        name: data.name.toUpperCase(),
        tokenExpiresAt: new Date(data.tokenExpiresAt),
      });

      const saved = await this.repository.save(organization);
      return ok(this.transformToResponse(saved));
    } catch (error) {
      return err(error as Error);
    }
  }

  async findAll(): Promise<Result<GitHubOrganizationResponse[], Error>> {
    try {
      const organizations = await this.repository.find();
      return ok(organizations.map(org => this.transformToResponse(org)));
    } catch (error) {
      return err(error as Error);
    }
  }

  async findById(id: string): Promise<Result<GitHubOrganizationResponse | null, Error>> {
    try {
      const organization = await this.repository.findOne({ where: { id } });
      return ok(organization ? this.transformToResponse(organization) : null);
    } catch (error) {
      return err(error as Error);
    }
  }

  async update(
    id: string,
    data: UpdateGitHubOrganizationRequest
  ): Promise<Result<GitHubOrganizationResponse | null, Error>> {
    try {
      const organization = await this.repository.findOne({ where: { id } });
      if (!organization) {
        return ok(null);
      }

      const updateData = {
        ...data,
        ...(data.name && { name: data.name.toUpperCase() }),
        ...(data.tokenExpiresAt && { tokenExpiresAt: new Date(data.tokenExpiresAt) }),
      };

      await this.repository.update(id, updateData);
      const updated = await this.repository.findOne({ where: { id } });
      return ok(updated ? this.transformToResponse(updated) : null);
    } catch (error) {
      return err(error as Error);
    }
  }

  async delete(id: string): Promise<Result<boolean, Error>> {
    try {
      const result = await this.repository.delete(id);
      return ok(result.affected !== 0);
    } catch (error) {
      return err(error as Error);
    }
  }
}
