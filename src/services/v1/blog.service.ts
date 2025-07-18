import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { Types } from 'mongoose';

import { generateSlug } from '@/utils';
import { BlogSchemaType } from '@/validators/blog.validator';
import { BlogBanner } from '@/types/blog.types';

import Blog, { BlogDocument } from '@/models/blog';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

export const BlogService = {
  getById: async (
    blogId: Types.ObjectId | string,
  ): Promise<BlogDocument | null> => {
    return await Blog.findById(blogId).select('-__v').exec();
  },

  create: async (
    userId: Types.ObjectId | string,
    requestData: BlogSchemaType,
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
