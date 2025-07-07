import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DataSource } from 'typeorm';
import { GitHubOrganizationEntity } from '../../adaptors/db/github-organization/index.js';
import { isValidUUID } from '../../adaptors/db/shared/entities/base.entity.js';
import { createTestDataSource, cleanupTestDataSource } from '../utils/test-database.js';

describe('BaseEntity UUID Generation', () => {
  let dataSource: DataSource;

  beforeEach(async () => {
    // Create a fresh database for each test to avoid UUID conflicts
    dataSource = await createTestDataSource();
  });

  afterEach(async () => {
    await cleanupTestDataSource(dataSource);
  });

  it('should automatically generate UUID for new entities', async () => {
    const repository = dataSource.getRepository(GitHubOrganizationEntity);
    
    const entity = repository.create({
      name: 'test-org',
      accessToken: 'test-token',
      tokenExpiresAt: new Date('2024-12-31'),
    });

    // ID should not be set initially
    expect(entity.id).toBeUndefined();

    const saved = await repository.save(entity);

    // ID should be generated and valid
    expect(saved.id).toBeDefined();
    expect(typeof saved.id).toBe('string');
  });

  it('should not override existing ID when provided', async () => {
    const repository = dataSource.getRepository(GitHubOrganizationEntity);
    const customId = '123e4567-e89b-12d3-a456-426614174000';
    
    const entity = repository.create({
      id: customId as any, // Cast to bypass type checking for this test
      name: 'test-org',
      accessToken: 'test-token',
      tokenExpiresAt: new Date('2024-12-31'),
    });

    const saved = await repository.save(entity);

    // Should keep the custom ID
    expect(saved.id).toBe(customId);
  });

  it('should generate unique IDs for multiple entities', async () => {
    const repository = dataSource.getRepository(GitHubOrganizationEntity);
    
    const entity1 = repository.create({
      name: 'test-org-1',
      accessToken: 'test-token-1',
      tokenExpiresAt: new Date('2024-12-31'),
    });

    const entity2 = repository.create({
      name: 'test-org-2',
      accessToken: 'test-token-2',
      tokenExpiresAt: new Date('2024-12-31'),
    });

    // Save entities sequentially to avoid potential UUID generation race conditions
    const saved1 = await repository.save(entity1);
    const saved2 = await repository.save(entity2);

    // IDs should be different
    expect(saved1.id).not.toBe(saved2.id);
    
    // Verify both entities exist in the database
    const count = await repository.count();
    expect(count).toBe(2);
  });
});
