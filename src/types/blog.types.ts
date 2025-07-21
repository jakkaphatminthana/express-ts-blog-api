import { Types } from 'mongoose';

import { BLOG_STATUS } from '@/constants/enums';
import { BaseImage, Pagination } from './core.types';

export interface IResBlog {
  id: Types.ObjectId | string;
  title: string;
  slug: string;
  content: string;
  banner: BaseImage;
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
