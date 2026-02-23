import { Header } from '@/components/Header';
import { ArrowLeft, AlertCircle, Ruler, Scissors } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const iconMap = [Ruler, Ruler, Scissors, AlertCircle, Ruler, Scissors, AlertCircle];

export default function Adjustments() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const adjustments = Array.from({ length: 7 }, (_, i) => ({
    title: t(`adj.${i + 1}.title`),
    icon: iconMap[i],
    problem: t(`adj.${i + 1}.problem`),
    solution: t(`adj.${i + 1}.solution`),
    tip: t(`adj.${i + 1}.tip`),
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-6 text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          {t('adj.back')}
        </Button>

        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
          {t('adj.title')}
        </h1>
        <p className="text-muted-foreground mb-8">
          {t('adj.subtitle')}
        </p>

        <div className="space-y-6">
          {adjustments.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="border border-border rounded-lg p-5 bg-card"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="mt-0.5 text-primary">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-lg font-semibold text-foreground">
                    {item.title}
                  </h2>
                </div>
                <div className="ml-8 space-y-2 text-sm">
                  <p>
                    <span className="font-medium text-foreground">{t('adj.problem')} </span>
                    <span className="text-muted-foreground">{item.problem}</span>
                  </p>
                  <p>
                    <span className="font-medium text-foreground">{t('adj.solution')} </span>
                    <span className="text-muted-foreground">{item.solution}</span>
                  </p>
                  <p className="text-xs text-muted-foreground/80 italic border-l-2 border-primary/30 pl-3 mt-2">
                    💡 {item.tip}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
