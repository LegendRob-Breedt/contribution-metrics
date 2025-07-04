import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity.js';

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
    name: 'historical_usernames',
  })
  historicalUsernames!: string[];

  @Column({
    type: 'text',
    array: true,
    default: '{}',
    name: 'historical_emails',
  })
  historicalEmails!: string[];

  @Column({
    type: 'text',
    array: true,
    default: '{}',
    name: 'historical_names',
  })
  historicalNames!: string[];

  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;
}
