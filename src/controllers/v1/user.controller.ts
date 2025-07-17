import type { Types } from 'mongoose';
import type { Request, Response } from 'express';

import { logger } from '@/lib/winston';
import { sendError } from '@/utils/http-error';

import { UserService } from '@/services/v1/user.service';
import { userDto, usersDto } from '@/dtos/user.dto';
import {
  UsersSchemaType,
  UserUpdateSchemaType,
} from '@/validators/user.validator';

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      sendError.unauthorized(res);
      return;
    }

    const user = await UserService.getUserById(userId as Types.ObjectId);
    if (!user) {
      sendError.notFound(res, 'User not found');
      return;
    }
    res.status(200).json({
      data: userDto(user),
    });
  } catch (error) {
    sendError.internalServer(res, error);
    logger.error('Error while getMe: ', error);
  }
};

export const updateMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as UserUpdateSchemaType;
    const userId = req.userId;

    if (!userId) {
      sendError.unauthorized(res);
      return;
    }

    const updatedData = await UserService.update(userId, body);

    res.status(200).json({
      data: userDto(updatedData),
    });
  } catch (error) {
    sendError.internalServer(res, error);
    logger.error('Error while updateMe: ', error);
  }
};

export const deleteMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      sendError.unauthorized(res);
      return;
    }

    await UserService.delete(userId);
    res.sendStatus(204);
  } catch (error) {
    sendError.internalServer(res, error);
    logger.error('Error while deleteMe: ', error);
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query as UsersSchemaType;
    const listData = await UserService.getUsers(query);

    res.status(200).json(usersDto(listData.users, listData.pagination));
  } catch (error) {
    sendError.internalServer(res, error);
    logger.error('Error while getUsers: ', error);
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;

    const user = await UserService.getUserById(userId);
    if (!user) {
      sendError.notFound(res, 'User not found');
      return;
    }
    res.status(200).json({ data: userDto(user) });
  } catch (error) {
    sendError.internalServer(res, error);
    logger.error('Error while getUser: ', error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.params.userId;
    await UserService.delete(userId);
    res.sendStatus(204);
  } catch (error) {
    sendError.internalServer(res, error);
    logger.error('Error while getUser: ', error);
  }
};
