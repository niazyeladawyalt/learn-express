import express from 'express';
import { isAuth } from '../middleware/is-auth';
import { getInvoice, getOrders, postOrder } from '../controllers/orders';

const router = express.Router();

router.get('/orders', isAuth, getOrders);
router.post('/create-order', isAuth, postOrder);

router.get('/orders/:orderId', isAuth, getInvoice);

export default router;
