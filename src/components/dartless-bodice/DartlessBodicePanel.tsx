import { BodiceMeasurements, Category } from "@/types/sloper";
import { useDartlessBodicePath } from "./DartlessBodicePanelPath";

interface DartlessBodicePanelProps {
  measurements: BodiceMeasurements;
  offsetX: number;
  offsetY: number;
  scale: number;
  panel: "front" | "back";
  category: Category;
  mirrored?: boolean;
}

export function DartlessBodicePanel({
  measurements,
  offsetX,
  offsetY,
  scale,
  panel,
  category,
  mirrored,
}: DartlessBodicePanelProps) {
  const { bust, backWidth, backLength } = measurements;

  const { path, bustQuarterScaled, armholeDepthScaled, backLengthScaled, ease } = useDartlessBodicePath({
    measurements,
    offsetX,
    offsetY,
    scale,
    panel,
    category,
  });

  const isFront = panel === "front";
  const tm: React.CSSProperties | undefined = mirrored
    ? { transform: 'scaleX(-1)', transformBox: 'fill-box' as const, transformOrigin: 'center' }
    : undefined;

  return (
    <g>
      {/* Main pattern piece */}
      <path
        d={path}
        fill="hsl(var(--pattern-fill))"
        stroke="hsl(var(--pattern-stroke))"
        strokeWidth="2"
      />

      {/* Bust line (reference) */}
      <line
        x1={offsetX}
        y1={offsetY + armholeDepthScaled}
        x2={offsetX + bustQuarterScaled}
        y2={offsetY + armholeDepthScaled}
        stroke="hsl(var(--muted-foreground))"
        strokeWidth="1"
        strokeDasharray="3,3"
      />

      {/* Grain line */}
      <line
        x1={offsetX + bustQuarterScaled * 0.3}
        y1={offsetY + backLengthScaled * 0.25}
        x2={offsetX + bustQuarterScaled * 0.3}
        y2={offsetY + backLengthScaled * 0.75}
        stroke="hsl(var(--pattern-stroke))"
        strokeWidth="1.5"
        markerEnd="url(#dartlessBodiceArrow)"
      />

      {/* Center front/back fold line indicator */}
      <line
        x1={offsetX}
        y1={offsetY}
        x2={offsetX}
        y2={offsetY + backLengthScaled}
        stroke="hsl(var(--primary))"
        strokeWidth="1"
        strokeDasharray="8,4"
      />

      {/* Labels */}
      <text
        x={offsetX + bustQuarterScaled / 2}
        y={offsetY + backLengthScaled / 2}
        textAnchor="middle"
        className="fill-foreground font-serif text-sm"
        style={tm}
      >
        {isFront ? "FRONT" : "BACK"}
      </text>
      <text
        x={offsetX + bustQuarterScaled / 2}
        y={offsetY + backLengthScaled / 2 + 16}
        textAnchor="middle"
        className="fill-muted-foreground text-xs"
        style={tm}
      >
        Cut 1 on fold
      </text>
      <text
        x={offsetX + bustQuarterScaled / 2}
        y={offsetY + backLengthScaled / 2 + 30}
        textAnchor="middle"
        className="fill-primary/70 text-[10px] italic"
        style={tm}
      >
        Dartless
      </text>

      {/* Measurement labels - only on front panel */}
      {isFront && (
        <>
          <line
            x1={offsetX + bustQuarterScaled + 15}
            y1={offsetY + armholeDepthScaled}
            x2={offsetX + bustQuarterScaled + 35}
            y2={offsetY + armholeDepthScaled}
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="1"
          />
          <text
            x={offsetX + bustQuarterScaled + 40}
            y={offsetY + armholeDepthScaled + 4}
            className="fill-muted-foreground text-[10px]"
          >
            Bust: {(bust / 4 + ease).toFixed(1)}cm
          </text>
          <text
            x={offsetX + bustQuarterScaled + 10}
            y={offsetY + backLengthScaled - 5}
            className="fill-muted-foreground text-[10px]"
          >
            Back width: {(backWidth / 2).toFixed(1)}cm
          </text>
        </>
      )}

      {/* Length label */}
      <text
        x={offsetX - 8}
        y={offsetY + backLengthScaled / 2}
        textAnchor="end"
        className="fill-muted-foreground text-[10px]"
        transform={`rotate(-90 ${offsetX - 8} ${offsetY + backLengthScaled / 2})`}
        style={tm}
      >
        {backLength}cm
      </text>

      {/* Fold line indicator */}
      <text
        x={offsetX + 3}
        y={offsetY + backLengthScaled / 2}
        className="fill-primary text-[9px]"
        transform={`rotate(-90 ${offsetX + 3} ${offsetY + backLengthScaled / 2})`}
        style={tm}
      >
        FOLD
      </text>
    </g>
  );
}
