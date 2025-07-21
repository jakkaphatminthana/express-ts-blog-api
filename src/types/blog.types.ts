import { Types } from 'mongoose';

import { BLOG_STATUS } from '@/constants/enums';
import { Pagination } from './core.types';
import { IBlogBanner } from '@/models/blog';

export interface IResBlog {
  id: Types.ObjectId | string;
  title: string;
  slug: string;
  content: string;
  banner: IBlogBanner;
  author: Types.ObjectId | string;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  status: BLOG_STATUS;
}

export interface IResBlogs {
  data: IResBlog[];
  pagination: Pagination;
}
