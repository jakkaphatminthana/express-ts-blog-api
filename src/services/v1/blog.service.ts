import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { Types } from 'mongoose';

import { generateSlug } from '@/utils';
import { PAGE, PAGE_SIZE } from '@/constants';
import { BlogBanner } from '@/types/blog.types';
import { Pagination } from '@/types/core.types';

import {
  BlogsSchemaType,
  CreateBlogSchemaType,
} from '@/validators/blog.validator';

import Blog, { BlogDocument } from '@/models/blog';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

export const BlogService = {
  getById: async (
    blogId: Types.ObjectId | string,
  ): Promise<BlogDocument | null> => {
    return await Blog.findById(blogId).select('-__v').exec();
  },

  getAll: async (
    requestData: BlogsSchemaType,
  ): Promise<{ blogs: BlogDocument[]; pagination: Pagination }> => {
    const filter: Record<string, any> = {};
    if (requestData.status) filter.status = requestData.status;

    const page = requestData.page || PAGE;
    const pageSize = requestData.pageSize || PAGE_SIZE;
    const total = await Blog.countDocuments(filter);

    const blogs = await Blog.find(filter)
      .select('-__v') // not select __v
      .populate('author', '-updatedAt -createdAt -__v')
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .sort({ createdAt: -1 }) //DESC
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

  create: async (
    userId: Types.ObjectId | string,
    requestData: CreateBlogSchemaType,
    bannerImage: BlogBanner,
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
};
