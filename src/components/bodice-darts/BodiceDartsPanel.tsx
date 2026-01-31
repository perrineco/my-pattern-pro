import { BodiceMeasurements, Category } from "@/types/sloper";
import { useBodiceDartsPath } from "./BodiceDartsPanelPath";

interface BodiceDartsPanelProps {
  measurements: BodiceMeasurements;
  offsetX: number;
  offsetY: number;
  scale: number;
  panel: "front" | "back";
  category: Category;
}

export function BodiceDartsPanel({
  measurements,
  offsetX,
  offsetY,
  scale,
  panel,
  category,
}: BodiceDartsPanelProps) {
  const { path, dartPath, bustQuarterScaled, armholeDepthScaled, backLengthScaled } = useBodiceDartsPath({
    measurements,
    offsetX,
    offsetY,
    scale,
    panel,
    category,
  });

  const isFront = panel === "front";

  return (
    <g>
      {/* Main pattern piece */}
      <path
        d={path}
        fill="hsl(var(--pattern-fill))"
        stroke="hsl(var(--pattern-stroke))"
        strokeWidth="2"
      />

      {/* Dart lines - highlighted */}
      <path
        d={dartPath}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
        strokeDasharray="4 2"
      />

      {/* Grain line */}
      <defs>
        <marker
          id={`bodiceDartsArrow-${panel}`}
          markerWidth="6"
          markerHeight="6"
          refX="3"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill="hsl(var(--pattern-stroke))" />
        </marker>
      </defs>
      <line
        x1={offsetX + bustQuarterScaled * 0.3}
        y1={offsetY + backLengthScaled * 0.25}
        x2={offsetX + bustQuarterScaled * 0.3}
        y2={offsetY + backLengthScaled * 0.75}
        stroke="hsl(var(--pattern-stroke))"
        strokeWidth="1.5"
        markerEnd={`url(#bodiceDartsArrow-${panel})`}
      />

      {/* Center line indicator */}
      <line
        x1={offsetX}
        y1={offsetY - 10}
        x2={offsetX}
        y2={offsetY + backLengthScaled + 10}
        stroke="hsl(var(--pattern-stroke))"
        strokeWidth="1"
        strokeDasharray="8 4"
        opacity={0.5}
      />

      {/* Labels */}
      <text
        x={offsetX + bustQuarterScaled / 2}
        y={offsetY + backLengthScaled / 2 - 10}
        textAnchor="middle"
        className="fill-foreground font-serif text-sm"
      >
        {isFront ? "FRONT" : "BACK"}
      </text>
      <text
        x={offsetX + bustQuarterScaled / 2}
        y={offsetY + backLengthScaled / 2 + 6}
        textAnchor="middle"
        className="fill-muted-foreground text-xs"
      >
        Cut 1 on fold
      </text>
      <text
        x={offsetX + bustQuarterScaled / 2}
        y={offsetY + backLengthScaled / 2 + 20}
        textAnchor="middle"
        className="fill-primary text-[10px] font-medium"
      >
        (with darts)
      </text>

      {/* Bust line indicator */}
      <line
        x1={offsetX}
        y1={offsetY + armholeDepthScaled}
        x2={offsetX + bustQuarterScaled}
        y2={offsetY + armholeDepthScaled}
        stroke="hsl(var(--muted-foreground))"
        strokeWidth="0.5"
        strokeDasharray="2 2"
        opacity={0.5}
      />
    </g>
  );
}
