// routes/webhook.ts
import express from 'express';
import { stripeWebhook } from '../controllers/webhook';

const router = express.Router();

// ✅ Only use raw body on this exact route
router.post('/webhook/stripe', express.raw({ type: 'application/json' }), stripeWebhook);

export default router;
