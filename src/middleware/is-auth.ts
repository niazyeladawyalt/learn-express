import { NextFunction, Request, Response } from 'express';

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.session?.isLoggedIn) {
    return next();
  }
  return res.redirect('/login');
};
export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    req.flash('error', 'Unauthorized access');
    return res.redirect('/');
  }
  next();
}
