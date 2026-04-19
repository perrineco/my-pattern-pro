import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { STRIPE_CONFIG, getPatternsLimit } from '@/lib/stripe-config';
import { Header } from '@/components/Header';
import { Check, Crown, Sparkles, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { cn } from '@/lib/utils';

export default function Pricing() {
  const { user, session, subscription } = useAuth();
  const { symbol } = useCurrency();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string, tierName: string) => {
    if (!user) {
      toast.error(t('action.signIn'));
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
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-4">
            {t('pricing.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </div>

        {/* Current Plan Banner */}
        {subscription.tier !== 'none' && (
          <div className="mb-8 p-4 bg-primary/10 border border-primary/20 rounded-lg text-center">
            <p className="text-sm font-medium text-foreground">
              {t('pricing.youreOn')} <span className="text-primary capitalize">{subscription.tier}</span> {t('pricing.plan')}
              {subscription.tier === 'basic' && (
                <span className="text-muted-foreground">
                  {' '}• {subscription.patternsUsedThisMonth}/{patternsLimit} {t('pricing.patternsUsed')}
                </span>
              )}
            </p>
            <Button
              variant="link"
              onClick={handleManageSubscription}
              disabled={loading === 'manage'}
              className="mt-1"
            >
              {t('pricing.manageSubscription')}
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
              <h3 className="font-serif text-xl font-semibold mb-1">{t('pricing.single.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('pricing.single.desc')}</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold">{STRIPE_CONFIG.singlePurchase.price}{symbol}</span>
              <span className="text-muted-foreground">{t('pricing.perPattern')}</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>{t('pricing.single.f1')}</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>{t('pricing.single.f2')}</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>{t('pricing.single.f3')}</span>
              </li>
            </ul>
            <p className="text-xs text-muted-foreground text-center">
              {t('pricing.single.note')}
            </p>
          </Card>

          {/* Basic */}
          <Card className={cn("p-6 relative", isBasic && "ring-2 ring-primary")}>
            {isBasic && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                {t('pricing.currentPlan')}
              </div>
            )}
            <div className="mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-1">{t('pricing.basic.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('pricing.basic.desc')}</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold">{STRIPE_CONFIG.subscriptions.basic.price}{symbol}</span>
              <span className="text-muted-foreground">{t('pricing.perMonth')}</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>{t('pricing.basic.f1')}</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>{t('pricing.basic.f2')}</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>{t('pricing.basic.f3')}</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>{t('pricing.basic.f4')}</span>
              </li>
            </ul>
            <Button
              className="w-full"
              variant={isBasic ? "outline" : "default"}
              disabled={isBasic || loading === 'basic'}
              onClick={() => handleSubscribe(STRIPE_CONFIG.subscriptions.basic.priceId, 'basic')}
            >
              {isBasic ? t('pricing.currentPlan') : loading === 'basic' ? t('pricing.loading') : t('pricing.subscribe')}
            </Button>
          </Card>

          {/* Pro */}
          <Card className={cn("p-6 relative border-primary", isPro && "ring-2 ring-primary")}>
            {isPro ? (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                {t('pricing.currentPlan')}
              </div>
            ) : (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                {t('pricing.mostPopular')}
              </div>
            )}
            <div className="mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-4">
                <Crown className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-1">{t('pricing.pro.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('pricing.pro.desc')}</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold">{STRIPE_CONFIG.subscriptions.pro.price}{symbol}</span>
              <span className="text-muted-foreground">{t('pricing.perMonth')}</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span className="font-medium">{t('pricing.pro.f1')}</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>{t('pricing.pro.f2')}</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>{t('pricing.pro.f3')}</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>{t('pricing.pro.f4')}</span>
              </li>
            </ul>
            <Button
              className="w-full"
              variant={isPro ? "outline" : "default"}
              disabled={isPro || loading === 'pro'}
              onClick={() => handleSubscribe(STRIPE_CONFIG.subscriptions.pro.priceId, 'pro')}
            >
              {isPro ? t('pricing.currentPlan') : loading === 'pro' ? t('pricing.loading') : t('pricing.subscribe')}
            </Button>
          </Card>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="font-serif text-2xl font-semibold text-center mb-8">
            {t('pricing.faq.title')}
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">{t('pricing.faq.q1')}</h3>
              <p className="text-sm text-muted-foreground">{t('pricing.faq.a1')}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">{t('pricing.faq.q2')}</h3>
              <p className="text-sm text-muted-foreground">{t('pricing.faq.a2')}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">{t('pricing.faq.q3')}</h3>
              <p className="text-sm text-muted-foreground">{t('pricing.faq.a3')}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
