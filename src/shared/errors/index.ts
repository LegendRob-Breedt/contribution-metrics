import { Result } from 'neverthrow';

export class BaseError extends Error {
  constructor(
    public readonly message: string,
    public readonly code: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends BaseError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string) {
    super(message, 'NOT_FOUND', 404);
  }
}

export class DatabaseError extends BaseError {
  constructor(message: string, originalError?: Error) {
    super(message, 'DATABASE_ERROR', 500);
    if (originalError) {
      this.stack = originalError.stack;
    }
  }
}

export class ExternalServiceError extends BaseError {
  constructor(message: string, service: string) {
    super(message, `EXTERNAL_SERVICE_ERROR_${service.toUpperCase()}`, 502);
  }
}

// Type helpers for Result types
export type ServiceResult<T> = Result<T, BaseError>;
export type RepositoryResult<T> = Result<T, DatabaseError>;
export type ApiResult<T> = Result<T, ExternalServiceError>;
