import express from 'express';
import { isAuth } from '../middleware/is-auth';
import { getCart, postCart, postDeleteCart, postUpdateCart } from '../controllers/cart';

const router = express.Router();

router.get('/cart', isAuth, getCart);
router.post('/cart', isAuth, postCart);

router.post('/cart-delete', isAuth, postDeleteCart);

router.post('/cart-update', isAuth, postUpdateCart);

export default router;
