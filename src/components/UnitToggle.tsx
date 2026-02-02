import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export type MeasurementUnit = 'cm' | 'inches';

interface UnitToggleProps {
  unit: MeasurementUnit;
  onChange: (unit: MeasurementUnit) => void;
}

export function UnitToggle({ unit, onChange }: UnitToggleProps) {
  return (
    <div className="flex items-center gap-3 bg-secondary/50 px-3 py-2 rounded-lg">
      <Label 
        htmlFor="unit-toggle" 
        className={`text-sm font-medium transition-colors ${unit === 'cm' ? 'text-foreground' : 'text-muted-foreground'}`}
      >
        cm
      </Label>
      <Switch
        id="unit-toggle"
        checked={unit === 'inches'}
        onCheckedChange={(checked) => onChange(checked ? 'inches' : 'cm')}
        className="data-[state=checked]:bg-primary"
      />
      <Label 
        htmlFor="unit-toggle" 
        className={`text-sm font-medium transition-colors ${unit === 'inches' ? 'text-foreground' : 'text-muted-foreground'}`}
      >
        in
      </Label>
    </div>
  );
}

// Conversion helpers
export const cmToInches = (cm: number): number => {
  return Math.round((cm / 2.54) * 100) / 100;
};

export const inchesToCm = (inches: number): number => {
  return Math.round(inches * 2.54 * 100) / 100;
};
