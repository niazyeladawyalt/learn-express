import { NextFunction, Request, Response } from 'express';

// const notFoundff = (req, res, next) => {
//   res.status(404).render('404', {
//     pageTitle: 'Page Not Found',
//     path: '',
//   });
// };

const get500 = (req: Request, res: Response, next: NextFunction) => {
  res.status(500).render('500', {
    pageTitle: 'Error !',
    path: '/500',
  });
};
export { get500 };
