import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { Category } from "@/types/sloper";
import { useLanguage } from "@/contexts/LanguageContext";
import { SharedBodyDiagram, BodyPositions } from "@/components/guides/SharedBodyDiagram";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SleeveMeasurementGuideProps {
  category: Category;
}

export function SleeveMeasurementGuide({ category }: SleeveMeasurementGuideProps) {
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
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <HelpCircle className="w-4 h-4" />
          {t('action.howToMeasure')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">{t('guide.sleeveMeasurementGuide')}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[65vh] pr-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex justify-center">
              <SharedBodyDiagram
                category={category}
                renderOverlay={(pos) => <SleeveOverlay pos={pos} t={t} highlightedNumber={highlightedNumber} onNumberClick={handleNumberClick} />}
              />
            </div>
            <div className="space-y-4">
              <MeasurementInstruction ref={el => { instructionRefs.current[1] = el; }} number={1} name={t('guide.upperArm')} color="hsl(var(--primary))" description={t('guide.desc.upperArm')} highlighted={highlightedNumber === 1} />
              <MeasurementInstruction ref={el => { instructionRefs.current[2] = el; }} number={2} name={t('guide.wrist')} color="hsl(var(--destructive))" description={t('guide.desc.wrist')} highlighted={highlightedNumber === 2} />
              <MeasurementInstruction ref={el => { instructionRefs.current[3] = el; }} number={3} name={t('guide.sleeveLength')} color="hsl(var(--chart-3))" description={t('guide.desc.sleeveLength')} highlighted={highlightedNumber === 3} />
              <MeasurementInstruction ref={el => { instructionRefs.current[4] = el; }} number={4} name={t('guide.elbowLength')} color="hsl(var(--chart-4))" description={t('guide.desc.elbowLength')} highlighted={highlightedNumber === 4} />
              <MeasurementInstruction ref={el => { instructionRefs.current[5] = el; }} number={5} name={t('guide.armholeDepth')} color="hsl(var(--chart-5))" description={t('guide.desc.armholeDepth')} highlighted={highlightedNumber === 5} />
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">{t('guide.tipsForAccurate')}</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• {t('guide.tip.sleeve1')}</li>
              <li>• {t('guide.tip.sleeve2')}</li>
              <li>• {t('guide.tip4')}</li>
              <li>• {t('guide.tip5')}</li>
              <li>• {t('guide.tip.sleeve5')}</li>
            </ul>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function SleeveOverlay({ pos, t, highlightedNumber, onNumberClick }: { pos: BodyPositions; t: (key: string) => string; highlightedNumber: number | null; onNumberClick: (n: number) => void }) {
  const highlightColor = "#f97316";
  const defaultColor = "hsl(var(--foreground))";
  const getCircleFill = (n: number) => highlightedNumber === n ? highlightColor : defaultColor;

  const armCx = pos.rightShoulderX + 8;
  const shoulderPtY = pos.shoulderY;
  const bicepY = pos.underarmY + 15;
  const elbowY = pos.elbowY;
  const wristArmY = pos.wristY;
  const dimX = armCx + 30;
  const dimX2 = armCx + 45;

  return (
    <>
      {/* Shoulder point marker */}
      <circle cx={pos.rightShoulderX} cy={shoulderPtY} r="4" fill="hsl(var(--foreground))" />
      <text x={pos.rightShoulderX} y={shoulderPtY - 10} textAnchor="middle" className="fill-muted-foreground text-[8px]">
        {t('guide.shoulderPoint')}
      </text>

      {/* Elbow marker */}
      <circle cx={armCx} cy={elbowY} r="3" fill="hsl(var(--muted-foreground))" />
      <text x={armCx - 18} y={elbowY + 4} textAnchor="end" className="fill-muted-foreground text-[8px]">
        {t('guide.elbow')}
      </text>

      {/* 1. Upper Arm circumference */}
      <ellipse cx={armCx} cy={bicepY} rx={pos.armWidth / 2 + 8} ry={5} fill="none" stroke="hsl(var(--foreground))" strokeWidth="1.5" strokeDasharray="6,3" />
      <g onClick={() => onNumberClick(1)} className="cursor-pointer">
        <circle cx={armCx + pos.armWidth / 2 + 15} cy={bicepY} r="7" fill={getCircleFill(1)} />
        <text x={armCx + pos.armWidth / 2 + 15} y={bicepY + 3} textAnchor="middle" className="fill-white text-[9px] font-bold pointer-events-none">1</text>
      </g>

      {/* 2. Wrist circumference */}
      <ellipse cx={pos.rightShoulderX + 5 - pos.wristWidth / 2} cy={wristArmY - 3} rx={pos.wristWidth / 2 + 4} ry={4} fill="none" stroke="hsl(var(--foreground))" strokeWidth="1.5" strokeDasharray="6,3" />
      <g onClick={() => onNumberClick(2)} className="cursor-pointer">
        <circle cx={pos.rightShoulderX + 5 - pos.wristWidth / 2 + pos.wristWidth / 2 + 10} cy={wristArmY - 3} r="7" fill={getCircleFill(2)} />
        <text x={pos.rightShoulderX + 5 - pos.wristWidth / 2 + pos.wristWidth / 2 + 10} y={wristArmY} textAnchor="middle" className="fill-white text-[9px] font-bold pointer-events-none">2</text>
      </g>

      {/* 3. Sleeve Length */}
      <line x1={pos.leftShoulderX - 20} y1={shoulderPtY} x2={pos.leftShoulderX - 20} y2={wristArmY} stroke="hsl(var(--foreground))" strokeWidth="1.5" />
      <line x1={pos.leftShoulderX - 25} y1={shoulderPtY} x2={pos.leftShoulderX - 15} y2={shoulderPtY} stroke="hsl(var(--foreground))" strokeWidth="1.5" />
      <line x1={pos.leftShoulderX - 25} y1={wristArmY} x2={pos.leftShoulderX - 15} y2={wristArmY} stroke="hsl(var(--foreground))" strokeWidth="1.5" />
      <g onClick={() => onNumberClick(3)} className="cursor-pointer">
        <circle cx={pos.leftShoulderX - 20} cy={(shoulderPtY + wristArmY) / 2} r="7" fill={getCircleFill(3)} />
        <text x={pos.leftShoulderX - 20} y={(shoulderPtY + wristArmY) / 2 + 3} textAnchor="middle" className="fill-white text-[9px] font-bold pointer-events-none">3</text>
      </g>

      {/* 4. Elbow Length */}
      <line x1={dimX} y1={shoulderPtY} x2={dimX} y2={elbowY} stroke="hsl(var(--foreground))" strokeWidth="1.5" />
      <line x1={dimX - 5} y1={shoulderPtY} x2={dimX + 5} y2={shoulderPtY} stroke="hsl(var(--foreground))" strokeWidth="1.5" />
      <line x1={dimX - 5} y1={elbowY} x2={dimX + 5} y2={elbowY} stroke="hsl(var(--foreground))" strokeWidth="1.5" />
      <g onClick={() => onNumberClick(4)} className="cursor-pointer">
        <circle cx={dimX} cy={(shoulderPtY + elbowY) / 2} r="7" fill={getCircleFill(4)} />
        <text x={dimX} y={(shoulderPtY + elbowY) / 2 + 3} textAnchor="middle" className="fill-white text-[9px] font-bold pointer-events-none">4</text>
      </g>

      {/* 5. Armhole Depth */}
      <line x1={dimX2} y1={shoulderPtY} x2={dimX2} y2={pos.underarmY} stroke="hsl(var(--foreground))" strokeWidth="1.5" />
      <line x1={dimX2 - 5} y1={shoulderPtY} x2={dimX2 + 5} y2={shoulderPtY} stroke="hsl(var(--foreground))" strokeWidth="1.5" />
      <line x1={dimX2 - 5} y1={pos.underarmY} x2={dimX2 + 5} y2={pos.underarmY} stroke="hsl(var(--foreground))" strokeWidth="1.5" />
      <g onClick={() => onNumberClick(5)} className="cursor-pointer">
        <circle cx={dimX2} cy={(shoulderPtY + pos.underarmY) / 2} r="7" fill={getCircleFill(5)} />
        <text x={dimX2} y={(shoulderPtY + pos.underarmY) / 2 + 3} textAnchor="middle" className="fill-white text-[9px] font-bold pointer-events-none">5</text>
      </g>
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
