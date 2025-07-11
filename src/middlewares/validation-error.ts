import type { ZodSchema } from 'zod';
import { validationResult } from 'express-validator';
import type { NextFunction, Request, Response, RequestHandler } from 'express';

// type ZodRequestParts = 'body' | 'query' | 'params';

// function validationError(
//   schema: ZodSchema,
//   source: ZodRequestParts = 'body',
// ): RequestHandler {
//   return (req: Request, res: Response, next: NextFunction) => {
//     const result = schema.safeParse(req[source]);

//     if (!result.success) {
//       res.status(400).json({
//         code: 'ValidationError',
//         message: 'Validation failed',
//         errors: result.error.flatten().fieldErrors,
//       });
//       return;
//     }

//     req[source] = result.data;
//     next();
//   };
// }

const validationError = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      code: 'ValidationError',
      message: 'Validation failed',
      errors: errors.mapped(),
    });
    return;
  }
  next();
};

export default validationError;
