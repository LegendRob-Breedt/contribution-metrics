import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../db/shared/entities/base.entity.js';

export enum GitHubContributorStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('github_contributors')
export class GitHubContributorEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true, name: 'current_username' })
  currentUsername!: string;

  @Column({ type: 'varchar', length: 255, name: 'current_email' })
  currentEmail!: string;

  @Column({ type: 'varchar', length: 255, name: 'current_name' })
  currentName!: string;

  @Column({
    type: 'text',
    array: true,
    default: '{}',
    name: 'all_known_usernames',
  })
  allKnownUsernames!: string[];

  @Column({
    type: 'text',
    array: true,
    default: '{}',
    name: 'all_known_emails',
  })
  allKnownEmails!: string[];

  @Column({
    type: 'text',
    array: true,
    default: '{}',
    name: 'all_known_names',
  })
  allKnownNames!: string[];

  @Column({ type: 'uuid', name: 'user_id', nullable: true })
  userId?: string;

  @Column({ type: 'timestamp', name: 'last_active_date', nullable: true })
  lastActiveDate?: Date;

  @Column({
    type: 'enum',
    enum: GitHubContributorStatus,
    default: GitHubContributorStatus.ACTIVE,
    name: 'status',
  })
  status!: GitHubContributorStatus;
}
