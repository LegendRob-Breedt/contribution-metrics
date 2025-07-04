import type { Repository } from 'typeorm';
import { Result, ok, err } from 'neverthrow';
import type { UserRepository } from '../../../../modules/user/ports/user.repository.ports.js';
import {
  User,
  Role as DomainRole,
  RoleType as DomainRoleType,
  OrgFunction as DomainOrgFunction,
  AppAccessRole as DomainAppAccessRole,
} from '../../../../modules/user/domains/user.domain.js';
import {
  UserEntity,
  Role as EntityRole,
  RoleType as EntityRoleType,
  OrgFunction as EntityOrgFunction,
  AppAccessRole as EntityAppAccessRole,
} from '../entities/user.entity.js';
import { DatabaseError, NotFoundError } from '../../../../shared/errors/index.js';

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly repository: Repository<UserEntity>) {}

  private toDomain(entity: UserEntity): User {
    return User.create(
      entity.id,
      entity.email,
      entity.name,
      entity.company || null,
      this.mapEntityRoleToDomain(entity.role),
      this.mapEntityRoleTypeToDomain(entity.roleType),
      entity.growthLevel || null,
      entity.orgFunction ? this.mapEntityOrgFunctionToDomain(entity.orgFunction) : null,
      entity.pillar || null,
      entity.tribe || null,
      entity.squad || null,
      entity.jobTitle || null,
      entity.managerId || null,
      this.mapEntityAppAccessRoleToDomain(entity.appAccessRole),
      entity.createdAt,
      entity.updatedAt
    );
  }

  private toEntity(domain: User): UserEntity {
    const entity = new UserEntity();
    entity.id = domain.id;
    entity.email = domain.email;
    entity.name = domain.name;
    entity.company = domain.company || undefined;
    entity.role = this.mapDomainRoleToEntity(domain.role);
    entity.roleType = this.mapDomainRoleTypeToEntity(domain.roleType);
    entity.growthLevel = domain.growthLevel || undefined;
    entity.orgFunction = domain.orgFunction
      ? this.mapDomainOrgFunctionToEntity(domain.orgFunction)
      : undefined;
    entity.pillar = domain.pillar || undefined;
    entity.tribe = domain.tribe || undefined;
    entity.squad = domain.squad || undefined;
    entity.jobTitle = domain.jobTitle || undefined;
    entity.managerId = domain.managerId || undefined;
    entity.appAccessRole = this.mapDomainAppAccessRoleToEntity(domain.appAccessRole);
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }

  // Mapping methods
  private mapEntityRoleToDomain(role: EntityRole): DomainRole {
    return role as DomainRole;
  }

  private mapDomainRoleToEntity(role: DomainRole): EntityRole {
    return role as EntityRole;
  }

  private mapEntityRoleTypeToDomain(roleType: EntityRoleType): DomainRoleType {
    return roleType as DomainRoleType;
  }

  private mapDomainRoleTypeToEntity(roleType: DomainRoleType): EntityRoleType {
    return roleType as EntityRoleType;
  }

  private mapEntityOrgFunctionToDomain(orgFunction: EntityOrgFunction): DomainOrgFunction {
    return orgFunction as DomainOrgFunction;
  }

  private mapDomainOrgFunctionToEntity(orgFunction: DomainOrgFunction): EntityOrgFunction {
    return orgFunction as EntityOrgFunction;
  }

  private mapEntityAppAccessRoleToDomain(appAccessRole: EntityAppAccessRole): DomainAppAccessRole {
    return appAccessRole as DomainAppAccessRole;
  }

  private mapDomainAppAccessRoleToEntity(appAccessRole: DomainAppAccessRole): EntityAppAccessRole {
    return appAccessRole as EntityAppAccessRole;
  }

  async create(user: User): Promise<Result<User, DatabaseError>> {
    try {
      const entity = this.toEntity(user);
      const saved = await this.repository.save(entity);
      return ok(this.toDomain(saved));
    } catch (error) {
      return err(
        new DatabaseError(`Failed to create user: ${(error as Error).message}`, error as Error)
      );
    }
  }

  async findAll(): Promise<Result<User[], DatabaseError>> {
    try {
      const entities = await this.repository.find();
      return ok(entities.map(entity => this.toDomain(entity)));
    } catch (error) {
      return err(
        new DatabaseError(`Failed to find users: ${(error as Error).message}`, error as Error)
      );
    }
  }

  async findById(id: string): Promise<Result<User | null, DatabaseError | NotFoundError>> {
    try {
      const entity = await this.repository.findOne({ where: { id } });
      if (!entity) {
        return ok(null);
      }
      return ok(this.toDomain(entity));
    } catch (error) {
      return err(
        new DatabaseError(`Failed to find user by ID: ${(error as Error).message}`, error as Error)
      );
    }
  }

  async findByEmail(email: string): Promise<Result<User | null, DatabaseError | NotFoundError>> {
    try {
      const entity = await this.repository.findOne({ where: { email: email.toLowerCase() } });
      if (!entity) {
        return ok(null);
      }
      return ok(this.toDomain(entity));
    } catch (error) {
      return err(
        new DatabaseError(
          `Failed to find user by email: ${(error as Error).message}`,
          error as Error
        )
      );
    }
  }

  async update(
    id: string,
    user: Partial<User>
  ): Promise<Result<User, DatabaseError | NotFoundError>> {
    try {
      const updateData: Partial<UserEntity> = {};

      if (user.email !== undefined) updateData.email = user.email;
      if (user.name !== undefined) updateData.name = user.name;
      if (user.company !== undefined) updateData.company = user.company || undefined;
      if (user.role !== undefined) updateData.role = this.mapDomainRoleToEntity(user.role);
      if (user.roleType !== undefined)
        updateData.roleType = this.mapDomainRoleTypeToEntity(user.roleType);
      if (user.growthLevel !== undefined) updateData.growthLevel = user.growthLevel || undefined;
      if (user.orgFunction !== undefined)
        updateData.orgFunction = user.orgFunction
          ? this.mapDomainOrgFunctionToEntity(user.orgFunction)
          : undefined;
      if (user.pillar !== undefined) updateData.pillar = user.pillar || undefined;
      if (user.tribe !== undefined) updateData.tribe = user.tribe || undefined;
      if (user.squad !== undefined) updateData.squad = user.squad || undefined;
      if (user.jobTitle !== undefined) updateData.jobTitle = user.jobTitle || undefined;
      if (user.managerId !== undefined) updateData.managerId = user.managerId || undefined;
      if (user.appAccessRole !== undefined)
        updateData.appAccessRole = this.mapDomainAppAccessRoleToEntity(user.appAccessRole);

      updateData.updatedAt = new Date();

      const updateResult = await this.repository.update(id, updateData);

      if (updateResult.affected === 0) {
        return err(new NotFoundError(`User with ID '${id}' not found`));
      }

      const entity = await this.repository.findOne({ where: { id } });
      if (!entity) {
        return err(new NotFoundError(`User with ID '${id}' not found after update`));
      }

      return ok(this.toDomain(entity));
    } catch (error) {
      return err(
        new DatabaseError(`Failed to update user: ${(error as Error).message}`, error as Error)
      );
    }
  }

  async delete(id: string): Promise<Result<void, DatabaseError | NotFoundError>> {
    try {
      const deleteResult = await this.repository.delete(id);

      if (deleteResult.affected === 0) {
        return err(new NotFoundError(`User with ID '${id}' not found`));
      }

      return ok(undefined);
    } catch (error) {
      return err(
        new DatabaseError(`Failed to delete user: ${(error as Error).message}`, error as Error)
      );
    }
  }

  async findByManagerId(managerId: string): Promise<Result<User[], DatabaseError>> {
    try {
      const entities = await this.repository.find({ where: { managerId } });
      return ok(entities.map(entity => this.toDomain(entity)));
    } catch (error) {
      return err(
        new DatabaseError(
          `Failed to find users by manager ID: ${(error as Error).message}`,
          error as Error
        )
      );
    }
  }
}
