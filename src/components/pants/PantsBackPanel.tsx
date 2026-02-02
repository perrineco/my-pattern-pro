import { PantsMeasurements } from "@/types/sloper";

interface PantsBackPanelProps {
  measurements: PantsMeasurements;
  offsetX: number;
  offsetY: number;
  scale: number;
}

export function PantsBackPanel({
  measurements,
  offsetX,
  offsetY,
  scale,
}: PantsBackPanelProps) {
  const { waist, hip, thigh, knee, ankle, crotchDepth, outseamLength, inseamLength } = measurements;

  const s = (v: number) => v * scale;

  // Pattern calculations - quarter measurements for half panel
  const waistQuarter = waist / 4;
  const hipQuarter = hip / 4;
  const thighHalf = thigh / 2;
  const kneeHalf = knee / 2;
  const ankleHalf = ankle / 2;

  // Back dart (larger than front - takes more of the waist reduction)
  const dartWidth = (hip - waist) / 6; // Back takes more dart
  const dartLength = crotchDepth * 0.5;

  // Ease from measurements (default to 2 if not provided)
  const ease = measurements.ease ?? 2;

  // Key positions (scaled) - back takes slightly more width
  const waistWidth = s(waistQuarter + dartWidth + ease);
  const hipWidth = s(hipQuarter + ease + 0.5); // Back slightly wider at hip
  const thighWidth = s(thighHalf * 0.52 + ease); // Back takes ~52% of thigh
  const kneeWidth = s(kneeHalf * 0.52 + ease);
  const ankleWidth = s(ankleHalf * 0.52 + ease);

  const crotchY = s(crotchDepth);
  const kneeY = s(crotchDepth + (inseamLength * 0.5));
  const hemY = s(outseamLength);
  const hipY = s(crotchDepth * 0.65);

  // Crotch extension (back is longer than front)
  const crotchExtension = s(hipQuarter * 0.18);

  // Back rise adjustment (back waist sits slightly higher)
  const backRise = s(1.5);

  // Build the back panel path
  const buildPath = () => {
    const points: string[] = [];

    // Start at waist center back (raised slightly)
    points.push(`M ${offsetX} ${offsetY - backRise}`);

    // Waist to dart
    const dartX = offsetX + waistWidth * 0.35;
    points.push(`L ${dartX - s(dartWidth / 2)} ${offsetY}`);

    // Dart (deeper than front)
    points.push(`L ${dartX} ${offsetY + s(dartLength)}`);
    points.push(`L ${dartX + s(dartWidth / 2)} ${offsetY}`);

    // Continue waist to side
    points.push(`L ${offsetX + waistWidth} ${offsetY}`);

    // Side seam: waist to hip curve
    const hipX = offsetX + hipWidth;
    points.push(`Q ${offsetX + hipWidth + s(1.5)} ${offsetY + hipY * 0.5} ${hipX} ${offsetY + hipY}`);

    // Side seam: hip to crotch level
    points.push(`L ${hipX} ${offsetY + crotchY}`);

    // Side seam: crotch to knee
    points.push(`L ${offsetX + kneeWidth} ${offsetY + kneeY}`);

    // Side seam: knee to hem
    points.push(`L ${offsetX + ankleWidth} ${offsetY + hemY}`);

    // Hem line
    points.push(`L ${offsetX} ${offsetY + hemY}`);

    // Inseam: hem to knee
    points.push(`L ${offsetX} ${offsetY + kneeY}`);

    // Inseam: knee to crotch
    points.push(`L ${offsetX} ${offsetY + crotchY}`);

    // Crotch curve (deeper for back)
    points.push(`Q ${offsetX - crotchExtension * 0.8} ${offsetY + crotchY + s(1)} ${offsetX - crotchExtension} ${offsetY + crotchY - s(1)}`);
    points.push(`Q ${offsetX - crotchExtension} ${offsetY + hipY * 0.8} ${offsetX} ${offsetY + hipY * 0.5}`);

    // Center back to waist
    points.push(`L ${offsetX} ${offsetY - backRise}`);

    points.push(`Z`);

    return points.join(" ");
  };

  const panelWidth = Math.max(waistWidth, hipWidth);
  const panelHeight = hemY;

  return (
    <g>
      {/* Main pattern piece */}
      <path
        d={buildPath()}
        fill="hsl(var(--pattern-fill))"
        stroke="hsl(var(--pattern-stroke))"
        strokeWidth="2"
      />

      {/* Hip line (reference) */}
      <line
        x1={offsetX - crotchExtension}
        y1={offsetY + hipY}
        x2={offsetX + hipWidth}
        y2={offsetY + hipY}
        stroke="hsl(var(--muted-foreground))"
        strokeWidth="1"
        strokeDasharray="3,3"
      />

      {/* Crotch line (reference) */}
      <line
        x1={offsetX - crotchExtension}
        y1={offsetY + crotchY}
        x2={offsetX + hipWidth}
        y2={offsetY + crotchY}
        stroke="hsl(var(--muted-foreground))"
        strokeWidth="1"
        strokeDasharray="3,3"
      />

      {/* Knee line (reference) */}
      <line
        x1={offsetX}
        y1={offsetY + kneeY}
        x2={offsetX + kneeWidth}
        y2={offsetY + kneeY}
        stroke="hsl(var(--muted-foreground))"
        strokeWidth="1"
        strokeDasharray="3,3"
      />

      {/* Grain line */}
      <line
        x1={offsetX + panelWidth * 0.4}
        y1={offsetY + panelHeight * 0.15}
        x2={offsetX + panelWidth * 0.4}
        y2={offsetY + panelHeight * 0.85}
        stroke="hsl(var(--pattern-stroke))"
        strokeWidth="1.5"
        markerEnd="url(#pantsArrow)"
      />

      {/* Labels */}
      <text
        x={offsetX + panelWidth * 0.4}
        y={offsetY + panelHeight * 0.45}
        textAnchor="middle"
        className="fill-foreground font-serif text-sm"
      >
        BACK
      </text>
      <text
        x={offsetX + panelWidth * 0.4}
        y={offsetY + panelHeight * 0.45 + 16}
        textAnchor="middle"
        className="fill-muted-foreground text-xs"
      >
        Cut 2
      </text>

      {/* Measurement labels */}
      <text
        x={offsetX + hipWidth + 5}
        y={offsetY + hipY + 4}
        className="fill-muted-foreground text-[9px]"
      >
        Hip
      </text>
      <text
        x={offsetX + hipWidth + 5}
        y={offsetY + crotchY + 4}
        className="fill-muted-foreground text-[9px]"
      >
        Crotch
      </text>
      <text
        x={offsetX + kneeWidth + 5}
        y={offsetY + kneeY + 4}
        className="fill-muted-foreground text-[9px]"
      >
        Knee
      </text>
    </g>
  );
}
