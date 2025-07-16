import { Types } from 'mongoose';

import { genUsername } from '@/utils';

import User, { IUser, UserDocument } from '@/models/user';

export const UserService = {
  getUserById: async (userId: Types.ObjectId): Promise<UserDocument | null> => {
    return await User.findOne({ _id: userId })
      .select('-__v +password') // not include __v
      .exec();
  },

  getUserByEmail: async (email: string): Promise<UserDocument | null> => {
    return await User.findOne({ email })
      .select('-__v +password') // not include __v
      .exec();
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
};
