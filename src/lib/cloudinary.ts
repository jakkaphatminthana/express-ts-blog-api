import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiResponse } from 'cloudinary';

import config from '@/config';
import { logger } from './winston';

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
  secure: config.NODE_ENV === 'production',
});

/**
 * Uploads an image to Cloudinary using a Buffer (commonly from memoryStorage).
 *
 * @param buffer - The file content as a Buffer (e.g. from multer.memoryStorage)
 * @param publicId - (Optional) The custom public ID (path/filename) to assign in Cloudinary
 * @returns A Promise that resolves to UploadApiResponse or rejects with an error
 */
const uploadToCloudinary = (
  buffer: Buffer<ArrayBufferLike>,
  publicId?: string,
): Promise<UploadApiResponse | undefined> => {
  return new Promise((resolve, reject) => {
    // Create an upload stream and pipe the buffer into it
    cloudinary.uploader
      .upload_stream(
        {
          allowed_formats: ['png', 'jpg', 'webp'],
          resource_type: 'image',
          public_id: publicId,
          transformation: { quality: 'auto' },
        },
        (err, result) => {
          if (err) {
            logger.error('Error uploading image to Cloudinary: ', err);
            reject(err);
          }

          resolve(result);
        },
      )
      .end(buffer); // Write the buffer to the upload stream
  });
};

export default uploadToCloudinary;
