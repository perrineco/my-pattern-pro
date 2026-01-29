export function PantsLegend() {
  return (
    <div className="absolute bottom-4 right-4 bg-card border rounded-lg p-3 text-xs space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-5 h-0.5 bg-pattern-stroke" />
        <span className="text-foreground">Pattern edge</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-0.5 border-t border-dashed border-muted-foreground" />
        <span className="text-foreground">Reference lines</span>
      </div>
      <div className="flex items-center gap-2">
        <svg className="w-5 h-3">
          <line x1="0" y1="6" x2="20" y2="6" stroke="hsl(var(--pattern-stroke))" strokeWidth="1.5" />
          <polygon points="17,3 20,6 17,9" fill="hsl(var(--pattern-stroke))" />
        </svg>
        <span className="text-foreground">Grain line</span>
      </div>
    </div>
  );
}
