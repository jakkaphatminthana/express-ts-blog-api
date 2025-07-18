import { NextFunction, Request, Response } from 'express';
import { UploadApiErrorResponse } from 'cloudinary';

import uploadToCloudinary from '@/lib/cloudinary';
import { logger } from '@/lib/winston';
import { MAX_FILE_SIZE } from '@/constants';

import { sendError } from '@/utils/http-error';
import { BlogBanner } from '@/types/blog.types';

export const uploadBlogBanner = (method: 'post' | 'put') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (method === 'put' && !req.file) {
      next();
      return;
    }

    if (!req.file) {
      sendError.badRequest(res, 'banner_image is required');
      return;
    }

    if (req.file.size > MAX_FILE_SIZE) {
      res.status(413).json({
        code: 'ValidationError',
        message: 'File size must be less than 2MB',
      });
      return;
    }

    try {
      //   const { blogId } = req.params;
      //   const blog = await BlogService.getById(blogId);
      //   if (!blog) {
      //     sendError.badRequest(res, 'Blog not found');
      //     return;
      //   }

      const data = await uploadToCloudinary(
        req.file.buffer,
        // blog?.banner.publicId.replace('express-ts-blog/', ''),
      );

      if (!data) {
        sendError.internalServer(res, new Error('Error upload image'));
        logger.error('Error while uploading blog banner to cloudinary');
        return;
      }

      const newBanner: BlogBanner = {
        publicId: data.public_id,
        url: data.secure_url,
        width: data.width,
        height: data.height,
      };

      logger.info('Blog banner uploaded to Cloudinary', newBanner);
      req.body.banner_image = newBanner;
      next();
    } catch (err: UploadApiErrorResponse | any) {
      res.status(err.http_code).json({
        code: err.http_code < 500 ? 'ValidationError' : err.name,
        message: err.message,
      });
      logger.error('Error while uploadBlogBanner: ', err);
    }
  };
};
