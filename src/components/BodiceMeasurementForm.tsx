import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MeasurementInput } from '@/components/MeasurementInput';
import { BodiceMeasurementGuide } from '@/components/BodiceMeasurementGuide';
import { Category, BodiceMeasurements } from '@/types/sloper';

interface BodiceMeasurementFormProps {
  measurements: BodiceMeasurements;
  onChange: (measurements: BodiceMeasurements) => void;
  category: Category;
}

export const defaultBodiceMeasurements: Record<Category, BodiceMeasurements> = {
  women: {
    bust: 92,
    neckCircumference: 36,
    shoulderLength: 13,
    backWidth: 36,
    backLength: 42,
  },
  men: {
    bust: 102,
    neckCircumference: 40,
    shoulderLength: 15,
    backWidth: 42,
    backLength: 46,
  },
  kids: {
    bust: 68,
    neckCircumference: 30,
    shoulderLength: 10,
    backWidth: 28,
    backLength: 30,
  },
};

export function BodiceMeasurementForm({
  measurements,
  onChange,
  category,
}: BodiceMeasurementFormProps) {
  const handleChange = (key: keyof BodiceMeasurements) => (value: number) => {
    onChange({ ...measurements, [key]: value });
  };

  const handleReset = () => {
    onChange(defaultBodiceMeasurements[category]);
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-serif text-lg text-foreground">
            Bodice Measurements
          </CardTitle>
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
      </CardContent>
    </Card>
  );
}
