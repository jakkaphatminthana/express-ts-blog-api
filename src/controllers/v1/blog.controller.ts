import type { Request, Response } from 'express';
import { Types } from 'mongoose';

import { logger } from '@/lib/winston';
import { sendError } from '@/utils/http-error';
import { BLOG_STATUS, USER_ROLE } from '@/constants/enums';

import { blogDto, blogsDto } from '@/dtos/blog.dto';
import {
  BlogsSchemaType,
  CreateBlogSchemaType,
} from '@/validators/blog.validator';

import { BlogService } from '@/services/v1/blog.service';
import { UserService } from '@/services/v1/user.service';

export const createBlog = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;
    const body = req.body as CreateBlogSchemaType;
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

export const getBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const query = req.query as BlogsSchemaType;

    const user = await UserService.getUserById(userId as Types.ObjectId);
    if (!user) {
      sendError.unauthorized(res);
      return;
    }

    // Show only the published blog for user
    if (user.role === USER_ROLE.User) {
      query.status = BLOG_STATUS.PUBLISHED;
    }

    const listData = await BlogService.getAll(query);

    res.status(200).json(blogsDto(listData.blogs, listData.pagination));
  } catch (error) {
    sendError.internalServer(res, error);
    logger.error('Error while getBlogs, ', error);
  }
};
