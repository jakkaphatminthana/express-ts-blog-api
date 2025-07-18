import type { ZodSchema } from 'zod';
import type { NextFunction, Request, Response, RequestHandler } from 'express';
// import { validationResult } from 'express-validator';

type ZodRequestParts = 'body' | 'query' | 'params';

function preprocessValues(obj: Record<string, any>) {
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    try {
      result[key] = JSON.parse(value);
    } catch {
      result[key] = value;
    }
  }

  return result;
}

export default function validationError(
  schema: ZodSchema,
  source: ZodRequestParts = 'body',
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalData = req[source];

    const parsedData =
      typeof originalData === 'object' && originalData !== null
        ? preprocessValues(originalData)
        : originalData;

    const result = schema.safeParse(parsedData);

    if (!result.success) {
      res.status(400).json({
        code: 'ValidationError',
        message: 'Validation failed',
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    Object.assign(req[source], result.data);
    next();
  };
}

// const validationError = (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): void => {
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     res.status(400).json({
//       code: 'ValidationError',
//       message: 'Validation failed',
//       errors: errors.mapped(),
//     });
//     return;
//   }
//   next();
// };
