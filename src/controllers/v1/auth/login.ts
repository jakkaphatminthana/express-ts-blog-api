import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';

import User, { IUser } from '@/models/user';
import Token from '@/models/token';

import type { Request, Response } from 'express';
import { sendError } from '@/utils/http-error';

type UserData = Pick<IUser, 'email' | 'password'>;

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body as UserData;

    const user = await User.findOne({ email })
      .select('username email password role')
      .lean()
      .exec();

    if (!user) {
      sendError.unauthorized(res, 'Email or password is invalid');
      return;
    }

    // Generate access & refresh token
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store token to databased
    await Token.create({ token: refreshToken, userId: user._id });
    logger.info('Refresh token created for user', {
      userId: user._id,
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
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
    logger.info('Login successful');
  } catch (error) {
    sendError.internalServer(res, error);
    logger.error('Error during user login, ', error);
  }
};

export default login;
