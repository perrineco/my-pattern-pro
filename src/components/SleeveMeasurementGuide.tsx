import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { Category } from "@/types/sloper";
import { useLanguage } from "@/contexts/LanguageContext";
import { SharedBodyDiagram, BodyPositions } from "@/components/guides/SharedBodyDiagram";

interface SleeveMeasurementGuideProps {
  category: Category;
}

export function SleeveMeasurementGuide({ category }: SleeveMeasurementGuideProps) {
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
          <DialogTitle className="font-serif text-xl">{t('guide.sleeveMeasurementGuide')}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div className="flex justify-center">
            <SharedBodyDiagram
              category={category}
              renderOverlay={(pos) => <SleeveOverlay pos={pos} t={t} />}
            />
          </div>

          <div className="space-y-4">
            <MeasurementInstruction number={1} name={t('guide.upperArm')} color="hsl(var(--primary))" description={t('guide.desc.upperArm')} />
            <MeasurementInstruction number={2} name={t('guide.wrist')} color="hsl(var(--destructive))" description={t('guide.desc.wrist')} />
            <MeasurementInstruction number={3} name={t('guide.sleeveLength')} color="hsl(var(--chart-3))" description={t('guide.desc.sleeveLength')} />
            <MeasurementInstruction number={4} name={t('guide.elbowLength')} color="hsl(var(--chart-4))" description={t('guide.desc.elbowLength')} />
            <MeasurementInstruction number={5} name={t('guide.armholeDepth')} color="hsl(var(--chart-5))" description={t('guide.desc.armholeDepth')} />
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
      </DialogContent>
    </Dialog>
  );
}

function SleeveOverlay({ pos, t }: { pos: BodyPositions; t: (key: string) => string }) {
  // We use the RIGHT arm for sleeve measurements
  const armCx = pos.rightShoulderX + 8; // center of the right arm
  const armOuterX = pos.rightShoulderX + 8;

  // Key Y positions along the right arm
  const shoulderPtY = pos.shoulderY;
  const bicepY = pos.underarmY + 15;
  const elbowY = pos.elbowY;
  const wristArmY = pos.wristY;

  // Offset for dimension lines (to the right of the arm)
  const dimX = armOuterX + 30;
  const dimX2 = armOuterX + 45;

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
      <ellipse cx={armCx} cy={bicepY} rx={pos.armWidth / 2 + 8} ry={5} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="6,3" />
      <circle cx={armCx + pos.armWidth / 2 + 15} cy={bicepY} r="10" fill="hsl(var(--primary))" />
      <text x={armCx + pos.armWidth / 2 + 15} y={bicepY + 4} textAnchor="middle" className="fill-primary-foreground text-xs font-bold">1</text>

      {/* 2. Wrist circumference */}
      <ellipse cx={pos.rightShoulderX + 5 - pos.wristWidth / 2} cy={wristArmY - 3} rx={pos.wristWidth / 2 + 4} ry={4} fill="none" stroke="hsl(var(--destructive))" strokeWidth="2" strokeDasharray="6,3" />
      <circle cx={pos.rightShoulderX + 5 - pos.wristWidth / 2 + pos.wristWidth / 2 + 10} cy={wristArmY - 3} r="10" fill="hsl(var(--destructive))" />
      <text x={pos.rightShoulderX + 5 - pos.wristWidth / 2 + pos.wristWidth / 2 + 10} y={wristArmY + 1} textAnchor="middle" className="fill-destructive-foreground text-xs font-bold">2</text>

      {/* 3. Sleeve Length (shoulder to wrist) - left side of right arm */}
      <line x1={pos.leftShoulderX - 20} y1={shoulderPtY} x2={pos.leftShoulderX - 20} y2={wristArmY} stroke="hsl(var(--chart-3))" strokeWidth="2" />
      <line x1={pos.leftShoulderX - 25} y1={shoulderPtY} x2={pos.leftShoulderX - 15} y2={shoulderPtY} stroke="hsl(var(--chart-3))" strokeWidth="2" />
      <line x1={pos.leftShoulderX - 25} y1={wristArmY} x2={pos.leftShoulderX - 15} y2={wristArmY} stroke="hsl(var(--chart-3))" strokeWidth="2" />
      <circle cx={pos.leftShoulderX - 20} cy={(shoulderPtY + wristArmY) / 2} r="10" fill="hsl(var(--chart-3))" />
      <text x={pos.leftShoulderX - 20} y={(shoulderPtY + wristArmY) / 2 + 4} textAnchor="middle" className="fill-white text-xs font-bold">3</text>

      {/* 4. Elbow Length (shoulder to elbow) */}
      <line x1={dimX} y1={shoulderPtY} x2={dimX} y2={elbowY} stroke="hsl(var(--chart-4))" strokeWidth="2" />
      <line x1={dimX - 5} y1={shoulderPtY} x2={dimX + 5} y2={shoulderPtY} stroke="hsl(var(--chart-4))" strokeWidth="2" />
      <line x1={dimX - 5} y1={elbowY} x2={dimX + 5} y2={elbowY} stroke="hsl(var(--chart-4))" strokeWidth="2" />
      <circle cx={dimX} cy={(shoulderPtY + elbowY) / 2} r="10" fill="hsl(var(--chart-4))" />
      <text x={dimX} y={(shoulderPtY + elbowY) / 2 + 4} textAnchor="middle" className="fill-white text-xs font-bold">4</text>

      {/* 5. Armhole Depth (shoulder to underarm) */}
      <line x1={dimX2} y1={shoulderPtY} x2={dimX2} y2={pos.underarmY} stroke="hsl(var(--chart-5))" strokeWidth="2" />
      <line x1={dimX2 - 5} y1={shoulderPtY} x2={dimX2 + 5} y2={shoulderPtY} stroke="hsl(var(--chart-5))" strokeWidth="2" />
      <line x1={dimX2 - 5} y1={pos.underarmY} x2={dimX2 + 5} y2={pos.underarmY} stroke="hsl(var(--chart-5))" strokeWidth="2" />
      <circle cx={dimX2} cy={(shoulderPtY + pos.underarmY) / 2} r="10" fill="hsl(var(--chart-5))" />
      <text x={dimX2} y={(shoulderPtY + pos.underarmY) / 2 + 4} textAnchor="middle" className="fill-white text-xs font-bold">5</text>
    </>
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
      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ backgroundColor: color }}>
        {number}
      </div>
      <div>
        <h4 className="font-medium text-foreground">{name}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
