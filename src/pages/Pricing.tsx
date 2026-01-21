import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { STRIPE_CONFIG, getPatternsLimit } from '@/lib/stripe-config';
import { Scissors, Check, Crown, Sparkles, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function Pricing() {
  const { user, session, subscription } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string, tierName: string) => {
    if (!user) {
      toast.error('Please sign in to subscribe');
      navigate('/auth');
      return;
    }

    setLoading(tierName);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId, mode: 'subscription' },
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error('Failed to start checkout');
    } finally {
      setLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    if (!session) return;

    setLoading('manage');
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      console.error('Portal error:', err);
      toast.error('Failed to open subscription management');
    } finally {
      setLoading(null);
    }
  };

  const patternsLimit = getPatternsLimit(subscription.tier);
  const isBasic = subscription.tier === 'basic';
  const isPro = subscription.tier === 'pro';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/')} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Scissors className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-serif text-xl font-semibold text-foreground tracking-tight">
                  Sloper Studio
                </h1>
              </div>
            </button>
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to App
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create professional sewing patterns with our sloper generator. Choose a subscription
            or purchase individual patterns.
          </p>
        </div>

        {/* Current Plan Banner */}
        {subscription.tier !== 'none' && (
          <div className="mb-8 p-4 bg-primary/10 border border-primary/20 rounded-lg text-center">
            <p className="text-sm font-medium text-foreground">
              You're currently on the <span className="text-primary capitalize">{subscription.tier}</span> plan
              {subscription.tier === 'basic' && (
                <span className="text-muted-foreground">
                  {' '}• {subscription.patternsUsedThisMonth}/{patternsLimit} patterns used this month
                </span>
              )}
            </p>
            <Button
              variant="link"
              onClick={handleManageSubscription}
              disabled={loading === 'manage'}
              className="mt-1"
            >
              Manage Subscription
            </Button>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Single Purchase */}
          <Card className="p-6 relative">
            <div className="mb-6">
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                <ShoppingCart className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-1">Single Pattern</h3>
              <p className="text-sm text-muted-foreground">One-time purchase</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold">${STRIPE_CONFIG.singlePurchase.price}</span>
              <span className="text-muted-foreground">/pattern</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>Access to one pattern type</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>Lifetime access</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>PDF export included</span>
              </li>
            </ul>
            <p className="text-xs text-muted-foreground text-center">
              Purchase individual patterns from the app
            </p>
          </Card>

          {/* Basic */}
          <Card className={cn("p-6 relative", isBasic && "ring-2 ring-primary")}>
            {isBasic && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                Current Plan
              </div>
            )}
            <div className="mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-1">Basic</h3>
              <p className="text-sm text-muted-foreground">For hobbyists</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold">${STRIPE_CONFIG.subscriptions.basic.price}</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>5 patterns per month</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>All pattern types</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>Save measurements</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>PDF export</span>
              </li>
            </ul>
            <Button
              className="w-full"
              variant={isBasic ? "outline" : "default"}
              disabled={isBasic || loading === 'basic'}
              onClick={() => handleSubscribe(STRIPE_CONFIG.subscriptions.basic.priceId, 'basic')}
            >
              {isBasic ? 'Current Plan' : loading === 'basic' ? 'Loading...' : 'Subscribe'}
            </Button>
          </Card>

          {/* Pro */}
          <Card className={cn("p-6 relative border-primary", isPro && "ring-2 ring-primary")}>
            {isPro ? (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                Current Plan
              </div>
            ) : (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                Most Popular
              </div>
            )}
            <div className="mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-4">
                <Crown className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-1">Pro</h3>
              <p className="text-sm text-muted-foreground">For professionals</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold">${STRIPE_CONFIG.subscriptions.pro.price}</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span className="font-medium">Unlimited patterns</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>All pattern types</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>Save unlimited measurements</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>Priority support</span>
              </li>
            </ul>
            <Button
              className="w-full"
              variant={isPro ? "outline" : "default"}
              disabled={isPro || loading === 'pro'}
              onClick={() => handleSubscribe(STRIPE_CONFIG.subscriptions.pro.priceId, 'pro')}
            >
              {isPro ? 'Current Plan' : loading === 'pro' ? 'Loading...' : 'Subscribe'}
            </Button>
          </Card>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="font-serif text-2xl font-semibold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">What patterns are included?</h3>
              <p className="text-sm text-muted-foreground">
                Currently we offer skirt slopers, with bodice, dress, pants, and sleeve patterns
                coming soon. All subscribers get access to new patterns as they're released.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Can I cancel anytime?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! You can cancel your subscription at any time. You'll continue to have
                access until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Do single purchases expire?</h3>
              <p className="text-sm text-muted-foreground">
                No, single pattern purchases give you lifetime access to that pattern type.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
