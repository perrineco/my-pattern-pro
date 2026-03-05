import { Category } from "@/types/sloper";

interface SkirtBackPanelProps {
  waist: number;
  waistQuarter: number;
  hipQuarter: number;
  ease: number;
  dartWidth: number;
  dartLength: number;
  skirtLength: number;
  waistToHip: number;
  scale: number;
  patternWidth: number;
  patternHeight: number;
  waistWidthScaled: number;
  dartWidthScaled: number;
  dartLengthScaled: number;
  waistToHipScaled: number;
  offsetX: number;
  offsetY: number;
  category: Category;
  centerToDartScaled: number;
  mirrored?: boolean;
}

export function SkirtBackPanel({
  waistQuarter,
  ease,
  dartWidth,
  skirtLength,
  waistToHip,
  scale,
  patternWidth,
  patternHeight,
  waistWidthScaled,
  dartWidthScaled,
  dartLengthScaled,
  waistToHipScaled,
  offsetX,
  offsetY,
  centerToDartScaled,
  mirrored,
}: SkirtBackPanelProps) {
  const tm: React.CSSProperties | undefined = mirrored
    ? { transform: 'scaleX(-1)', transformBox: 'fill-box' as const, transformOrigin: 'center' }
    : undefined;

  const panelPath = `
    M ${offsetX} ${offsetY}
    L ${offsetX + centerToDartScaled} ${offsetY}
    L ${offsetX + centerToDartScaled + dartWidthScaled / 2} ${offsetY + dartLengthScaled}
    L ${offsetX + centerToDartScaled + dartWidthScaled} ${offsetY}
    C ${offsetX + centerToDartScaled + dartWidthScaled + (waistWidthScaled - (centerToDartScaled + dartWidthScaled)) / 2} ${offsetY},
      ${offsetX + waistWidthScaled} ${offsetY - 1.25 * scale},
      ${offsetX + waistWidthScaled} ${offsetY - 1.25 * scale}
    C ${offsetX + waistWidthScaled} ${offsetY - 1.25 * scale},
      ${offsetX + patternWidth} ${offsetY + waistToHipScaled / 4},
      ${offsetX + patternWidth} ${offsetY + waistToHipScaled + 1.25 * scale}
    L ${offsetX + patternWidth} ${offsetY + patternHeight}
    L ${offsetX} ${offsetY + patternHeight}
    Z
  `;

  return (
    <g className="back-panel">
      {/* Pattern piece */}
      <path
        d={panelPath}
        fill="hsl(var(--pattern-fill))"
        stroke="hsl(var(--pattern-stroke))"
        strokeWidth="2"
        className="animate-fade-in"
      />

      {/* Grain line */}
      <line
        x1={offsetX + patternWidth / 2}
        y1={offsetY + 30}
        x2={offsetX + patternWidth / 2}
        y2={offsetY + patternHeight - 30}
        stroke="hsl(var(--pattern-stroke))"
        strokeWidth="1"
        strokeDasharray="8,4"
        markerEnd="url(#arrow)"
        markerStart="url(#arrow)"
      />

      {/* Waist measurement */}
      <g className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <line
          x1={offsetX - 10}
          y1={offsetY - 15}
          x2={offsetX + waistWidthScaled + 10}
          y2={offsetY - 15}
          stroke="hsl(var(--measure-line))"
          strokeWidth="1"
        />
        <line
          x1={offsetX}
          y1={offsetY - 20}
          x2={offsetX}
          y2={offsetY - 10}
          stroke="hsl(var(--measure-line))"
          strokeWidth="1"
        />
        <line
          x1={offsetX + waistWidthScaled}
          y1={offsetY - 20}
          x2={offsetX + waistWidthScaled}
          y2={offsetY - 10}
          stroke="hsl(var(--measure-line))"
          strokeWidth="1"
        />
        <text
          x={offsetX + waistWidthScaled / 2}
          y={offsetY - 22}
          textAnchor="middle"
          className="fill-primary text-xs font-sans"
          style={tm}
        >
          ¼ waist = {(waistQuarter + dartWidth + ease).toFixed(1)}cm
        </text>
      </g>

      {/* Hip to hem measurement */}
      <g className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <line
          x1={offsetX + patternWidth + 15}
          y1={offsetY + waistToHipScaled}
          x2={offsetX + patternWidth + 15}
          y2={offsetY + patternHeight}
          stroke="hsl(var(--measure-line))"
          strokeWidth="1"
        />
        <text
          x={offsetX + patternWidth + 25}
          y={offsetY + waistToHipScaled + (patternHeight - waistToHipScaled) / 2}
          textAnchor="start"
          className="fill-primary text-xs font-sans"
          transform={`rotate(90, ${offsetX + patternWidth + 25}, ${offsetY + waistToHipScaled + (patternHeight - waistToHipScaled) / 2})`}
          style={tm}
        >
          {(skirtLength - waistToHip).toFixed(1)}cm
        </text>
      </g>

      {/* Label */}
      <text
        x={offsetX + patternWidth / 2}
        y={offsetY + patternHeight / 2}
        textAnchor="middle"
        className="fill-foreground font-serif text-sm"
        style={tm}
      >
        BACK
      </text>
      <text
        x={offsetX + patternWidth / 2}
        y={offsetY + patternHeight / 2 + 18}
        textAnchor="middle"
        className="fill-muted-foreground text-xs font-sans"
        style={tm}
      >
        Cut 1 on fold
      </text>
    </g>
  );
}
