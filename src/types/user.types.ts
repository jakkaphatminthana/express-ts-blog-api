import { Pagination } from '@/types/core.types';

export interface IResUser {
  id: string;
  username: string;
  email: string;
  role: string;
  firstname?: string;
  lastname?: string;
  socialLinks?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    x?: string;
    youtube?: string;
  };
}

export interface IResUsers {
  data: IResUser[];
  pagination: Pagination;
}
