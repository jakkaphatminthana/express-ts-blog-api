import { Types } from 'mongoose';

import { genUsername } from '@/utils';
import { logger } from '@/lib/winston';
import { PAGE, PAGE_SIZE } from '@/types/core.constants';
import { Pagination } from '@/types/core.types';
import { createError } from '@/types/core.error';

import {
  UsersSchemaType,
  UserUpdateSchemaType,
} from '@/validators/user.validator';

import User, { IUser, UserDocument } from '@/models/user';

import { TokenService } from '@/services/v1/token.service';

export const UserService = {
  getUserById: async (
    userId: Types.ObjectId | string,
  ): Promise<UserDocument | null> => {
    return await User.findOne({ _id: userId })
      .select('-__v +password') // not include __v
      .exec();
  },

  getUserByEmail: async (email: string): Promise<UserDocument | null> => {
    return await User.findOne({ email })
      .select('-__v +password') // not include __v
      .exec();
  },

  getUsers: async (
    requestData: UsersSchemaType,
  ): Promise<{ users: UserDocument[]; pagination: Pagination }> => {
    const page = requestData.page || PAGE;
    const pageSize = requestData.pageSize || PAGE_SIZE;
    const total = await User.countDocuments();

    const users = await User.find()
      .select('-__v') // not select __v
      .limit(pageSize)
      .skip((page - 1) * pageSize) //page
      .exec();

    return {
      users,
      pagination: {
        page: Number(page),
        pageSize: Number(page),
        total: total,
      },
    };
  },

  create: async (
    requestData: Pick<IUser, 'email' | 'password' | 'role'>,
  ): Promise<UserDocument> => {
    const username = genUsername();
    return await User.create({
      ...requestData,
      username,
    });
  },

  update: async (
    userId: Types.ObjectId,
    requestData: UserUpdateSchemaType,
  ): Promise<UserDocument> => {
    const user = await UserService.getUserById(userId);
    if (!user) {
      throw createError.notFound('User not found');
    }

    // Update data
    if (requestData.username) user.username = requestData.username;
    if (requestData.password) user.password = requestData.password;
    if (requestData.firstName) user.firstname = requestData.firstName;
    if (requestData.lastName) user.lastname = requestData.lastName;

    user.socialLinks ??= {}; // nullish coalescing assignment

    if (requestData.website) user.socialLinks.website = requestData.website;
    if (requestData.facebook) user.socialLinks.facebook = requestData.facebook;
    if (requestData.instagram)
      user.socialLinks.instagram = requestData.instagram;
    if (requestData.linkedin) user.socialLinks.linkedin = requestData.linkedin;
    if (requestData.x) user.socialLinks.x = requestData.x;
    if (requestData.youtube) user.socialLinks.youtube = requestData.youtube;

    await user.save();
    logger.info('Update user successful', user);

    return user;
  },

  delete: async (userId: Types.ObjectId | string): Promise<void> => {
    // delete user
    await User.deleteOne({ _id: userId });
    logger.info('A user account has been deleted', {
      userId,
    });

    // delete refresh token
    await TokenService.deleteByUserId(userId);
    logger.info('Refresh tokens has been deleted', {
      userId,
    });
  },
};
