import { Types } from 'mongoose';

import { BLOG_STATUS } from '@/constants/enums';
import { Pagination } from './core.types';

export interface BlogBanner {
  publicId: Types.ObjectId | string;
  url: string;
  width: number;
  height: number;
}

export interface IResBlog {
  id: Types.ObjectId | string;
  title: string;
  slug: string;
  content: string;
  banner: BlogBanner;
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
