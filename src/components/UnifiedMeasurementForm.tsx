import { Card } from '@/components/ui/card';
import { MeasurementInput } from '@/components/MeasurementInput';
import { Category, UnifiedMeasurements } from '@/types/sloper';
import { useLanguage } from '@/contexts/LanguageContext';
import { MeasurementUnit } from './UnitToggle';

interface UnifiedMeasurementFormProps {
  measurements: UnifiedMeasurements;
  onChange: (measurements: UnifiedMeasurements) => void;
  category: Category;
  unit?: MeasurementUnit;
}

export const defaultUnifiedMeasurements: Record<Category, UnifiedMeasurements> = {
  women: {
    waist: 70,
    hip: 98,
    waistToHip: 20,
    skirtLength: 60,
    bust: 92,
    neckCircumference: 36,
    shoulderLength: 13,
    backWidth: 36,
    backLength: 42,
  },
  men: {
    waist: 88,
    hip: 100,
    waistToHip: 22,
    skirtLength: 65,
    bust: 102,
    neckCircumference: 40,
    shoulderLength: 15,
    backWidth: 42,
    backLength: 46,
  },
  kids: {
    waist: 58,
    hip: 72,
    waistToHip: 14,
    skirtLength: 35,
    bust: 68,
    neckCircumference: 30,
    shoulderLength: 10,
    backWidth: 28,
    backLength: 30,
  },
};

const measurementFields: { key: keyof UnifiedMeasurements; labelKey: string; hintKey: string; min: number; max: number }[] = [
  { key: 'waist', labelKey: 'meas.waist', hintKey: 'hint.waist', min: 40, max: 130 },
  { key: 'hip', labelKey: 'meas.hip', hintKey: 'hint.hip', min: 60, max: 150 },
  { key: 'bust', labelKey: 'meas.bust', hintKey: 'hint.bust', min: 50, max: 150 },
  { key: 'neckCircumference', labelKey: 'meas.neckCircumference', hintKey: 'hint.neckCircumference', min: 28, max: 50 },
  { key: 'shoulderLength', labelKey: 'meas.shoulderLength', hintKey: 'hint.shoulderLength', min: 8, max: 20 },
  { key: 'backWidth', labelKey: 'meas.backWidth', hintKey: 'hint.backWidth', min: 25, max: 55 },
  { key: 'backLength', labelKey: 'meas.backLength', hintKey: 'hint.backLength', min: 30, max: 60 },
  { key: 'waistToHip', labelKey: 'meas.waistToHip', hintKey: 'hint.waistToHip', min: 15, max: 30 },
  { key: 'skirtLength', labelKey: 'meas.skirtLength', hintKey: 'hint.skirtLength', min: 30, max: 120 },
];

export function UnifiedMeasurementForm({
  measurements,
  onChange,
  category,
  unit = 'cm',
}: UnifiedMeasurementFormProps) {
  const { t } = useLanguage();

  const handleChange = (key: keyof UnifiedMeasurements, value: number) => {
    onChange({ ...measurements, [key]: value });
  };

  return (
    <Card className="p-5">
      <div className="grid gap-3">
        {measurementFields.map((field) => (
          <MeasurementInput
            key={field.key}
            label={t(field.labelKey)}
            value={measurements[field.key]}
            onChange={(v) => handleChange(field.key, v)}
            min={field.min}
            max={field.max}
            hint={t(field.hintKey)}
            unit={unit}
          />
        ))}
      </div>
    </Card>
  );
}
