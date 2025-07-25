import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { Types } from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

import { generateSlug } from '@/utils';
import { PAGE, PAGE_SIZE } from '@/constants';
import { BaseImage, Pagination } from '@/types/core.types';

import {
  BlogsSchemaType,
  CreateBlogSchemaType,
  UpdateBlogSchemaType,
} from '@/validators/blog.validator';

import Blog, { BlogDocument } from '@/models/blog';
import { createError } from '@/types/core.error';
import { BLOG_STATUS } from '@/constants/enums';
import { logger } from '@/lib/winston';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

export const BlogService = {
  getAll: async (
    requestData: BlogsSchemaType,
  ): Promise<{ blogs: BlogDocument[]; pagination: Pagination }> => {
    //filter
    const filter: Record<string, any> = {};
    if (requestData.status) filter.status = requestData.status;
    if (requestData.author) filter.author = requestData.author;

    const page = requestData.page || PAGE;
    const pageSize = requestData.pageSize || PAGE_SIZE;
    const total = await Blog.countDocuments(filter);

    const blogs = await Blog.find(filter)
      .select('-__v') // not select __v
      .populate('author', '-updatedAt -createdAt -__v')
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .sort({ publishedAt: -1 }) //DESC
      .exec();

    return {
      blogs,
      pagination: {
        page: Number(page),
        pageSize: Number(pageSize),
        total: total,
      },
    };
  },

  getById: async (
    blogId: Types.ObjectId | string,
  ): Promise<BlogDocument | null> => {
    return await Blog.findById(blogId).select('-__v').exec();
  },

  getBySlug: async (slug: string): Promise<BlogDocument | null> => {
    return await Blog.findOne({ slug })
      .select('-__v') // not select __v
      .populate('author', '-updatedAt -createdAt -__v')
      .exec();
  },

  create: async (
    userId: Types.ObjectId | string,
    requestData: CreateBlogSchemaType,
    bannerImage: BaseImage,
  ): Promise<BlogDocument> => {
    // clean content with <script>
    const cleanContent: string = purify.sanitize(requestData.content);

    const slug = generateSlug(requestData.title);

    return await Blog.create({
      title: requestData.title,
      slug: slug,
      content: cleanContent,
      banner: bannerImage,
      status: requestData.status,
      author: userId,
    });
  },

  update: async (
    blogId: Types.ObjectId | string,
    requestData: UpdateBlogSchemaType,
    bannerImage?: BaseImage,
  ): Promise<BlogDocument> => {
    const blog = await BlogService.getById(blogId);
    if (!blog) {
      throw createError.notFound('Blog not found');
    }

    if (requestData.title) blog.title = requestData.title;
    if (requestData.content) {
      // clean content with <script>
      const cleanContent: string = purify.sanitize(requestData.content);
      blog.content = cleanContent;
    }
    if (requestData.status) blog.status = requestData.status as BLOG_STATUS;
    if (bannerImage) blog.banner = bannerImage;

    await blog.save();
    logger.info('Blgo updated: ', blog);

    return blog;
  },

  delete: async (blogId: Types.ObjectId | string): Promise<void> => {
    const blog = await BlogService.getById(blogId);
    if (!blog) {
      throw createError.notFound('Blog not found');
    }

    // delete blog
    await blog.deleteOne({ _id: blogId });
    logger.info('Blog delete successful', { blogId });

    // delete image on Cloudinary
    if (blog.banner?.publicId) {
      await cloudinary.uploader.destroy(blog.banner.publicId);
      logger.info('Blog banner deleted from Cloudinary', {
        publicId: blog.banner.publicId,
      });
    }
  },
};
