import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_RESTRICTED_KEY || '');

/**
 * Create a checkout session for subscription
 * Includes 3-day free trial
 */
export async function createCheckoutSession(
  customerId: string,
  email: string,
  successUrl: string,
  cancelUrl: string
) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    subscription_data: {
      trial_period_days: 3, // 3-day free trial
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return session;
}

/**
 * Get or create a Stripe customer
 */
export async function getOrCreateCustomer(userId: number, email: string, name?: string) {
  // Search for existing customer by email
  const customers = await stripe.customers.list({
    email: email,
    limit: 1,
  });

  if (customers.data.length > 0) {
    return customers.data[0];
  }

  // Create new customer
  const customer = await stripe.customers.create({
    email: email,
    name: name || undefined,
    metadata: {
      userId: userId.toString(),
    },
  });

  return customer;
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionId: string) {
  return stripe.subscriptions.retrieve(subscriptionId);
}

/**
 * Check if subscription is active (including trial)
 */
export async function isSubscriptionActive(subscription: Stripe.Subscription): Promise<boolean> {
  return subscription.status === 'active' || subscription.status === 'trialing';
}

/**
 * Get subscription status for a customer
 */
export async function getCustomerSubscription(customerId: string) {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    limit: 1,
  });

  return subscriptions.data[0] || null;
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  return stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });
}

/**
 * Update subscription (e.g., change plan)
 */
export async function updateSubscription(subscriptionId: string, updates: any) {
  return stripe.subscriptions.update(subscriptionId, updates);
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(body: string, signature: string, secret: string) {
  try {
    return stripe.webhooks.constructEvent(body, signature, secret);
  } catch (error) {
    throw new Error(`Webhook signature verification failed: ${error}`);
  }
}
