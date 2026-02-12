import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MeasurementInput } from '@/components/MeasurementInput';
import { BodiceMeasurementGuide } from '@/components/BodiceMeasurementGuide';
import { Category, BodiceMeasurements } from '@/types/sloper';
import { MeasurementUnit } from './UnitToggle';
import { useLanguage } from '@/contexts/LanguageContext';

interface DartlessBodiceMeasurementFormProps {
  measurements: BodiceMeasurements;
  onChange: (measurements: BodiceMeasurements) => void;
  category: Category;
  unit?: MeasurementUnit;
}

export const defaultDartlessBodiceMeasurements: Record<Category, BodiceMeasurements> = {
  women: { bust: 92, neckCircumference: 36, shoulderLength: 13, backWidth: 36, backLength: 42, ease: 2 },
  men: { bust: 102, neckCircumference: 40, shoulderLength: 15, backWidth: 42, backLength: 46, ease: 3 },
  kids: { bust: 68, neckCircumference: 30, shoulderLength: 10, backWidth: 28, backLength: 30, ease: 2.5 },
};

export function DartlessBodiceMeasurementForm({
  measurements,
  onChange,
  category,
  unit = 'cm',
}: DartlessBodiceMeasurementFormProps) {
  const { t } = useLanguage();
  
  const handleChange = (key: keyof BodiceMeasurements) => (value: number) => {
    onChange({ ...measurements, [key]: value });
  };

  const handleReset = () => {
    onChange(defaultDartlessBodiceMeasurements[category]);
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-serif text-lg text-foreground">
              {t('title.dartlessBodice')}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {t('note.simpleBodice')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <BodiceMeasurementGuide category={category} />
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground hover:text-foreground">
              <RotateCcw className="w-4 h-4 mr-1" />
              {t('action.reset')}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('section.core')}</span>
          <div className="grid gap-3">
            <MeasurementInput label={t('meas.bust')} value={measurements.bust} onChange={handleChange('bust')} hint={t('hint.tourDePoitrine')} unit={unit} />
            <MeasurementInput label={t('meas.necklineCircumference')} value={measurements.neckCircumference} onChange={handleChange('neckCircumference')} hint={t('hint.tourDeCou')} unit={unit} />
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('section.widthLength')}</span>
          <div className="grid gap-3">
            <MeasurementInput label={t('meas.shoulderLength')} value={measurements.shoulderLength} onChange={handleChange('shoulderLength')} hint={t('hint.longueurEpaule')} unit={unit} />
            <MeasurementInput label={t('meas.backWidth')} value={measurements.backWidth} onChange={handleChange('backWidth')} hint={t('hint.carrureDos')} unit={unit} />
            <MeasurementInput label={t('meas.backLength')} value={measurements.backLength} onChange={handleChange('backLength')} hint={t('hint.longueurTailleDos')} unit={unit} />
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('meas.ease')}</span>
          <div className="grid gap-3">
            <MeasurementInput label={t('meas.ease')} value={measurements.ease ?? 2} onChange={handleChange('ease')} hint={t('hint.addedWearingRoom')} min={0} max={10} step={0.5} unit={unit} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
