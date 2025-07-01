import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity.js';
import { User } from './user.entity.js';

@Entity('github_contributors')
export class GitHubContributor extends BaseEntity {
  @Column({ type: 'varchar' })
  currentUsername!: string;

  @Column({ type: 'varchar' })
  currentEmail!: string;

  @Column({ type: 'varchar' })
  currentName!: string;

  @Column({ type: 'simple-array' })
  historicalUsernames!: string[];

  @Column({ type: 'simple-array' })
  historicalEmails!: string[];

  @Column({ type: 'simple-array' })
  historicalNames!: string[];

  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user!: User;
}
