import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Category } from "@/types/sloper";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";

interface BodiceMeasurementGuideProps {
  category: Category;
}

export function BodiceMeasurementGuide({ category }: BodiceMeasurementGuideProps) {
  const { t } = useLanguage();
  const [highlightedNumber, setHighlightedNumber] = useState<number | null>(null);

  const handleNumberClick = (n: number) => {
    setHighlightedNumber(prev => prev === n ? null : n);
  };
  
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
              <BodiceBodyDiagram category={category} highlightedNumber={highlightedNumber} onNumberClick={handleNumberClick} />
            </div>
            <div className="space-y-4">
              <MeasurementInstruction
                number={1}
                name={t('guide.bust')}
                color="hsl(var(--primary))"
                description={t('guide.desc.bust')}
              />
              <MeasurementInstruction
                number={2}
                name={t('guide.neckline')}
                color="hsl(var(--chart-2))"
                description={t('guide.desc.neckline')}
              />
              <MeasurementInstruction
                number={3}
                name={t('guide.shoulderLength')}
                color="hsl(var(--chart-3))"
                description={t('guide.desc.shoulderLength')}
              />
              <MeasurementInstruction
                number={4}
                name={t('guide.backWidth')}
                color="hsl(var(--chart-4))"
                description={t('guide.desc.backWidth')}
              />
              <MeasurementInstruction
                number={5}
                name={t('guide.backLength')}
                color="hsl(var(--chart-5))"
                description={t('guide.desc.backLength')}
              />
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

interface MeasurementInstructionProps {
  number: number;
  name: string;
  color: string;
  description: string;
}

function MeasurementInstruction({ number, name, color, description }: MeasurementInstructionProps) {
  return (
    <div className="flex gap-3">
      <div
        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
        style={{ backgroundColor: color }}
      >
        {number}
      </div>
      <div>
        <div className="font-medium text-foreground">{name}</div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function BodiceBodyDiagram({ category, highlightedNumber, onNumberClick }: { category: Category; highlightedNumber: number | null; onNumberClick: (n: number) => void }) {
  const isKids = category === "kids";
  const highlightColor = "#f97316";
  const getCircleFill = (n: number, defaultColor: string) => highlightedNumber === n ? highlightColor : defaultColor;
  const isMen = category === "men";

  // Adjust proportions based on category
  const shoulderWidth = isMen ? 90 : isKids ? 60 : 75;
  const bustWidth = isMen ? 85 : isKids ? 55 : 80;
  const waistWidth = isMen ? 75 : isKids ? 50 : 60;

  // Vertical positions
  const neckBaseY = 55;
  const shoulderY = 50;
  const bustY = isKids ? 100 : isMen ? 110 : 105;
  const waistY = isKids ? 140 : isMen ? 165 : 155;
  const backWidthY = isKids ? 75 : isMen ? 80 : 78; // Position for carrure dos

  const centerX = 100;

  return (
    <svg viewBox="0 0 200 260" className="w-full max-w-[200px] h-auto">
      {/* Head */}
      <ellipse cx={centerX} cy={25} rx={18} ry={22} fill="none" stroke="hsl(var(--border))" strokeWidth="2" />

      {/* Neck */}
      <path
        d={`M ${centerX - 8} 45 L ${centerX - 8} 55 M ${centerX + 8} 45 L ${centerX + 8} 55`}
        stroke="hsl(var(--border))"
        strokeWidth="2"
        fill="none"
      />

      {/* Nape point (7th cervical vertebra) */}
      <circle cx={centerX} cy={neckBaseY - 5} r="3" fill="hsl(var(--chart-5))" />

      {/* Body outline */}
      <path
        d={`
          M ${centerX - shoulderWidth / 2} ${shoulderY}
          Q ${centerX - shoulderWidth / 2 - 5} ${(shoulderY + bustY) / 2} ${centerX - bustWidth / 2} ${bustY}
          Q ${centerX - waistWidth / 2 - 5} ${(bustY + waistY) / 2} ${centerX - waistWidth / 2} ${waistY}
          L ${centerX - waistWidth / 2} 200
          L ${centerX + waistWidth / 2} 200
          L ${centerX + waistWidth / 2} ${waistY}
          Q ${centerX + waistWidth / 2 + 5} ${(bustY + waistY) / 2} ${centerX + bustWidth / 2} ${bustY}
          Q ${centerX + shoulderWidth / 2 + 5} ${(shoulderY + bustY) / 2} ${centerX + shoulderWidth / 2} ${shoulderY}
          L ${centerX + 8} 55
          Q ${centerX} 50 ${centerX - 8} 55
          L ${centerX - shoulderWidth / 2} ${shoulderY}
        `}
        fill="hsl(var(--pattern-fill))"
        stroke="hsl(var(--border))"
        strokeWidth="2"
      />

      {/* Arms (simplified) */}
      <path
        d={`M ${centerX - shoulderWidth / 2} ${shoulderY} Q ${centerX - shoulderWidth / 2 - 20} ${shoulderY + 40} ${centerX - shoulderWidth / 2 - 15} ${shoulderY + 80}`}
        stroke="hsl(var(--border))"
        strokeWidth="2"
        fill="none"
      />
      <path
        d={`M ${centerX + shoulderWidth / 2} ${shoulderY} Q ${centerX + shoulderWidth / 2 + 20} ${shoulderY + 40} ${centerX + shoulderWidth / 2 + 15} ${shoulderY + 80}`}
        stroke="hsl(var(--border))"
        strokeWidth="2"
        fill="none"
      />

      {/* 1: Bust line */}
      <line
        x1={centerX - bustWidth / 2 - 15}
        y1={bustY}
        x2={centerX + bustWidth / 2 + 15}
        y2={bustY}
        stroke="hsl(var(--primary))"
        strokeWidth="2.5"
        strokeDasharray="4,2"
      />
      <g onClick={() => onNumberClick(1)} className="cursor-pointer">
        <circle cx={centerX - bustWidth / 2 - 20} cy={bustY} r="10" fill={getCircleFill(1, "hsl(var(--primary))")} />
        <text x={centerX - bustWidth / 2 - 20} y={bustY + 4} textAnchor="middle" className="fill-white text-[10px] font-bold pointer-events-none">1</text>
      </g>

      {/* 2: Neckline circumference */}
      <ellipse
        cx={centerX}
        cy={neckBaseY}
        rx={12}
        ry={6}
        fill="none"
        stroke="hsl(var(--chart-2))"
        strokeWidth="2.5"
        strokeDasharray="3,2"
      />
      <g onClick={() => onNumberClick(2)} className="cursor-pointer">
        <circle cx={centerX + 20} cy={neckBaseY} r="10" fill={getCircleFill(2, "hsl(var(--chart-2))")} />
        <text x={centerX + 20} y={neckBaseY + 4} textAnchor="middle" className="fill-white text-[10px] font-bold pointer-events-none">2</text>
      </g>

      {/* 3: Shoulder length (left shoulder highlighted) */}
      <line
        x1={centerX - 8}
        y1={neckBaseY}
        x2={centerX - shoulderWidth / 2}
        y2={shoulderY}
        stroke="hsl(var(--chart-3))"
        strokeWidth="3"
      />
      <circle cx={centerX - shoulderWidth / 2} cy={shoulderY} r="4" fill="hsl(var(--chart-3))" />
      <circle cx={centerX - 8} cy={neckBaseY} r="4" fill="hsl(var(--chart-3))" />
      <g onClick={() => onNumberClick(3)} className="cursor-pointer">
        <circle cx={centerX - shoulderWidth / 4 - 4} cy={(neckBaseY + shoulderY) / 2} r="10" fill={getCircleFill(3, "hsl(var(--chart-3))")} />
        <text x={centerX - shoulderWidth / 4 - 4} y={(neckBaseY + shoulderY) / 2 + 4} textAnchor="middle" className="fill-white text-[10px] font-bold pointer-events-none">3</text>
      </g>

      {/* 4: Back width (Carrure dos) */}
      <line
        x1={centerX - bustWidth / 2 + 8}
        y1={backWidthY}
        x2={centerX + bustWidth / 2 - 8}
        y2={backWidthY}
        stroke="hsl(var(--chart-4))"
        strokeWidth="3"
      />
      {/* Small vertical indicators at endpoints */}
      <line
        x1={centerX - bustWidth / 2 + 8}
        y1={backWidthY - 5}
        x2={centerX - bustWidth / 2 + 8}
        y2={backWidthY + 5}
        stroke="hsl(var(--chart-4))"
        strokeWidth="2"
      />
      <line
        x1={centerX + bustWidth / 2 - 8}
        y1={backWidthY - 5}
        x2={centerX + bustWidth / 2 - 8}
        y2={backWidthY + 5}
        stroke="hsl(var(--chart-4))"
        strokeWidth="2"
      />
      <g onClick={() => onNumberClick(4)} className="cursor-pointer">
        <circle cx={centerX} cy={backWidthY - 12} r="10" fill={getCircleFill(4, "hsl(var(--chart-4))")} />
        <text x={centerX} y={backWidthY - 8} textAnchor="middle" className="fill-white text-[10px] font-bold pointer-events-none">4</text>
      </g>
      {/* Label for clarity */}
      <text x={centerX} y={backWidthY + 15} textAnchor="middle" className="fill-muted-foreground text-[8px]">
        Carrure dos
      </text>

      {/* 5: Back length (from nape to waist) */}
      <line
        x1={centerX + 15}
        y1={neckBaseY - 5}
        x2={centerX + 15}
        y2={waistY}
        stroke="hsl(var(--chart-5))"
        strokeWidth="3"
      />
      {/* Horizontal indicators */}
      <line
        x1={centerX + 10}
        y1={neckBaseY - 5}
        x2={centerX + 20}
        y2={neckBaseY - 5}
        stroke="hsl(var(--chart-5))"
        strokeWidth="2"
      />
      <line x1={centerX + 10} y1={waistY} x2={centerX + 20} y2={waistY} stroke="hsl(var(--chart-5))" strokeWidth="2" />
      <g onClick={() => onNumberClick(5)} className="cursor-pointer">
        <circle cx={centerX + 30} cy={(neckBaseY + waistY) / 2} r="10" fill={getCircleFill(5, "hsl(var(--chart-5))")} />
        <text x={centerX + 30} y={(neckBaseY + waistY) / 2 + 4} textAnchor="middle" className="fill-white text-[10px] font-bold pointer-events-none">5</text>
      </g>

      {/* Waist line indicator (reference) */}
      <line
        x1={centerX - waistWidth / 2 - 10}
        y1={waistY}
        x2={centerX + waistWidth / 2 + 10}
        y2={waistY}
        stroke="hsl(var(--muted-foreground))"
        strokeWidth="1"
        strokeDasharray="3,3"
      />
      <text x={centerX + waistWidth / 2 + 15} y={waistY + 4} className="fill-muted-foreground text-[8px]">
        Waist
      </text>

      {/* Labels */}
      <text x={centerX} y={245} textAnchor="middle" className="fill-muted-foreground text-[9px]">
        {category === "women" ? "Women" : category === "men" ? "Men" : "Kids"}
      </text>
    </svg>
  );
}
