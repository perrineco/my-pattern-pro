interface BodiceDartsLegendProps {
  x: number;
  y: number;
}

export function BodiceDartsLegend({ x, y }: BodiceDartsLegendProps) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        x="0"
        y="0"
        width="120"
        height="55"
        fill="hsl(var(--card))"
        stroke="hsl(var(--border))"
        rx="4"
      />
      <line x1="8" y1="12" x2="28" y2="12" stroke="hsl(var(--pattern-stroke))" strokeWidth="2" />
      <text x="34" y="15" className="fill-foreground text-[9px]">Pattern edge</text>
      
      <line x1="8" y1="27" x2="28" y2="27" stroke="hsl(var(--pattern-stroke))" strokeWidth="1.5" markerEnd="url(#bodiceDartsArrow-front)" />
      <text x="34" y="30" className="fill-foreground text-[9px]">Grain line</text>

      <line x1="8" y1="42" x2="28" y2="42" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeDasharray="4 2" />
      <text x="34" y="45" className="fill-foreground text-[9px]">Dart line</text>
    </g>
  );
}
