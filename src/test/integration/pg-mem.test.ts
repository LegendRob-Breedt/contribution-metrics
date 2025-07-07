import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DataSource } from 'typeorm';
import { createTestDataSource, cleanupTestDataSource } from '../utils/test-database.js';
import { GitHubOrganizationEntity } from '../../adaptors/db/github-organization/entities/github-organization.entity.js';

describe('pg-mem Integration', () => {
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = await createTestDataSource();
  });

  afterEach(async () => {
    await cleanupTestDataSource(dataSource);
  });

  it('should create and connect to pg-mem database', async () => {
    expect(dataSource.isInitialized).toBe(true);
    expect(dataSource.options.type).toBe('postgres');
  });

  it('should execute basic SQL queries', async () => {
    const result = await dataSource.query('SELECT 1 as test');
    expect(result).toEqual([{ test: 1 }]);
  });

  it('should create and query GitHub organization entities with explicit IDs', async () => {
    const repository = dataSource.getRepository(GitHubOrganizationEntity);
    
    // Create entity with explicit ID to avoid UUID generation issues
    const entity = repository.create({
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'test-org',
      accessToken: 'test-token',
      tokenExpiresAt: new Date('2025-12-31'),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const saved = await repository.save(entity);
    expect(saved.id).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(saved.name).toBe('test-org');

    // Query it back
    const found = await repository.findOne({ 
      where: { id: '123e4567-e89b-12d3-a456-426614174000' } 
    });
    expect(found).toBeTruthy();
    expect(found?.name).toBe('test-org');
  });

  it('should handle PostgreSQL functions', async () => {
    // Test version function
    const versionResult = await dataSource.query('SELECT version()');
    expect(versionResult[0].version).toContain('PostgreSQL');

    // Test current_timestamp function
    const timestampResult = await dataSource.query('SELECT current_timestamp');
    expect(timestampResult[0].current_timestamp).toBeInstanceOf(Date);
  });

  it('should handle GitHub organization entity operations', async () => {
    const repository = dataSource.getRepository(GitHubOrganizationEntity);
    
    // Create a realistic GitHub organization entity
    const orgData = {
      id: '456e7890-e12b-34d5-a789-123456789abc',
      name: 'my-github-org',
      accessToken: 'ghp_1234567890abcdef1234567890abcdef12345678',
      tokenExpiresAt: new Date('2025-06-30T23:59:59Z'),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const entity = repository.create(orgData);
    const saved = await repository.save(entity);

    // Verify all fields are saved correctly
    expect(saved.id).toBe(orgData.id);
    expect(saved.name).toBe(orgData.name);
    expect(saved.accessToken).toBe(orgData.accessToken);
    expect(saved.tokenExpiresAt).toEqual(orgData.tokenExpiresAt);

    // Test finding by name (unique constraint)
    const foundByName = await repository.findOne({ where: { name: 'my-github-org' } });
    expect(foundByName).toBeTruthy();
    expect(foundByName?.id).toBe(orgData.id);

    // Test updating the entity
    if (foundByName) {
      foundByName.tokenExpiresAt = new Date('2025-12-31T23:59:59Z');
      const updated = await repository.save(foundByName);
      expect(updated.tokenExpiresAt).toEqual(new Date('2025-12-31T23:59:59Z'));
    }

    // Test deletion
    await repository.delete({ id: orgData.id });
    const afterDeletion = await repository.findOne({ where: { id: orgData.id } });
    expect(afterDeletion).toBeNull();
  });
});
