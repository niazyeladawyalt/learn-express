import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import multer, { FileFilterCallback } from 'multer';

import adminRoutes from './routes/admin';
import shopRoutes from './routes/shop';
import cartRoutes from './routes/cart';
import ordersRoutes from './routes/orders';
import chekout from './routes/chekout';
import webhookRoutes from './routes/webhook'; // ✅ new file

import authRoutes from './routes/auth';
import User from './models/user';

import Tokens from 'csrf';
import flash from 'connect-flash';
import { toHttpError } from './util/errors';

// Load environment variablesd
dotenv.config();

// Constants
const app = express();
const port = 3000;
const MONGODB_URI = process.env.MONGODB_URI as string;
const SESSION_SECRET = process.env.SESSION_SECRET as string;

const filteStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    cb(null, `${timestamp}-${file.originalname}`);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/png'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Session store
const store = MongoStore.create({
  mongoUrl: MONGODB_URI,
  collectionName: 'sessions',
});

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('view cache', false);
app.use(webhookRoutes);

// Middleware
app.use(express.static('public'));
app.use('/images', express.static('images'));
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(multer({ storage: filteStorage, fileFilter }).single('image'));

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
  }),
);
app.use(flash());

const tokens = new Tokens();

app.use((req, res, next) => {
  // If there's no secret in session, generate one
  if (!req.session.csrfSecret) {
    req.session.csrfSecret = tokens.secretSync();
  }

  // Generate a token for this request and pass to views
  const token = tokens.create(req.session.csrfSecret);
  res.locals.csrfToken = token;
  res.locals.errorMessages = [];
  next();
});

app.use(async (req, res, next) => {
  try {
    res.locals.isLoggedIn = req.session?.isLoggedIn || false;
    if (!req.session.user) {
      return next();
    }
    const user = await User.findById(req.session.user._id);
    if (user) {
      req.user = user;
    }
    next();
  } catch (err) {
    return next(toHttpError(err));
  }
});

// Routes
app.use('/admin', adminRoutes);

app.use(shopRoutes);
app.use(cartRoutes);
app.use(ordersRoutes);
app.use(chekout);

app.use(authRoutes);

// app.get('/500', get500);

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found' });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong.';

  res.status(statusCode).render('500', {
    pageTitle: 'Server Error',
    path: '/500',
    errorMessage: message,
  });
});

// Database connection & server startup
mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    app.listen(port, () => {
      console.log(`🚀 Server is running at http://localhost:${port}`);
    });
  })
  .catch((err) => console.error('MongoDB connection failed:', err));
