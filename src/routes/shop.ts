import express from 'express';
import shopController from '../controllers/shop';


const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/product/:id', shopController.getProductDetails);

router.get('/cart', shopController.getCart);
router.get('/orders', shopController.getOrders);
router.get('/checkout', shopController.getCheckout);

export default router;
