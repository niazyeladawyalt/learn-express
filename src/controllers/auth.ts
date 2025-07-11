// controllers/products.ts
import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import bcrypt from 'bcryptjs';

const getLogin = async (req: Request, res: Response, next: NextFunction) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
  });
};
const postLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
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
  } catch (error) {
    next(error); // handle unexpected errors
  }
};
const postLogout = async (req: Request, res: Response, next: NextFunction) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
  // const user = await User.findById('686f8048f35cb9f919291dbe');
  // if (user) {
  //   req.session.isLoggedIn = true;
  //   req.session.user = user;
  // }
  // res.redirect('/');
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
  const founduser = await User.findOne({ email });

  if (founduser) {
    return res.redirect('/signup');
  }
  if (password === confirmPassword) {
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
  }
};

export { getLogin, postLogin, postLogout, getSignup, postSignup };
