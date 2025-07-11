import { CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum ActiveStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

/**
 * Base entity class that provides common fields for all entities.
 * All entities should extend this class to ensure consistent structure.
 */
export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({
    type: 'enum',
    enum: ActiveStatus,
    default: ActiveStatus.ACTIVE,
    name: 'active_status',
  })
  activeStatus!: ActiveStatus;
}
