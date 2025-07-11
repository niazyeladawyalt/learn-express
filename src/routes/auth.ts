import express from 'express';
import { getLogin, getSignup, postLogin, postLogout, postSignup } from '../controllers/auth';

const router = express.Router();

router.get('/login', getLogin);
router.post('/login', postLogin);

router.post('/logout', postLogout);

router.get('/signup', getSignup);
router.post('/signup', postSignup);

export default router;
