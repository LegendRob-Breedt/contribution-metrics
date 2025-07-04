import type { Result } from 'neverthrow';
import type { User } from '../domains/user.domain.js';
import type { DatabaseError, NotFoundError } from '../../../shared/errors/index.js';

export interface UserRepository {
  create(user: User): Promise<Result<User, DatabaseError>>;
  findAll(): Promise<Result<User[], DatabaseError>>;
  findById(id: string): Promise<Result<User | null, DatabaseError | NotFoundError>>;
  findByEmail(email: string): Promise<Result<User | null, DatabaseError | NotFoundError>>;
  update(id: string, user: Partial<User>): Promise<Result<User, DatabaseError | NotFoundError>>;
  delete(id: string): Promise<Result<void, DatabaseError | NotFoundError>>;
  findByManagerId(managerId: string): Promise<Result<User[], DatabaseError>>;
}
