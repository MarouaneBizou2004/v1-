import type { Request } from 'express';
import multer from 'multer';

const storage = multer.memoryStorage();

export const upload = multer({ storage });

export const mapFilesToIds = (files: Express.Multer.File[] | undefined): string[] => {
  if (!files) return [];
  return files.map((file) => file.originalname);
};
