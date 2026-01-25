import { PatternType } from '@/types/sloper';
import { cn } from '@/lib/utils';

interface PatternTypeNavProps {
  selected: PatternType;
  onSelect: (type: PatternType) => void;
}

const patternTypes: { value: PatternType; label: string; available: boolean }[] = [
  { value: 'skirt', label: 'Skirt', available: true },
  { value: 'bodice', label: 'Bodice', available: true },
  { value: 'dress', label: 'Dress', available: false },
  { value: 'pants', label: 'Pants', available: false },
  { value: 'sleeve', label: 'Sleeve', available: false },
];

export function PatternTypeNav({ selected, onSelect }: PatternTypeNavProps) {
  return (
    <nav className="flex gap-1 p-1 bg-secondary/50 rounded-lg">
      {patternTypes.map((type) => (
        <button
          key={type.value}
          onClick={() => type.available && onSelect(type.value)}
          disabled={!type.available}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 relative",
            type.available
              ? selected === type.value
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-card/50"
              : "text-muted-foreground/50 cursor-not-allowed"
          )}
        >
          {type.label}
          {!type.available && (
            <span className="absolute -top-1 -right-1 text-[10px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full">
              Soon
            </span>
          )}
        </button>
      ))}
    </nav>
  );
}
