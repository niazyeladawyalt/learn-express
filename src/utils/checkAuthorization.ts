import { Response } from 'express';
import { Types } from 'mongoose';

export const checkPostAuthor = (
  postAuthor: Types.ObjectId,
  userId: string | undefined,
  res: Response,
): boolean => {
  if (!userId || postAuthor.toString() !== userId.toString()) {
    res.status(403).json({ message: 'Not authorized' });
    return false;
  }
  return true;
};
