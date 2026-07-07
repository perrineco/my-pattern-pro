import { useLanguage } from "@/contexts/LanguageContext";

export function PantsLegend() {
  const { t } = useLanguage();

  return (
    <div className="absolute top-11 right-2 bg-card/90 backdrop-blur-sm p-3 rounded-md border border-border text-xs space-y-1">
      <div className="flex items-center gap-2">
        <div className="w-4 h-0.5 bg-pattern-stroke" />
        <span className="text-muted-foreground">{t('legend.patternEdge')}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-0.5 border-t border-dashed border-muted-foreground" />
        <span className="text-muted-foreground">{t('legend.referenceLines')}</span>
      </div>
      <div className="flex items-center gap-2">
        <svg className="w-4 h-3">
          <line x1="0" y1="6" x2="16" y2="6" stroke="hsl(var(--pattern-stroke))" strokeWidth="1.5" />
          <polygon points="13,3 16,6 13,9" fill="hsl(var(--pattern-stroke))" />
        </svg>
        <span className="text-muted-foreground">{t('legend.grainLine')}</span>
      </div>
    </div>
  );
}
