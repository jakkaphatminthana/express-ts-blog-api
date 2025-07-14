import { NextFunction, Request, Response } from 'express';

import { logger } from '@/lib/winston';
import { sendError } from '@/utils/http-error';
import { USER_ROLE } from '@/types/core.enums';

import User from '@/models/user';

const authorize = (roles: USER_ROLE[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    try {
      const user = await User.findById(userId).select('role').exec();

      // Check User
      if (!user) {
        sendError.notFound(res, 'User not found');
        return;
      }

      // Check Role permission
      if (!roles.includes(user.role)) {
        sendError.forbidden(res, 'Access denied, insufficient permissions');
        return;
      }

      return next();
    } catch (error) {
      sendError.internalServer(res, error);
      logger.error('Error while authorizing user: ', error);
    }
  };
};

export default authorize;
