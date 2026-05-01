import express from 'express';
import Stripe from 'stripe';
import { authMiddleware } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create checkout session
router.post('/create-checkout-session', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    
    // Create or get Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user._id.toString(),
        },
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: 'price_pro_your_price_id', // Replace with your Stripe price ID
          quantity: 1,
        },
      ],
      success_url: `${process.env.APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/pricing`,
      metadata: {
        userId: user._id.toString(),
      },
    });
    
    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const userId = session.metadata.userId;
      const user = await User.findById(userId);
      
      if (user) {
        user.plan = 'pro';
        user.credits += 100;
        user.subscriptionId = session.subscription;
        await user.save();
      }
      break;
      
    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      const customerId = subscription.customer;
      const userToDowngrade = await User.findOne({ stripeCustomerId: customerId });
      
      if (userToDowngrade) {
        userToDowngrade.plan = 'free';
        userToDowngrade.subscriptionId = null;
        await userToDowngrade.save();
      }
      break;
  }
  
  res.json({ received: true });
});

// Get pricing plans
router.get('/pricing', async (req, res) => {
  try {
    const prices = await stripe.prices.list({
      active: true,
      expand: ['data.product'],
    });
    
    const plans = prices.data.map(price => ({
      id: price.id,
      name: price.product.name,
      amount: price.unit_amount,
      currency: price.currency,
      interval: price.recurring?.interval,
    }));
    
    res.json(plans);
  } catch (error) {
    console.error('Error fetching pricing:', error);
    res.status(500).json({ error: 'Failed to fetch pricing' });
  }
});

export default router;