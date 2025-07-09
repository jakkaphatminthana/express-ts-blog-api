import { logger } from '@/lib/winston';
import { genUsername } from '@/utils';
import type { Request, Response } from 'express';

import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';

import Token from '@/models/token';
import User, { IUser } from '@/models/user';
import config from '@/config';
import { USER_ROLE } from '@/types/enums';

type UserData = Pick<IUser, 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body as UserData;

  // Check whitelist admin
  if (
    role === USER_ROLE.Admin &&
    !config.WHITELIST_ADMINS_MAIL.includes(email)
  ) {
    res.status(403).json({
      code: 'AuthorizationError',
      message: 'You cannot register as an admin',
    });
    logger.warn(`User with email ${email} tried to register as an admin`);
    return;
  }

  try {
    const username = genUsername();

    const newUser = await User.create({
      username,
      email,
      password,
      role,
    });

    // generate access & refresh token
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
    res.status(500).json({
      code: 'ServerError',
      message: 'InternalServerError',
      error: error,
    });
    logger.error('Error during user registeration, ', error);
  }
};

export default register;
