import bcrypt from 'bcrypt';
import mongoose, { Types } from 'mongoose';

import config from '@/config';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';

import { USER_ROLE } from '@/types/core.enums';
import { createError } from '@/types/core.error';
import {
  LoginSchemaType,
  LogoutSchemaType,
  RegisterSchemaType,
} from '@/validators/auth.validator';

import { UserService } from '@/services/v1/user.service';
import { TokenService } from '@/services/v1/token.service';

export const AuthService = {
  register: async ({ email, password, role }: RegisterSchemaType) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    // Check email exists
    const userExists = await UserService.getUserByEmail(email);
    if (userExists) {
      logger.warn(`This email "${email}" is already exists`);
      throw createError.badRequest('Email or password is invalid');
    }

    // Check whitelist admin
    if (
      role === USER_ROLE.Admin &&
      !config.WHITELIST_ADMINS_MAIL.includes(email)
    ) {
      logger.warn(`User with email ${email} tried to register as an admin`);
      throw createError.forbidden('You cannot register as an admin');
    }

    // Create User on database
    const newUser = await UserService.create({
      email,
      password,
      role: role as USER_ROLE,
    });

    // Generate access & refresh token
    const accessToken = generateAccessToken(newUser._id as Types.ObjectId);
    const refreshToken = generateRefreshToken(newUser._id as Types.ObjectId);

    // Store token to databased
    await TokenService.createRefreshToken({
      token: refreshToken,
      userId: newUser._id as Types.ObjectId,
    });
    logger.info('Refresh token created for user', {
      userId: newUser._id,
      token: refreshToken,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    };
  },

  login: async ({ email, password }: LoginSchemaType) => {
    // Check user exists
    const user = await UserService.getUserByEmail(email);
    if (!user) {
      logger.warn(`getUserByEmail not found`);
      throw createError.unauthorized('Email or password is invalid');
    }

    // Check password match
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      logger.warn(`Password not match`);
      throw createError.unauthorized('Email or password is invalid');
    }

    // Generate access & refresh token
    const accessToken = generateAccessToken(user._id as Types.ObjectId);
    const refreshToken = generateRefreshToken(user._id as Types.ObjectId);

    // Store token to databased
    await TokenService.createRefreshToken({
      token: refreshToken,
      userId: user._id as Types.ObjectId,
    });
    logger.info('Refresh token created for user', {
      userId: user._id,
      token: refreshToken,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  },

  logout: async ({ refreshToken }: LogoutSchemaType) => {
    // Check token is exisits
    const isTokenExists = await TokenService.isExists(refreshToken);
    if (!isTokenExists) {
      throw createError.badRequest('Invalid refresh token');
    }

    await TokenService.delete(refreshToken);
    logger.info('User refresh token deleted successful', {
      token: refreshToken,
    });
  },
};
