import { UserDocument } from '@/models/user';
import { Pagination } from '@/types/core.types';
import { IResUser, IResUsers } from '@/types/user.types';

export const userDto = (data: UserDocument): IResUser => {
  //   const userObj = data.toObject();
  //   delete userObj.password;
  //   delete userObj.__v;
  //   return userObj;

  return {
    id: data._id as string,
    username: data.username,
    email: data.email,
    role: data.role,
    firstname: data.firstname,
    lastname: data.lastname,
    socialLinks: data.socialLinks,
  };
};

export const usersDto = (
  data: UserDocument[],
  pagination: Pagination,
): IResUsers => {
  return { data: data.map((i) => userDto(i)), pagination };
};
