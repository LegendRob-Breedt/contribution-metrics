import { Result, ok, err } from 'neverthrow';
import { v4 as uuidv4 } from 'uuid';
import type {
  GitHubOrganizationService,
  CreateOrganizationData,
  UpdateOrganizationData,
} from '../ports/github-organization.service.ports.js';
import type { GitHubOrganizationRepository } from '../ports/github-organization.repository.ports.js';
import { GitHubOrganization } from '../domains/github-organization.domain.js';
import { ValidationError, NotFoundError } from '../../../shared/errors/index.js';
import { applicationMetrics } from '../../../shared/instrumentation/application-metrics.js';

export class GitHubOrganizationServiceImpl implements GitHubOrganizationService {
  constructor(private readonly repository: GitHubOrganizationRepository) {}

  async createOrganization(
    data: CreateOrganizationData
  ): Promise<Result<GitHubOrganization, ValidationError>> {
    const startTime = Date.now();

    try {
      // Validate input
      if (!data.name.trim()) {
        return err(new ValidationError('Organization name cannot be empty'));
      }

      if (!data.accessToken.trim()) {
        return err(new ValidationError('Access token cannot be empty'));
      }

      if (data.tokenExpiresAt <= new Date()) {
        return err(new ValidationError('Token expiration date must be in the future'));
      }

      // Check if organization already exists
      const existingResult = await this.repository.findByName(data.name);
      if (existingResult.isOk() && existingResult.value) {
        return err(new ValidationError(`Organization '${data.name}' already exists`));
      }

      // Create domain object
      const organization = GitHubOrganization.create(uuidv4(), data.name, data.tokenExpiresAt);

      // Save to repository
      const saveResult = await this.repository.create(organization, data.accessToken);
      if (saveResult.isErr()) {
        return err(
          new ValidationError(`Failed to create organization: ${saveResult.error.message}`)
        );
      }

      // Update metrics on success
      applicationMetrics.githubOrganizationsTotal.add(1);

      return ok(saveResult.value);
    } finally {
      // Record operation duration
      const duration = (Date.now() - startTime) / 1000;
      applicationMetrics.dbQueryDuration.record(duration, {
        operation: 'create_organization',
      });
    }
  }

  async getAllOrganizations(): Promise<Result<GitHubOrganization[], Error>> {
    const result = await this.repository.findAll();
    if (result.isErr()) {
      return err(new Error(`Failed to fetch organizations: ${result.error.message}`));
    }
    return ok(result.value);
  }

  async getOrganizationById(
    id: string
  ): Promise<Result<GitHubOrganization, NotFoundError | ValidationError>> {
    if (!id.trim()) {
      return err(new ValidationError('Organization ID cannot be empty'));
    }

    const result = await this.repository.findById(id);
    if (result.isErr()) {
      if (result.error instanceof NotFoundError) {
        return err(result.error);
      }
      return err(new ValidationError(`Failed to fetch organization: ${result.error.message}`));
    }

    if (!result.value) {
      return err(new NotFoundError(`Organization with ID '${id}' not found`));
    }

    return ok(result.value);
  }

  async getOrganizationByName(
    name: string
  ): Promise<Result<GitHubOrganization, NotFoundError | ValidationError>> {
    if (!name.trim()) {
      return err(new ValidationError('Organization name cannot be empty'));
    }

    const result = await this.repository.findByName(name);
    if (result.isErr()) {
      if (result.error instanceof NotFoundError) {
        return err(result.error);
      }
      return err(new ValidationError(`Failed to fetch organization: ${result.error.message}`));
    }

    if (!result.value) {
      return err(new NotFoundError(`Organization with name '${name}' not found`));
    }

    return ok(result.value);
  }

  async updateOrganization(
    id: string,
    data: UpdateOrganizationData
  ): Promise<Result<GitHubOrganization, NotFoundError | ValidationError>> {
    if (!id.trim()) {
      return err(new ValidationError('Organization ID cannot be empty'));
    }

    // Validate update data
    if (data.tokenExpiresAt && data.tokenExpiresAt <= new Date()) {
      return err(new ValidationError('Token expiration date must be in the future'));
    }

    const result = await this.repository.update(id, data);
    if (result.isErr()) {
      if (result.error instanceof NotFoundError) {
        return err(result.error);
      }
      return err(new ValidationError(`Failed to update organization: ${result.error.message}`));
    }

    return ok(result.value);
  }

  async deleteOrganization(id: string): Promise<Result<void, NotFoundError | ValidationError>> {
    const startTime = Date.now();

    try {
      if (!id.trim()) {
        return err(new ValidationError('Organization ID cannot be empty'));
      }

      const result = await this.repository.delete(id);
      if (result.isErr()) {
        if (result.error instanceof NotFoundError) {
          return err(result.error);
        }
        return err(new ValidationError(`Failed to delete organization: ${result.error.message}`));
      }

      // Update metrics on success
      applicationMetrics.githubOrganizationsTotal.add(-1);

      return ok(undefined);
    } finally {
      // Record operation duration
      const duration = (Date.now() - startTime) / 1000;
      applicationMetrics.dbQueryDuration.record(duration, {
        operation: 'delete_organization',
      });
    }
  }
}
