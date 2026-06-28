import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MeasurementUnit, cmToInches, inchesToCm } from './UnitToggle';
import { HelpCircle } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

interface MeasurementInputProps {
  label: string;
  value: number; // Always stored in cm
  onChange: (value: number) => void; // Always receives cm
  unit?: MeasurementUnit;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
  tooltip?: string;
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
  tooltip,
}: MeasurementInputProps) {
  // Convert display value based on unit
  const displayValue = unit === 'inches' ? cmToInches(value) : value;
  const displayUnit = unit === 'inches' ? 'in' : 'cm';
  const displayStep = unit === 'inches' ? 0.25 : step;
  const displayMin = unit === 'inches' ? cmToInches(min) : min;
  const displayMax = unit === 'inches' ? cmToInches(max) : max;

  const handleChange = (inputValue: number) => {
    // Convert back to cm before calling onChange
    const cmValue = unit === 'inches' ? inchesToCm(inputValue) : inputValue;
    onChange(cmValue);
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1">
        <Label className="text-sm font-medium text-foreground">{label}</Label>
        {tooltip && (
          <Popover>
            <PopoverTrigger asChild>
              <button type="button" className="text-muted-foreground hover:text-foreground transition-colors">
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="text-xs whitespace-pre-line leading-relaxed">
              {tooltip}
            </PopoverContent>
          </Popover>
        )}
      </div>
      {hint && <span className="text-xs text-muted-foreground block">{hint}</span>}
      <div className="relative">
        <Input
          type="number"
          value={displayValue || ''}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            if (!isNaN(v) && v > 0) handleChange(v);
          }}
          min={displayMin}
          max={displayMax}
          step={displayStep}
          className="pr-10 font-sans tabular-nums"
          placeholder="0"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          {displayUnit}
        </span>
      </div>
    </div>
  );
}
