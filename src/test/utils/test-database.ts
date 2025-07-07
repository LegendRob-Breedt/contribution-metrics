import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { v4 } from 'uuid';
import { GitHubOrganizationEntity } from '../../adaptors/db/github-organization/entities/github-organization.entity.js';
import { UserEntity } from '../../adaptors/db/user/entities/user.entity.js';
import { GitHubContributorEntity } from '../../adaptors/db/github-contributor/entities/github-contributor.entity.js';
import { TestGitHubOrganization } from '../entities/test-github-organization.entity.js';

/**
 * Creates an in-memory PostgreSQL database for testing using pg-mem
 */
export async function createTestDataSource(): Promise<DataSource> {
  // Create a new in-memory database
  const db = newDb();

  // Register required PostgreSQL functions for TypeORM compatibility
  
  // Enable uuid extension for UUID generation
   db.registerExtension('uuid-ossp', (schema) => {
    schema.registerFunction({
      name: 'uuid_generate_v4',
      returns: DataType.uuid,
      implementation: v4,
      impure: true,
    });
  });

  // Register current_timestamp function
  db.public.registerFunction({
    name: 'current_timestamp',
    returns: DataType.timestamptz,
    implementation: () => new Date(),
  });

  // Register now function
  db.public.registerFunction({
    name: 'now',
    returns: DataType.timestamptz,
    implementation: () => new Date(),
  });

  // Register version function for TypeORM compatibility
  db.public.registerFunction({
    name: 'version',
    returns: DataType.text,
    implementation: () => 'PostgreSQL 14.0 (pg-mem)',
  });

  // Register pg_version function
  db.public.registerFunction({
    name: 'pg_version',
    returns: DataType.text,
    implementation: () => '14.0',
  });

  // Register current_database function
  db.public.registerFunction({
    name: 'current_database',
    returns: DataType.text,
    implementation: () => 'test_db',
  });

  // Register current_schema function
  db.public.registerFunction({
    name: 'current_schema',
    returns: DataType.text,
    implementation: () => 'public',
  });

  // Create TypeORM DataSource that uses pg-mem
  const dataSource = await db.adapters.createTypeormDataSource({
    type: 'postgres',
    entities: [GitHubOrganizationEntity, UserEntity, GitHubContributorEntity, TestGitHubOrganization],
    synchronize: true,
    logging: false,
  });

  // Initialize the DataSource
  await dataSource.initialize();

  return dataSource;
}

/**
 * Cleans up the test database
 */
export async function cleanupTestDataSource(dataSource: DataSource): Promise<void> {
  if (dataSource && dataSource.isInitialized) {
    await dataSource.destroy();
  }
}

/**
 * Clears all data from test database tables
 */
export async function clearTestData(dataSource: DataSource): Promise<void> {
  if (!dataSource.isInitialized) {
    throw new Error('DataSource is not initialized');
  }

  const queryRunner = dataSource.createQueryRunner();
  
  try {
    // Disable foreign key checks temporarily for clean deletion
    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0;').catch(() => {
      // pg-mem might not support this command, ignore and try cascade approach
    });

    // Use TRUNCATE CASCADE to handle foreign key constraints
    const entities = dataSource.entityMetadatas;
    
    for (const entity of entities) {
      try {
        await queryRunner.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE;`);
      } catch (error) {
        // If TRUNCATE fails, try DELETE FROM
        console.warn(`TRUNCATE failed for ${entity.tableName}, trying DELETE`);
        await queryRunner.query(`DELETE FROM "${entity.tableName}";`);
      }
    }

    // Re-enable foreign key checks
    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1;').catch(() => {
      // pg-mem might not support this command, ignore
    });
  } finally {
    await queryRunner.release();
  }
}
