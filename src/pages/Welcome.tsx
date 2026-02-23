import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Scissors, Ruler, Download, Users, Crown, Star, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Welcome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();

  const handleGetStarted = () => {
    navigate(user ? '/app' : '/auth');
  };

  const features = [
    { icon: Ruler, title: t('welcome.feat.measurements'), description: t('welcome.feat.measurementsDesc') },
    { icon: Scissors, title: t('welcome.feat.patterns'), description: t('welcome.feat.patternsDesc') },
    { icon: Users, title: t('welcome.feat.categories'), description: t('welcome.feat.categoriesDesc') },
    { icon: Download, title: t('welcome.feat.pdf'), description: t('welcome.feat.pdfDesc') },
  ];

  const plans = [
    {
      name: t('welcome.plan.free'), price: '$0', period: '',
      features: [t('welcome.plan.feat.skirt'), t('welcome.plan.feat.allCategories'), t('welcome.plan.feat.pdfExport'), t('welcome.plan.feat.livePreview')],
      cta: t('welcome.plan.getStarted'), highlighted: false,
    },
    {
      name: t('welcome.plan.basic'), price: '$9', period: '/mo',
      features: [t('welcome.plan.feat.allPatterns'), t('welcome.plan.feat.saveProfiles'), t('welcome.plan.feat.tenPatterns'), t('welcome.plan.feat.prioritySupport')],
      cta: t('welcome.plan.startBasic'), highlighted: false,
    },
    {
      name: t('welcome.plan.pro'), price: '$19', period: '/mo',
      features: [t('welcome.plan.feat.unlimited'), t('welcome.plan.feat.unlimitedProfiles'), t('welcome.plan.feat.allFuture'), t('welcome.plan.feat.earlyAccess')],
      cta: t('welcome.plan.goPro'), highlighted: true,
    },
  ];

  const testimonials = [
    { quote: t('welcome.testimonial1'), author: t('welcome.testimonial1Author'), role: t('welcome.testimonial1Role') },
    { quote: t('welcome.testimonial2'), author: t('welcome.testimonial2Author'), role: t('welcome.testimonial2Role') },
    { quote: t('welcome.testimonial3'), author: t('welcome.testimonial3Author'), role: t('welcome.testimonial3Role') },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Scissors className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-semibold text-foreground tracking-tight">Sloper Studio</h1>
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

      {/* Pricing Preview */}
      <section className="bg-secondary/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="font-serif text-3xl font-semibold text-foreground mb-3">{t('welcome.pricingTitle')}</h3>
            <p className="text-muted-foreground max-w-md mx-auto">{t('welcome.pricingDesc')}</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <Card key={plan.name} className={`p-6 flex flex-col ${plan.highlighted ? 'border-primary shadow-lg ring-2 ring-primary/20' : ''}`}>
                {plan.highlighted && (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-primary mb-3">
                    <Crown className="w-3.5 h-3.5" />
                    {t('welcome.plan.mostPopular')}
                  </div>
                )}
                <h4 className="font-serif text-xl font-semibold text-foreground">{plan.name}</h4>
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
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="font-serif text-3xl font-semibold text-foreground mb-3">{t('welcome.testimonialsTitle')}</h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {testimonials.map((tst) => (
            <Card key={tst.author} className="p-6">
              <p className="text-sm text-muted-foreground leading-relaxed italic mb-4">"{tst.quote}"</p>
              <div>
                <p className="text-sm font-medium text-foreground">{tst.author}</p>
                <p className="text-xs text-muted-foreground">{tst.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

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

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>{t('welcome.footer')}</p>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/pricing')} className="hover:text-foreground transition-colors">{t('action.pricing')}</button>
            <button onClick={() => navigate('/contact')} className="hover:text-foreground transition-colors">{t('action.contact')}</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
