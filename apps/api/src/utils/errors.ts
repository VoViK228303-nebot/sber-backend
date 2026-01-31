export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    code: string,
    statusCode: number = 500,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 'FORBIDDEN', 403);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string, code: string = 'CONFLICT') {
    super(message, code, 409);
    this.name = 'ConflictError';
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, 'TOO_MANY_REQUESTS', 429);
    this.name = 'TooManyRequestsError';
  }
}

// Auth specific errors
export class InvalidCredentialsError extends AppError {
  constructor() {
    super('Invalid credentials', 'INVALID_CREDENTIALS', 401);
    this.name = 'InvalidCredentialsError';
  }
}

export class AccountBlockedError extends AppError {
  constructor() {
    super('Account is blocked', 'ACCOUNT_BLOCKED', 403);
    this.name = 'AccountBlockedError';
  }
}

export class EmailExistsError extends ConflictError {
  constructor() {
    super('Email already registered', 'EMAIL_EXISTS');
    this.name = 'EmailExistsError';
  }
}

export class PhoneExistsError extends ConflictError {
  constructor() {
    super('Phone number already registered', 'PHONE_EXISTS');
    this.name = 'PhoneExistsError';
  }
}

export class WeakPasswordError extends ValidationError {
  constructor() {
    super(
      'Password must be at least 8 characters long and contain uppercase, lowercase, and number',
      { field: 'password' }
    );
    this.name = 'WeakPasswordError';
  }
}

export class InvalidTokenError extends AppError {
  constructor() {
    super('Invalid token', 'INVALID_TOKEN', 401);
    this.name = 'InvalidTokenError';
  }
}

export class TokenExpiredError extends AppError {
  constructor() {
    super('Token expired', 'TOKEN_EXPIRED', 401);
    this.name = 'TokenExpiredError';
  }
}

// Account specific errors
export class InsufficientFundsError extends AppError {
  constructor() {
    super('Insufficient funds', 'INSUFFICIENT_FUNDS', 400);
    this.name = 'InsufficientFundsError';
  }
}

export class InvalidAccountError extends AppError {
  constructor() {
    super('Invalid account', 'INVALID_ACCOUNT', 400);
    this.name = 'InvalidAccountError';
  }
}

export class LimitExceededError extends AppError {
  constructor(message: string = 'Limit exceeded') {
    super(message, 'LIMIT_EXCEEDED', 400);
    this.name = 'LimitExceededError';
  }
}

export class AccountClosedError extends AppError {
  constructor() {
    super('Account is closed', 'ACCOUNT_CLOSED', 400);
    this.name = 'AccountClosedError';
  }
}
