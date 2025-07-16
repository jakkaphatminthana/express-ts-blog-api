import type { Request, Response } from 'express';

import { logger } from '@/lib/winston';
import { sendError } from '@/utils/http-error';

import User from '@/models/user';
import Token from '@/models/token';

const deleteMe = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;

  try {
    // delete user
    await User.deleteOne({ _id: userId });
    logger.info('A user account has been deleted', {
      userId,
    });

    // delete tokens
    await Token.deleteMany({ userId });
    logger.info('Refresh tokens has been deleted', {
      userId,
    });

    await res.sendStatus(204);
  } catch (error) {
    sendError.internalServer(res, error);
    logger.error('Error while deleteMe: ', error);
  }
};

export default deleteMe;
