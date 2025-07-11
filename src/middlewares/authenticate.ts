import { Types } from 'mongoose';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';

import { verifyAccessToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';

import { sendError } from '@/utils/http-error';

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // 1. Check authorization with Bearer
  if (!authHeader?.startsWith('Bearer ')) {
    sendError.unauthorized(res, 'Access denied, no token provided');
    return;
  }

  // 2. Split out prefix 'Bearer'
  const [_, token] = authHeader.split(' ');

  try {
    // 3. Verify access token
    const jwtPayload = verifyAccessToken(token) as { userId: Types.ObjectId };

    // 4. set at request express
    req.userId = jwtPayload.userId;

    return next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      sendError.unauthorized(res, 'Access token expired');
      return;
    }

    if (error instanceof JsonWebTokenError) {
      sendError.unauthorized(res, 'Access token is invalid');
      return;
    }

    sendError.internalServer(res, error);
    logger.error('Error during authentication: ', error);
  }
};

export default authenticate;
