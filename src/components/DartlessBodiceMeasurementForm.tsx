import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MeasurementInput } from '@/components/MeasurementInput';
import { Category } from '@/types/sloper';

export interface DartlessBodiceMeasurements {
  // Core measurements
  bust: number;
  waist: number;
  // Vertical measurements
  shoulderToWaist: number;
  // Width measurements
  shoulderWidth: number;
  backWidth: number;
  // Armhole
  armholeDepth: number;
  // Neck
  neckWidth: number;
  neckDepthFront: number;
  neckDepthBack: number;
  // Shoulder
  shoulderSlope: number;
}

interface DartlessBodiceMeasurementFormProps {
  measurements: DartlessBodiceMeasurements;
  onChange: (measurements: DartlessBodiceMeasurements) => void;
  category: Category;
}

export const defaultDartlessBodiceMeasurements: Record<Category, DartlessBodiceMeasurements> = {
  women: {
    bust: 92,
    waist: 70,
    shoulderToWaist: 42,
    shoulderWidth: 38,
    backWidth: 36,
    armholeDepth: 21,
    neckWidth: 14,
    neckDepthFront: 7,
    neckDepthBack: 2,
    shoulderSlope: 4,
  },
  men: {
    bust: 100,
    waist: 84,
    shoulderToWaist: 46,
    shoulderWidth: 44,
    backWidth: 42,
    armholeDepth: 24,
    neckWidth: 16,
    neckDepthFront: 7,
    neckDepthBack: 2.5,
    shoulderSlope: 5,
  },
  kids: {
    bust: 66,
    waist: 54,
    shoulderToWaist: 30,
    shoulderWidth: 28,
    backWidth: 26,
    armholeDepth: 14,
    neckWidth: 11,
    neckDepthFront: 5,
    neckDepthBack: 1.5,
    shoulderSlope: 3,
  },
};

export function DartlessBodiceMeasurementForm({
  measurements,
  onChange,
  category,
}: DartlessBodiceMeasurementFormProps) {
  const handleChange = (key: keyof DartlessBodiceMeasurements) => (value: number) => {
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
          </div>
        </div>

        {/* Neck measurements */}
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Neck
          </span>
          <div className="grid grid-cols-2 gap-3">
            <MeasurementInput
              label="Neck Width"
              value={measurements.neckWidth}
              onChange={handleChange('neckWidth')}
              hint="Base of neck"
            />
            <MeasurementInput
              label="Front Neck Depth"
              value={measurements.neckDepthFront}
              onChange={handleChange('neckDepthFront')}
              hint="From shoulder"
            />
            <MeasurementInput
              label="Back Neck Depth"
              value={measurements.neckDepthBack}
              onChange={handleChange('neckDepthBack')}
              hint="From shoulder"
            />
            <MeasurementInput
              label="Shoulder Slope"
              value={measurements.shoulderSlope}
              onChange={handleChange('shoulderSlope')}
              hint="Drop in cm"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}