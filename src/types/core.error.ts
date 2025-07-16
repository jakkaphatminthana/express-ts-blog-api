export class HttpError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public errors?: object,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export const createError = {
  badRequest: (message = 'Validation failed', errors?: object) =>
    new HttpError(400, 'ValidationError', message, errors),

  unauthorized: (message = 'Unauthorized') =>
    new HttpError(401, 'AuthorizationError', message),

  forbidden: (message = 'Forbidden') =>
    new HttpError(403, 'AuthorizationError', message),

  notFound: (message = 'NotFound') =>
    new HttpError(404, 'NotFoundError', message),

  internal: (message = 'InternalServerError', errors: object) =>
    new HttpError(500, 'ServerError', message, errors),
};
