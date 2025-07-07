import { CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

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
}
