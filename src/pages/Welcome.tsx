import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { STRIPE_CONFIG } from '@/lib/stripe-config';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Scissors, Ruler, Download, Users, Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import { LegalFooter } from '@/components/LegalFooter';

export default function Welcome() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const { symbol, currency } = useCurrency();

  if (!loading && user) return <Navigate to="/app" replace />;

  const handleGetStarted = () => {
    navigate(user ? '/app' : '/auth');
  };

  const fmt = (price: number) => currency === 'USD' || currency === 'CAD'
    ? `${symbol}${price.toFixed(2)}`
    : `${price.toFixed(2)}${symbol}`;

  const features = [
    { icon: Ruler, title: t('welcome.feat.measurements'), description: t('welcome.feat.measurementsDesc') },
    { icon: Scissors, title: t('welcome.feat.patterns'), description: t('welcome.feat.patternsDesc') },
    { icon: Users, title: t('welcome.feat.categories'), description: t('welcome.feat.categoriesDesc') },
    { icon: Download, title: t('welcome.feat.pdf'), description: t('welcome.feat.pdfDesc') },
  ];

  const plans = [
    {
      name: t('welcome.plan.free'), desc: t('welcome.plan.freeDesc'), price: fmt(0), period: '',
      features: [t('welcome.plan.feat.skirt'), t('welcome.plan.feat.pdfExport'), t('welcome.plan.feat.livePreview')],
      cta: t('welcome.plan.getStarted'), highlighted: false,
      note: 'Ou achetez un patron individuel à 4,99 € depuis l\'application.',
    },
    {
      name: t('welcome.plan.basic'), desc: t('welcome.plan.basicDesc'), price: fmt(STRIPE_CONFIG.subscriptions.basic.price), period: '/mo',
      features: [t('welcome.plan.feat.tenPatterns'), t('welcome.plan.feat.allPatterns'), t('welcome.plan.feat.saveProfiles'), t('welcome.plan.feat.pdfExport'), t('welcome.plan.feat.adjustmentGuide')],
      cta: t('welcome.plan.startBasic'), highlighted: false,
    },
    {
      name: t('welcome.plan.pro'), desc: t('welcome.plan.proDesc'), price: fmt(STRIPE_CONFIG.subscriptions.pro.price), period: '/mo',
      features: [t('welcome.plan.feat.unlimited'), t('welcome.plan.feat.allPatterns'), t('welcome.plan.feat.unlimitedProfiles'), t('welcome.plan.feat.pdfExport'), t('welcome.plan.feat.adjustmentGuide'), t('welcome.plan.feat.earlyAccess'), t('welcome.plan.feat.prioritySupport')],
      cta: t('welcome.plan.goPro'), highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-3">
            <img src="/logo-petitcitron.gif" alt="Petit Citron" className="h-10 w-auto" />
            <div>
              <h1 className="font-serif text-xl font-semibold text-foreground tracking-tight">Petit Citron Studio</h1>
              <p className="text-xs text-muted-foreground">{t('misc.createPatterns')}</p>
            </div>
          </button>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/pricing')}>{t('action.pricing')}</Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/contact')}>{t('action.contact')}</Button>
            {user ? (
              <Button size="sm" onClick={() => navigate('/app')}>{t('welcome.openApp')}</Button>
            ) : (
              <Button size="sm" onClick={() => navigate('/auth')}>{t('action.signIn')}</Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 lg:py-28 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Star className="w-4 h-4" />
            {t('welcome.badge')}
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            {t('welcome.heroTitle1')}{' '}
            <span className="text-primary">{t('welcome.heroTitle2')}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            {t('welcome.heroDesc')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="gap-2 text-base px-8" onClick={handleGetStarted}>
              {t('welcome.startDrafting')}
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg" className="gap-2 text-base px-8" onClick={() => navigate('/pricing')}>
              {t('welcome.viewPlans')}
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="font-serif text-3xl font-semibold text-foreground mb-3">{t('welcome.featuresTitle')}</h3>
          <p className="text-muted-foreground max-w-md mx-auto">{t('welcome.featuresDesc')}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {features.map((f) => (
            <Card key={f.title} className="p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-serif text-lg font-semibold text-foreground mb-2">{f.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Demo preview */}
      <section className="bg-secondary/30 py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <h3 className="font-serif text-3xl font-semibold text-foreground mb-3">Ce que vous obtenez</h3>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Un patron de base précis, annoté, prêt à imprimer, généré en quelques secondes à partir de vos mesures.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <img
              src="/demo-skirt-pattern.png"
              alt="Aperçu du patron jupe"
              className="w-full max-w-2xl rounded-xl border border-border shadow-lg"
            />
            <p className="text-xs text-muted-foreground text-center italic">
              Aperçu du patron jupe de base — devant et dos, avec annotations des mesures clés
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10">
            {[
              'Prêt à imprimer en A4',
              'Droit-fil et repères d\'assemblage inclus',
              'Téléchargement instantané en PDF',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="bg-secondary/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="font-serif text-3xl font-semibold text-foreground mb-3">{t('welcome.pricingTitle')}</h3>
            <p className="text-muted-foreground max-w-md mx-auto">{t('welcome.pricingDesc')}</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <Card key={plan.name} className="p-6 flex flex-col">
                <h4 className="font-serif text-xl font-semibold text-foreground">{plan.name}</h4>
                {'desc' in plan && <p className="text-sm text-muted-foreground mt-0.5 mb-1">{plan.desc}</p>}
                <div className="mt-2 mb-4">
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-2 flex-1 mb-6">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Button variant={plan.highlighted ? 'default' : 'outline'} className="w-full" onClick={() => navigate('/pricing')}>
                  {plan.cta}
                </Button>
                {'note' in plan && plan.note && (
                  <p className="text-xs text-muted-foreground text-center mt-3 leading-snug">{plan.note}</p>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials — hidden until real users available */}

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-2xl mx-auto p-10 bg-primary/5 border-primary/20">
          <h3 className="font-serif text-2xl font-semibold text-foreground mb-3">{t('welcome.ctaTitle')}</h3>
          <p className="text-muted-foreground mb-6">{t('welcome.ctaDesc')}</p>
          <Button size="lg" className="gap-2 text-base px-8" onClick={handleGetStarted}>
            {t('welcome.ctaButton')}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Card>
      </section>

      <LegalFooter />
    </div>
  );
}
