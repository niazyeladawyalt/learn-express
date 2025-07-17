import express, { NextFunction, Request, Response } from 'express';
import { login, signup } from '../controllers/auth';
import { signupValidation } from '../validators/authValidators';

const router = express.Router();

router.post('/signup', signupValidation, signup);
router.post('/login', login);

export default router;
