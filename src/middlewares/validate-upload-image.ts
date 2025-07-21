import { Request, Response, NextFunction } from 'express';

import { MAX_FILE_SIZE } from '@/constants';
import { sendError } from '@/utils/http-error';

export const validateUploadImage = (fieldName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;
    if (!file) {
      sendError.badRequest(res, `${fieldName} is required`);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      res.status(413).json({
        code: 'ValidationError',
        message: 'File size must be less than 2MB',
      });
      return;
    }

    next();
  };
};
