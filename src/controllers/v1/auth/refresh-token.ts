import type { Request, Response } from 'express';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { Types } from 'mongoose';

import { logger } from '@/lib/winston';
import { generateAccessToken, verifyRefreshToken } from '@/lib/jwt';

import { sendError } from '@/utils/http-error';
import { RefreshTokenSchemaType } from '@/validators/auth.validator';

import Token from '@/models/token';

const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body as RefreshTokenSchemaType;
  //   const refreshToken = req.cookies.refreshToken as string

  try {
    const tokenExists = await Token.exists({ token: token });
    if (!tokenExists) {
      sendError.unauthorized(res, 'Invalid refresh token');
      return;
    }

    // Verify refresh token
    const jwtPayload = verifyRefreshToken(token) as { userId: Types.ObjectId };

    const newAccessToken = generateAccessToken(jwtPayload.userId);

    res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      sendError.unauthorized(res, 'Refresh token exired');
      return;
    }

    if (error instanceof JsonWebTokenError) {
      sendError.unauthorized(res, 'Refresh token is invaild');
      return;
    }

    sendError.internalServer(res, error);
    logger.error('Error during refreshToken, ', error);
  }
};

export default refreshToken;
