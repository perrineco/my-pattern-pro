import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { Category } from "@/types/sloper";
import { useLanguage } from "@/contexts/LanguageContext";
import { SharedBodyDiagram, BodyPositions } from "@/components/guides/SharedBodyDiagram";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MeasurementGuideProps {
  category: Category;
}

export function MeasurementGuide({ category }: MeasurementGuideProps) {
  const { t } = useLanguage();
  const [highlightedNumber, setHighlightedNumber] = useState<number | null>(null);

  const handleNumberClick = (n: number) => {
    setHighlightedNumber(prev => prev === n ? null : n);
  };

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
                renderOverlay={(pos) => <SkirtOverlay pos={pos} t={t} highlightedNumber={highlightedNumber} onNumberClick={handleNumberClick} />}
              />
            </div>
            <div className="space-y-4">
              <MeasurementInstruction number={1} name={t('guide.waist')} color="hsl(var(--primary))" description={t('guide.desc.waist')} highlighted={highlightedNumber === 1} />
              <MeasurementInstruction number={2} name={t('guide.hip')} color="hsl(var(--destructive))" description={t('guide.desc.hip')} highlighted={highlightedNumber === 2} />
              <MeasurementInstruction number={3} name={t('guide.waistToHip')} color="hsl(var(--chart-3))" description={t('guide.desc.waistToHip')} highlighted={highlightedNumber === 3} />
              <MeasurementInstruction number={4} name={t('guide.skirtLength')} color="hsl(var(--chart-4))" description={t('guide.desc.skirtLength')} highlighted={highlightedNumber === 4} />
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
  const getCircleFill = (n: number, defaultColor: string) => highlightedNumber === n ? highlightColor : defaultColor;

  return (
    <>
      {/* 1. Waist line */}
      <line x1={cx - pos.waistWidth / 2 - 15} y1={pos.waistY} x2={cx + pos.waistWidth / 2 + 15} y2={pos.waistY} stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="6,3" />
      <g onClick={() => onNumberClick(1)} className="cursor-pointer">
        <circle cx={cx - pos.waistWidth / 2 - 20} cy={pos.waistY} r="10" fill={getCircleFill(1, "hsl(var(--primary))")} />
        <text x={cx - pos.waistWidth / 2 - 20} y={pos.waistY + 4} textAnchor="middle" className="fill-white text-xs font-bold pointer-events-none">1</text>
      </g>

      {/* 2. Hip line */}
      <line x1={cx - pos.hipWidth / 2 - 15} y1={pos.hipY} x2={cx + pos.hipWidth / 2 + 15} y2={pos.hipY} stroke="hsl(var(--destructive))" strokeWidth="2" strokeDasharray="6,3" />
      <g onClick={() => onNumberClick(2)} className="cursor-pointer">
        <circle cx={cx + pos.hipWidth / 2 + 20} cy={pos.hipY} r="10" fill={getCircleFill(2, "hsl(var(--destructive))")} />
        <text x={cx + pos.hipWidth / 2 + 20} y={pos.hipY + 4} textAnchor="middle" className="fill-white text-xs font-bold pointer-events-none">2</text>
      </g>

      {/* 3. Waist to Hip vertical */}
      <line x1={cx + pos.hipWidth / 2 + 35} y1={pos.waistY} x2={cx + pos.hipWidth / 2 + 35} y2={pos.hipY} stroke="hsl(var(--chart-3))" strokeWidth="2" />
      <line x1={cx + pos.hipWidth / 2 + 30} y1={pos.waistY} x2={cx + pos.hipWidth / 2 + 40} y2={pos.waistY} stroke="hsl(var(--chart-3))" strokeWidth="2" />
      <line x1={cx + pos.hipWidth / 2 + 30} y1={pos.hipY} x2={cx + pos.hipWidth / 2 + 40} y2={pos.hipY} stroke="hsl(var(--chart-3))" strokeWidth="2" />
      <g onClick={() => onNumberClick(3)} className="cursor-pointer">
        <circle cx={cx + pos.hipWidth / 2 + 35} cy={(pos.waistY + pos.hipY) / 2} r="10" fill={getCircleFill(3, "hsl(var(--chart-3))")} />
        <text x={cx + pos.hipWidth / 2 + 35} y={(pos.waistY + pos.hipY) / 2 + 4} textAnchor="middle" className="fill-white text-xs font-bold pointer-events-none">3</text>
      </g>

      {/* 4. Skirt length vertical */}
      <line x1={cx - pos.hipWidth / 2 - 35} y1={pos.waistY} x2={cx - pos.hipWidth / 2 - 35} y2={pos.hemY} stroke="hsl(var(--chart-4))" strokeWidth="2" />
      <line x1={cx - pos.hipWidth / 2 - 40} y1={pos.waistY} x2={cx - pos.hipWidth / 2 - 30} y2={pos.waistY} stroke="hsl(var(--chart-4))" strokeWidth="2" />
      <line x1={cx - pos.hipWidth / 2 - 40} y1={pos.hemY} x2={cx - pos.hipWidth / 2 - 30} y2={pos.hemY} stroke="hsl(var(--chart-4))" strokeWidth="2" />
      <g onClick={() => onNumberClick(4)} className="cursor-pointer">
        <circle cx={cx - pos.hipWidth / 2 - 35} cy={(pos.waistY + pos.hemY) / 2} r="10" fill={getCircleFill(4, "hsl(var(--chart-4))")} />
        <text x={cx - pos.hipWidth / 2 - 35} y={(pos.waistY + pos.hemY) / 2 + 4} textAnchor="middle" className="fill-white text-xs font-bold pointer-events-none">4</text>
      </g>

      {/* Labels */}
      <text x={cx} y={pos.waistY - 6} textAnchor="middle" className="fill-muted-foreground text-[10px]">{t('guide.waist')}</text>
      <text x={cx} y={pos.hipY + 14} textAnchor="middle" className="fill-muted-foreground text-[10px]">{t('guide.hip')}</text>
    </>
  );
}

interface MeasurementInstructionProps {
  number: number;
  name: string;
  color: string;
  description: string;
  highlighted?: boolean;
}

function MeasurementInstruction({ number, name, color, description, highlighted }: MeasurementInstructionProps) {
  const highlightColor = "#f97316";
  return (
    <div className={`flex gap-3 rounded-lg p-2 transition-colors ${highlighted ? 'bg-orange-50 dark:bg-orange-950/30 ring-1 ring-orange-400' : ''}`}>
      <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: highlighted ? highlightColor : color }}>
        {number}
      </div>
      <div>
        <h4 className="font-medium text-foreground">{name}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
