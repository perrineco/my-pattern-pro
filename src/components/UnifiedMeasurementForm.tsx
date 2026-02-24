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
    waist: 70, hip: 98, waistToHip: 20, skirtLength: 60,
    bust: 92, neckCircumference: 36, shoulderLength: 13, backWidth: 36, backLength: 42,
    thigh: 58, knee: 38, ankle: 24, crotchDepth: 26, outseamLength: 105, inseamLength: 80,
    upperArm: 28, wrist: 16, sleeveLength: 58, elbowLength: 33, armholeDepth: 14,
  },
  men: {
    waist: 88, hip: 100, waistToHip: 22, skirtLength: 65,
    bust: 102, neckCircumference: 40, shoulderLength: 15, backWidth: 42, backLength: 46,
    thigh: 60, knee: 42, ankle: 26, crotchDepth: 28, outseamLength: 110, inseamLength: 82,
    upperArm: 32, wrist: 18, sleeveLength: 64, elbowLength: 36, armholeDepth: 16,
  },
  kids: {
    waist: 58, hip: 72, waistToHip: 14, skirtLength: 35,
    bust: 68, neckCircumference: 30, shoulderLength: 10, backWidth: 28, backLength: 30,
    thigh: 40, knee: 28, ankle: 20, crotchDepth: 18, outseamLength: 65, inseamLength: 48,
    upperArm: 20, wrist: 13, sleeveLength: 42, elbowLength: 24, armholeDepth: 10,
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
  { key: 'thigh', labelKey: 'meas.thigh', hintKey: 'hint.thigh', min: 30, max: 100 },
  { key: 'knee', labelKey: 'meas.knee', hintKey: 'hint.knee', min: 25, max: 60 },
  { key: 'ankle', labelKey: 'meas.ankle', hintKey: 'hint.ankle', min: 18, max: 40 },
  { key: 'crotchDepth', labelKey: 'meas.crotchDepth', hintKey: 'hint.crotchDepth', min: 18, max: 40 },
  { key: 'outseamLength', labelKey: 'meas.outseamLength', hintKey: 'hint.outseamLength', min: 50, max: 130 },
  { key: 'inseamLength', labelKey: 'meas.inseamLength', hintKey: 'hint.inseamLength', min: 40, max: 100 },
  { key: 'upperArm', labelKey: 'meas.upperArm', hintKey: 'hint.upperArm', min: 18, max: 50 },
  { key: 'wrist', labelKey: 'meas.wrist', hintKey: 'hint.wrist', min: 12, max: 25 },
  { key: 'sleeveLength', labelKey: 'meas.sleeveLength', hintKey: 'hint.sleeveLength', min: 30, max: 80 },
  { key: 'elbowLength', labelKey: 'meas.elbowLength', hintKey: 'hint.elbowLength', min: 20, max: 45 },
  { key: 'armholeDepth', labelKey: 'meas.armholeDepth', hintKey: 'hint.armholeDepth', min: 8, max: 25 },
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
