import type { Response } from 'express';

export const sendError = {
  badRequest(res: Response, message = 'Validation failed', errors?: object) {
    return res.status(400).json({
      code: 'ValidationError',
      message,
      errors: errors ?? {},
    });
  },
  unauthorized(res: Response, message = 'Unauthorized') {
    return res.status(401).json({
      code: 'AuthorizationError',
      message,
    });
  },
  forbidden(res: Response, message = 'Forbidden') {
    return res.status(403).json({
      code: 'AuthorizationError',
      message,
    });
  },
  internalServer(
    res: Response,
    error: unknown,
    message = 'InternalServerError',
  ) {
    const parsedErrors = parseMongooseError(error);
    if (parsedErrors) {
      return this.badRequest(res, 'Validation failed', parsedErrors);
    }

    return res.status(500).json({
      code: 'ServerError',
      message,
      error,
    });
  },
};

function parseMongooseError(error: any): Record<string, string[]> | null {
  // Mongoose validation error
  if (error?.name === 'ValidationError' && error?.errors) {
    const errors: Record<string, string[]> = {};
    for (const key in error.errors) {
      const mongooseErr = error.errors[key];
      const message = mongooseErr?.message ?? 'Invalid value';
      if (!errors[key]) errors[key] = [];
      errors[key].push(message);
    }
    return errors;
  }

  // MongoDB duplicate key error
  const cause = error?.cause ?? error;
  if (cause?.code === 11000 && cause?.keyValue) {
    const field = Object.keys(cause.keyValue)[0];
    const message = `${field} must be unique`;
    return { [field]: [message] };
  }

  return null;
}
