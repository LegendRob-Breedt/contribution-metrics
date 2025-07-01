import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity.js';

@Entity('github_organizations')
export class GitHubOrganization extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  name!: string;

  @Column({ type: 'text' })
  accessToken!: string;

  @Column({ type: 'timestamp' }) // Use timestamp for PostgreSQL compatibility
  tokenExpiresAt!: Date;
}
