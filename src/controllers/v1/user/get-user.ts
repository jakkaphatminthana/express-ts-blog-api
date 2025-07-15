import { Request, Response } from 'express';

import { logger } from '@/lib/winston';
import { sendError } from '@/utils/http-error';

import User from '@/models/user';

const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).select('-__v').exec();
    if (!user) {
      sendError.notFound(res, 'User not found');
      return;
    }

    res.status(200).json({
      data: user,
    });
  } catch (error) {
    sendError.internalServer(res, error);
    logger.error('Error while getUser: ', error);
  }
};
export default getUser;
