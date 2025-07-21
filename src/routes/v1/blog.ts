import { Router } from 'express';
import multer from 'multer';

import authorize from '@/middlewares/authorize';
import authenticate from '@/middlewares/authenticate';
import validationError from '@/middlewares/validation-error';

import { USER_ROLE } from '@/constants/enums';
import {
  BlogIdParamSchema,
  BlogsSchema,
  CreateBlogSchema,
  UpdateBlogSchema,
} from '@/validators/blog.validator';
import {
  createBlog,
  delteBlog,
  getBlogBySlug,
  getBlogs,
  getBlogsByUser,
  updateBlog,
} from '@/controllers/v1/blog.controller';
import { uploadToCloudinaryMiddleware } from '@/middlewares/upload-to-cloudinary';

const upload = multer();

const router = Router();

router.post(
  '/',
  authenticate,
  authorize([USER_ROLE.Admin]),
  upload.single('banner_image'), // file upload
  uploadToCloudinaryMiddleware('banner_image', 'blog/banner'),
  validationError(CreateBlogSchema, 'body'),
  createBlog,
);

router.put(
  '/:blogId',
  authenticate,
  authorize([USER_ROLE.Admin]),
  upload.single('banner_image'), // file upload
  uploadToCloudinaryMiddleware('banner_image', 'blog/banner', false),
  validationError(UpdateBlogSchema, 'body'),
  updateBlog,
);

router.delete(
  '/:blogId',
  authenticate,
  authorize([USER_ROLE.Admin]),
  validationError(BlogIdParamSchema, 'params'),
  delteBlog,
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

export default router;
