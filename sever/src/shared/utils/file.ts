import { ALLOWED_IMPORT_TYPES } from '@app/constants';
import { Errors } from '@app/errors';
import { Request } from 'express';
import { FastifyRequest } from 'fastify';
import { extname } from 'path';

export const editFileName = (
  req: FastifyRequest,
  file: Express.Multer.File,
  callback: (error: Error | null, filename?: string) => void,
) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');

  callback(null, `${name}-${randomName}${fileExtName}`);
};

export const importDataFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: any, acceptFile: boolean) => void,
) => {
  if (!ALLOWED_IMPORT_TYPES.includes(file.mimetype)) {
    return callback(Errors.File.TypeNotSupported, false);
  }
  callback(null, true);
};
