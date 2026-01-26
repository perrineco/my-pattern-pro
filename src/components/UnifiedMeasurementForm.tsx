import { Card } from '@/components/ui/card';
import { MeasurementInput } from '@/components/MeasurementInput';
import { Category, UnifiedMeasurements } from '@/types/sloper';
import { Ruler, User, Shirt } from 'lucide-react';

interface UnifiedMeasurementFormProps {
  measurements: UnifiedMeasurements;
  onChange: (measurements: UnifiedMeasurements) => void;
  category: Category;
}

export const defaultUnifiedMeasurements: Record<Category, UnifiedMeasurements> = {
  women: {
    bust: 92,
    waist: 70,
    hip: 98,
    shoulderToWaist: 42,
    bustHeight: 26,
    waistToHip: 20,
    skirtLength: 60,
    shoulderWidth: 38,
    backWidth: 36,
    chestWidth: 34,
    armholeDepth: 21,
    neckWidth: 14,
    neckDepthFront: 7,
    neckDepthBack: 2,
    shoulderSlope: 4.5,
  },
  men: {
    bust: 102,
    waist: 88,
    hip: 100,
    shoulderToWaist: 46,
    bustHeight: 28,
    waistToHip: 22,
    skirtLength: 65,
    shoulderWidth: 46,
    backWidth: 42,
    chestWidth: 40,
    armholeDepth: 24,
    neckWidth: 16,
    neckDepthFront: 8,
    neckDepthBack: 2.5,
    shoulderSlope: 5,
  },
  kids: {
    bust: 68,
    waist: 58,
    hip: 72,
    shoulderToWaist: 30,
    bustHeight: 18,
    waistToHip: 14,
    skirtLength: 35,
    shoulderWidth: 30,
    backWidth: 28,
    chestWidth: 26,
    armholeDepth: 15,
    neckWidth: 12,
    neckDepthFront: 5,
    neckDepthBack: 1.5,
    shoulderSlope: 3,
  },
};

export function UnifiedMeasurementForm({
  measurements,
  onChange,
  category,
}: UnifiedMeasurementFormProps) {
  const handleChange = (key: keyof UnifiedMeasurements, value: number) => {
    onChange({ ...measurements, [key]: value });
  };

  return (
    <Card className="p-5 space-y-6">
      {/* Body Measurements */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <User className="w-4 h-4 text-primary" />
          Body Measurements
        </div>
        <div className="grid gap-3">
          <MeasurementInput
            label="Bust / Chest"
            value={measurements.bust}
            onChange={(v) => handleChange('bust', v)}
            min={50}
            max={150}
            hint="Fullest part"
          />
          <MeasurementInput
            label="Waist"
            value={measurements.waist}
            onChange={(v) => handleChange('waist', v)}
            min={40}
            max={130}
            hint="Natural waistline"
          />
          <MeasurementInput
            label="Hip"
            value={measurements.hip}
            onChange={(v) => handleChange('hip', v)}
            min={60}
            max={150}
            hint="Fullest part"
          />
        </div>
      </div>

      {/* Vertical Measurements */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Ruler className="w-4 h-4 text-primary" />
          Vertical Measurements
        </div>
        <div className="grid gap-3">
          <MeasurementInput
            label="Shoulder to Waist"
            value={measurements.shoulderToWaist}
            onChange={(v) => handleChange('shoulderToWaist', v)}
            min={30}
            max={60}
          />
          <MeasurementInput
            label="Bust Height"
            value={measurements.bustHeight}
            onChange={(v) => handleChange('bustHeight', v)}
            min={15}
            max={40}
            hint="Shoulder to bust point"
          />
          <MeasurementInput
            label="Waist to Hip"
            value={measurements.waistToHip}
            onChange={(v) => handleChange('waistToHip', v)}
            min={15}
            max={30}
          />
          <MeasurementInput
            label="Skirt Length"
            value={measurements.skirtLength}
            onChange={(v) => handleChange('skirtLength', v)}
            min={30}
            max={120}
            hint="Waist to hem"
          />
        </div>
      </div>

      {/* Width Measurements */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Shirt className="w-4 h-4 text-primary" />
          Width & Depth Measurements
        </div>
        <div className="grid gap-3">
          <MeasurementInput
            label="Shoulder Width"
            value={measurements.shoulderWidth}
            onChange={(v) => handleChange('shoulderWidth', v)}
            min={30}
            max={60}
          />
          <MeasurementInput
            label="Back Width"
            value={measurements.backWidth}
            onChange={(v) => handleChange('backWidth', v)}
            min={25}
            max={55}
          />
          <MeasurementInput
            label="Chest Width"
            value={measurements.chestWidth}
            onChange={(v) => handleChange('chestWidth', v)}
            min={25}
            max={55}
          />
          <MeasurementInput
            label="Armhole Depth"
            value={measurements.armholeDepth}
            onChange={(v) => handleChange('armholeDepth', v)}
            min={15}
            max={30}
          />
          <MeasurementInput
            label="Neck Width"
            value={measurements.neckWidth}
            onChange={(v) => handleChange('neckWidth', v)}
            min={10}
            max={20}
          />
          <MeasurementInput
            label="Neck Depth Front"
            value={measurements.neckDepthFront}
            onChange={(v) => handleChange('neckDepthFront', v)}
            min={4}
            max={15}
          />
          <MeasurementInput
            label="Neck Depth Back"
            value={measurements.neckDepthBack}
            onChange={(v) => handleChange('neckDepthBack', v)}
            min={1}
            max={8}
          />
          <MeasurementInput
            label="Shoulder Slope"
            value={measurements.shoulderSlope}
            onChange={(v) => handleChange('shoulderSlope', v)}
            min={2}
            max={8}
            step={0.5}
            hint="Drop in cm"
          />
        </div>
      </div>
    </Card>
  );
}
