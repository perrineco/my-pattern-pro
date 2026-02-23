import { Header } from '@/components/Header';
import { ArrowLeft, Ruler, Scissors, AlertCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';

type PatternKey = 'bodice' | 'skirt' | 'pants' | 'sleeve';

interface AdjQuestion {
  titleKey: string;
  problemKey: string;
  solutionKey: string;
  tipKey: string;
  icon: typeof Ruler;
}

const adjustmentData: Record<PatternKey, AdjQuestion[]> = {
  bodice: [
    { titleKey: 'adj.b1', problemKey: 'adj.b1.problem', solutionKey: 'adj.b1.solution', tipKey: 'adj.b1.tip', icon: Ruler },
    { titleKey: 'adj.b2', problemKey: 'adj.b2.problem', solutionKey: 'adj.b2.solution', tipKey: 'adj.b2.tip', icon: Ruler },
    { titleKey: 'adj.b3', problemKey: 'adj.b3.problem', solutionKey: 'adj.b3.solution', tipKey: 'adj.b3.tip', icon: Scissors },
    { titleKey: 'adj.b4', problemKey: 'adj.b4.problem', solutionKey: 'adj.b4.solution', tipKey: 'adj.b4.tip', icon: AlertCircle },
    { titleKey: 'adj.b5', problemKey: 'adj.b5.problem', solutionKey: 'adj.b5.solution', tipKey: 'adj.b5.tip', icon: Ruler },
  ],
  skirt: [
    { titleKey: 'adj.s1', problemKey: 'adj.s1.problem', solutionKey: 'adj.s1.solution', tipKey: 'adj.s1.tip', icon: Scissors },
    { titleKey: 'adj.s2', problemKey: 'adj.s2.problem', solutionKey: 'adj.s2.solution', tipKey: 'adj.s2.tip', icon: Ruler },
    { titleKey: 'adj.s3', problemKey: 'adj.s3.problem', solutionKey: 'adj.s3.solution', tipKey: 'adj.s3.tip', icon: AlertCircle },
  ],
  pants: [
    { titleKey: 'adj.p1', problemKey: 'adj.p1.problem', solutionKey: 'adj.p1.solution', tipKey: 'adj.p1.tip', icon: AlertCircle },
    { titleKey: 'adj.p2', problemKey: 'adj.p2.problem', solutionKey: 'adj.p2.solution', tipKey: 'adj.p2.tip', icon: Ruler },
    { titleKey: 'adj.p3', problemKey: 'adj.p3.problem', solutionKey: 'adj.p3.solution', tipKey: 'adj.p3.tip', icon: Scissors },
  ],
  sleeve: [
    { titleKey: 'adj.sl1', problemKey: 'adj.sl1.problem', solutionKey: 'adj.sl1.solution', tipKey: 'adj.sl1.tip', icon: Ruler },
    { titleKey: 'adj.sl2', problemKey: 'adj.sl2.problem', solutionKey: 'adj.sl2.solution', tipKey: 'adj.sl2.tip', icon: Scissors },
  ],
};

const patternIcons: Record<PatternKey, string> = {
  bodice: '👗',
  skirt: '👘',
  pants: '👖',
  sleeve: '🧵',
};

export default function Adjustments() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedPattern, setSelectedPattern] = useState<PatternKey | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  const handleBack = () => {
    if (selectedQuestion !== null) {
      setSelectedQuestion(null);
    } else if (selectedPattern) {
      setSelectedPattern(null);
    } else {
      navigate(-1);
    }
  };

  const patterns: { key: PatternKey; labelKey: string }[] = [
    { key: 'bodice', labelKey: 'adj.cat.bodice' },
    { key: 'skirt', labelKey: 'adj.cat.skirt' },
    { key: 'pants', labelKey: 'adj.cat.pants' },
    { key: 'sleeve', labelKey: 'adj.cat.sleeve' },
  ];

  // Level 3: Answer
  if (selectedPattern && selectedQuestion !== null) {
    const q = adjustmentData[selectedPattern][selectedQuestion];
    const Icon = q.icon;
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-3xl mx-auto px-4 py-10">
          <Button variant="ghost" size="sm" onClick={handleBack} className="mb-6 text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t('adj.back')}
          </Button>

          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-start gap-3 mb-5">
              <div className="mt-0.5 text-primary"><Icon className="w-5 h-5" /></div>
              <h2 className="font-serif text-xl font-semibold text-foreground">{t(q.titleKey)}</h2>
            </div>
            <div className="ml-8 space-y-4 text-sm">
              <div>
                <span className="font-medium text-foreground">{t('adj.problem')} </span>
                <span className="text-muted-foreground">{t(q.problemKey)}</span>
              </div>
              <div>
                <span className="font-medium text-foreground">{t('adj.solution')} </span>
                <span className="text-muted-foreground">{t(q.solutionKey)}</span>
              </div>
              <p className="text-xs text-muted-foreground/80 italic border-l-2 border-primary/30 pl-3 mt-3">
                💡 {t(q.tipKey)}
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Level 2: Questions list
  if (selectedPattern) {
    const questions = adjustmentData[selectedPattern];
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-3xl mx-auto px-4 py-10">
          <Button variant="ghost" size="sm" onClick={handleBack} className="mb-6 text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t('adj.back')}
          </Button>

          <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
            {t(`adj.cat.${selectedPattern}`)}
          </h1>
          <p className="text-muted-foreground mb-8">{t('adj.selectQuestion')}</p>

          <div className="space-y-3">
            {questions.map((q, i) => (
              <button
                key={i}
                onClick={() => setSelectedQuestion(i)}
                className="w-full text-left border border-border rounded-lg p-4 bg-card hover:border-primary/50 hover:bg-primary/5 transition-colors group flex items-center justify-between gap-3"
              >
                <span className="font-medium text-foreground text-sm">{t(q.titleKey)}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Level 1: Pattern categories
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <Button variant="ghost" size="sm" onClick={handleBack} className="mb-6 text-muted-foreground">
          <ArrowLeft className="w-4 h-4 mr-1" />
          {t('adj.back')}
        </Button>

        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">{t('adj.title')}</h1>
        <p className="text-muted-foreground mb-8">{t('adj.subtitle')}</p>

        <div className="grid grid-cols-2 gap-4">
          {patterns.map(({ key, labelKey }) => (
            <button
              key={key}
              onClick={() => setSelectedPattern(key)}
              className="border border-border rounded-xl p-6 bg-card hover:border-primary/50 hover:bg-primary/5 transition-colors flex flex-col items-center gap-3 group"
            >
              <span className="text-4xl">{patternIcons[key]}</span>
              <span className="font-serif font-semibold text-foreground group-hover:text-primary transition-colors">
                {t(labelKey)}
              </span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
