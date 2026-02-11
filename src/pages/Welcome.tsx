import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Scissors, Ruler, Download, Users, Crown, Star, ArrowRight, CheckCircle2, MessageSquare } from 'lucide-react';

const features = [
  {
    icon: Ruler,
    title: 'Custom Measurements',
    description: 'Enter your exact body measurements and get pattern blocks tailored precisely to your shape.',
  },
  {
    icon: Scissors,
    title: 'Multiple Pattern Types',
    description: 'Skirts, bodices (dartless, with darts, knit), pants, and sleeves — all from one tool.',
  },
  {
    icon: Users,
    title: 'Women, Men & Kids',
    description: 'Category-specific drafting logic ensures accurate results for every body type.',
  },
  {
    icon: Download,
    title: 'PDF Export',
    description: 'Download print-ready pattern PDFs instantly. No waiting, no shipping.',
  },
];

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    features: ['Skirt pattern block', 'All categories', 'PDF export', 'Live preview'],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Basic',
    price: '$9',
    period: '/mo',
    features: ['All pattern types', 'Save measurement profiles', '10 patterns/month', 'Priority support'],
    cta: 'Start Basic',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/mo',
    features: ['Unlimited patterns', 'Unlimited profiles', 'All future pattern types', 'Early access to new features'],
    cta: 'Go Pro',
    highlighted: true,
  },
];

const testimonials = [
  {
    quote: "Finally, a pattern tool that understands real bodies. The fit is incredible compared to standard size charts.",
    author: "Marie L.",
    role: "Home Sewist",
  },
  {
    quote: "I use Sloper Studio for all my client fittings. The PDF export saves me hours of manual drafting.",
    author: "James K.",
    role: "Tailor",
  },
  {
    quote: "The kids category is a game-changer. My children's clothes actually fit now!",
    author: "Sofia R.",
    role: "Parent & Maker",
  },
];

export default function Welcome() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/app');
    } else {
      navigate('/auth');
    }
  };

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
              <h1 className="font-serif text-xl font-semibold text-foreground tracking-tight">
                Sloper Studio
              </h1>
              <p className="text-xs text-muted-foreground">Custom sewing patterns</p>
            </div>
          </button>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/pricing')}>
              Pricing
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/contact')}>
              Contact
            </Button>
            {user ? (
              <Button size="sm" onClick={() => navigate('/app')}>
                Open App
              </Button>
            ) : (
              <Button size="sm" onClick={() => navigate('/auth')}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 lg:py-28 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Star className="w-4 h-4" />
            Pattern drafting made personal
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            Sewing patterns built{' '}
            <span className="text-primary">to your body</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            Enter your measurements, choose your pattern type, and download a custom-fit sloper in seconds. 
            No more grading between sizes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="gap-2 text-base px-8" onClick={handleGetStarted}>
              Start Drafting
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg" className="gap-2 text-base px-8" onClick={() => navigate('/pricing')}>
              View Plans
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="font-serif text-3xl font-semibold text-foreground mb-3">
            Everything you need to draft
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Professional-grade pattern tools, accessible to everyone.
          </p>
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
            <h3 className="font-serif text-3xl font-semibold text-foreground mb-3">
              Simple, transparent pricing
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Start free with the skirt block. Upgrade when you need more.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`p-6 flex flex-col ${
                  plan.highlighted
                    ? 'border-primary shadow-lg ring-2 ring-primary/20'
                    : ''
                }`}
              >
                {plan.highlighted && (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-primary mb-3">
                    <Crown className="w-3.5 h-3.5" />
                    Most popular
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
                <Button
                  variant={plan.highlighted ? 'default' : 'outline'}
                  className="w-full"
                  onClick={() => navigate('/pricing')}
                >
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
          <h3 className="font-serif text-3xl font-semibold text-foreground mb-3">
            Loved by makers
          </h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {testimonials.map((t) => (
            <Card key={t.author} className="p-6">
              <p className="text-sm text-muted-foreground leading-relaxed italic mb-4">
                "{t.quote}"
              </p>
              <div>
                <p className="text-sm font-medium text-foreground">{t.author}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-2xl mx-auto p-10 bg-primary/5 border-primary/20">
          <h3 className="font-serif text-2xl font-semibold text-foreground mb-3">
            Ready to create your perfect fit?
          </h3>
          <p className="text-muted-foreground mb-6">
            Join thousands of sewists drafting custom patterns with Sloper Studio.
          </p>
          <Button size="lg" className="gap-2 text-base px-8" onClick={handleGetStarted}>
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>Sloper Studio — Create custom-fit sewing patterns</p>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/pricing')} className="hover:text-foreground transition-colors">
              Pricing
            </button>
            <button onClick={() => navigate('/contact')} className="hover:text-foreground transition-colors">
              Contact
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
