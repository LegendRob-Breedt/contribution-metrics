import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User.js';

@Entity('github_contributors')
export class GitHubContributor {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

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

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
