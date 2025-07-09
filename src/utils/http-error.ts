import type { Response } from 'express';

export const sendError = {
  badRequest(res: Response, errors: object, message = 'Validation failed') {
    return res.status(400).json({
      code: 'ValidationError',
      message,
      errors,
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
    return res.status(500).json({
      code: 'ServerError',
      message,
      error,
    });
  },
};
