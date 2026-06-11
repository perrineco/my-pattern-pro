import { Header } from '@/components/Header';
import { LegalFooter } from '@/components/LegalFooter';
import { ArrowLeft, Ruler, Scissors, AlertCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';

type PatternKey = 'bodice' | 'skirt' | 'pants' | 'sleeve';

interface AdjContentBlock {
  textKey?: string;
  imageSrc?: string;
}

interface AdjSubItem {
  titleKey: string;
  problemKey: string;
  solutionKey: string;
  tipKey: string;
  icon: typeof Ruler;
  blocks?: AdjContentBlock[];
}

interface AdjQuestion {
  titleKey: string;
  problemKey: string;
  solutionKey: string;
  tipKey: string;
  icon: typeof Ruler;
  subItems?: AdjSubItem[];
  blocks?: AdjContentBlock[];
}

interface SubCategory {
  key: string;
  labelKey: string;
  emoji: string;
  questions: AdjQuestion[];
}

const bodiceSubCategories: SubCategory[] = [
  {
    key: 'neckline',
    labelKey: 'adj.bodice.sub.neckline',
    emoji: '👕',
    questions: [
      {
        titleKey: 'adj.bn1',
        problemKey: 'adj.bn1.problem',
        solutionKey: 'adj.bn1.solution',
        tipKey: 'adj.bn1.tip',
        icon: AlertCircle,
        subItems: [
          {
            titleKey: 'adj.bn1.sub1',
            problemKey: '',
            solutionKey: '',
            tipKey: 'adj.bn1.sub1.tip',
            icon: Ruler,
            blocks: [
              { textKey: 'adj.bn1.sub1.step1' },
              { imageSrc: '/adjustments/MO5100-1.png' },
              { textKey: 'adj.bn1.sub1.step2' },
              { imageSrc: '/adjustments/MO5100-2.png' },
              { textKey: 'adj.bn1.sub1.option1' },
              { imageSrc: '/adjustments/MO5100-3.png' },
              { textKey: 'adj.bn1.sub1.option2' },
              { imageSrc: '/adjustments/MO5100-4.png' },
            ],
          },
          {
            titleKey: 'adj.bn1.sub2',
            problemKey: '',
            solutionKey: '',
            tipKey: 'adj.bn1.sub2.note',
            icon: Ruler,
            blocks: [
              { textKey: 'adj.bn1.sub2.intro' },
              { imageSrc: '/adjustments/MO5100-5.png' },
              { textKey: 'adj.bn1.sub2.correction' },
              { imageSrc: '/adjustments/MO5100-6.png' },
              { textKey: 'adj.bn1.sub2.steps' },
            ],
          },
          {
            titleKey: 'adj.bn1.sub3',
            problemKey: '',
            solutionKey: '',
            tipKey: 'adj.bn1.sub3.note',
            icon: Ruler,
            blocks: [
              { textKey: 'adj.bn1.sub3.intro' },
              { imageSrc: '/adjustments/MO5100-7.png' },
              { textKey: 'adj.bn1.sub3.correction' },
              { imageSrc: '/adjustments/MO5100-8.png' },
              { textKey: 'adj.bn1.sub3.steps' },
            ],
          },
        ],
      },
      { titleKey: 'adj.bn2', problemKey: 'adj.bn2.problem', solutionKey: 'adj.bn2.solution', tipKey: 'adj.bn2.tip', icon: AlertCircle },
      {
        titleKey: 'adj.bn3', problemKey: '', solutionKey: '', tipKey: 'adj.bn3.note', icon: Ruler,
        blocks: [
          { textKey: 'adj.bn3.intro' },
          { textKey: 'adj.bn3.understand' },
          { textKey: 'adj.bn3.step1' },
          { imageSrc: '/adjustments/MO5100-14.png' },
          { textKey: 'adj.bn3.step2' },
          { imageSrc: '/adjustments/MO5100-15.png' },
          { textKey: 'adj.bn3.step3' },
          { imageSrc: '/adjustments/MO5100-17.png' },
          { textKey: 'adj.bn3.step3correct' },
          { imageSrc: '/adjustments/MO5100-18.png' },
          { textKey: 'adj.bn3.step4' },
          { textKey: 'adj.bn3.step5' },
          { textKey: 'adj.bn3.morphology' },
        ],
      },
      {
        titleKey: 'adj.bn4', problemKey: '', solutionKey: '', tipKey: 'adj.bn4.note', icon: Scissors,
        blocks: [
          { textKey: 'adj.bn4.intro' },
          { imageSrc: '/adjustments/MO5100-9.png' },
          { textKey: 'adj.bn4.understand' },
          { textKey: 'adj.bn4.step1' },
          { imageSrc: '/adjustments/MO5100-10.png' },
          { textKey: 'adj.bn4.step2' },
          { imageSrc: '/adjustments/MO5100-11.png' },
          { textKey: 'adj.bn4.step3intro' },
          { textKey: 'adj.bn4.optionA' },
          { imageSrc: '/adjustments/MO5100-12.png' },
          { textKey: 'adj.bn4.optionB' },
          { imageSrc: '/adjustments/MO5100-13.png' },
        ],
      },
    ],
  },
  {
    key: 'shoulder',
    labelKey: 'adj.bodice.sub.shoulder',
    emoji: '🪡',
    questions: [
      {
        titleKey: 'adj.bsh1', problemKey: '', solutionKey: '', tipKey: '', icon: Ruler,
        subItems: [
          {
            titleKey: 'adj.bsh1.sub1', problemKey: '', solutionKey: '', tipKey: 'adj.bsh1.sub1.note', icon: Ruler,
            blocks: [
              { textKey: 'adj.bsh1.sub1.intro' },
              { textKey: 'adj.bsh1.sub1.find' },
              { imageSrc: '/adjustments/MO5101-0.png' },
              { textKey: 'adj.bsh1.sub1.measure' },
              { imageSrc: '/adjustments/MO5101-1.png' },
            ],
          },
          {
            titleKey: 'adj.bsh1.sub2', problemKey: '', solutionKey: '', tipKey: 'adj.bsh1.sub2.note', icon: AlertCircle,
            blocks: [
              { textKey: 'adj.bsh1.sub2.problem' },
              { imageSrc: '/adjustments/MO5101-2.png' },
              { textKey: 'adj.bsh1.sub2.pin' },
              { textKey: 'adj.bsh1.sub2.option1' },
              { imageSrc: '/adjustments/MO5101-3.png' },
              { imageSrc: '/adjustments/MO5101-4.png' },
              { textKey: 'adj.bsh1.sub2.option2' },
              { imageSrc: '/adjustments/MO5101-5.png' },
              { imageSrc: '/adjustments/MO5101-6.png' },
            ],
          },
          {
            titleKey: 'adj.bsh1.sub3', problemKey: '', solutionKey: '', tipKey: 'adj.bsh1.sub3.note', icon: Scissors,
            blocks: [
              { textKey: 'adj.bsh1.sub3.problem' },
              { textKey: 'adj.bsh1.sub3.cut' },
              { imageSrc: '/adjustments/MO5101-7.png' },
              { textKey: 'adj.bsh1.sub3.option1' },
              { imageSrc: '/adjustments/MO5101-8.png' },
              { imageSrc: '/adjustments/MO5101-9.png' },
              { textKey: 'adj.bsh1.sub3.option2' },
              { imageSrc: '/adjustments/MO5101-10.png' },
              { imageSrc: '/adjustments/MO5101-11.png' },
              { textKey: 'adj.bsh1.sub3.morphology' },
            ],
          },
        ],
      },
      { titleKey: 'adj.bsh2', problemKey: 'adj.bsh2.problem', solutionKey: 'adj.bsh2.solution', tipKey: 'adj.bsh2.tip', icon: Ruler },
{ titleKey: 'adj.bsh4', problemKey: 'adj.bsh4.problem', solutionKey: 'adj.bsh4.solution', tipKey: 'adj.bsh4.tip', icon: Scissors },
    ],
  },
  {
    key: 'acrossFrontBack',
    labelKey: 'adj.bodice.sub.acrossFrontBack',
    emoji: '📐',
    questions: [
      { titleKey: 'adj.bafb1', problemKey: 'adj.bafb1.problem', solutionKey: 'adj.bafb1.solution', tipKey: 'adj.bafb1.tip', icon: Ruler },
      { titleKey: 'adj.bafb2', problemKey: 'adj.bafb2.problem', solutionKey: 'adj.bafb2.solution', tipKey: 'adj.bafb2.tip', icon: AlertCircle },
      { titleKey: 'adj.bafb3', problemKey: 'adj.bafb3.problem', solutionKey: 'adj.bafb3.solution', tipKey: 'adj.bafb3.tip', icon: Ruler },
      { titleKey: 'adj.bafb4', problemKey: 'adj.bafb4.problem', solutionKey: 'adj.bafb4.solution', tipKey: 'adj.bafb4.tip', icon: Scissors },
    ],
  },
  {
    key: 'armholeRaglan',
    labelKey: 'adj.bodice.sub.armholeRaglan',
    emoji: '🔵',
    questions: [
      { titleKey: 'adj.bar1', problemKey: 'adj.bar1.problem', solutionKey: 'adj.bar1.solution', tipKey: 'adj.bar1.tip', icon: Ruler },
      { titleKey: 'adj.bar2', problemKey: 'adj.bar2.problem', solutionKey: 'adj.bar2.solution', tipKey: 'adj.bar2.tip', icon: AlertCircle },
      { titleKey: 'adj.bar3', problemKey: 'adj.bar3.problem', solutionKey: 'adj.bar3.solution', tipKey: 'adj.bar3.tip', icon: Scissors },
      { titleKey: 'adj.bar4', problemKey: 'adj.bar4.problem', solutionKey: 'adj.bar4.solution', tipKey: 'adj.bar4.tip', icon: AlertCircle },
    ],
  },
  {
    key: 'setInSleeve',
    labelKey: 'adj.bodice.sub.setInSleeve',
    emoji: '🧵',
    questions: [
      { titleKey: 'adj.bsl1', problemKey: 'adj.bsl1.problem', solutionKey: 'adj.bsl1.solution', tipKey: 'adj.bsl1.tip', icon: Scissors },
      { titleKey: 'adj.bsl2', problemKey: 'adj.bsl2.problem', solutionKey: 'adj.bsl2.solution', tipKey: 'adj.bsl2.tip', icon: Ruler },
      { titleKey: 'adj.bsl3', problemKey: 'adj.bsl3.problem', solutionKey: 'adj.bsl3.solution', tipKey: 'adj.bsl3.tip', icon: AlertCircle },
      { titleKey: 'adj.bsl4', problemKey: 'adj.bsl4.problem', solutionKey: 'adj.bsl4.solution', tipKey: 'adj.bsl4.tip', icon: Ruler },
    ],
  },
  {
    key: 'bust',
    labelKey: 'adj.bodice.sub.bust',
    emoji: '💛',
    questions: [
      { titleKey: 'adj.bbu1', problemKey: 'adj.bbu1.problem', solutionKey: 'adj.bbu1.solution', tipKey: 'adj.bbu1.tip', icon: Ruler },
      { titleKey: 'adj.bbu2', problemKey: 'adj.bbu2.problem', solutionKey: 'adj.bbu2.solution', tipKey: 'adj.bbu2.tip', icon: AlertCircle },
      { titleKey: 'adj.bbu3', problemKey: 'adj.bbu3.problem', solutionKey: 'adj.bbu3.solution', tipKey: 'adj.bbu3.tip', icon: Scissors },
      { titleKey: 'adj.bbu4', problemKey: 'adj.bbu4.problem', solutionKey: 'adj.bbu4.solution', tipKey: 'adj.bbu4.tip', icon: Ruler },
    ],
  },
  {
    key: 'backDraglines',
    labelKey: 'adj.bodice.sub.backDraglines',
    emoji: '📏',
    questions: [
      { titleKey: 'adj.bbdh1', problemKey: 'adj.bbdh1.problem', solutionKey: 'adj.bbdh1.solution', tipKey: 'adj.bbdh1.tip', icon: Ruler },
      { titleKey: 'adj.bbdh2', problemKey: 'adj.bbdh2.problem', solutionKey: 'adj.bbdh2.solution', tipKey: 'adj.bbdh2.tip', icon: AlertCircle },
      { titleKey: 'adj.bbdh3', problemKey: 'adj.bbdh3.problem', solutionKey: 'adj.bbdh3.solution', tipKey: 'adj.bbdh3.tip', icon: Scissors },
      { titleKey: 'adj.bbdh4', problemKey: 'adj.bbdh4.problem', solutionKey: 'adj.bbdh4.solution', tipKey: 'adj.bbdh4.tip', icon: AlertCircle },
    ],
  },
];

const pantsSubCategories: SubCategory[] = [
  {
    key: 'balance',
    labelKey: 'adj.pants.sub.balance',
    emoji: '⚖️',
    questions: [
      { titleKey: 'adj.pb1', problemKey: 'adj.pb1.problem', solutionKey: 'adj.pb1.solution', tipKey: 'adj.pb1.tip', icon: Ruler },
      { titleKey: 'adj.pb2', problemKey: 'adj.pb2.problem', solutionKey: 'adj.pb2.solution', tipKey: 'adj.pb2.tip', icon: Ruler },
      { titleKey: 'adj.pb3', problemKey: 'adj.pb3.problem', solutionKey: 'adj.pb3.solution', tipKey: 'adj.pb3.tip', icon: Scissors },
    ],
  },
  {
    key: 'frontRise',
    labelKey: 'adj.pants.sub.frontRise',
    emoji: '👖',
    questions: [
      { titleKey: 'adj.pfr1', problemKey: 'adj.pfr1.problem', solutionKey: 'adj.pfr1.solution', tipKey: 'adj.pfr1.tip', icon: AlertCircle },
      { titleKey: 'adj.pfr2', problemKey: 'adj.pfr2.problem', solutionKey: 'adj.pfr2.solution', tipKey: 'adj.pfr2.tip', icon: Scissors },
      { titleKey: 'adj.pfr3', problemKey: 'adj.pfr3.problem', solutionKey: 'adj.pfr3.solution', tipKey: 'adj.pfr3.tip', icon: Ruler },
      { titleKey: 'adj.pfr4', problemKey: 'adj.pfr4.problem', solutionKey: 'adj.pfr4.solution', tipKey: 'adj.pfr4.tip', icon: AlertCircle },
    ],
  },
  {
    key: 'backDraglines',
    labelKey: 'adj.pants.sub.backDraglines',
    emoji: '📐',
    questions: [
      { titleKey: 'adj.pbd1', problemKey: 'adj.pbd1.problem', solutionKey: 'adj.pbd1.solution', tipKey: 'adj.pbd1.tip', icon: AlertCircle },
      { titleKey: 'adj.pbd2', problemKey: 'adj.pbd2.problem', solutionKey: 'adj.pbd2.solution', tipKey: 'adj.pbd2.tip', icon: Scissors },
      { titleKey: 'adj.pbd3', problemKey: 'adj.pbd3.problem', solutionKey: 'adj.pbd3.solution', tipKey: 'adj.pbd3.tip', icon: Scissors },
      { titleKey: 'adj.pbd4', problemKey: 'adj.pbd4.problem', solutionKey: 'adj.pbd4.solution', tipKey: 'adj.pbd4.tip', icon: Ruler },
    ],
  },
  {
    key: 'pocketsLeg',
    labelKey: 'adj.pants.sub.pocketsLeg',
    emoji: '🪡',
    questions: [
      { titleKey: 'adj.ppl1', problemKey: 'adj.ppl1.problem', solutionKey: 'adj.ppl1.solution', tipKey: 'adj.ppl1.tip', icon: Ruler },
      { titleKey: 'adj.ppl2', problemKey: 'adj.ppl2.problem', solutionKey: 'adj.ppl2.solution', tipKey: 'adj.ppl2.tip', icon: AlertCircle },
      { titleKey: 'adj.ppl3', problemKey: 'adj.ppl3.problem', solutionKey: 'adj.ppl3.solution', tipKey: 'adj.ppl3.tip', icon: Ruler },
      { titleKey: 'adj.ppl4', problemKey: 'adj.ppl4.problem', solutionKey: 'adj.ppl4.solution', tipKey: 'adj.ppl4.tip', icon: Scissors },
    ],
  },
];

const subCategoryData: Partial<Record<PatternKey, SubCategory[]>> = {
  bodice: bodiceSubCategories,
  pants: pantsSubCategories,
};

const sectionLabelKey: Partial<Record<PatternKey, string>> = {
  bodice: 'adj.bodice.selectSection',
  pants: 'adj.pants.selectSection',
};

const flatQuestions: Partial<Record<PatternKey, AdjQuestion[]>> = {
  skirt: [
    { titleKey: 'adj.s1', problemKey: 'adj.s1.problem', solutionKey: 'adj.s1.solution', tipKey: 'adj.s1.tip', icon: Scissors },
    { titleKey: 'adj.s2', problemKey: 'adj.s2.problem', solutionKey: 'adj.s2.solution', tipKey: 'adj.s2.tip', icon: Ruler },
    { titleKey: 'adj.s3', problemKey: 'adj.s3.problem', solutionKey: 'adj.s3.solution', tipKey: 'adj.s3.tip', icon: AlertCircle },
  ],
  sleeve: [
    { titleKey: 'adj.sl1', problemKey: 'adj.sl1.problem', solutionKey: 'adj.sl1.solution', tipKey: 'adj.sl1.tip', icon: Ruler },
    { titleKey: 'adj.sl2', problemKey: 'adj.sl2.problem', solutionKey: 'adj.sl2.solution', tipKey: 'adj.sl2.tip', icon: Scissors },
  ],
};

const patternImages: Record<PatternKey, string> = {
  bodice: '/adjustments/icon-bodice.png',
  skirt: '/adjustments/icon-skirt.png',
  pants: '/adjustments/icon-pants.png',
  sleeve: '/adjustments/icon-sleeve.png',
};

export default function Adjustments() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedPattern, setSelectedPattern] = useState<PatternKey | null>(null);
  const [selectedSubKey, setSelectedSubKey] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [selectedSubItem, setSelectedSubItem] = useState<number | null>(null);

  const handleBack = () => {
    if (selectedSubItem !== null) {
      setSelectedSubItem(null);
    } else if (selectedQuestion !== null) {
      setSelectedQuestion(null);
    } else if (selectedSubKey !== null) {
      setSelectedSubKey(null);
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

  const currentSubCategories = selectedPattern ? subCategoryData[selectedPattern] : undefined;
  const currentSub = currentSubCategories?.find(s => s.key === selectedSubKey);

  // Resolve the active question list
  const activeQuestions: AdjQuestion[] | undefined = selectedPattern
    ? currentSub
      ? currentSub.questions
      : flatQuestions[selectedPattern]
    : undefined;

  const activeQuestion = activeQuestions && selectedQuestion !== null ? activeQuestions[selectedQuestion] : undefined;

  const DetailCard = ({ titleKey, problemKey, solutionKey, tipKey, icon: Icon, blocks }: { titleKey: string; problemKey: string; solutionKey: string; tipKey: string; icon: typeof Ruler; blocks?: AdjContentBlock[] }) => (
    <div className="border border-border rounded-lg p-6 bg-card">
      <div className="flex items-start gap-3 mb-5">
        <div className="mt-0.5 text-primary"><Icon className="w-5 h-5" /></div>
        <h2 className="font-serif text-xl font-semibold text-foreground">{t(titleKey)}</h2>
      </div>
      <div className="ml-8 space-y-5 text-sm">
        {blocks ? (
          <>
            {blocks.map((block, i) => (
              <div key={i}>
                {block.textKey && (
                  <p className="text-muted-foreground whitespace-pre-line">{t(block.textKey)}</p>
                )}
                {block.imageSrc && (
                  <img
                    src={block.imageSrc}
                    alt=""
                    className="w-full rounded-lg mt-3 border border-border"
                  />
                )}
              </div>
            ))}
            {t(tipKey) && (
              <p className="text-xs text-muted-foreground/80 italic border-l-2 border-primary/30 pl-3">
                💡 {t(tipKey)}
              </p>
            )}
          </>
        ) : (
          <>
            {t(problemKey) && (
              <div>
                <span className="font-medium text-foreground">{t('adj.problem')} </span>
                <span className="text-muted-foreground whitespace-pre-line">{t(problemKey)}</span>
              </div>
            )}
            {t(solutionKey) && (
              <div>
                <span className="font-medium text-foreground">{t('adj.solution')} </span>
                <span className="text-muted-foreground whitespace-pre-line">{t(solutionKey)}</span>
              </div>
            )}
            {t(tipKey) && (
              <p className="text-xs text-muted-foreground/80 italic border-l-2 border-primary/30 pl-3">
                💡 {t(tipKey)}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );

  // Sub-item detail
  if (activeQuestion?.subItems && selectedSubItem !== null) {
    const sub = activeQuestion.subItems[selectedSubItem];
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-3xl mx-auto px-4 py-10">
          <Button variant="ghost" size="sm" onClick={handleBack} className="mb-6 text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t('adj.back')}
          </Button>
          <DetailCard {...sub} blocks={sub.blocks} />
        </main>
      </div>
    );
  }

  // Sub-items list (question with causes)
  if (activeQuestion?.subItems) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-3xl mx-auto px-4 py-10">
          <Button variant="ghost" size="sm" onClick={handleBack} className="mb-6 text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t('adj.back')}
          </Button>

          <div className="border border-border rounded-lg p-6 bg-card mb-6">
            <div className="flex items-start gap-3 mb-3">
              <div className="mt-0.5 text-primary"><activeQuestion.icon className="w-5 h-5" /></div>
              <h2 className="font-serif text-xl font-semibold text-foreground">{t(activeQuestion.titleKey)}</h2>
            </div>
            <p className="ml-8 text-sm text-muted-foreground whitespace-pre-line">{t(activeQuestion.problemKey)}</p>
          </div>

          <div className="space-y-3">
            {activeQuestion.subItems.map((sub, i) => (
              <button
                key={i}
                onClick={() => setSelectedSubItem(i)}
                className="w-full text-left border border-border rounded-lg p-4 bg-card hover:border-primary/50 hover:bg-primary/5 transition-colors group flex items-center justify-between gap-3"
              >
                <span className="font-medium text-foreground text-sm">{t(sub.titleKey)}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Standard answer detail
  if (activeQuestion && selectedQuestion !== null) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-3xl mx-auto px-4 py-10">
          <Button variant="ghost" size="sm" onClick={handleBack} className="mb-6 text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t('adj.back')}
          </Button>
          <DetailCard {...activeQuestion} />
        </main>
      </div>
    );
  }

  // Level 3 (sub-category selected): Questions list
  if (selectedPattern && currentSub) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-3xl mx-auto px-4 py-10">
          <Button variant="ghost" size="sm" onClick={handleBack} className="mb-6 text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t('adj.back')}
          </Button>

          <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
            {t(currentSub.labelKey)}
          </h1>
          <p className="text-muted-foreground mb-8">{t('adj.selectQuestion')}</p>

          <div className="space-y-3">
            {currentSub.questions.map((q, i) => (
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

  // Level 2a (pattern has sub-categories): Sub-category list
  if (selectedPattern && currentSubCategories) {
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
          <p className="text-muted-foreground mb-8">
            {t(sectionLabelKey[selectedPattern] ?? 'adj.selectQuestion')}
          </p>

          <div className="space-y-3">
            {currentSubCategories.map(sub => (
              <button
                key={sub.key}
                onClick={() => setSelectedSubKey(sub.key)}
                className="w-full text-left border border-border rounded-lg p-4 bg-card hover:border-primary/50 hover:bg-primary/5 transition-colors group flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{sub.emoji}</span>
                  <span className="font-medium text-foreground text-sm">{t(sub.labelKey)}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Level 2b (flat questions — skirt, sleeve): Questions list
  if (selectedPattern && activeQuestions) {
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
            {activeQuestions.map((q, i) => (
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
              className="border border-border rounded-xl overflow-hidden bg-card hover:border-primary/50 hover:bg-primary/5 transition-colors flex flex-col group"
            >
              <img
                src={patternImages[key]}
                alt=""
                className="w-full object-cover"
              />
              <span className="px-4 py-3 font-serif font-semibold text-foreground group-hover:text-primary transition-colors text-center w-full">
                {t(labelKey)}
              </span>
            </button>
          ))}
        </div>
      </main>
      <LegalFooter />
    </div>
  );
}
