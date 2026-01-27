import { Card } from '@/components/ui/card';
import { MeasurementInput } from '@/components/MeasurementInput';
import { Category, UnifiedMeasurements } from '@/types/sloper';
import { Ruler, Shirt } from 'lucide-react';

interface UnifiedMeasurementFormProps {
  measurements: UnifiedMeasurements;
  onChange: (measurements: UnifiedMeasurements) => void;
  category: Category;
}

export const defaultUnifiedMeasurements: Record<Category, UnifiedMeasurements> = {
  women: {
    // Skirt
    waist: 70,
    hip: 98,
    waistToHip: 20,
    skirtLength: 60,
    // Bodice
    bust: 92,
    neckCircumference: 36,
    shoulderLength: 13,
    backWidth: 36,
    backLength: 42,
  },
  men: {
    // Skirt
    waist: 88,
    hip: 100,
    waistToHip: 22,
    skirtLength: 65,
    // Bodice
    bust: 102,
    neckCircumference: 40,
    shoulderLength: 15,
    backWidth: 42,
    backLength: 46,
  },
  kids: {
    // Skirt
    waist: 58,
    hip: 72,
    waistToHip: 14,
    skirtLength: 35,
    // Bodice
    bust: 68,
    neckCircumference: 30,
    shoulderLength: 10,
    backWidth: 28,
    backLength: 30,
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
      {/* Skirt Measurements */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Ruler className="w-4 h-4 text-primary" />
          Skirt Measurements
        </div>
        <div className="grid gap-3">
          <MeasurementInput
            label="Waist"
            value={measurements.waist}
            onChange={(v) => handleChange('waist', v)}
            min={40}
            max={130}
            hint="Tour de taille"
          />
          <MeasurementInput
            label="Hip"
            value={measurements.hip}
            onChange={(v) => handleChange('hip', v)}
            min={60}
            max={150}
            hint="Tour de hanches"
          />
          <MeasurementInput
            label="Waist to Hip"
            value={measurements.waistToHip}
            onChange={(v) => handleChange('waistToHip', v)}
            min={15}
            max={30}
            hint="Hauteur taille-hanches"
          />
          <MeasurementInput
            label="Skirt Length"
            value={measurements.skirtLength}
            onChange={(v) => handleChange('skirtLength', v)}
            min={30}
            max={120}
            hint="Longueur jupe"
          />
        </div>
      </div>

      {/* Bodice Measurements */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Shirt className="w-4 h-4 text-primary" />
          Bodice Measurements
        </div>
        <div className="grid gap-3">
          <MeasurementInput
            label="Bust"
            value={measurements.bust}
            onChange={(v) => handleChange('bust', v)}
            min={50}
            max={150}
            hint="Tour de poitrine"
          />
          <MeasurementInput
            label="Neckline Circumference"
            value={measurements.neckCircumference}
            onChange={(v) => handleChange('neckCircumference', v)}
            min={28}
            max={50}
            hint="Tour de cou"
          />
          <MeasurementInput
            label="Shoulder Length"
            value={measurements.shoulderLength}
            onChange={(v) => handleChange('shoulderLength', v)}
            min={8}
            max={20}
            hint="Longueur d'épaule"
          />
          <MeasurementInput
            label="Back Width"
            value={measurements.backWidth}
            onChange={(v) => handleChange('backWidth', v)}
            min={25}
            max={55}
            hint="Carrure dos"
          />
          <MeasurementInput
            label="Back Length"
            value={measurements.backLength}
            onChange={(v) => handleChange('backLength', v)}
            min={30}
            max={60}
            hint="Longueur taille-dos"
          />
        </div>
      </div>
    </Card>
  );
}
