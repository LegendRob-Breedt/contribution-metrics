import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../db/shared/entities/base.entity.js';

@Entity('github_organizations')
export class GitHubOrganizationEntity extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  name!: string;

  @Column({ type: 'text' })
  accessToken!: string;

  @Column({ type: 'timestamp' })
  tokenExpiresAt!: Date;
}
