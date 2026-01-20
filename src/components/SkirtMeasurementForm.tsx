import { SkirtMeasurements, Category } from '@/types/sloper';
import { MeasurementInput } from './MeasurementInput';
import { Card } from '@/components/ui/card';

interface SkirtMeasurementFormProps {
  measurements: SkirtMeasurements;
  onChange: (measurements: SkirtMeasurements) => void;
  category: Category;
}

const defaultMeasurements: Record<Category, SkirtMeasurements> = {
  women: { waist: 70, hip: 98, waistToHip: 20, skirtLength: 60 },
  men: { waist: 84, hip: 100, waistToHip: 22, skirtLength: 55 },
  kids: { waist: 54, hip: 68, waistToHip: 14, skirtLength: 35 },
};

export function SkirtMeasurementForm({
  measurements,
  onChange,
  category,
}: SkirtMeasurementFormProps) {
  const handleChange = (key: keyof SkirtMeasurements) => (value: number) => {
    onChange({ ...measurements, [key]: value });
  };

  const handleReset = () => {
    onChange(defaultMeasurements[category]);
  };

  return (
    <Card className="p-6 space-y-6 bg-card border-border">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-xl font-semibold text-foreground">Measurements</h3>
        <button
          onClick={handleReset}
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          Reset to default
        </button>
      </div>

      <div className="space-y-4">
        <MeasurementInput
          label="Waist Circumference"
          value={measurements.waist}
          onChange={handleChange('waist')}
          hint="Measure at natural waist"
          min={40}
          max={150}
        />

        <MeasurementInput
          label="Hip Circumference"
          value={measurements.hip}
          onChange={handleChange('hip')}
          hint="Measure at fullest part"
          min={50}
          max={180}
        />

        <MeasurementInput
          label="Waist to Hip"
          value={measurements.waistToHip}
          onChange={handleChange('waistToHip')}
          hint="Distance between waist and hip"
          min={10}
          max={35}
        />

        <MeasurementInput
          label="Skirt Length"
          value={measurements.skirtLength}
          onChange={handleChange('skirtLength')}
          hint="From waist to hem"
          min={20}
          max={150}
        />
      </div>

      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          All measurements in centimeters. The pattern includes standard ease allowances.
        </p>
      </div>
    </Card>
  );
}

export { defaultMeasurements };
