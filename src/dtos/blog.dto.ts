import { BlogDocument } from '@/models/blog';
import { IResBlog, IResBlogs } from '@/types/blog.types';
import { Pagination } from '@/types/core.types';

export const blogDto = (data: BlogDocument): IResBlog => {
  return {
    id: data._id as string,
    title: data.title,
    slug: data.slug,
    content: data.content,
    banner: {
      publicId: data.banner.publicId,
      url: data.banner.url,
      width: data.banner.width,
      height: data.banner.height,
    },
    author: data.author,
    viewsCount: data.viewsCount,
    likesCount: data.likesCount,
    commentsCount: data.commentsCount,
    status: data.status,
  };
};

export const blogsDto = (
  data: BlogDocument[],
  pagination: Pagination,
): IResBlogs => {
  return { data: data.map((i) => blogDto(i)), pagination };
};
