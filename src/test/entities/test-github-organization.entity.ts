import 'reflect-metadata';
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../adaptors/db/shared/entities/base.entity.js';

// Test-specific entity that mirrors the main GitHubOrganization
// but uses datetime for SQLite compatibility in tests
@Entity('github_organizations')
export class TestGitHubOrganization extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  name!: string;

  @Column({ type: 'text' })
  accessToken!: string;

  @Column({ type: 'datetime' }) // Use datetime for SQLite compatibility in tests
  tokenExpiresAt!: Date;
}
