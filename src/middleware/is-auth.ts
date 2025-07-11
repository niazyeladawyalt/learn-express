import { NextFunction, Request, Response } from 'express';

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.session?.isLoggedIn) {
    return next();
  }
  return res.redirect('/login');
};
