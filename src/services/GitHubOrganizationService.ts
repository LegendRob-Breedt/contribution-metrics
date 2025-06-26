import type { Repository } from 'typeorm';
import { Result, ok, err } from 'neverthrow';
import { GitHubOrganization } from '../entities/index.js';
import type {
  CreateGitHubOrganizationRequest,
  UpdateGitHubOrganizationRequest,
} from '../schemas/index.js';

export class GitHubOrganizationService {
  constructor(private readonly repository: Repository<GitHubOrganization>) {}

  async create(data: CreateGitHubOrganizationRequest): Promise<Result<GitHubOrganization, Error>> {
    try {
      const organization = this.repository.create({
        ...data,
        tokenExpiresAt: new Date(data.tokenExpiresAt),
      });

      const saved = await this.repository.save(organization);
      return ok(saved);
    } catch (error) {
      return err(error as Error);
    }
  }

  async findAll(): Promise<Result<GitHubOrganization[], Error>> {
    try {
      const organizations = await this.repository.find();
      return ok(organizations);
    } catch (error) {
      return err(error as Error);
    }
  }

  async findById(id: string): Promise<Result<GitHubOrganization | null, Error>> {
    try {
      const organization = await this.repository.findOne({ where: { id } });
      return ok(organization);
    } catch (error) {
      return err(error as Error);
    }
  }

  async update(
    id: string,
    data: UpdateGitHubOrganizationRequest
  ): Promise<Result<GitHubOrganization | null, Error>> {
    try {
      const organization = await this.repository.findOne({ where: { id } });
      if (!organization) {
        return ok(null);
      }

      const updateData = {
        ...data,
        ...(data.tokenExpiresAt && { tokenExpiresAt: new Date(data.tokenExpiresAt) }),
      };

      await this.repository.update(id, updateData);
      const updated = await this.repository.findOne({ where: { id } });
      return ok(updated);
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
