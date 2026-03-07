import { useState, useRef, useEffect } from 'react';
import { PatternType, BodiceVariant, Category } from '@/types/sloper';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface PatternTypeNavProps {
  selected: PatternType;
  onSelect: (type: PatternType) => void;
  category: Category;
}

interface PatternTypeConfig {
  value: PatternType;
  labelKey: string;
  available: boolean;
  hasSubmenu?: boolean;
  submenu?: { value: PatternType; labelKey: string; available: boolean }[];
}

const patternTypes: PatternTypeConfig[] = [
  { value: 'skirt', labelKey: 'pattern.skirt', available: true },
  { 
    value: 'bodice', 
    labelKey: 'pattern.bodice', 
    available: true,
    hasSubmenu: true,
    submenu: [
      { value: 'bodice-dartless', labelKey: 'pattern.dartless', available: true },
      { value: 'bodice-with-darts', labelKey: 'pattern.withDarts', available: false },
      { value: 'bodice-knit', labelKey: 'pattern.forKnit', available: false },
    ]
  },
  { value: 'dress', labelKey: 'pattern.dress', available: false },
  { 
    value: 'pants', 
    labelKey: 'pattern.pants', 
    available: true,
    hasSubmenu: true,
    submenu: [
      { value: 'pants-dartless', labelKey: 'pattern.dartless', available: true },
      { value: 'pants-with-darts', labelKey: 'pattern.withDarts', available: true },
    ]
  },
  { value: 'sleeve', labelKey: 'pattern.sleeve', available: false },
];

export function PatternTypeNav({ selected, onSelect, category }: PatternTypeNavProps) {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const submenuRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // Filter pattern types based on category
  const filteredPatternTypes = patternTypes.filter(type => {
    if (type.value === 'skirt' && category === 'men') return false;
    return true;
  });

  const isBodiceVariant = selected.startsWith('bodice');
  const isPantsVariant = selected.startsWith('pants');
  const selectedBodiceVariant = isBodiceVariant ? selected : null;
  const selectedPantsVariant = isPantsVariant ? selected : null;

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
      const isVariantActive = (type.value === 'bodice' && isBodiceVariant) || (type.value === 'pants' && isPantsVariant);
      if (!isVariantActive) {
        const firstAvailable = type.submenu?.find(s => s.available);
        if (firstAvailable) {
          onSelect(firstAvailable.value);
        }
      }
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
    if (type.hasSubmenu && type.value === 'bodice' && selectedBodiceVariant) {
      const variant = type.submenu?.find(s => s.value === selectedBodiceVariant);
      return variant ? `${t('pattern.bodice')}: ${t(variant.labelKey)}` : t(type.labelKey);
    }
    if (type.hasSubmenu && type.value === 'pants' && selectedPantsVariant) {
      const variant = type.submenu?.find(s => s.value === selectedPantsVariant);
      return variant ? `${t('pattern.pants')}: ${t(variant.labelKey)}` : t(type.labelKey);
    }
    return t(type.labelKey);
  };

  return (
    <nav className="flex gap-1 p-1 bg-secondary/50 rounded-lg" ref={submenuRef}>
      {filteredPatternTypes.map((type) => (
        <div key={type.value} className="relative">
          <button
            onClick={() => handleMainClick(type)}
            disabled={!type.available}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 relative flex items-center gap-1",
              type.available
                ? (selected === type.value || (type.hasSubmenu && isBodiceVariant && type.value === 'bodice') || (type.hasSubmenu && isPantsVariant && type.value === 'pants'))
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
                {t('misc.soon')}
              </span>
            )}
          </button>

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
                  {t(subType.labelKey)}
                  {!subType.available && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full">
                      {t('misc.soon')}
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
