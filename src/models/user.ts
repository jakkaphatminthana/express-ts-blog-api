import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { USER_ROLE } from '@/types/core.enums';

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: USER_ROLE;
  firstname?: string;
  lastname?: string;
  socialLinks?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    x?: string;
    youtube?: string;
  };
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'username is required'],
      maxlength: [20, 'username must be less than 20 characters'],
      unique: [true, 'username must be unique'],
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      maxlength: [50, 'email must be less than 20 characters'],
      unique: [true, 'email must be unique'],
    },
    password: {
      type: String,
      required: [true, 'password is required'],
      select: false,
    },
    role: {
      type: String,
      required: [true, 'role is required'],
      enum: {
        values: Object.values(USER_ROLE),
        message: '{VALUE} is not supported',
      },
      default: USER_ROLE.User,
    },
    firstname: {
      type: String,
      maxlength: [30, 'firstname must be less than 30 characters'],
    },
    lastname: {
      type: String,
      maxlength: [30, 'lastname must be less than 30 characters'],
    },
    socialLinks: {
      website: {
        type: String,
        maxlength: [100, 'website must be less than 100 characters'],
      },
      facebook: {
        type: String,
        maxlength: [100, 'facebook must be less than 100 characters'],
      },
      instagram: {
        type: String,
        maxlength: [100, 'instagram must be less than 100 characters'],
      },
      linkedin: {
        type: String,
        maxlength: [100, 'linkedin must be less than 100 characters'],
      },
      x: {
        type: String,
        maxlength: [100, 'x must be less than 100 characters'],
      },
      youtube: {
        type: String,
        maxlength: [100, 'youtube must be less than 100 characters'],
      },
    },
  },
  { timestamps: true },
);

// on create
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default model<IUser>('User', userSchema);
