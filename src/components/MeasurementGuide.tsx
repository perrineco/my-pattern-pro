import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { Category } from "@/types/sloper";
import { useLanguage } from "@/contexts/LanguageContext";

interface MeasurementGuideProps {
  category: Category;
}

export function MeasurementGuide({ category }: MeasurementGuideProps) {
  const { t } = useLanguage();
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <HelpCircle className="w-4 h-4" />
          {t('action.howToMeasure')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">{t('guide.measurementGuide')}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {/* Body diagram */}
          <div className="flex justify-center">
            <BodyDiagram category={category} t={t} />
          </div>

          {/* Measurement instructions */}
          <div className="space-y-4">
            <MeasurementInstruction
              number={1}
              name={t('guide.waist')}
              color="hsl(var(--primary))"
              description={t('guide.desc.waist')}
            />
            <MeasurementInstruction
              number={2}
              name={t('guide.hip')}
              color="hsl(var(--destructive))"
              description={t('guide.desc.hip')}
            />
            <MeasurementInstruction
              number={3}
              name={t('guide.waistToHip')}
              color="hsl(var(--chart-3))"
              description={t('guide.desc.waistToHip')}
            />
            <MeasurementInstruction
              number={4}
              name={t('guide.skirtLength')}
              color="hsl(var(--chart-4))"
              description={t('guide.desc.skirtLength')}
            />
          </div>
        </div>

        {/* Tips section */}
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
        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
        style={{ backgroundColor: color }}
      >
        {number}
      </div>
      <div>
        <h4 className="font-medium text-foreground">{name}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

interface BodyDiagramProps {
  category: Category;
  t: (key: string) => string;
}

function BodyDiagram({ category, t }: BodyDiagramProps) {
  // Adjust proportions slightly based on category
  const isKids = category === "kids";
  const isMen = category === "men";

  const height = isKids ? 280 : 320;
  const shoulderWidth = isMen ? 90 : 75;
  const hipWidth = isMen ? 70 : 80;
  const waistWidth = isMen ? 65 : 55;

  // Vertical positions
  const shoulderY = 60;
  const waistY = 140;
  const hipY = 175;
  const hemY = 280;

  return (
    <svg viewBox="0 0 200 340" className="w-full max-w-[200px]" style={{ height }}>
      {/* Head */}
      <ellipse cx="100" cy="25" rx="20" ry="24" fill="none" stroke="hsl(var(--border))" strokeWidth="2" />

      {/* Neck */}
      <path
        d={`M 90 48 L 90 ${shoulderY} M 110 48 L 110 ${shoulderY}`}
        fill="none"
        stroke="hsl(var(--border))"
        strokeWidth="2"
      />

      {/* Body outline */}
      <path
        d={`
          M ${100 - shoulderWidth / 2} ${shoulderY}
          Q ${100 - waistWidth / 2 - 10} ${(shoulderY + waistY) / 2} ${100 - waistWidth / 2} ${waistY}
          Q ${100 - hipWidth / 2 - 5} ${(waistY + hipY) / 2} ${100 - hipWidth / 2} ${hipY}
          L ${100 - hipWidth / 2 + 5} ${hemY}
          L ${100 - 15} ${hemY}
          L ${100 - 15} ${hemY + 50}
          M ${100 + 15} ${hemY + 50}
          L ${100 + 15} ${hemY}
          L ${100 + hipWidth / 2 - 5} ${hemY}
          L ${100 + hipWidth / 2} ${hipY}
          Q ${100 + hipWidth / 2 + 5} ${(waistY + hipY) / 2} ${100 + waistWidth / 2} ${waistY}
          Q ${100 + waistWidth / 2 + 10} ${(shoulderY + waistY) / 2} ${100 + shoulderWidth / 2} ${shoulderY}
        `}
        fill="none"
        stroke="hsl(var(--border))"
        strokeWidth="2"
      />

      {/* Arms */}
      <path
        d={`
          M ${100 - shoulderWidth / 2} ${shoulderY}
          Q ${100 - shoulderWidth / 2 - 15} ${shoulderY + 40} ${100 - shoulderWidth / 2 - 20} ${shoulderY + 100}
          L ${100 - shoulderWidth / 2 - 25} ${shoulderY + 130}
        `}
        fill="none"
        stroke="hsl(var(--border))"
        strokeWidth="2"
      />
      <path
        d={`
          M ${100 + shoulderWidth / 2} ${shoulderY}
          Q ${100 + shoulderWidth / 2 + 15} ${shoulderY + 40} ${100 + shoulderWidth / 2 + 20} ${shoulderY + 100}
          L ${100 + shoulderWidth / 2 + 25} ${shoulderY + 130}
        `}
        fill="none"
        stroke="hsl(var(--border))"
        strokeWidth="2"
      />

      {/* Measurement lines */}
      {/* 1. Waist line */}
      <line
        x1={100 - waistWidth / 2 - 20}
        y1={waistY}
        x2={100 + waistWidth / 2 + 20}
        y2={waistY}
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeDasharray="6,3"
      />
      <circle cx={100 - waistWidth / 2 - 20} cy={waistY} r="10" fill="hsl(var(--primary))" />
      <text
        x={100 - waistWidth / 2 - 20}
        y={waistY + 4}
        textAnchor="middle"
        className="fill-primary-foreground text-xs font-bold"
      >
        1
      </text>

      {/* 2. Hip line */}
      <line
        x1={100 - hipWidth / 2 - 20}
        y1={hipY}
        x2={100 + hipWidth / 2 + 20}
        y2={hipY}
        stroke="hsl(var(--destructive))"
        strokeWidth="2"
        strokeDasharray="6,3"
      />
      <circle cx={100 + hipWidth / 2 + 20} cy={hipY} r="10" fill="hsl(var(--destructive))" />
      <text
        x={100 + hipWidth / 2 + 20}
        y={hipY + 4}
        textAnchor="middle"
        className="fill-destructive-foreground text-xs font-bold"
      >
        2
      </text>

      {/* 3. Waist to Hip vertical */}
      <line
        x1={100 + hipWidth / 2 + 35}
        y1={waistY}
        x2={100 + hipWidth / 2 + 35}
        y2={hipY}
        stroke="hsl(var(--chart-3))"
        strokeWidth="2"
      />
      <line
        x1={100 + hipWidth / 2 + 30}
        y1={waistY}
        x2={100 + hipWidth / 2 + 40}
        y2={waistY}
        stroke="hsl(var(--chart-3))"
        strokeWidth="2"
      />
      <line
        x1={100 + hipWidth / 2 + 30}
        y1={hipY}
        x2={100 + hipWidth / 2 + 40}
        y2={hipY}
        stroke="hsl(var(--chart-3))"
        strokeWidth="2"
      />
      <circle cx={100 + hipWidth / 2 + 35} cy={(waistY + hipY) / 2} r="10" fill="hsl(var(--chart-3))" />
      <text
        x={100 + hipWidth / 2 + 35}
        y={(waistY + hipY) / 2 + 4}
        textAnchor="middle"
        className="fill-white text-xs font-bold"
      >
        3
      </text>

      {/* 4. Skirt length vertical */}
      <line
        x1={100 - hipWidth / 2 - 35}
        y1={waistY}
        x2={100 - hipWidth / 2 - 35}
        y2={hemY}
        stroke="hsl(var(--chart-4))"
        strokeWidth="2"
      />
      <line
        x1={100 - hipWidth / 2 - 40}
        y1={waistY}
        x2={100 - hipWidth / 2 - 30}
        y2={waistY}
        stroke="hsl(var(--chart-4))"
        strokeWidth="2"
      />
      <line
        x1={100 - hipWidth / 2 - 40}
        y1={hemY}
        x2={100 - hipWidth / 2 - 30}
        y2={hemY}
        stroke="hsl(var(--chart-4))"
        strokeWidth="2"
      />
      <circle cx={100 - hipWidth / 2 - 35} cy={(waistY + hemY) / 2} r="10" fill="hsl(var(--chart-4))" />
      <text
        x={100 - hipWidth / 2 - 35}
        y={(waistY + hemY) / 2 + 4}
        textAnchor="middle"
        className="fill-white text-xs font-bold"
      >
        4
      </text>

      {/* Labels */}
      <text x="100" y={waistY - 8} textAnchor="middle" className="fill-muted-foreground text-[10px]">
        {t('guide.waist')}
      </text>
      <text x="100" y={hipY + 18} textAnchor="middle" className="fill-muted-foreground text-[10px]">
        {t('guide.hip')}
      </text>
    </svg>
  );
}
