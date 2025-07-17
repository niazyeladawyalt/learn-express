import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
  }
}
export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    res.status(401).json({ message: 'Not authenticated: No token provided' });
    return;
  }
  const token = authHeader.split(' ')[1];
  if (!token || !process.env.JWT_SECRET) {
    res.status(401).json({ message: 'Not authenticated: Invalid token or secret' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;
    req.userId = decoded.userId; // ✅ attaches userId to the request
    next(); // ✅ move to next middleware or controller
  } catch (error) {
    res.status(401).json({ message: 'Token verification failed' });
    return;
  }
};
// export function isAdmin(req: Request, res: Response, next: NextFunction) {
//   if (!req.user || req.user.role !== 'admin') {
//     req.flash('error', 'Unauthorized access');
//     return res.redirect('/');
//   }
//   next();
// }
