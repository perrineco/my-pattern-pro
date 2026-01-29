import { PantsMeasurements, Category } from '@/types/sloper';
import { MeasurementInput } from './MeasurementInput';
import { MeasurementGuide } from './MeasurementGuide';
import { Card } from '@/components/ui/card';

interface PantsMeasurementFormProps {
  measurements: PantsMeasurements;
  onChange: (measurements: PantsMeasurements) => void;
  category: Category;
}

const defaultMeasurements: Record<Category, PantsMeasurements> = {
  women: { 
    waist: 70, 
    hip: 98, 
    thigh: 58,
    knee: 38,
    ankle: 24,
    crotchDepth: 26,
    outseamLength: 105,
    inseamLength: 80,
  },
  men: { 
    waist: 84, 
    hip: 100,
    thigh: 60,
    knee: 42,
    ankle: 26,
    crotchDepth: 28,
    outseamLength: 110,
    inseamLength: 82,
  },
  kids: { 
    waist: 54, 
    hip: 68,
    thigh: 40,
    knee: 28,
    ankle: 20,
    crotchDepth: 18,
    outseamLength: 65,
    inseamLength: 48,
  },
};

export function PantsMeasurementForm({
  measurements,
  onChange,
  category,
}: PantsMeasurementFormProps) {
  const handleChange = (key: keyof PantsMeasurements) => (value: number) => {
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
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Circumferences
        </div>
        
        <MeasurementInput
          label="Waist"
          value={measurements.waist}
          onChange={handleChange('waist')}
          hint="Measure at natural waist"
          min={40}
          max={150}
        />

        <MeasurementInput
          label="Hip"
          value={measurements.hip}
          onChange={handleChange('hip')}
          hint="Measure at fullest part"
          min={50}
          max={180}
        />

        <MeasurementInput
          label="Thigh"
          value={measurements.thigh}
          onChange={handleChange('thigh')}
          hint="Measure at fullest part of thigh"
          min={30}
          max={100}
        />

        <MeasurementInput
          label="Knee"
          value={measurements.knee}
          onChange={handleChange('knee')}
          hint="Measure around the knee"
          min={25}
          max={60}
        />

        <MeasurementInput
          label="Ankle"
          value={measurements.ankle}
          onChange={handleChange('ankle')}
          hint="Measure around the ankle"
          min={18}
          max={40}
        />

        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide pt-4">
          Lengths
        </div>

        <MeasurementInput
          label="Crotch Depth (Rise)"
          value={measurements.crotchDepth}
          onChange={handleChange('crotchDepth')}
          hint="Waist to seat while sitting"
          min={18}
          max={40}
        />

        <MeasurementInput
          label="Outseam Length"
          value={measurements.outseamLength}
          onChange={handleChange('outseamLength')}
          hint="Waist to floor along outside leg"
          min={50}
          max={130}
        />

        <MeasurementInput
          label="Inseam Length"
          value={measurements.inseamLength}
          onChange={handleChange('inseamLength')}
          hint="Crotch to floor along inside leg"
          min={40}
          max={100}
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

export { defaultMeasurements as defaultPantsMeasurements };
