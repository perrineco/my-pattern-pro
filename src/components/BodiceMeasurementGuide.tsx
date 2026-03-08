import { useState, useRef, useEffect } from "react";
import React from "react";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Category } from "@/types/sloper";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { SharedBodyDiagram, BodyPositions } from "@/components/guides/SharedBodyDiagram";
import { BackBodyDiagram } from "@/components/guides/BackBodyDiagram";

interface BodiceMeasurementGuideProps {
  category: Category;
}

export function BodiceMeasurementGuide({ category }: BodiceMeasurementGuideProps) {
  const { t } = useLanguage();
  const [highlightedNumber, setHighlightedNumber] = useState<number | null>(null);
  const [view, setView] = useState<'front' | 'back'>('front');
  const instructionRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleNumberClick = (n: number) => {
    setHighlightedNumber(prev => prev === n ? null : n);
  };

  // Auto-switch view when clicking an instruction
  const handleInstructionClick = (n: number) => {
    const isBackMeasurement = n === 4 || n === 5;
    if (isBackMeasurement && view !== 'back') setView('back');
    if (!isBackMeasurement && view !== 'front') setView('front');
    handleNumberClick(n);
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
            <div className="flex flex-col items-center gap-2">
              {/* Front/Back toggle */}
              <div className="flex gap-1 rounded-lg bg-muted p-1">
                <button
                  onClick={() => setView('front')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    view === 'front'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('guide.frontView')}
                </button>
                <button
                  onClick={() => setView('back')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    view === 'back'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('guide.backView')}
                </button>
              </div>

              {/* Diagram */}
              {view === 'front' ? (
                <SharedBodyDiagram
                  category={category}
                  renderOverlay={(pos) => (
                    <BodiceOverlayFront pos={pos} highlightedNumber={highlightedNumber} onNumberClick={handleNumberClick} t={t} />
                  )}
                />
              ) : (
                <BackBodyDiagram
                  category={category}
                  renderOverlay={(pos) => (
                    <BodiceOverlayBack pos={pos} highlightedNumber={highlightedNumber} onNumberClick={handleNumberClick} t={t} />
                  )}
                />
              )}
            </div>
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground italic mb-2">
                {t('guide.clickToSwitch')}
              </p>
              <MeasurementInstruction ref={el => { instructionRefs.current[1] = el; }} number={1} name={t('guide.bust')} description={t('guide.desc.bust')} highlighted={highlightedNumber === 1} view="front" onClick={() => handleInstructionClick(1)} />
              <MeasurementInstruction ref={el => { instructionRefs.current[2] = el; }} number={2} name={t('guide.neckline')} description={t('guide.desc.neckline')} highlighted={highlightedNumber === 2} view="front" onClick={() => handleInstructionClick(2)} />
              <MeasurementInstruction ref={el => { instructionRefs.current[3] = el; }} number={3} name={t('guide.shoulderLength')} description={t('guide.desc.shoulderLength')} highlighted={highlightedNumber === 3} view="front" onClick={() => handleInstructionClick(3)} />
              <MeasurementInstruction ref={el => { instructionRefs.current[4] = el; }} number={4} name={t('guide.backWidth')} description={t('guide.desc.backWidth')} highlighted={highlightedNumber === 4} view="back" onClick={() => handleInstructionClick(4)} />
              <MeasurementInstruction ref={el => { instructionRefs.current[5] = el; }} number={5} name={t('guide.backLength')} description={t('guide.desc.backLength')} highlighted={highlightedNumber === 5} view="back" onClick={() => handleInstructionClick(5)} />
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

// ─── Overlay Face (mesures 1, 2, 3) ──────────────────────────────────────────

function BodiceOverlayFront({ pos, highlightedNumber, onNumberClick, t }: { pos: BodyPositions; highlightedNumber: number | null; onNumberClick: (n: number) => void; t: (key: string) => string }) {
  const cx = pos.centerX;
  const highlightColor = "#f97316";
  const defaultColor = "hsl(var(--foreground))";
  const getCircleFill = (n: number) => highlightedNumber === n ? highlightColor : defaultColor;

  return (
    <>
      {/* 1: Bust line */}
      <line x1={cx - pos.bustWidth / 2 - 10} y1={pos.bustY} x2={cx + pos.bustWidth / 2 + 10} y2={pos.bustY} stroke="hsl(var(--foreground))" strokeWidth="0.8" strokeDasharray="4,3" />
      <g onClick={() => onNumberClick(1)} className="cursor-pointer">
        <circle cx={cx - pos.bustWidth / 2 - 18} cy={pos.bustY} r="7" fill={getCircleFill(1)} />
        <text x={cx - pos.bustWidth / 2 - 18} y={pos.bustY + 3} textAnchor="middle" className="fill-white text-[9px] font-bold pointer-events-none">1</text>
      </g>

      {/* 2: Neckline circumference */}
      <ellipse cx={cx} cy={pos.neckBaseY} rx={12} ry={6} fill="none" stroke="hsl(var(--foreground))" strokeWidth="1" strokeDasharray="3,2" />
      <g onClick={() => onNumberClick(2)} className="cursor-pointer">
        <circle cx={cx + 20} cy={pos.neckBaseY} r="7" fill={getCircleFill(2)} />
        <text x={cx + 20} y={pos.neckBaseY + 3} textAnchor="middle" className="fill-white text-[9px] font-bold pointer-events-none">2</text>
      </g>

      {/* 3: Shoulder length (right side) */}
      <line x1={cx + 8} y1={pos.neckBaseY} x2={pos.rightShoulderX} y2={pos.shoulderY} stroke="hsl(var(--foreground))" strokeWidth="1.5" />
      <circle cx={pos.rightShoulderX} cy={pos.shoulderY} r="3" fill="hsl(var(--foreground))" />
      <circle cx={cx + 8} cy={pos.neckBaseY} r="3" fill="hsl(var(--foreground))" />
      <g onClick={() => onNumberClick(3)} className="cursor-pointer">
        <circle cx={(cx + 8 + pos.rightShoulderX) / 2} cy={(pos.neckBaseY + pos.shoulderY) / 2} r="7" fill={getCircleFill(3)} />
        <text x={(cx + 8 + pos.rightShoulderX) / 2} y={(pos.neckBaseY + pos.shoulderY) / 2 + 3} textAnchor="middle" className="fill-white text-[9px] font-bold pointer-events-none">3</text>
      </g>

      {/* Waist reference line */}
      <line x1={cx - pos.waistWidth / 2 - 10} y1={pos.waistY} x2={cx + pos.waistWidth / 2 + 10} y2={pos.waistY} stroke="hsl(var(--muted-foreground))" strokeWidth="0.7" strokeDasharray="3,3" />
      <text x={cx + pos.waistWidth / 2 + 15} y={pos.waistY + 4} className="fill-muted-foreground text-[8px]">{t('guide.waist')}</text>
    </>
  );
}

// ─── Overlay Dos (mesures 4, 5) ──────────────────────────────────────────────

function BodiceOverlayBack({ pos, highlightedNumber, onNumberClick, t }: { pos: BodyPositions; highlightedNumber: number | null; onNumberClick: (n: number) => void; t: (key: string) => string }) {
  const cx = pos.centerX;
  const highlightColor = "#f97316";
  const defaultColor = "hsl(var(--foreground))";
  const getCircleFill = (n: number) => highlightedNumber === n ? highlightColor : defaultColor;

  return (
    <>
      {/* Nape point */}
      <circle cx={cx} cy={pos.neckBaseY - 5} r="3" fill="hsl(var(--foreground))" />
      <text x={cx - 15} y={pos.neckBaseY - 8} textAnchor="end" className="fill-muted-foreground text-[8px]">{t('guide.nape')}</text>

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

// ─── Instruction de mesure ───────────────────────────────────────────────────

interface MeasurementInstructionProps {
  number: number;
  name: string;
  description: string;
  highlighted?: boolean;
  view: 'front' | 'back';
  onClick?: () => void;
}

const MeasurementInstruction = React.forwardRef<HTMLDivElement, MeasurementInstructionProps>(({ number, name, description, highlighted, view, onClick }, ref) => {
  const highlightColor = "#f97316";
  const viewLabel = view === 'back' ? '(dos)' : '(face)';
  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`flex gap-3 rounded-lg p-2 transition-colors cursor-pointer hover:bg-muted/50 ${highlighted ? 'bg-orange-50 dark:bg-orange-950/30 ring-1 ring-orange-400' : ''}`}
    >
      <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground bg-foreground" style={highlighted ? { backgroundColor: highlightColor } : undefined}>
        {number}
      </div>
      <div>
        <div className="font-medium text-foreground">
          {name} <span className="text-[10px] text-muted-foreground font-normal">{viewLabel}</span>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
});
