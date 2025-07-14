import type { Request, Response } from 'express';

import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';

import config from '@/config';
import { USER_ROLE } from '@/types/core.enums';
import { sendError } from '@/utils/http-error';
import { genUsername } from '@/utils';
import { RegisterSchemaType } from '@/validators/auth.validator';

import Token from '@/models/token';
import User from '@/models/user';

const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role } = req.body as RegisterSchemaType;

    // Check email exists
    const userExists = await User.exists({ email });
    if (userExists) {
      sendError.badRequest(res, 'Email or password is invalid');
      logger.warn(`This email "${email}" is already exists`);
      return;
    }

    // Check whitelist admin
    if (
      role === USER_ROLE.Admin &&
      !config.WHITELIST_ADMINS_MAIL.includes(email)
    ) {
      sendError.forbidden(res, 'You cannot register as an admin');
      logger.warn(`User with email ${email} tried to register as an admin`);
      return;
    }

    // Create User on database
    const username = genUsername();
    const newUser = await User.create({
      username,
      email,
      password,
      role,
    });

    // Generate access & refresh token
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    // Store token to databased
    await Token.create({ token: refreshToken, userId: newUser._id });
    logger.info('Refresh token created for user', {
      userId: newUser._id,
      token: refreshToken,
    });

    // res.cookie('refreshToken', refreshToken, {
    //   httpOnly: true,
    //   secure: config.NODE_ENV === 'production',
    //   sameSite: 'strict',
    // });

    res.status(201).json({
      accessToken,
      refreshToken,
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
    logger.info('register successful');
  } catch (error) {
    sendError.internalServer(res, error);
    logger.error('Error during user registeration, ', error);
  }
};

export default register;
