// src/controllers/webhook.ts
import Stripe from 'stripe';
import { Request, Response } from 'express';
import Order from '../models/order';
import User from '../models/user';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const stripeWebhook = async (req: Request, res: Response): Promise<void> => {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body as Buffer,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    console.error(`❌ Webhook signature verification failed: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('✅ Payment confirmed for session:', session.id);

    const userId = session.metadata?.userId;
    if (!userId) {
      res.status(400).send('Missing userId in session metadata');
      return;
    }

    try {
      const user = await User.findById(userId).populate('cart.items.productId');
      if (!user) {
        res.status(404).send('User not found');
        return;
      }
      if (!user.cart) {
        res.status(400).send('User cart not found');
        return;
      }

      const order = new Order({
        items: user.cart.items,
        userId: user._id,
        stripeSessionId: session.id, // ✅ attach session ID
      });

      await order.save();
      await (user as any).clearCart();

      console.log('📦 Order created and cart cleared for user:', user.email);
    } catch (err) {
      console.error('❌ Failed to create order from webhook:', err);
      res.status(500).send('Internal error while creating order');
      return;
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const intent = event.data.object as Stripe.PaymentIntent;
    console.log('❌ Payment failed:', intent.last_payment_error?.message);
  }

  res.status(200).json({ received: true });
};
