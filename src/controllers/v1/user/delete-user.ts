import { Request, Response } from 'express';

import { logger } from '@/lib/winston';
import { sendError } from '@/utils/http-error';

import User from '@/models/user';
import Token from '@/models/token';

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;

    const user = await User.findOne({ _id: userId }).select('id').lean().exec();
    if (!user) {
      sendError.notFound(res, 'User not found');
      return;
    }

    // Delete user
    await User.deleteOne({ _id: userId });
    logger.info('A user account has been deleted', { userId });

    // Delete user token
    await Token.deleteMany({ userId });
    logger.info('Refresh tokens has been deleted', {
      userId,
    });

    res.sendStatus(204);
  } catch (error) {
    sendError.internalServer(res, error);
    logger.error('Error while getUser: ', error);
  }
};
export default deleteUser;
