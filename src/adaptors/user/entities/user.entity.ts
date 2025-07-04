import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity.js';

export enum Role {
  PRODUCT_ENGINEER = 'Product Engineer',
  WORDPRESS_PRODUCT_ENGINEER = 'Wordpress Product Engineer',
  ARCHITECT_PRINCIPLE = 'Architect/Principle',
  CONTENT_EDITOR = 'Content Editor',
  DATA_ENGINEER = 'Data Engineer',
  DATA_ANALYTICS = 'Data Analytics',
  DWP_ENGINEER = 'DWP Engineer',
  MANAGER = 'Manager',
  SRE_ENGINEER = 'SRE Engineer',
}

export enum RoleType {
  IC = 'IC', // Individual Contributor
  MG = 'MG', // Manager
}

export enum OrgFunction {
  ENGINEERING = 'Engineering',
  CONTENT = 'Content',
  DESIGN = 'Design',
  DATA = 'Data',
}

export enum AppAccessRole {
  ADMINISTRATOR = 'administrator',
  HO = 'HO',
  EM = 'EM',
  IC = 'IC',
}

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar', nullable: true })
  company?: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.PRODUCT_ENGINEER,
  })
  role!: Role;

  @Column({
    type: 'enum',
    enum: RoleType,
    default: RoleType.IC,
  })
  roleType!: RoleType;

  @Column({ type: 'varchar', nullable: true })
  growthLevel?: string; // Examples: IC-6, IC-5, MG-5

  @Column({
    type: 'enum',
    enum: OrgFunction,
    nullable: true,
  })
  orgFunction?: OrgFunction;

  @Column({ type: 'varchar', nullable: true })
  pillar?: string; // Business division

  @Column({ type: 'varchar', nullable: true })
  tribe?: string;

  @Column({ type: 'varchar', nullable: true })
  squad?: string; // Team

  @Column({ type: 'varchar', nullable: true })
  jobTitle?: string;

  @Column({ type: 'uuid', nullable: true })
  managerId?: string;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'managerId' })
  manager?: UserEntity;

  @Column({
    type: 'enum',
    enum: AppAccessRole,
    default: AppAccessRole.IC,
  })
  appAccessRole!: AppAccessRole;
}
