import { logger } from '@/lib/winston';
import User from '@/models/user';
import { sendError } from '@/utils/http-error';
import { UserUpdateSchemaType } from '@/validators/user.validator';
import type { Request, Response } from 'express';

const updateMe = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  const {
    username,
    password,
    firstName,
    lastName,
    website,
    facebook,
    instagram,
    linkedin,
    x,
    youtube,
  } = req.body as UserUpdateSchemaType;

  try {
    const user = await User.findById(userId)
      .select('+password -__v') // +password = get password (hidden field), -__v = don't get field __v
      .exec();

    if (!user) {
      sendError.notFound(res, 'User not found');
      return;
    }

    // Update data
    if (username) user.username = username;
    if (password) user.password = password;
    if (firstName) user.firstname = firstName;
    if (lastName) user.lastname = lastName;

    user.socialLinks ??= {}; // nullish coalescing assignment

    if (website) user.socialLinks.website = website;
    if (facebook) user.socialLinks.facebook = facebook;
    if (instagram) user.socialLinks.instagram = instagram;
    if (linkedin) user.socialLinks.linkedin = linkedin;
    if (x) user.socialLinks.x = x;
    if (youtube) user.socialLinks.youtube = youtube;

    await user.save();
    logger.info('User update successful', user);

    res.status(200).json({
      data: user,
    });
  } catch (error) {
    sendError.internalServer(res, error);
    logger.error('Error while updateMe: ', error);
  }
};

export default updateMe;
