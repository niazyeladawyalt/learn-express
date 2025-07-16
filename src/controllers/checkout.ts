import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { toHttpError } from '../util/errors';
import dotenv from 'dotenv';
import Order from '../models/order';
import { format } from 'date-fns';

dotenv.config();
// ✅ Use env variable for security
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {});
// ✅ Your pre-created recurring price from Stripe
const SUBSCRIPTION_PRICE_ID = process.env.STRIPE_PRICE_ID; // Replace with your actual price ID

// GET /checkout
const getCheckout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await req.user.updateCartTotal();
    const cart = await req.user.populate('cart.items.productId');
    const cartData = cart.cart;

    res.render('shop/checkout', {
      pageTitle: 'Checkout',
      path: '/checkout',
      cart: cartData,
    });
  } catch (err) {
    next(toHttpError(err));
  }
};

// POST /create-checkout-session
const postCheckoutSession = async (req: Request, res: Response, next: NextFunction) => {
  console.log('🛒 Creating dynamic Stripe Checkout session...');

  try {
    // Ensure cart items are populated with product data
    const cart = await req.user.populate('cart.items.productId');
    const items = cart.cart.items;

    const line_items = items.map((item: any) => ({
      price_data: {
        currency: 'aed',
        unit_amount: Math.round(item.productId.price * 100), // Stripe expects cents
        product_data: {
          name: item.productId.title,
          description: item.productId.description || '', // optional
        },
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment', // ✅ one-time purchase
      line_items,
      success_url: `${req.protocol}://${req.get('host')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.protocol}://${req.get('host')}/checkout/cancel`,
      metadata: {
        userId: req.user._id.toString(),
      },
    });

    if (!session.url) {
      throw new Error('Stripe session URL is null');
    }

    res.redirect(303, session.url);
  } catch (err) {
    console.error('🔥 Stripe Checkout Error:', err);
    next(toHttpError(err));
  }
};

// GET /checkout/success
// const getSuccess = (req: Request, res: Response) => {
//   res.render('shop/checkout-success', {
//     pageTitle: 'Payment Successful',
//     path: '/checkout/success',
//   });
// };
const getSuccess = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const sessionId = req.query.session_id;
    if (!sessionId || typeof sessionId !== 'string') {
      res.status(400).send('Missing session ID');
      return;
    }

    const order = await Order.findOne({ stripeSessionId: sessionId }).populate('items.productId');
    if (!order) {
      res.status(404).send('Order not found');
      return;
    }

    const formattedOrder = {
      ...order,
      formattedDate: format(order.createdAt, 'd MMMM yyyy'),
    };

    console.log('Asd', order);

    res.render('shop/checkout-success', {
      pageTitle: 'Payment Successful',
      path: '/checkout/success',
      order: formattedOrder,
    });
  } catch (err) {
    next(err);
  }
};

// GET /checkout/cancel
const getCancel = (req: Request, res: Response) => {
  res.render('shop/checkout-cancel', {
    pageTitle: 'Payment Cancelled',
    path: '/checkout/cancel',
  });
};

export { getCheckout, postCheckoutSession, getSuccess, getCancel };
