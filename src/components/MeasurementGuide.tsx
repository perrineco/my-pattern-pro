import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { Category } from "@/types/sloper";
import { useLanguage } from "@/contexts/LanguageContext";
import { SharedBodyDiagram, BodyPositions } from "@/components/guides/SharedBodyDiagram";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MeasurementGuideProps {
  category: Category;
  patternType?: 'skirt' | 'pants';
}

export function MeasurementGuide({ category, patternType = 'skirt' }: MeasurementGuideProps) {
  const { t } = useLanguage();
  const [highlightedNumber, setHighlightedNumber] = useState<number | null>(null);
  const instructionRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleNumberClick = (n: number) => {
    setHighlightedNumber(prev => prev === n ? null : n);
  };

  useEffect(() => {
    if (highlightedNumber && instructionRefs.current[highlightedNumber]) {
      instructionRefs.current[highlightedNumber]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [highlightedNumber]);

  const isPants = patternType === 'pants';

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <HelpCircle className="w-4 h-4" />
          {t('action.howToMeasure')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">{t('guide.measurementGuide')}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[65vh] pr-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex justify-center">
              <SharedBodyDiagram
                category={category}
                renderOverlay={(pos) => isPants
                  ? <PantsOverlay pos={pos} t={t} highlightedNumber={highlightedNumber} onNumberClick={handleNumberClick} />
                  : <SkirtOverlay pos={pos} t={t} highlightedNumber={highlightedNumber} onNumberClick={handleNumberClick} />
                }
              />
            </div>
            <div className="space-y-4">
              <MeasurementInstruction ref={el => { instructionRefs.current[1] = el; }} number={1} name={t('guide.waist')} color="hsl(var(--primary))" description={t('guide.desc.waist')} highlighted={highlightedNumber === 1} />
              <MeasurementInstruction ref={el => { instructionRefs.current[2] = el; }} number={2} name={t('guide.hip')} color="hsl(var(--destructive))" description={t('guide.desc.hip')} highlighted={highlightedNumber === 2} />
              <MeasurementInstruction ref={el => { instructionRefs.current[3] = el; }} number={3} name={t('guide.waistToHip')} color="hsl(var(--chart-3))" description={t('guide.desc.waistToHip')} highlighted={highlightedNumber === 3} />
              <MeasurementInstruction ref={el => { instructionRefs.current[4] = el; }} number={4} name={isPants ? t('guide.pantsLength') : t('guide.skirtLength')} color="hsl(var(--chart-4))" description={isPants ? t('guide.desc.pantsLength') : t('guide.desc.skirtLength')} highlighted={highlightedNumber === 4} />
              {isPants && (
                <MeasurementInstruction ref={el => { instructionRefs.current[5] = el; }} number={5} name={t('guide.crotchDepth')} color="hsl(var(--chart-5, var(--primary)))" description={t('guide.desc.crotchDepth')} highlighted={highlightedNumber === 5} />
              )}
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">{t('guide.tipsForAccurate')}</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• {t('guide.tip1')}</li>
              <li>• {t('guide.tip2')}</li>
              <li>• {t('guide.tip3')}</li>
              <li>• {t('guide.tip4')}</li>
              <li>• {t('guide.tip5')}</li>
            </ul>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function SkirtOverlay({ pos, t, highlightedNumber, onNumberClick }: { pos: BodyPositions; t: (key: string) => string; highlightedNumber: number | null; onNumberClick: (n: number) => void }) {
  const cx = pos.centerX;
  const highlightColor = "#f97316";
  const defaultColor = "hsl(var(--foreground))";
  const getCircleFill = (n: number) => highlightedNumber === n ? highlightColor : defaultColor;

  return (
    <>
      {/* 1. Waist line */}
      <line x1={cx - pos.waistWidth / 2 - 15} y1={pos.waistY} x2={cx + pos.waistWidth / 2 + 15} y2={pos.waistY} stroke="hsl(var(--foreground))" strokeWidth="1.5" strokeDasharray="6,3" />
      <g onClick={() => onNumberClick(1)} className="cursor-pointer">
        <circle cx={cx - pos.waistWidth / 2 - 20} cy={pos.waistY} r="7" fill={getCircleFill(1)} />
        <text x={cx - pos.waistWidth / 2 - 20} y={pos.waistY + 3} textAnchor="middle" className="fill-white text-[9px] font-bold pointer-events-none">1</text>
      </g>

      {/* 2. Hip line */}
      <line x1={cx - pos.hipWidth / 2 - 15} y1={pos.hipY} x2={cx + pos.hipWidth / 2 + 15} y2={pos.hipY} stroke="hsl(var(--foreground))" strokeWidth="1.5" strokeDasharray="6,3" />
      <g onClick={() => onNumberClick(2)} className="cursor-pointer">
        <circle cx={cx + pos.hipWidth / 2 + 20} cy={pos.hipY} r="7" fill={getCircleFill(2)} />
        <text x={cx + pos.hipWidth / 2 + 20} y={pos.hipY + 3} textAnchor="middle" className="fill-white text-[9px] font-bold pointer-events-none">2</text>
      </g>

      {/* 3. Waist to Hip vertical */}
      <line x1={cx + pos.hipWidth / 2 + 35} y1={pos.waistY} x2={cx + pos.hipWidth / 2 + 35} y2={pos.hipY} stroke="hsl(var(--foreground))" strokeWidth="1.5" />
      <line x1={cx + pos.hipWidth / 2 + 30} y1={pos.waistY} x2={cx + pos.hipWidth / 2 + 40} y2={pos.waistY} stroke="hsl(var(--foreground))" strokeWidth="1.5" />
      <line x1={cx + pos.hipWidth / 2 + 30} y1={pos.hipY} x2={cx + pos.hipWidth / 2 + 40} y2={pos.hipY} stroke="hsl(var(--foreground))" strokeWidth="1.5" />
      <g onClick={() => onNumberClick(3)} className="cursor-pointer">
        <circle cx={cx + pos.hipWidth / 2 + 35} cy={(pos.waistY + pos.hipY) / 2} r="7" fill={getCircleFill(3)} />
        <text x={cx + pos.hipWidth / 2 + 35} y={(pos.waistY + pos.hipY) / 2 + 3} textAnchor="middle" className="fill-white text-[9px] font-bold pointer-events-none">3</text>
      </g>

      {/* 4. Skirt length vertical */}
      <line x1={cx - pos.hipWidth / 2 - 35} y1={pos.waistY} x2={cx - pos.hipWidth / 2 - 35} y2={pos.hemY} stroke="hsl(var(--foreground))" strokeWidth="1.5" />
      <line x1={cx - pos.hipWidth / 2 - 40} y1={pos.waistY} x2={cx - pos.hipWidth / 2 - 30} y2={pos.waistY} stroke="hsl(var(--foreground))" strokeWidth="1.5" />
      <line x1={cx - pos.hipWidth / 2 - 40} y1={pos.hemY} x2={cx - pos.hipWidth / 2 - 30} y2={pos.hemY} stroke="hsl(var(--foreground))" strokeWidth="1.5" />
      <g onClick={() => onNumberClick(4)} className="cursor-pointer">
        <circle cx={cx - pos.hipWidth / 2 - 35} cy={(pos.waistY + pos.hemY) / 2} r="7" fill={getCircleFill(4)} />
        <text x={cx - pos.hipWidth / 2 - 35} y={(pos.waistY + pos.hemY) / 2 + 3} textAnchor="middle" className="fill-white text-[9px] font-bold pointer-events-none">4</text>
      </g>

      {/* Labels */}
      <text x={cx} y={pos.waistY - 6} textAnchor="middle" className="fill-muted-foreground text-[10px]">{t('guide.waist')}</text>
      <text x={cx} y={pos.hipY + 14} textAnchor="middle" className="fill-muted-foreground text-[10px]">{t('guide.hip')}</text>
    </>
  );
}

function PantsOverlay({ pos, t, highlightedNumber, onNumberClick }: { pos: BodyPositions; t: (key: string) => string; highlightedNumber: number | null; onNumberClick: (n: number) => void }) {
  const cx = pos.centerX;
  const highlightColor = "#f97316";
  const defaultColor = "hsl(var(--foreground))";
  const getCircleFill = (n: number) => highlightedNumber === n ? highlightColor : defaultColor;

  // Crotch level: approximate between hip and knee (hemY used as knee-ish reference)
  const crotchY = pos.hipY + (pos.ankleY - pos.hipY) * 0.3;

  return (
    <>
      {/* 1. Waist line */}
      <line x1={cx - pos.waistWidth / 2 - 15} y1={pos.waistY} x2={cx + pos.waistWidth / 2 + 15} y2={pos.waistY} stroke="hsl(var(--foreground))" strokeWidth="1.5" strokeDasharray="6,3" />
      <g onClick={() => onNumberClick(1)} className="cursor-pointer">
        <circle cx={cx - pos.waistWidth / 2 - 20} cy={pos.waistY} r="7" fill={getCircleFill(1)} />
        <text x={cx - pos.waistWidth / 2 - 20} y={pos.waistY + 3} textAnchor="middle" className="fill-white text-[9px] font-bold pointer-events-none">1</text>
      </g>

      {/* 2. Hip line */}
      <line x1={cx - pos.hipWidth / 2 - 15} y1={pos.hipY} x2={cx + pos.hipWidth / 2 + 15} y2={pos.hipY} stroke="hsl(var(--foreground))" strokeWidth="1.5" strokeDasharray="6,3" />
      <g onClick={() => onNumberClick(2)} className="cursor-pointer">
        <circle cx={cx + pos.hipWidth / 2 + 20} cy={pos.hipY} r="10" fill={getCircleFill(2)} />
        <text x={cx + pos.hipWidth / 2 + 20} y={pos.hipY + 4} textAnchor="middle" className="fill-white text-xs font-bold pointer-events-none">2</text>
      </g>

      {/* 3. Waist to Hip vertical */}
      <line x1={cx + pos.hipWidth / 2 + 35} y1={pos.waistY} x2={cx + pos.hipWidth / 2 + 35} y2={pos.hipY} stroke="hsl(var(--foreground))" strokeWidth="1.5" />
      <line x1={cx + pos.hipWidth / 2 + 30} y1={pos.waistY} x2={cx + pos.hipWidth / 2 + 40} y2={pos.waistY} stroke="hsl(var(--foreground))" strokeWidth="1.5" />
      <line x1={cx + pos.hipWidth / 2 + 30} y1={pos.hipY} x2={cx + pos.hipWidth / 2 + 40} y2={pos.hipY} stroke="hsl(var(--foreground))" strokeWidth="1.5" />
      <g onClick={() => onNumberClick(3)} className="cursor-pointer">
        <circle cx={cx + pos.hipWidth / 2 + 35} cy={(pos.waistY + pos.hipY) / 2} r="10" fill={getCircleFill(3)} />
        <text x={cx + pos.hipWidth / 2 + 35} y={(pos.waistY + pos.hipY) / 2 + 4} textAnchor="middle" className="fill-white text-xs font-bold pointer-events-none">3</text>
      </g>

      {/* 4. Pants length vertical (waist to ankle) */}
      <line x1={cx - pos.hipWidth / 2 - 35} y1={pos.waistY} x2={cx - pos.hipWidth / 2 - 35} y2={pos.ankleY} stroke="hsl(var(--foreground))" strokeWidth="1.5" />
      <line x1={cx - pos.hipWidth / 2 - 40} y1={pos.waistY} x2={cx - pos.hipWidth / 2 - 30} y2={pos.waistY} stroke="hsl(var(--foreground))" strokeWidth="1.5" />
      <line x1={cx - pos.hipWidth / 2 - 40} y1={pos.ankleY} x2={cx - pos.hipWidth / 2 - 30} y2={pos.ankleY} stroke="hsl(var(--foreground))" strokeWidth="1.5" />
      <g onClick={() => onNumberClick(4)} className="cursor-pointer">
        <circle cx={cx - pos.hipWidth / 2 - 35} cy={(pos.waistY + pos.ankleY) / 2} r="10" fill={getCircleFill(4)} />
        <text x={cx - pos.hipWidth / 2 - 35} y={(pos.waistY + pos.ankleY) / 2 + 4} textAnchor="middle" className="fill-white text-xs font-bold pointer-events-none">4</text>
      </g>

      {/* 5. Crotch depth vertical (waist to crotch) */}
      <line x1={cx + pos.hipWidth / 2 + 55} y1={pos.waistY} x2={cx + pos.hipWidth / 2 + 55} y2={crotchY} stroke="hsl(var(--foreground))" strokeWidth="1.5" />
      <line x1={cx + pos.hipWidth / 2 + 50} y1={pos.waistY} x2={cx + pos.hipWidth / 2 + 60} y2={pos.waistY} stroke="hsl(var(--foreground))" strokeWidth="1.5" />
      <line x1={cx + pos.hipWidth / 2 + 50} y1={crotchY} x2={cx + pos.hipWidth / 2 + 60} y2={crotchY} stroke="hsl(var(--foreground))" strokeWidth="1.5" />
      <g onClick={() => onNumberClick(5)} className="cursor-pointer">
        <circle cx={cx + pos.hipWidth / 2 + 55} cy={(pos.waistY + crotchY) / 2} r="10" fill={getCircleFill(5)} />
        <text x={cx + pos.hipWidth / 2 + 55} y={(pos.waistY + crotchY) / 2 + 4} textAnchor="middle" className="fill-white text-xs font-bold pointer-events-none">5</text>
      </g>

      {/* Labels */}
      <text x={cx} y={pos.waistY - 6} textAnchor="middle" className="fill-muted-foreground text-[10px]">{t('guide.waist')}</text>
      <text x={cx} y={pos.hipY + 14} textAnchor="middle" className="fill-muted-foreground text-[10px]">{t('guide.hip')}</text>
    </>
  );
}

import React from "react";

interface MeasurementInstructionProps {
  number: number;
  name: string;
  color: string;
  description: string;
  highlighted?: boolean;
}

const MeasurementInstruction = React.forwardRef<HTMLDivElement, MeasurementInstructionProps>(({ number, name, description, highlighted }, ref) => {
  const highlightColor = "#f97316";
  return (
    <div ref={ref} className={`flex gap-3 rounded-lg p-2 transition-colors ${highlighted ? 'bg-orange-50 dark:bg-orange-950/30 ring-1 ring-orange-400' : ''}`}>
      <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground bg-foreground" style={highlighted ? { backgroundColor: highlightColor } : undefined}>
        {number}
      </div>
      <div>
        <h4 className="font-medium text-foreground">{name}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
});
