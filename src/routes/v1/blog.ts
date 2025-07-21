import { Router } from 'express';
import multer from 'multer';

import authorize from '@/middlewares/authorize';
import authenticate from '@/middlewares/authenticate';
import validationError from '@/middlewares/validation-error';
import { uploadBlogBanner } from '@/middlewares/upload-image';

import { USER_ROLE } from '@/constants/enums';
import {
  BlogsSchema,
  CreateBlogSchema,
  UpdateBlogSchema,
} from '@/validators/blog.validator';
import {
  createBlog,
  getBlogBySlug,
  getBlogs,
  getBlogsByUser,
  updateBlog,
} from '@/controllers/v1/blog.controller';

const upload = multer();

const router = Router();

router.post(
  '/',
  authenticate,
  authorize([USER_ROLE.Admin]),
  upload.single('banner_image'), // Must be placed before validationError
  validationError(CreateBlogSchema, 'body'),
  uploadBlogBanner('post'),
  createBlog,
);

router.get(
  '/',
  authenticate,
  authorize([USER_ROLE.Admin, USER_ROLE.User]),
  validationError(BlogsSchema, 'query'),
  getBlogs,
);

router.get(
  '/user/:userId',
  authenticate,
  authorize([USER_ROLE.Admin, USER_ROLE.User]),
  validationError(BlogsSchema, 'query'),
  getBlogsByUser,
);

router.get(
  '/:slug',
  authenticate,
  authorize([USER_ROLE.Admin, USER_ROLE.User]),
  getBlogBySlug,
);

router.put(
  '/:blogId',
  authenticate,
  authorize([USER_ROLE.Admin]),
  upload.single('banner_image'), // Must be placed before validationError
  validationError(UpdateBlogSchema, 'body'),
  uploadBlogBanner('put'),
  updateBlog,
);

export default router;
