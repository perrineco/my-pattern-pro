import { BodiceMeasurements, Category } from '@/types/sloper';
import { MeasurementInput } from './MeasurementInput';
import { BodiceMeasurementGuide } from './BodiceMeasurementGuide';
import { Card } from '@/components/ui/card';
import { MeasurementUnit } from './UnitToggle';
import { useLanguage } from '@/contexts/LanguageContext';

interface KnitBodiceMeasurementFormProps {
  measurements: BodiceMeasurements;
  onChange: (measurements: BodiceMeasurements) => void;
  category: Category;
  unit?: MeasurementUnit;
}

const defaultMeasurements: Record<Category, BodiceMeasurements> = {
  women: { bust: 92, neckCircumference: 36, shoulderLength: 13, backWidth: 36, backLength: 41, ease: 0 },
  men: { bust: 100, neckCircumference: 40, shoulderLength: 15, backWidth: 42, backLength: 45, ease: 1 },
  kids: { bust: 65, neckCircumference: 28, shoulderLength: 10, backWidth: 28, backLength: 28, ease: 0.5 },
};

export function KnitBodiceMeasurementForm({
  measurements,
  onChange,
  category,
  unit = 'cm',
}: KnitBodiceMeasurementFormProps) {
  const { t } = useLanguage();
  
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
          <h3 className="font-serif text-xl font-semibold text-foreground">{t('label.measurements')}</h3>
          <p className="text-xs text-primary/70 italic mt-0.5">{t('section.forKnitFabrics')}</p>
        </div>
        <div className="flex items-center gap-2">
          <BodiceMeasurementGuide category={category} />
          <button onClick={handleReset} className="text-sm text-muted-foreground hover:text-primary transition-colors">
            {t('action.reset')}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <MeasurementInput label={t('meas.bustCircumference')} value={measurements.bust} onChange={handleChange('bust')} hint={t('hint.measureAtFullestPart')} min={50} max={150} unit={unit} />
        <MeasurementInput label={t('meas.neckCircumference')} value={measurements.neckCircumference} onChange={handleChange('neckCircumference')} hint={t('hint.tourDeCou')} min={25} max={55} unit={unit} />
        <MeasurementInput label={t('meas.shoulderLength')} value={measurements.shoulderLength} onChange={handleChange('shoulderLength')} hint={t('hint.longueurEpaule')} min={8} max={20} unit={unit} />
        <MeasurementInput label={t('meas.backWidth')} value={measurements.backWidth} onChange={handleChange('backWidth')} hint={t('hint.carrureDos')} min={25} max={55} unit={unit} />
        <MeasurementInput label={t('meas.backLength')} value={measurements.backLength} onChange={handleChange('backLength')} hint={t('hint.longueurTailleDos')} min={30} max={55} unit={unit} />

        <div className="pt-4 border-t border-border">
          <MeasurementInput label={t('meas.ease')} value={measurements.ease ?? 0} onChange={handleChange('ease')} hint={t('hint.knitEase')} min={-4} max={6} step={0.5} unit={unit} />
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          {t('note.allMeasurementsIn')} {unit === 'inches' ? t('note.inches') : t('note.centimeters')}. {t('note.optimizedKnit')}
        </p>
      </div>
    </Card>
  );
}

export { defaultMeasurements as defaultKnitBodiceMeasurements };
