import { model, Schema, Types, Document } from 'mongoose';
import { BLOG_STATUS } from '@/constants/enums';

export interface IBlog {
  title: string;
  slug: string;
  content: string;
  banner: IBlogBanner;
  author: Types.ObjectId;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  status: BLOG_STATUS;
}

export interface IBlogBanner {
  publicId: string;
  url: string;
  width: number;
  height: number;
}

export type BlogDocument = Document & IBlog;

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, 'title is required'],
      maxlength: [180, 'title must be less than 180 characters'],
    },
    slug: {
      type: String,
      required: [true, 'slug is required'],
      unique: [true, 'slug must be unique'],
    },
    content: {
      type: String,
      required: [true, 'content is required'],
    },
    banner: {
      publicId: {
        type: String,
        required: [true, 'banner publicId is required'],
      },
      url: {
        type: String,
        required: [true, 'banner url is required'],
      },
      width: {
        type: Number,
        required: [true, 'banner width is required'],
      },
      height: {
        type: Number,
        required: [true, 'banner height is required'],
      },
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'author is required'],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(BLOG_STATUS),
        message: '{VALUE} is not supported',
      },
      default: BLOG_STATUS.DRAFT,
    },
  },
  {
    timestamps: {
      createdAt: 'publishedAt',
    },
  },
);

export default model<IBlog>('Blog', blogSchema);
