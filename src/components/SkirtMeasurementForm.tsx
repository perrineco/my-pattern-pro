import { SkirtMeasurements, Category } from '@/types/sloper';
import { MeasurementInput } from './MeasurementInput';
import { MeasurementGuide } from './MeasurementGuide';
import { Card } from '@/components/ui/card';
import { MeasurementUnit } from './UnitToggle';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { t } = useLanguage();
  
  const handleChange = (key: keyof SkirtMeasurements) => (value: number) => {
    onChange({ ...measurements, [key]: value });
  };

  const handleReset = () => {
    onChange(defaultMeasurements[category]);
  };

  return (
    <Card className="p-4 space-y-4 bg-card border-border">
      <div className="space-y-1">
        <h3 className="font-serif text-xl font-semibold text-foreground">{t('label.measurements')}</h3>
        <div className="flex items-center gap-3">
          <MeasurementGuide category={category} />
          <button
            onClick={handleReset}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {t('action.reset')}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <MeasurementInput
          label={t('meas.waistCircumference')}
          value={measurements.waist}
          onChange={handleChange('waist')}
          hint={t('hint.measureAtNaturalWaist')}
          min={40}
          max={150}
          unit={unit}
        />

        <MeasurementInput
          label={t('meas.hipCircumference')}
          value={measurements.hip}
          onChange={handleChange('hip')}
          hint={t('hint.measureAtFullestPart')}
          min={50}
          max={180}
          unit={unit}
        />

        <MeasurementInput
          label={t('meas.waistToHip')}
          value={measurements.waistToHip}
          onChange={handleChange('waistToHip')}
          hint={t('hint.distanceBetweenWaistAndHip')}
          min={10}
          max={35}
          unit={unit}
        />

        <MeasurementInput
          label={t('meas.skirtLength')}
          value={measurements.skirtLength}
          onChange={handleChange('skirtLength')}
          hint={t('hint.fromWaistToHem')}
          min={20}
          max={150}
          unit={unit}
        />

        <div className="pt-4 border-t border-border">
          <MeasurementInput
            label={t('meas.ease')}
            value={measurements.ease ?? (category === 'kids' ? 0.5 : 1)}
            onChange={handleChange('ease')}
            hint={t('hint.wearingEaseAllowance')}
            min={0}
            max={4}
            step={0.5}
            unit={unit}
          />
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          {t('note.allMeasurementsIn')} {unit === 'inches' ? t('note.inches') : t('note.centimeters')}. {t('note.standardEase')}
        </p>
      </div>
    </Card>
  );
}

export { defaultMeasurements };
