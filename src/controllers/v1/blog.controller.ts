import type { Request, Response } from 'express';
import { Types } from 'mongoose';

import { logger } from '@/lib/winston';
import { sendError } from '@/utils/http-error';
import { BLOG_STATUS, USER_ROLE } from '@/constants/enums';

import { blogDto, blogsDto } from '@/dtos/blog.dto';
import {
  BlogsSchemaType,
  CreateBlogSchemaType,
  UpdateBlogSchemaType,
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

export const updateBlog = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;
    const blogId = req.params.blogId;

    const body = req.body as UpdateBlogSchemaType;

    const user = await UserService.getUserById(userId as Types.ObjectId);
    const blog = await BlogService.getById(blogId);

    // check blog
    if (!blog) {
      sendError.notFound(res, 'Blog not found');
      return;
    }

    // check owner blog
    if (!blog.author._id.equals(userId) || user?.role !== USER_ROLE.Admin) {
      sendError.forbidden(res);
      logger.warn('A user tried to update a blog without permission');
      return;
    }

    // update
    const updatedData = await BlogService.update(
      blogId,
      body,
      req.body?.banner_image,
    );

    res.status(200).json({ data: blogDto(updatedData) });
  } catch (error) {
    sendError.internalServer(res, error);
    logger.error('Error while updateBlog, ', error);
  }
};

export const delteBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const blogId = req.params.blogId;

    const user = await UserService.getUserById(userId as Types.ObjectId);
    const blog = await BlogService.getById(blogId);

    // check blog
    if (!blog) {
      sendError.notFound(res, 'Blog not found');
      return;
    }

    // check owner blog
    if (!blog.author._id.equals(userId) || user?.role !== USER_ROLE.Admin) {
      sendError.forbidden(res);
      logger.warn('A user tried to delte a blog without permission');
      return;
    }

    // deleting
    await BlogService.delete(blogId);

    res.status(200).json({ message: 'Delete blog successful' });
  } catch (error) {
    sendError.internalServer(res, error);
    logger.error('Error while updateBlog, ', error);
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

export const getBlogsByUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const currentUserId = req.userId;
    const query = req.query as BlogsSchemaType;

    const currentUser = await UserService.getUserById(
      currentUserId as Types.ObjectId,
    );
    if (!currentUser) {
      sendError.unauthorized(res);
      return;
    }

    // Show only the published blog for user
    if (currentUser.role === USER_ROLE.User) {
      query.status = BLOG_STATUS.PUBLISHED;
    }

    // Filter author
    query.author = userId;

    const listData = await BlogService.getAll(query);

    res.status(200).json(blogsDto(listData.blogs, listData.pagination));
  } catch (error) {
    sendError.internalServer(res, error);
    logger.error('Error while getBlogsByUser, ', error);
  }
};

export const getBlogBySlug = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;
    const slug = req.params.slug;

    const user = await UserService.getUserById(userId as Types.ObjectId);
    if (!user) {
      sendError.unauthorized(res);
      return;
    }

    const blog = await BlogService.getBySlug(slug);

    if (!blog) {
      sendError.notFound(res, 'Blog not found');
      return;
    }

    if (user.role === USER_ROLE.User && blog.status === BLOG_STATUS.DRAFT) {
      sendError.forbidden(res);
      return;
    }

    res.status(200).json({ data: blogDto(blog) });
  } catch (error) {
    sendError.internalServer(res, error);
    logger.error('Error while getBlogBySlug, ', error);
  }
};
