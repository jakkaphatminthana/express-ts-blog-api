import { Types } from 'mongoose';
import { BLOG_STATUS } from '@/constants/enums';

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
