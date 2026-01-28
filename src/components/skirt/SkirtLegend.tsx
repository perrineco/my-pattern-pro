export function SkirtLegend() {
  return (
    <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm p-3 rounded-md border border-border text-xs space-y-1">
      <div className="flex items-center gap-2">
        <div className="w-4 h-0.5 bg-pattern-stroke" />
        <span className="text-muted-foreground">Pattern edge</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-0.5 border-t border-dashed border-pattern-stroke" />
        <span className="text-muted-foreground">Grain line</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-0.5 bg-primary" />
        <span className="text-muted-foreground">Measurements</span>
      </div>
    </div>
  );
}