import { Result, ok, err } from 'neverthrow';
import { v4 as uuidv4 } from 'uuid';
import type { UserService, CreateUserData, UpdateUserData } from '../ports/user.service.ports.js';
import type { UserRepository } from '../ports/user.repository.ports.js';
import { User } from '../domains/user.domain.js';
import { ValidationError, NotFoundError } from '../../../shared/errors/index.js';

export class UserServiceImpl implements UserService {
  constructor(private readonly repository: UserRepository) {}

  async createUser(data: CreateUserData): Promise<Result<User, ValidationError>> {
    try {
      // Validate input
      if (!data.email?.trim()) {
        return err(new ValidationError('Email is required'));
      }

      if (!data.name?.trim()) {
        return err(new ValidationError('Name is required'));
      }

      // Check if user already exists
      const existingResult = await this.repository.findByEmail(data.email);
      if (existingResult.isOk() && existingResult.value) {
        return err(new ValidationError(`User with email '${data.email}' already exists`));
      }

      // Validate manager exists if provided
      if (data.managerId) {
        const managerResult = await this.repository.findById(data.managerId);
        if (managerResult.isOk() && !managerResult.value) {
          return err(new ValidationError('Manager not found'));
        }
      }

      // Create domain object
      const user = User.create(
        uuidv4(),
        data.email,
        data.name,
        data.company || null,
        data.role,
        data.roleType,
        data.growthLevel || null,
        data.orgFunction || null,
        data.pillar || null,
        data.tribe || null,
        data.squad || null,
        data.jobTitle || null,
        data.managerId || null,
        data.appAccessRole
      );

      // Save to repository
      const saveResult = await this.repository.create(user);
      if (saveResult.isErr()) {
        return err(new ValidationError(`Failed to create user: ${saveResult.error.message}`));
      }

      return ok(saveResult.value);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Invalid email format')) {
        return err(new ValidationError('Invalid email format'));
      }
      if (error instanceof Error && error.message.includes('Name cannot be empty')) {
        return err(new ValidationError('Name cannot be empty'));
      }
      return err(new ValidationError(`Failed to create user: ${(error as Error).message}`));
    }
  }

  async getAllUsers(): Promise<Result<User[], Error>> {
    const result = await this.repository.findAll();
    if (result.isErr()) {
      return err(new Error(`Failed to fetch users: ${result.error.message}`));
    }
    return ok(result.value);
  }

  async getUserById(id: string): Promise<Result<User, NotFoundError | ValidationError>> {
    if (!id.trim()) {
      return err(new ValidationError('User ID cannot be empty'));
    }

    const result = await this.repository.findById(id);
    if (result.isErr()) {
      if (result.error instanceof NotFoundError) {
        return err(result.error);
      }
      return err(new ValidationError(`Failed to fetch user: ${result.error.message}`));
    }

    if (!result.value) {
      return err(new NotFoundError(`User with ID '${id}' not found`));
    }

    return ok(result.value);
  }

  async getUserByEmail(email: string): Promise<Result<User, NotFoundError | ValidationError>> {
    if (!email.trim()) {
      return err(new ValidationError('Email cannot be empty'));
    }

    const result = await this.repository.findByEmail(email);
    if (result.isErr()) {
      if (result.error instanceof NotFoundError) {
        return err(result.error);
      }
      return err(new ValidationError(`Failed to fetch user: ${result.error.message}`));
    }

    if (!result.value) {
      return err(new NotFoundError(`User with email '${email}' not found`));
    }

    return ok(result.value);
  }

  async updateUser(
    id: string,
    data: UpdateUserData
  ): Promise<Result<User, NotFoundError | ValidationError>> {
    if (!id.trim()) {
      return err(new ValidationError('User ID cannot be empty'));
    }

    // Get existing user
    const existingResult = await this.getUserById(id);
    if (existingResult.isErr()) {
      return err(existingResult.error);
    }

    try {
      // Validate manager exists if provided
      if (data.managerId) {
        const managerResult = await this.repository.findById(data.managerId);
        if (managerResult.isOk() && !managerResult.value) {
          return err(new ValidationError('Manager not found'));
        }
      }

      // Update domain object
      const updatedUser = existingResult.value.updateProfile(data);

      // Save to repository
      const result = await this.repository.update(id, updatedUser);
      if (result.isErr()) {
        if (result.error instanceof NotFoundError) {
          return err(result.error);
        }
        return err(new ValidationError(`Failed to update user: ${result.error.message}`));
      }

      return ok(result.value);
    } catch (error) {
      return err(new ValidationError(`Failed to update user: ${(error as Error).message}`));
    }
  }

  async updateUserEmail(
    id: string,
    newEmail: string
  ): Promise<Result<User, NotFoundError | ValidationError>> {
    if (!id.trim()) {
      return err(new ValidationError('User ID cannot be empty'));
    }

    if (!newEmail.trim()) {
      return err(new ValidationError('Email cannot be empty'));
    }

    // Check if email is already taken
    const existingEmailResult = await this.repository.findByEmail(newEmail);
    if (existingEmailResult.isOk() && existingEmailResult.value) {
      return err(new ValidationError(`Email '${newEmail}' is already taken`));
    }

    // Get existing user
    const existingResult = await this.getUserById(id);
    if (existingResult.isErr()) {
      return err(existingResult.error);
    }

    try {
      // Update domain object
      const updatedUser = existingResult.value.updateEmail(newEmail);

      // Save to repository
      const result = await this.repository.update(id, updatedUser);
      if (result.isErr()) {
        if (result.error instanceof NotFoundError) {
          return err(result.error);
        }
        return err(new ValidationError(`Failed to update user email: ${result.error.message}`));
      }

      return ok(result.value);
    } catch (error) {
      return err(new ValidationError(`Failed to update user email: ${(error as Error).message}`));
    }
  }

  async deleteUser(id: string): Promise<Result<void, NotFoundError | ValidationError>> {
    if (!id.trim()) {
      return err(new ValidationError('User ID cannot be empty'));
    }

    const result = await this.repository.delete(id);
    if (result.isErr()) {
      if (result.error instanceof NotFoundError) {
        return err(result.error);
      }
      return err(new ValidationError(`Failed to delete user: ${result.error.message}`));
    }

    return ok(undefined);
  }

  async getUsersByManager(
    managerId: string
  ): Promise<Result<User[], NotFoundError | ValidationError>> {
    if (!managerId.trim()) {
      return err(new ValidationError('Manager ID cannot be empty'));
    }

    // Verify manager exists
    const managerResult = await this.getUserById(managerId);
    if (managerResult.isErr()) {
      return err(managerResult.error);
    }

    const result = await this.repository.findByManagerId(managerId);
    if (result.isErr()) {
      return err(new ValidationError(`Failed to fetch users by manager: ${result.error.message}`));
    }

    return ok(result.value);
  }
}
