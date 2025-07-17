import express, { NextFunction, Request, Response } from 'express';
import feedRoutes from './routes/feeds';
import authRoutes from './routes/auth';

import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import multer, { FileFilterCallback } from 'multer';
import http from 'http'; // ✅ Needed for raw server

import { Server } from 'socket.io';
import { initSocket } from './socket';

dotenv.config();

const app = express();
const server = http.createServer(app); // ✅ Create raw HTTP server

const port = 5000;
const MONGODB_URI = process.env.MONGODB_URI as string;

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

app.use(bodyParser.json());

app.use(multer({ storage: filteStorage, fileFilter }).single('image'));

app.use('/images', express.static(path.join(process.cwd(), 'images')));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(feedRoutes);
app.use('/auth', authRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  const status = err.statusCode || 500;
  const message = err.message || 'Something went wrong';
  const errors = err.errors || null;

  res.status(status).json({ message, errors });
});

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    server.listen(port, () => {
      console.log(`🚀 Server is running at http://localhost:${port}`);
    });
    initSocket(server);
  })
  .catch((err) => console.error('MongoDB connection failed:', err));
