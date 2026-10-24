import multer from 'multer';
import { randomUUID } from 'node:crypto';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import HttpError from '../utils/http-error';

export const uploadDirectory = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../uploads/images',
);

const MIME_TYPE_MAP: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

const fileUpload = multer({
  limits: { fileSize: 500000 },
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      mkdir(uploadDirectory, { recursive: true })
        .then(() => cb(null, uploadDirectory))
        .catch((error: unknown) =>
          cb(
            error instanceof Error
              ? error
              : new Error('Could not create upload directory.'),
            uploadDirectory,
          ),
        );
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      if (!ext) {
        cb(new Error('Invalid mime type!'), '');
        return;
      }
      cb(null, `${randomUUID()}.${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (MIME_TYPE_MAP[file.mimetype]) {
      cb(null, true);
      return;
    }
    cb(new HttpError('Invalid mime type!', 400));
  },
});

export default fileUpload;
