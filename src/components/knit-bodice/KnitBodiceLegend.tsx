export function KnitBodiceLegend() {
  return (
    <div className="absolute bottom-4 right-4 bg-card border rounded-lg p-3 text-xs space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-5 h-0.5 bg-pattern-stroke" />
        <span className="text-foreground">Pattern edge</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-0.5 border-t-2 border-dashed border-primary" />
        <span className="text-foreground">Fold line</span>
      </div>
    </div>
  );
}
