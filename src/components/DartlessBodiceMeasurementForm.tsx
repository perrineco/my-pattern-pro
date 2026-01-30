import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MeasurementInput } from '@/components/MeasurementInput';
import { BodiceMeasurementGuide } from '@/components/BodiceMeasurementGuide';
import { Category, BodiceMeasurements } from '@/types/sloper';

interface DartlessBodiceMeasurementFormProps {
  measurements: BodiceMeasurements;
  onChange: (measurements: BodiceMeasurements) => void;
  category: Category;
}

export const defaultDartlessBodiceMeasurements: Record<Category, BodiceMeasurements> = {
  women: {
    bust: 92,
    neckCircumference: 36,
    shoulderLength: 13,
    backWidth: 36,
    backLength: 42,
    ease: 2,
  },
  men: {
    bust: 102,
    neckCircumference: 40,
    shoulderLength: 15,
    backWidth: 42,
    backLength: 46,
    ease: 3,
  },
  kids: {
    bust: 68,
    neckCircumference: 30,
    shoulderLength: 10,
    backWidth: 28,
    backLength: 30,
    ease: 2.5,
  },
};

export function DartlessBodiceMeasurementForm({
  measurements,
  onChange,
  category,
}: DartlessBodiceMeasurementFormProps) {
  const handleChange = (key: keyof BodiceMeasurements) => (value: number) => {
    onChange({ ...measurements, [key]: value });
  };

  const handleReset = () => {
    onChange(defaultDartlessBodiceMeasurements[category]);
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-serif text-lg text-foreground">
              Dartless Bodice
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Simple bodice block without bust darts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <BodiceMeasurementGuide category={category} />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Core measurements */}
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Core
          </span>
          <div className="grid gap-3">
            <MeasurementInput
              label="Bust"
              value={measurements.bust}
              onChange={handleChange('bust')}
              hint="Tour de poitrine"
            />
            <MeasurementInput
              label="Neckline Circumference"
              value={measurements.neckCircumference}
              onChange={handleChange('neckCircumference')}
              hint="Tour de cou"
            />
          </div>
        </div>

        {/* Width & Length measurements */}
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Width & Length
          </span>
          <div className="grid gap-3">
            <MeasurementInput
              label="Shoulder Length"
              value={measurements.shoulderLength}
              onChange={handleChange('shoulderLength')}
              hint="Longueur d'épaule"
            />
            <MeasurementInput
              label="Back Width"
              value={measurements.backWidth}
              onChange={handleChange('backWidth')}
              hint="Carrure dos"
            />
            <MeasurementInput
              label="Back Length"
              value={measurements.backLength}
              onChange={handleChange('backLength')}
              hint="Longueur taille-dos"
            />
          </div>
        </div>

        {/* Ease */}
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Ease
          </span>
          <div className="grid gap-3">
            <MeasurementInput
              label="Ease"
              value={measurements.ease ?? 2}
              onChange={handleChange('ease')}
              hint="Added wearing room (cm)"
              min={0}
              max={10}
              step={0.5}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
