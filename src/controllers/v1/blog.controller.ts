import type { Request, Response } from 'express';
import { Types } from 'mongoose';

import { logger } from '@/lib/winston';
import { sendError } from '@/utils/http-error';
import { BlogSchemaType } from '@/validators/blog.validator';
import { BlogService } from '@/services/v1/blog.service';
import { blogDto } from '@/dtos/blog.dto';

export const createBlog = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;
    const body = req.body as BlogSchemaType;
    const bannerImage = req.body.banner_image;

    if (!bannerImage) {
      sendError.badRequest(res, 'banner_image is required');
      logger.warn('banner_image is required: ', bannerImage);
      return;
    }

    const newData = await BlogService.create(
      userId as Types.ObjectId,
      body,
      bannerImage,
    );

    res.status(201).json({ data: blogDto(newData) });
  } catch (error) {
    sendError.internalServer(res, error);
    logger.error('Error while createBlog, ', error);
  }
};
