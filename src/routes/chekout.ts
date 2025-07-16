import express from 'express';
import { isAuth } from '../middleware/is-auth';
import { getCancel, getCheckout, getSuccess, postCheckoutSession } from '../controllers/checkout';
import { stripeWebhook } from '../controllers/webhook';

const router = express.Router();

router.get('/checkout', isAuth, getCheckout);
router.post('/create-checkout-session', postCheckoutSession);
router.get('/checkout/success', getSuccess);
router.get('/checkout/cancel', getCancel);

router.post('/webhook/stripe', express.raw({ type: 'application/json' }), stripeWebhook);

export default router;
