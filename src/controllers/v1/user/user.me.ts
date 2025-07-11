import { logger } from '@/lib/winston';
import { sendError } from '@/utils/http-error';
import { Request, Response } from 'express';
import User from '@/models/user';

const getUserMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId)
      .select('-__v') //not select field __v
      .lean()
      .exec();

    res.status(200).json({
      data: user,
    });
  } catch (error) {
    sendError.internalServer(res, error);
    logger.error('Error while getCurrentUser: ', error);
  }
};

export default getUserMe;
