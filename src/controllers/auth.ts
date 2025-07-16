// controllers/products.ts
import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { validationResult } from 'express-validator';
import { toHttpError } from '../util/errors';

const getLogin = async (req: Request, res: Response, next: NextFunction) => {
  const flashErrors = req.flash('error');
  const errorMessage = flashErrors.length > 0 ? flashErrors[0] : null;
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    errorMessage,
  });
};
const postLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        errorMessages: errors.array(),
        oldInputs: { email, password },
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      req.flash('error', 'Wrong Credentials');

      return res.redirect('/login');
    }

    const isCorrect = await bcrypt.compare(password, user.password);

    if (!isCorrect) {
      return res.redirect('/login');
    }

    req.session.isLoggedIn = true;
    req.session.user = user;

    req.session.save((err) => {
      if (err) {
        return next(err); // pass session save errors to error handler
      }

      return res.redirect('/');
    });
  } catch (err) {
    return next(toHttpError(err));
  }
};
const postLogout = async (req: Request, res: Response, next: NextFunction) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

const getSignup = async (req: Request, res: Response, next: NextFunction) => {
  res.render('auth/signup', {
    pageTitle: 'Signup',
    path: '/signup',
  });
};

const postSignup = async (req: Request, res: Response, next: NextFunction) => {
  // console.log('first', req.body);
  const { name, email, password, confirmPassword } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      pageTitle: 'Signup',
      path: '/signup',
      errorMessages: errors.array(),
      oldInputs: { name, email, password, confirmPassword },
    });
  }
  try {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userCreated = await new User({
      name,
      email,
      password: hashedPassword,
      cart: { items: [] },
    }).save();

    if (userCreated) {
      return res.redirect('/login');
    }
  } catch (err) {
    return next(toHttpError(err));
  }
};
const getResetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const flashErrors = req.flash('error');
  const errorMessage = flashErrors.length > 0 ? flashErrors[0] : null;
  res.render('auth/reset-password', {
    pageTitle: 'Password',
    path: '/reset-password',
    errorMessage,
  });
};

const postResetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const TOKEN_EXPIRATION_MS = 60 * 60 * 1000; // 1 hour

  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      req.flash('error', 'Wrong Email');

      return res.redirect('/reset-password');
    }

    // ✅ Generate a secure raw token
    const rawToken = crypto.randomBytes(32).toString('hex'); // 64-character hex string

    // ✅ Store only the hashed version in the DB (safer if DB is leaked)
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    console.log('rawToken', rawToken);
    foundUser.resetToken = hashedToken;
    foundUser.resetTokenExp = new Date(Date.now() + TOKEN_EXPIRATION_MS);

    const isDone = await foundUser.save();

    if (isDone) {
      res.redirect(`/reset-password/${rawToken}`);
    }
  } catch (err) {
    return next(toHttpError(err));
  }
};
const getNewPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const flashErrors = req.flash('error');
    const errorMessage = flashErrors.length > 0 ? flashErrors[0] : null;

    const { token } = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const foundUser = await User.findOne({
      resetToken: hashedToken,
      resetTokenExp: { $gt: Date.now() },
    });

    if (!foundUser) {
      req.flash('error', 'Invalid or expired token');
      return res.redirect('/reset-password');
    }

    res.render('auth/new-password', {
      pageTitle: 'New Password',
      path: '/new-password',
      errorMessage,
      userId: foundUser._id.toString(),
      passwordToken: token,
    });
  } catch (err) {
    return next(toHttpError(err));
  }
};

const postNewPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { password, passwordToken, userId } = req.body;

  if (!passwordToken || !userId || !password) {
    req.flash('error', 'Invalid or missing form data.');
    return res.redirect('/reset-password');
  }

  try {
    const hashedToken = crypto.createHash('sha256').update(passwordToken).digest('hex');

    const foundUser = await User.findOne({
      resetToken: hashedToken,
      _id: userId,
      resetTokenExp: { $gt: Date.now() },
    });

    if (!foundUser) {
      req.flash('error', 'Token expired or invalid');
      return res.redirect('/reset-password');
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    foundUser.password = hashedPassword;
    foundUser.resetToken = null;
    foundUser.resetTokenExp = undefined;

    await foundUser.save();
    res.redirect('/login');
  } catch (err) {
    return next(toHttpError(err));
  }
};

export {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getResetPassword,
  postResetPassword,
  getNewPassword,
  postNewPassword,
};
