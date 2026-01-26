// Stripe product and price configuration
export const STRIPE_CONFIG = {
  subscriptions: {
    basic: {
      productId: 'prod_TpeFl682qnh9TF',
      priceId: 'price_1SryxMClhPrD5Rw6ooyZVYOr',
      name: 'Basic',
      price: 9.99,
      patternsPerMonth: 5,
    },
    pro: {
      productId: 'prod_TpfU3WzHxyWx4X',
      priceId: 'price_1Ss09OClhPrD5Rw68WIwGySA',
      name: 'Pro',
      price: 19.99,
      patternsPerMonth: Infinity,
    },
  },
  singlePurchase: {
    productId: 'prod_TpfV8oPBpaUZD2',
    priceId: 'price_1Ss0AiClhPrD5Rw61q8IMbvp',
    price: 4.99,
  },
} as const;

export type SubscriptionTier = 'none' | 'basic' | 'pro';

// Test accounts that bypass payment for development/testing
export const TEST_PRO_EMAILS: string[] = [
  'perrine+sloper@petitcitron.com',
];

export function getSubscriptionTierFromProductId(productId: string | null): SubscriptionTier {
  if (!productId) return 'none';
  if (productId === STRIPE_CONFIG.subscriptions.basic.productId) return 'basic';
  if (productId === STRIPE_CONFIG.subscriptions.pro.productId) return 'pro';
  return 'none';
}

export function isTestProAccount(email: string | undefined | null): boolean {
  if (!email) return false;
  const normalizedEmail = email.toLowerCase().trim();
  const isTest = TEST_PRO_EMAILS.some(testEmail => 
    testEmail.toLowerCase().trim() === normalizedEmail
  );
  console.log('isTestProAccount check:', { email, normalizedEmail, isTest, testEmails: TEST_PRO_EMAILS });
  return isTest;
}

export function getPatternsLimit(tier: SubscriptionTier): number {
  switch (tier) {
    case 'basic':
      return STRIPE_CONFIG.subscriptions.basic.patternsPerMonth;
    case 'pro':
      return STRIPE_CONFIG.subscriptions.pro.patternsPerMonth;
    default:
      return 0;
  }
}
