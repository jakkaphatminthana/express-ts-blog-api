import { Request, Response } from 'express';

import { logger } from '@/lib/winston';
import { sendError } from '@/utils/http-error';
import { UsersSchemaType } from '@/validators/user.validator';

import User from '@/models/user';
import { PAGE, PAGE_SIZE } from '@/types/core.constants';

const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = PAGE, pageSize = PAGE_SIZE } = req.query as UsersSchemaType;
    const total = await User.countDocuments();

    const users = await User.find()
      .select('-__v') // not select __v
      .limit(pageSize)
      .skip((page - 1) * pageSize) //page
      .lean()
      .exec();

    res.status(200).json({
      data: users,
      pagination: {
        page: Number(page),
        pageSize: Number(pageSize),
        total,
      },
    });
  } catch (error) {
    sendError.internalServer(res, error);
    logger.error('Error while getUsers: ', error);
  }
};

export default getUsers;
