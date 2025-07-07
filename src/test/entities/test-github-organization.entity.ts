import 'reflect-metadata';
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../adaptors/db/shared/entities/base.entity.js';

// Test-specific entity that mirrors the main GitHubOrganization
// Updated to use PostgreSQL-compatible types with pg-mem
@Entity('github_organizations')
export class TestGitHubOrganization extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  name!: string;

  @Column({ type: 'text' })
  accessToken!: string;

  @Column({ type: 'timestamp' }) // Use timestamp for PostgreSQL compatibility
  tokenExpiresAt!: Date;
}
