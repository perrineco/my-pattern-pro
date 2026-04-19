import { PantsMeasurements, Category } from '@/types/sloper';
import { MeasurementInput } from './MeasurementInput';
import { MeasurementGuide } from './MeasurementGuide';
import { Card } from '@/components/ui/card';
import { MeasurementUnit } from './UnitToggle';
import { useLanguage } from '@/contexts/LanguageContext';

interface PantsMeasurementFormProps {
  measurements: PantsMeasurements;
  onChange: (measurements: PantsMeasurements) => void;
  category: Category;
  unit?: MeasurementUnit;
}

const defaultMeasurements: Record<Category, PantsMeasurements> = {
  women: { waist: 70, hip: 98, thigh: 58, knee: 38, ankle: 24, hipHeight: 20, crotchDepth: 26, outseamLength: 105, inseamLength: 80, ease: 2 },
  men: { waist: 84, hip: 100, thigh: 60, knee: 42, ankle: 26, hipHeight: 22, crotchDepth: 28, outseamLength: 110, inseamLength: 82, ease: 3 },
  kids: { waist: 54, hip: 68, thigh: 40, knee: 28, ankle: 20, hipHeight: 16.2, crotchDepth: 18, outseamLength: 65, inseamLength: 48, ease: 1.5 },
};

export function PantsMeasurementForm({
  measurements,
  onChange,
  category,
  unit = 'cm',
}: PantsMeasurementFormProps) {
  const { t } = useLanguage();
  
  const handleChange = (key: keyof PantsMeasurements) => (value: number) => {
    onChange({ ...measurements, [key]: value });
  };

  const handleReset = () => {
    onChange(defaultMeasurements[category]);
  };

  return (
    <Card className="p-4 space-y-4 bg-card border-border">
      <div className="space-y-1">
        <h3 className="font-serif text-xl font-semibold text-foreground">{t('label.measurements')}</h3>
        <div className="flex items-center gap-2">
          <MeasurementGuide category={category} patternType="pants" />
          <button
            onClick={handleReset}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {t('action.reset')}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {t('section.circumferences')}
        </div>
        
        <MeasurementInput label={t('meas.waist')} value={measurements.waist} onChange={handleChange('waist')} hint={t('hint.measureAtNaturalWaist')} min={40} max={150} unit={unit} />
        <MeasurementInput label={t('meas.hip')} value={measurements.hip} onChange={handleChange('hip')} hint={t('hint.measureAtFullestPart')} min={50} max={180} unit={unit} />
        <MeasurementInput label={t('meas.thigh')} value={measurements.thigh} onChange={handleChange('thigh')} hint={t('hint.measureFullestThigh')} min={30} max={100} unit={unit} />
        <MeasurementInput label={t('meas.knee')} value={measurements.knee} onChange={handleChange('knee')} hint={t('hint.measureAroundKnee')} min={25} max={60} unit={unit} />
        <MeasurementInput label={t('meas.ankle')} value={measurements.ankle} onChange={handleChange('ankle')} hint={t('hint.measureAroundAnkle')} min={18} max={40} unit={unit} />

        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide pt-4">
          {t('section.lengths')}
        </div>

        <MeasurementInput label={t('meas.hipHeight')} value={measurements.hipHeight} onChange={handleChange('hipHeight')} hint={t('hint.hipHeight')} min={10} max={30} unit={unit} />
        <MeasurementInput label={t('meas.crotchDepth')} value={measurements.crotchDepth} onChange={handleChange('crotchDepth')} hint={t('hint.waistToSeat')} min={18} max={40} unit={unit} />
        <MeasurementInput label={t('meas.outseamLength')} value={measurements.outseamLength} onChange={handleChange('outseamLength')} hint={t('hint.waistToFloor')} min={50} max={130} unit={unit} />
        <MeasurementInput label={t('meas.inseamLength')} value={measurements.inseamLength} onChange={handleChange('inseamLength')} hint={t('hint.crotchToFloor')} min={40} max={100} unit={unit} />

        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide pt-4">
          {t('meas.ease')}
        </div>

        <MeasurementInput label={t('meas.ease')} value={measurements.ease ?? 2} onChange={handleChange('ease')} hint={t('hint.addedWearingRoom')} min={0} max={8} step={0.5} unit={unit} />
      </div>

      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          {t('note.allMeasurementsIn')} {unit === 'inches' ? t('note.inches') : t('note.centimeters')}. {t('note.standardEase')}
        </p>
      </div>
    </Card>
  );
}

export { defaultMeasurements as defaultPantsMeasurements };
