import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { validationError } from '../utils/error';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(validationError(errors.array()));
    }
    const { name, email, password } = req.body;

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userCreated = await new User({
      name,
      email,
      password: hashedPassword,
    }).save();
    if (userCreated) {
      res.status(201).json({
        message: 'User created successfully!',
        userId: userCreated._id.toString(),
      });
    }
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    console.log('asd', email, password);

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(422).json({ message: 'invalid login Data' });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!, // Your secret from .env
      { expiresIn: '1h' }, // Token expiration
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      userId: user._id,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export { signup, login };
