import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { Types } from 'mongoose';

import { logger } from '@/lib/winston';
import { generateAccessToken, verifyRefreshToken } from '@/lib/jwt';
import { createError } from '@/types/core.error';
import { RefreshTokenSchemaType } from '@/validators/auth.validator';

import Token, { IToken } from '@/models/token';

export const TokenService = {
  isExists: async (token: string): Promise<boolean> => {
    const tokenExists = await Token.exists({ token: token });
    return !!tokenExists;
  },

  createRefreshToken: async (requestData: IToken): Promise<void> => {
    await Token.create({
      token: requestData.token,
      userId: requestData.userId,
    });
  },

  refreshToken: async ({ token }: RefreshTokenSchemaType): Promise<string> => {
    const tokenExists = await Token.exists({ token: token });
    if (!tokenExists) {
      throw createError.unauthorized('Invalid refresh token');
    }

    // Verify refresh token
    try {
      const jwtPayload = verifyRefreshToken(token) as {
        userId: Types.ObjectId;
      };

      return generateAccessToken(jwtPayload.userId);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw createError.unauthorized('Refresh token exired');
      }

      if (error instanceof JsonWebTokenError) {
        throw createError.unauthorized('Refresh token is invaild');
      }
      logger.error('Error during refreshToken, ', error);
      throw error;
    }
  },

  delete: async (token: string): Promise<void> => {
    await Token.deleteOne({ token });
  },
};
