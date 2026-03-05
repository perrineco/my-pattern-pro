import { useState, useRef, useEffect } from "react";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Category } from "@/types/sloper";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { SharedBodyDiagram, BodyPositions } from "@/components/guides/SharedBodyDiagram";

interface BodiceMeasurementGuideProps {
  category: Category;
}

export function BodiceMeasurementGuide({ category }: BodiceMeasurementGuideProps) {
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <HelpCircle className="w-4 h-4 mr-1" />
          {t('action.howToMeasure')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">{t('guide.bodiceGuide')}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[65vh] pr-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex justify-center">
              <SharedBodyDiagram
                category={category}
                viewBoxHeight={220}
                renderOverlay={(pos) => (
                  <BodiceOverlay pos={pos} highlightedNumber={highlightedNumber} onNumberClick={handleNumberClick} t={t} />
                )}
              />
            </div>
            <div className="space-y-4">
              <MeasurementInstruction ref={el => { instructionRefs.current[1] = el; }} number={1} name={t('guide.bust')} color="hsl(var(--primary))" description={t('guide.desc.bust')} highlighted={highlightedNumber === 1} />
              <MeasurementInstruction ref={el => { instructionRefs.current[2] = el; }} number={2} name={t('guide.neckline')} color="hsl(var(--chart-2))" description={t('guide.desc.neckline')} highlighted={highlightedNumber === 2} />
              <MeasurementInstruction ref={el => { instructionRefs.current[3] = el; }} number={3} name={t('guide.shoulderLength')} color="hsl(var(--chart-3))" description={t('guide.desc.shoulderLength')} highlighted={highlightedNumber === 3} />
              <MeasurementInstruction ref={el => { instructionRefs.current[4] = el; }} number={4} name={t('guide.backWidth')} color="hsl(var(--chart-4))" description={t('guide.desc.backWidth')} highlighted={highlightedNumber === 4} />
              <MeasurementInstruction ref={el => { instructionRefs.current[5] = el; }} number={5} name={t('guide.backLength')} color="hsl(var(--chart-5))" description={t('guide.desc.backLength')} highlighted={highlightedNumber === 5} />
            </div>
          </div>

          <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
            <h4 className="font-medium text-foreground mb-2">{t('guide.tipsForAccurate')}</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• {t('guide.tip.bodice1')}</li>
              <li>• {t('guide.tip.bodice2')}</li>
              <li>• {t('guide.tip.bodice3')}</li>
              <li>• {t('guide.tip.bodice4')}</li>
              <li>• {t('guide.tip.bodice5')}</li>
              <li>• {t('guide.tip.bodice6')}</li>
            </ul>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function BodiceOverlay({ pos, highlightedNumber, onNumberClick, t }: { pos: BodyPositions; highlightedNumber: number | null; onNumberClick: (n: number) => void; t: (key: string) => string }) {
  const cx = pos.centerX;
  const highlightColor = "#f97316";
  const defaultColor = "hsl(var(--foreground))";
  const getCircleFill = (n: number) => highlightedNumber === n ? highlightColor : defaultColor;

  return (
    <>
      {/* Nape point */}
      <circle cx={cx} cy={pos.neckBaseY - 5} r="3" fill="hsl(var(--foreground))" />

      {/* 1: Bust line */}
      <line x1={cx - pos.bustWidth / 2 - 10} y1={pos.bustY} x2={cx + pos.bustWidth / 2 + 10} y2={pos.bustY} stroke="hsl(var(--foreground))" strokeWidth="1.5" strokeDasharray="4,2" />
      <g onClick={() => onNumberClick(1)} className="cursor-pointer">
        <circle cx={cx - pos.bustWidth / 2 - 18} cy={pos.bustY} r="7" fill={getCircleFill(1)} />
        <text x={cx - pos.bustWidth / 2 - 18} y={pos.bustY + 3} textAnchor="middle" className="fill-white text-[9px] font-bold pointer-events-none">1</text>
      </g>

      {/* 2: Neckline circumference */}
      <ellipse cx={cx} cy={pos.neckBaseY} rx={12} ry={6} fill="none" stroke="hsl(var(--foreground))" strokeWidth="2" strokeDasharray="3,2" />
      <g onClick={() => onNumberClick(2)} className="cursor-pointer">
        <circle cx={cx + 20} cy={pos.neckBaseY} r="7" fill={getCircleFill(2)} />
        <text x={cx + 20} y={pos.neckBaseY + 3} textAnchor="middle" className="fill-white text-[9px] font-bold pointer-events-none">2</text>
      </g>

      {/* 3: Shoulder length */}
      <line x1={cx - 8} y1={pos.neckBaseY} x2={pos.leftShoulderX} y2={pos.shoulderY} stroke="hsl(var(--foreground))" strokeWidth="2" />
      <circle cx={pos.leftShoulderX} cy={pos.shoulderY} r="4" fill="hsl(var(--foreground))" />
      <circle cx={cx - 8} cy={pos.neckBaseY} r="4" fill="hsl(var(--foreground))" />
      <g onClick={() => onNumberClick(3)} className="cursor-pointer">
        <circle cx={(cx - 8 + pos.leftShoulderX) / 2} cy={(pos.neckBaseY + pos.shoulderY) / 2} r="7" fill={getCircleFill(3)} />
        <text x={(cx - 8 + pos.leftShoulderX) / 2} y={(pos.neckBaseY + pos.shoulderY) / 2 + 3} textAnchor="middle" className="fill-white text-[9px] font-bold pointer-events-none">3</text>
      </g>

      {/* 4: Back width */}
      <line x1={cx - pos.bustWidth / 2 + 8} y1={pos.backWidthY} x2={cx + pos.bustWidth / 2 - 8} y2={pos.backWidthY} stroke="hsl(var(--foreground))" strokeWidth="2" />
      <line x1={cx - pos.bustWidth / 2 + 8} y1={pos.backWidthY - 5} x2={cx - pos.bustWidth / 2 + 8} y2={pos.backWidthY + 5} stroke="hsl(var(--foreground))" strokeWidth="1.5" />
      <line x1={cx + pos.bustWidth / 2 - 8} y1={pos.backWidthY - 5} x2={cx + pos.bustWidth / 2 - 8} y2={pos.backWidthY + 5} stroke="hsl(var(--foreground))" strokeWidth="1.5" />
      <g onClick={() => onNumberClick(4)} className="cursor-pointer">
        <circle cx={cx} cy={pos.backWidthY - 12} r="7" fill={getCircleFill(4)} />
        <text x={cx} y={pos.backWidthY - 9} textAnchor="middle" className="fill-white text-[9px] font-bold pointer-events-none">4</text>
      </g>

      {/* 5: Back length (nape to waist) */}
      <line x1={cx + 15} y1={pos.neckBaseY - 5} x2={cx + 15} y2={pos.waistY} stroke="hsl(var(--foreground))" strokeWidth="1.5" />
      <line x1={cx + 10} y1={pos.neckBaseY - 5} x2={cx + 20} y2={pos.neckBaseY - 5} stroke="hsl(var(--foreground))" strokeWidth="1.5" />
      <line x1={cx + 10} y1={pos.waistY} x2={cx + 20} y2={pos.waistY} stroke="hsl(var(--foreground))" strokeWidth="1.5" />
      <g onClick={() => onNumberClick(5)} className="cursor-pointer">
        <circle cx={cx + 30} cy={(pos.neckBaseY + pos.waistY) / 2} r="7" fill={getCircleFill(5)} />
        <text x={cx + 30} y={(pos.neckBaseY + pos.waistY) / 2 + 3} textAnchor="middle" className="fill-white text-[9px] font-bold pointer-events-none">5</text>
      </g>

      {/* Waist reference line */}
      <line x1={cx - pos.waistWidth / 2 - 10} y1={pos.waistY} x2={cx + pos.waistWidth / 2 + 10} y2={pos.waistY} stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeDasharray="3,3" />
      <text x={cx + pos.waistWidth / 2 + 15} y={pos.waistY + 4} className="fill-muted-foreground text-[8px]">{t('guide.waist')}</text>
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
        <div className="font-medium text-foreground">{name}</div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
});
