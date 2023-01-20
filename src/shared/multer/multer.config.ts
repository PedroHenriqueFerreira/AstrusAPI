import {
  BadRequestException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { MulterModuleOptions } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, resolve } from 'path';
import { v4 as uuid } from 'uuid';

export const multerModuleOptions = (
  allowedMimeTypes: string[],
): MulterModuleOptions => ({
  dest: resolve(__dirname, '..', '..', '..', 'uploads'),
  limits: { fileSize: 1024 * 1024 * 50 },
  fileFilter: (req, file, cb) => {
    if (
      allowedMimeTypes.some((mimetype) =>
        file.mimetype.includes(mimetype.toLowerCase()),
      )
    ) {
      return cb(null, true);
    }

    const upperAllowedMimeTypes = allowedMimeTypes.map((i) => i.toUpperCase());

    cb(
      new UnsupportedMediaTypeException(
        `Apenas os formatos [${upperAllowedMimeTypes.join(
          ' | ',
        )}] são permitidos`,
      ),
      false,
    );
  },
  storage: diskStorage({
    filename: (req, file, cb) => {
      cb(null, `${uuid()}${extname(file.originalname)}`);
    },

    destination: (req, file, cb) => {
      cb(null, resolve(__dirname, '..', '..', '..', 'uploads'));
    },
  }),
});
