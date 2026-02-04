export function SleeveLegend() {
  return (
    <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
      <div className="flex items-center gap-2">
        <div className="w-4 h-0.5 bg-foreground" />
        <span>Cut line</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-0.5 bg-muted-foreground" style={{ backgroundImage: 'repeating-linear-gradient(90deg, currentColor 0, currentColor 3px, transparent 3px, transparent 5px)' }} />
        <span>Grain line</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-3 bg-foreground" />
        <span>Single notch (front)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">
          <div className="w-1 h-3 bg-foreground" />
          <div className="w-1 h-3 bg-foreground" />
        </div>
        <span>Double notch (back)</span>
      </div>
    </div>
  );
}
