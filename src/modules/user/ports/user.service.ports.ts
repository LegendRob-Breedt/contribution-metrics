import type { Result } from 'neverthrow';
import type { User, Role, RoleType, OrgFunction, AppAccessRole } from '../domains/user.domain.js';
import type { ValidationError, NotFoundError } from '../../../shared/errors/index.js';

export interface CreateUserData {
  email: string;
  name: string;
  company?: string | null;
  role?: Role;
  roleType?: RoleType;
  growthLevel?: string | null;
  orgFunction?: OrgFunction | null;
  pillar?: string | null;
  tribe?: string | null;
  squad?: string | null;
  jobTitle?: string | null;
  managerId?: string | null;
  appAccessRole?: AppAccessRole;
}

export interface UpdateUserData {
  name?: string;
  company?: string | null;
  role?: Role;
  roleType?: RoleType;
  growthLevel?: string | null;
  orgFunction?: OrgFunction | null;
  pillar?: string | null;
  tribe?: string | null;
  squad?: string | null;
  jobTitle?: string | null;
  managerId?: string | null;
  appAccessRole?: AppAccessRole;
}

export interface UserService {
  createUser(data: CreateUserData): Promise<Result<User, ValidationError>>;
  getAllUsers(): Promise<Result<User[], Error>>;
  getUserById(id: string): Promise<Result<User, NotFoundError | ValidationError>>;
  getUserByEmail(email: string): Promise<Result<User, NotFoundError | ValidationError>>;
  updateUser(
    id: string,
    data: UpdateUserData
  ): Promise<Result<User, NotFoundError | ValidationError>>;
  updateUserEmail(
    id: string,
    newEmail: string
  ): Promise<Result<User, NotFoundError | ValidationError>>;
  deleteUser(id: string): Promise<Result<void, NotFoundError | ValidationError>>;
  getUsersByManager(managerId: string): Promise<Result<User[], NotFoundError | ValidationError>>;
}
