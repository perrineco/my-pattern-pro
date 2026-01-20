import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MeasurementInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
}

export function MeasurementInput({
  label,
  value,
  onChange,
  unit = 'cm',
  min = 0,
  max = 200,
  step = 0.5,
  hint,
}: MeasurementInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <Label className="text-sm font-medium text-foreground">{label}</Label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      <div className="relative">
        <Input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          min={min}
          max={max}
          step={step}
          className="pr-10 font-sans tabular-nums"
          placeholder="0"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          {unit}
        </span>
      </div>
    </div>
  );
}
