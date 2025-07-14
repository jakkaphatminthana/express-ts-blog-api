import type { Request, Response } from 'express';

import { logger } from '@/lib/winston';
import { sendError } from '@/utils/http-error';
import { LogoutSchemaType } from '@/validators/auth.validator';

import Token from '@/models/token';

const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body as LogoutSchemaType;

    // Check data exisits & user is owner account
    const tokenExists = await await Token.findOne({
      token: refreshToken,
      userId: req.userId,
    })
      .select('id')
      .lean()
      .exec();
    if (!tokenExists) {
      sendError.badRequest(
        res,
        'Invalid refresh token or you do not have permission',
      );
      return;
    }

    await Token.deleteOne({ token: refreshToken });
    logger.info('User refresh token deleted successful', {
      userId: req.userId,
      token: refreshToken,
    });

    res.sendStatus(204); //No content
  } catch (error) {
    sendError.internalServer(res, error);
    logger.error('Error during logout: ', error);
  }
};

export default logout;
