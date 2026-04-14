import Stripe from 'stripe';
import * as db from './db';
import * as stripeService from './stripe';

const stripe = new Stripe(process.env.STRIPE_RESTRICTED_KEY || '');

/**
 * Handle Stripe webhook events
 * This is called when Stripe sends events to your webhook endpoint
 */
export async function handleStripeWebhook(event: Stripe.Event) {
  switch (event.type) {
    case 'customer.subscription.created':
      return handleSubscriptionCreated(event.data.object as Stripe.Subscription);

    case 'customer.subscription.updated':
      return handleSubscriptionUpdated(event.data.object as Stripe.Subscription);

    case 'customer.subscription.deleted':
      return handleSubscriptionDeleted(event.data.object as Stripe.Subscription);

    case 'invoice.payment_succeeded':
      return handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);

    case 'invoice.payment_failed':
      return handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

/**
 * Handle subscription created event
 */
async function handleSubscriptionCreated(subscription: any) {
  console.log('Subscription created:', subscription.id);

  const customerId = subscription.customer as string;
  const customer = await stripe.customers.retrieve(customerId);
  const cust = customer as any;
  const userId = parseInt((cust.metadata?.userId as string) || '0');

  if (!userId) {
    console.error('No userId found in customer metadata');
    return;
  }

  const trialStart = subscription.trial_start ? new Date(subscription.trial_start * 1000) : undefined;
  const trialEnd = subscription.trial_end ? new Date(subscription.trial_end * 1000) : undefined;

  await db.createSubscription({
    userId,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscription.id,
    status: (subscription.status as any) || 'trialing',
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    trialEnd,
  });
}

/**
 * Handle subscription updated event
 */
async function handleSubscriptionUpdated(subscription: any) {
  console.log('Subscription updated:', subscription.id);

  const trialStart = subscription.trial_start ? new Date(subscription.trial_start * 1000) : undefined;
  const trialEnd = subscription.trial_end ? new Date(subscription.trial_end * 1000) : undefined;

  await db.updateSubscriptionByStripeId(subscription.id, {
    status: (subscription.status as any) || 'active',
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    trialEnd,
  });
}

/**
 * Handle subscription deleted event
 */
async function handleSubscriptionDeleted(subscription: any) {
  console.log('Subscription deleted:', subscription.id);

  await db.updateSubscriptionByStripeId(subscription.id, {
    status: 'canceled',
  });
}

/**
 * Handle invoice payment succeeded
 */
async function handleInvoicePaymentSucceeded(invoice: any) {
  console.log('Invoice payment succeeded:', invoice.id);

  const subscriptionId = invoice.subscription as string | null;
  if (subscriptionId) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const sub = subscription as any;

    await db.updateSubscriptionByStripeId(subscriptionId, {
      status: (sub.status as any) || 'active',
      currentPeriodStart: new Date(sub.current_period_start * 1000),
      currentPeriodEnd: new Date(sub.current_period_end * 1000),
    });
  }
}

/**
 * Handle invoice payment failed
 */
async function handleInvoicePaymentFailed(invoice: any) {
  console.log('Invoice payment failed:', invoice.id);

  const subscriptionId = invoice.subscription as string | null;
  if (subscriptionId) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const sub = subscription as any;

    await db.updateSubscriptionByStripeId(subscriptionId, {
      status: (sub.status as any) || 'past_due',
    });
  }
}
