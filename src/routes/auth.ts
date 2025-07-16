import express from 'express';
import {
  getLogin,
  getNewPassword,
  getResetPassword,
  getSignup,
  postLogin,
  postLogout,
  postNewPassword,
  postResetPassword,
  postSignup,
} from '../controllers/auth';
import { loginValidation, signupValidation } from '../validators/authValidators';

const router = express.Router();

router.get('/login', getLogin);
router.post('/login', loginValidation, postLogin);

router.post('/logout', postLogout);

router.get('/signup', getSignup);
router.post('/signup', signupValidation, postSignup);

router.get('/reset-password', getResetPassword);
router.post('/reset-password', postResetPassword);

router.get('/reset-password/:token', getNewPassword);
router.post('/new-password', postNewPassword);

export default router;
