import express from 'express';
import shopController from '../controllers/shop';
import { isAuth } from '../middleware/is-auth';

const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:id', shopController.getProductDetails);

router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete', isAuth, shopController.postDeleteCart);

router.post('/cart-update', isAuth, shopController.postUpdateCart);

router.get('/orders', isAuth, shopController.getOrders);
router.post('/create-order', isAuth, shopController.postOrder);

export default router;
