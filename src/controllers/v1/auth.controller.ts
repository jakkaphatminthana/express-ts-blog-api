import type { Request, Response } from 'express';

import { logger } from '@/lib/winston';
import { sendError } from '@/utils/http-error';

import {
  LoginSchemaType,
  LogoutSchemaType,
  RefreshTokenSchemaType,
  RegisterSchemaType,
} from '@/validators/auth.validator';

import { AuthService } from '@/services/v1/auth.service';
import { TokenService } from '@/services/v1/token.service';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as RegisterSchemaType;

    const data = await AuthService.register(body);

    // res.cookie('refreshToken', data.refreshToken, {
    //   httpOnly: true,
    //   secure: config.NODE_ENV === 'production',
    //   sameSite: 'strict',
    // });
    logger.info('Register successful');
    res.status(201).json(data);
  } catch (error) {
    sendError.internalServer(res, error);
    logger.error('Error during user register, ', error);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as LoginSchemaType;

    const data = await AuthService.login(body);

    // res.cookie('refreshToken', data.refreshToken, {
    //   httpOnly: true,
    //   secure: config.NODE_ENV === 'production',
    //   sameSite: 'strict',
    // });
    logger.info('Login successful');
    res.status(201).json(data);
  } catch (error) {
    sendError.internalServer(res, error);
    logger.error('Error during user login, ', error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const body = req.body as RefreshTokenSchemaType;
  try {
    const accessToken = await TokenService.refreshToken(body);
    res.status(200).json({
      accessToken,
    });
  } catch (error) {
    sendError.internalServer(res, error);
    logger.error('Error during refreshToken: ', error);
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body as LogoutSchemaType;
    await AuthService.logout({ refreshToken });

    res.sendStatus(204); //No content
  } catch (error) {
    sendError.internalServer(res, error);
    logger.error('Error during logout: ', error);
  }
};
