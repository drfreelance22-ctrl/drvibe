import { describe, it, expect } from 'vitest';

describe('Stripe Configuration', () => {
  it('should have Stripe environment variables set', () => {
    expect(process.env.STRIPE_RESTRICTED_KEY).toBeDefined();
    expect(process.env.STRIPE_PUBLISHABLE_KEY).toBeDefined();
    expect(process.env.STRIPE_PRICE_ID).toBeDefined();
  });

  it('should have valid Stripe key formats', () => {
    const restrictedKey = process.env.STRIPE_RESTRICTED_KEY;
    const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
    const priceId = process.env.STRIPE_PRICE_ID;

    // Restricted key should start with rk_live_
    expect(restrictedKey).toMatch(/^rk_live_/);

    // Publishable key should start with pk_live_
    expect(publishableKey).toMatch(/^pk_live_/);

    // Price ID should start with price_
    expect(priceId).toMatch(/^price_/);
  });

  it('should have minimum key lengths', () => {
    const restrictedKey = process.env.STRIPE_RESTRICTED_KEY;
    const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
    const priceId = process.env.STRIPE_PRICE_ID;

    expect(restrictedKey?.length).toBeGreaterThan(20);
    expect(publishableKey?.length).toBeGreaterThan(20);
    expect(priceId?.length).toBeGreaterThan(6);
  });
});
