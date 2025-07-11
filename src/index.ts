import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import adminRoutes from './routes/admin';
import shopRoutes from './routes/shop';
import authRoutes from './routes/auth';
import User from './models/user';

// Load environment variables
dotenv.config();

// Constants
const app = express();
const port = 3000;
const MONGODB_URI = process.env.MONGODB_URI as string;
const SESSION_SECRET = process.env.SESSION_SECRET as string;

// Session store
const store = MongoStore.create({
  mongoUrl: MONGODB_URI,
  collectionName: 'sessions',
});

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('view cache', false);

// Middleware
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
  }),
);
app.use(async (req, res, next) => {
  res.locals.isLoggedIn = req.session?.isLoggedIn || false;
  if (!req.session.user) {
    return next();
  }
  const user = await User.findById(req.session.user._id);
  if (user) {
    req.user = user;
  }
  next();
});

// Attach dummy user to request
// app.use(async (req, res, next) => {
//   const user = await User.findById('686f8048f35cb9f919291dbe');
//   if (user) {
//     req.session.user = user;
//   }
//   next();
// });

// Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found' });
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
