import { logger } from '@/lib/winston';
import User, { IUser } from '@/models/user';
import { genUsername } from '@/utils';
import type { Request, Response } from 'express';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';

type UserData = Pick<IUser, 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body as UserData;

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
