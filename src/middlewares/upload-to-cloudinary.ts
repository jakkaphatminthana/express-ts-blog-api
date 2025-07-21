import { UploadApiErrorResponse } from 'cloudinary';
import { Request, Response, NextFunction } from 'express';

import uploadToCloudinary from '@/lib/cloudinary';
import { logger } from '@/lib/winston';

import { BaseImage } from '@/types/core.types';
import { sendError } from '@/utils/http-error';
import { MAX_FILE_SIZE } from '@/constants';

export const uploadToCloudinaryMiddleware = (
  fieldName: string,
  publicIdPrefix?: string,
  required: boolean = true,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;

    if (!file) {
      if (required) {
        sendError.badRequest(res, `${fieldName} is required`);
        return;
      } else {
        return next();
      }
    }

    if (file.size > MAX_FILE_SIZE) {
      res.status(413).json({
        code: 'ValidationError',
        message: 'File size must be less than 2MB',
      });
      return;
    }

    try {
      const publicId = publicIdPrefix
        ? `${publicIdPrefix}/${Date.now()}`
        : undefined;

      const result = await uploadToCloudinary(file.buffer, publicId);
      if (!result) {
        logger.error('Failed to upload image to Cloudinary');
        sendError.internalServer(res, new Error('Cloudinary upload failed'));
        return;
      }

      const uploadedImage: BaseImage = {
        publicId: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height,
      };

      // Attach to req.body[fieldName]
      req.body[fieldName] = uploadedImage;

      logger.info(`Image uploaded to Cloudinary successful.`, {
        url: result.secure_url,
        body: fieldName,
      });

      next();
    } catch (err: UploadApiErrorResponse | any) {
      res.status(err.http_code).json({
        code: err.http_code < 500 ? 'ValidationError' : err.name,
        message: err.message,
      });
      logger.error('Error while uploadToCloudinaryMiddleware: ', err);
    }
  };
};
