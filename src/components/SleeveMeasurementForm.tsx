import { SleeveMeasurements, Category } from "@/types/sloper";
import { MeasurementInput } from "@/components/MeasurementInput";
import { MeasurementUnit } from "@/components/UnitToggle";
import { Card } from "@/components/ui/card";
import { SleeveMeasurementGuide } from "@/components/SleeveMeasurementGuide";
import { useLanguage } from '@/contexts/LanguageContext';

interface SleeveMeasurementFormProps {
  measurements: SleeveMeasurements;
  onChange: (measurements: SleeveMeasurements) => void;
  category: Category;
  unit?: MeasurementUnit;
}

export const defaultSleeveMeasurements: Record<Category, SleeveMeasurements> = {
  women: { upperArm: 28, wrist: 16, sleeveLength: 58, elbowLength: 33, armholeDepth: 14, ease: 2 },
  men: { upperArm: 32, wrist: 18, sleeveLength: 64, elbowLength: 36, armholeDepth: 16, ease: 3 },
  kids: { upperArm: 20, wrist: 13, sleeveLength: 42, elbowLength: 24, armholeDepth: 10, ease: 1.5 },
};

export function SleeveMeasurementForm({ measurements, onChange, category, unit = "cm" }: SleeveMeasurementFormProps) {
  const { t } = useLanguage();
  
  const handleChange = (key: keyof SleeveMeasurements, value: number) => {
    onChange({ ...measurements, [key]: value });
  };

  return (
    <Card className="p-5 bg-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-lg font-semibold text-foreground">{t('label.measurements')}</h3>
        <SleeveMeasurementGuide category={category} />
      </div>
      <div className="space-y-4">
        <MeasurementInput label={t('meas.upperArm')} value={measurements.upperArm} onChange={(v) => handleChange("upperArm", v)} min={15} max={50} step={0.5} unit={unit} />
        <MeasurementInput label={t('meas.wrist')} value={measurements.wrist} onChange={(v) => handleChange("wrist", v)} min={10} max={30} step={0.5} unit={unit} />
        <MeasurementInput label={t('meas.sleeveLength')} value={measurements.sleeveLength} onChange={(v) => handleChange("sleeveLength", v)} min={30} max={80} step={0.5} unit={unit} />
        <MeasurementInput label={t('meas.elbowLength')} value={measurements.elbowLength} onChange={(v) => handleChange("elbowLength", v)} min={20} max={50} step={0.5} unit={unit} />
        <MeasurementInput label={t('meas.armholeDepth')} value={measurements.armholeDepth} onChange={(v) => handleChange("armholeDepth", v)} min={8} max={25} step={0.5} unit={unit} />
        <MeasurementInput label={t('meas.ease')} value={measurements.ease ?? 2} onChange={(v) => handleChange("ease", v)} min={0} max={8} step={0.5} unit={unit} />
      </div>
    </Card>
  );
}
