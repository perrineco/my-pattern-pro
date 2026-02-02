import { SkirtMeasurements, Category } from '@/types/sloper';
import { MeasurementInput } from './MeasurementInput';
import { MeasurementGuide } from './MeasurementGuide';
import { Card } from '@/components/ui/card';
import { MeasurementUnit } from './UnitToggle';

interface SkirtMeasurementFormProps {
  measurements: SkirtMeasurements;
  onChange: (measurements: SkirtMeasurements) => void;
  category: Category;
  unit?: MeasurementUnit;
}

const defaultMeasurements: Record<Category, SkirtMeasurements> = {
  women: { waist: 70, hip: 98, waistToHip: 20, skirtLength: 60, ease: 1 },
  men: { waist: 84, hip: 100, waistToHip: 22, skirtLength: 55, ease: 1 },
  kids: { waist: 54, hip: 68, waistToHip: 14, skirtLength: 35, ease: 0.5 },
};

export function SkirtMeasurementForm({
  measurements,
  onChange,
  category,
  unit = 'cm',
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
        <div className="flex items-center gap-2">
          <MeasurementGuide category={category} />
          <button
            onClick={handleReset}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <MeasurementInput
          label="Waist Circumference"
          value={measurements.waist}
          onChange={handleChange('waist')}
          hint="Measure at natural waist"
          min={40}
          max={150}
          unit={unit}
        />

        <MeasurementInput
          label="Hip Circumference"
          value={measurements.hip}
          onChange={handleChange('hip')}
          hint="Measure at fullest part"
          min={50}
          max={180}
          unit={unit}
        />

        <MeasurementInput
          label="Waist to Hip"
          value={measurements.waistToHip}
          onChange={handleChange('waistToHip')}
          hint="Distance between waist and hip"
          min={10}
          max={35}
          unit={unit}
        />

        <MeasurementInput
          label="Skirt Length"
          value={measurements.skirtLength}
          onChange={handleChange('skirtLength')}
          hint="From waist to hem"
          min={20}
          max={150}
          unit={unit}
        />

        <div className="pt-4 border-t border-border">
          <MeasurementInput
            label="Ease"
            value={measurements.ease ?? (category === 'kids' ? 0.5 : 1)}
            onChange={handleChange('ease')}
            hint="Wearing ease allowance"
            min={0}
            max={4}
            step={0.5}
            unit={unit}
          />
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          All measurements in {unit === 'inches' ? 'inches' : 'centimeters'}. The pattern includes standard ease allowances.
        </p>
      </div>
    </Card>
  );
}

export { defaultMeasurements };
