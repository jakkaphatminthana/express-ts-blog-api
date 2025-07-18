import { Router } from 'express';
import multer from 'multer';

import authorize from '@/middlewares/authorize';
import authenticate from '@/middlewares/authenticate';
import validationError from '@/middlewares/validation-error';

import { USER_ROLE } from '@/constants/enums';
import { createBlog } from '@/controllers/v1/blog.controller';
import { BlogSchema } from '@/validators/blog.validator';
import { uploadBlogBanner } from '@/middlewares/upload-image';

const upload = multer();

const router = Router();

router.post(
  '/',
  authenticate,
  authorize([USER_ROLE.Admin]),
  upload.single('banner_image'), // Must be placed before validationError
  validationError(BlogSchema, 'body'),
  uploadBlogBanner('post'),
  createBlog,
);

export default router;
