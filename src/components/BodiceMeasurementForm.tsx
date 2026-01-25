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
    waist: 70,
    shoulderToWaist: 42,
    bustHeight: 26,
    shoulderWidth: 38,
    backWidth: 36,
    chestWidth: 34,
    armholeDepth: 21,
    neckWidth: 14,
    shoulderSlope: 4,
  },
  men: {
    bust: 100,
    waist: 84,
    shoulderToWaist: 46,
    bustHeight: 28,
    shoulderWidth: 44,
    backWidth: 42,
    chestWidth: 40,
    armholeDepth: 24,
    neckWidth: 16,
    shoulderSlope: 5,
  },
  kids: {
    bust: 66,
    waist: 54,
    shoulderToWaist: 30,
    bustHeight: 18,
    shoulderWidth: 28,
    backWidth: 26,
    chestWidth: 24,
    armholeDepth: 14,
    neckWidth: 11,
    shoulderSlope: 3,
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
          <div className="grid grid-cols-2 gap-3">
            <MeasurementInput
              label="Bust"
              value={measurements.bust}
              onChange={handleChange('bust')}
              hint={category === 'women' ? '82-110' : category === 'men' ? '90-120' : '56-76'}
            />
            <MeasurementInput
              label="Waist"
              value={measurements.waist}
              onChange={handleChange('waist')}
              hint={category === 'women' ? '60-90' : category === 'men' ? '70-110' : '46-62'}
            />
          </div>
        </div>

        {/* Vertical measurements */}
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Vertical
          </span>
          <div className="grid grid-cols-2 gap-3">
            <MeasurementInput
              label="Shoulder to Waist"
              value={measurements.shoulderToWaist}
              onChange={handleChange('shoulderToWaist')}
              hint="Front length"
            />
            <MeasurementInput
              label="Bust Height"
              value={measurements.bustHeight}
              onChange={handleChange('bustHeight')}
              hint="To bust point"
            />
            <MeasurementInput
              label="Armhole Depth"
              value={measurements.armholeDepth}
              onChange={handleChange('armholeDepth')}
              hint="From shoulder"
            />
          </div>
        </div>

        {/* Width measurements */}
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Width
          </span>
          <div className="grid grid-cols-2 gap-3">
            <MeasurementInput
              label="Shoulder Width"
              value={measurements.shoulderWidth}
              onChange={handleChange('shoulderWidth')}
              hint="Across back"
            />
            <MeasurementInput
              label="Back Width"
              value={measurements.backWidth}
              onChange={handleChange('backWidth')}
              hint="Armhole to armhole"
            />
            <MeasurementInput
              label="Chest Width"
              value={measurements.chestWidth}
              onChange={handleChange('chestWidth')}
              hint="Front width"
            />
            <MeasurementInput
              label="Neck Width"
              value={measurements.neckWidth}
              onChange={handleChange('neckWidth')}
              hint="Base of neck"
            />
          </div>
        </div>

        {/* Shoulder */}
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Shoulder
          </span>
          <MeasurementInput
            label="Shoulder Slope"
            value={measurements.shoulderSlope}
            onChange={handleChange('shoulderSlope')}
            hint="Drop in cm"
          />
        </div>
      </CardContent>
    </Card>
  );
}
