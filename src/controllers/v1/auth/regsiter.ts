import bcrypt from 'bcrypt';
import { logger } from '@/lib/winston';
import User, { IUser } from '@/models/user';
import { genUsername } from '@/utils';
import type { Request, Response } from 'express';

type UserData = Pick<IUser, 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body as UserData;

  try {
    const username = genUsername();
    const hashedPassword = await bcrypt.hashSync(password, 10); //saltRounds = 10

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
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
