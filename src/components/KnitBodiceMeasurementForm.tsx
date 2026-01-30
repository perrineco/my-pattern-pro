import { BodiceMeasurements, Category } from '@/types/sloper';
import { MeasurementInput } from './MeasurementInput';
import { BodiceMeasurementGuide } from './BodiceMeasurementGuide';
import { Card } from '@/components/ui/card';

interface KnitBodiceMeasurementFormProps {
  measurements: BodiceMeasurements;
  onChange: (measurements: BodiceMeasurements) => void;
  category: Category;
}

const defaultMeasurements: Record<Category, BodiceMeasurements> = {
  women: { 
    bust: 92, 
    neckCircumference: 36, 
    shoulderLength: 13,
    backWidth: 36,
    backLength: 41,
    ease: 0,
  },
  men: { 
    bust: 100, 
    neckCircumference: 40, 
    shoulderLength: 15,
    backWidth: 42,
    backLength: 45,
    ease: 1,
  },
  kids: { 
    bust: 65, 
    neckCircumference: 28, 
    shoulderLength: 10,
    backWidth: 28,
    backLength: 28,
    ease: 0.5,
  },
};

export function KnitBodiceMeasurementForm({
  measurements,
  onChange,
  category,
}: KnitBodiceMeasurementFormProps) {
  const handleChange = (key: keyof BodiceMeasurements) => (value: number) => {
    onChange({ ...measurements, [key]: value });
  };

  const handleReset = () => {
    onChange(defaultMeasurements[category]);
  };

  return (
    <Card className="p-6 space-y-6 bg-card border-border">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-xl font-semibold text-foreground">Measurements</h3>
          <p className="text-xs text-primary/70 italic mt-0.5">For Knit Fabrics</p>
        </div>
        <div className="flex items-center gap-2">
          <BodiceMeasurementGuide category={category} />
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
          label="Bust Circumference"
          value={measurements.bust}
          onChange={handleChange('bust')}
          hint="Measure at fullest part"
          min={50}
          max={150}
        />

        <MeasurementInput
          label="Neck Circumference"
          value={measurements.neckCircumference}
          onChange={handleChange('neckCircumference')}
          hint="Measure around base of neck"
          min={25}
          max={55}
        />

        <MeasurementInput
          label="Shoulder Length"
          value={measurements.shoulderLength}
          onChange={handleChange('shoulderLength')}
          hint="From neck point to shoulder tip"
          min={8}
          max={20}
        />

        <MeasurementInput
          label="Back Width (Carrure dos)"
          value={measurements.backWidth}
          onChange={handleChange('backWidth')}
          hint="Across back between armholes"
          min={25}
          max={55}
        />

        <MeasurementInput
          label="Back Length (Longueur taille-dos)"
          value={measurements.backLength}
          onChange={handleChange('backLength')}
          hint="From neck base to waist"
          min={30}
          max={55}
        />

        <div className="pt-4 border-t border-border">
          <MeasurementInput
            label="Ease"
            value={measurements.ease ?? 0}
            onChange={handleChange('ease')}
            hint="Knit ease (0 = body-hugging, negative = compression)"
            min={-4}
            max={6}
            step={0.5}
          />
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          All measurements in centimeters. Optimized for stretch knit fabrics.
        </p>
      </div>
    </Card>
  );
}

export { defaultMeasurements as defaultKnitBodiceMeasurements };
