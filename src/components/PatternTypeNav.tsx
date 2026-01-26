import { useState, useRef, useEffect } from 'react';
import { PatternType, BodiceVariant } from '@/types/sloper';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface PatternTypeNavProps {
  selected: PatternType;
  onSelect: (type: PatternType) => void;
}

interface PatternTypeConfig {
  value: PatternType;
  label: string;
  available: boolean;
  hasSubmenu?: boolean;
  submenu?: { value: PatternType; label: string; available: boolean }[];
}

const patternTypes: PatternTypeConfig[] = [
  { value: 'skirt', label: 'Skirt', available: true },
  { 
    value: 'bodice', 
    label: 'Bodice', 
    available: true,
    hasSubmenu: true,
    submenu: [
      { value: 'bodice-dartless', label: 'Dartless', available: true },
      { value: 'bodice-with-darts', label: 'With Darts', available: false },
      { value: 'bodice-knit', label: 'For Knit', available: false },
    ]
  },
  { value: 'dress', label: 'Dress', available: false },
  { value: 'pants', label: 'Pants', available: false },
  { value: 'sleeve', label: 'Sleeve', available: false },
];

export function PatternTypeNav({ selected, onSelect }: PatternTypeNavProps) {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const submenuRef = useRef<HTMLDivElement>(null);

  // Check if current selection is a bodice variant
  const isBodiceVariant = selected.startsWith('bodice');
  const selectedBodiceVariant = isBodiceVariant ? selected : null;

  // Close submenu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (submenuRef.current && !submenuRef.current.contains(event.target as Node)) {
        setOpenSubmenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMainClick = (type: PatternTypeConfig) => {
    if (!type.available) return;
    
    if (type.hasSubmenu) {
      setOpenSubmenu(openSubmenu === type.value ? null : type.value);
    } else {
      onSelect(type.value);
      setOpenSubmenu(null);
    }
  };

  const handleSubmenuClick = (subType: PatternType, available: boolean) => {
    if (!available) return;
    onSelect(subType);
    setOpenSubmenu(null);
  };

  const getDisplayLabel = (type: PatternTypeConfig): string => {
    if (type.hasSubmenu && selectedBodiceVariant && type.value === 'bodice') {
      const variant = type.submenu?.find(s => s.value === selectedBodiceVariant);
      return variant ? `Bodice: ${variant.label}` : type.label;
    }
    return type.label;
  };

  return (
    <nav className="flex gap-1 p-1 bg-secondary/50 rounded-lg" ref={submenuRef}>
      {patternTypes.map((type) => (
        <div key={type.value} className="relative">
          <button
            onClick={() => handleMainClick(type)}
            disabled={!type.available}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 relative flex items-center gap-1",
              type.available
                ? (selected === type.value || (type.hasSubmenu && isBodiceVariant && type.value === 'bodice'))
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                : "text-muted-foreground/50 cursor-not-allowed"
            )}
          >
            {getDisplayLabel(type)}
            {type.hasSubmenu && type.available && (
              <ChevronDown className={cn(
                "w-3.5 h-3.5 transition-transform duration-200",
                openSubmenu === type.value && "rotate-180"
              )} />
            )}
            {!type.available && (
              <span className="absolute -top-1 -right-1 text-[10px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full">
                Soon
              </span>
            )}
          </button>

          {/* Submenu dropdown */}
          {type.hasSubmenu && openSubmenu === type.value && (
            <div className="absolute top-full left-0 mt-1 py-1 bg-card border border-border rounded-lg shadow-lg z-50 min-w-[140px] animate-fade-in">
              {type.submenu?.map((subType) => (
                <button
                  key={subType.value}
                  onClick={() => handleSubmenuClick(subType.value, subType.available)}
                  disabled={!subType.available}
                  className={cn(
                    "w-full px-4 py-2 text-left text-sm transition-colors relative",
                    subType.available
                      ? selectedBodiceVariant === subType.value
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground hover:bg-secondary"
                      : "text-muted-foreground/50 cursor-not-allowed"
                  )}
                >
                  {subType.label}
                  {!subType.available && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full">
                      Soon
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}