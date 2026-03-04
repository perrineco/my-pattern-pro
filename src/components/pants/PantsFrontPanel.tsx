import { PantsMeasurements, Category } from "@/types/sloper";

interface PantsFrontPanelProps {
  measurements: PantsMeasurements;
  offsetX: number;
  offsetY: number;
  scale: number;
  category: Category;
}

export function PantsFrontPanel({ measurements, offsetX, offsetY, scale, category }: PantsFrontPanelProps) {
  const { waist, hip, thigh, knee, ankle, hipHeight, crotchDepth, outseamLength, inseamLength } = measurements;
  const ease = measurements.ease ?? 2;

  const s = (v: number) => v * scale;

  // === COSTRUZIONE DAVANTI (Italian Method) ===

  // Rectangle ABCD
  // A-B = 1/4 hip circumference
  const hipQuarter = hip / 4 + ease;
  // A-C = total pants length
  const totalLength = outseamLength;

  // E-E1: crotch extension
  const crotchExtension = category === "women" ? hip / 20 : hip / 16 - 1;

  // A-G: hip height — from measurements
  // A-E: crotch height — from measurements

  // I-L line:  (thigh reference)
  //  const iLineY = crotchDepth + (2 / 3) * crotchDepth;
  const iLineY = crotchDepth * 2;

  // X = midpoint of E1-F on crotch line
  const xCenter = (-crotchExtension + hipQuarter) / 2;

  // M-N: vertical grain line through X
  // M at top, N at bottom

  // M-O: knee height — approximate from measurements
  const kneeY = crotchDepth + inseamLength * 0.4;

  // B-B1 = 2cm (waist reduction at side)
  const waistReduction = 2;

  // B1 raised by 1cm for women only
  const b1Rise = category === "women" ? 1 : 0;

  // X1-L1 = 1/4 thigh circumference + 0.5 (each side of center)
  const thighHalfSpread = thigh / 4 + 0.5;

  // Hem: N-C1 = N-D1 ≈ ankle/4 + 0.5 each side (or custom)
  //  const hemHalfWidth = ankle / 4 + 0.5;
  const hemHalfWidth = thighHalfSpread - 1;

  // Knee width: interpolated between thigh and ankle
  const kneeHalfSpread = knee / 4 + 0.5;

  // Waist points
  const a1X = offsetX;
  const a1Y = offsetY;
  const b1X = offsetX + s(hipQuarter - waistReduction);
  const b1Y = offsetY - s(b1Rise);

  // Hip level
  const hipSideX = offsetX + s(hipQuarter);
  const hipY = offsetY + s(hipHeight);

  // Crotch level
  const crotchY = offsetY + s(crotchDepth);
  const e1X = offsetX - s(crotchExtension);

  // Center line X position
  const centerX = offsetX + s(xCenter);

  // Thigh level (I-L line)
  const iY = offsetY + s(iLineY);
  const thighSideX = centerX + s(thighHalfSpread);
  const thighInnerX = centerX - s(thighHalfSpread);

  // Knee level
  const kneeYPos = offsetY + s(kneeY);
  const kneeSideX = centerX + s(kneeHalfSpread);
  const kneeInnerX = centerX - s(kneeHalfSpread);

  // Hem level
  const hemY = offsetY + s(totalLength);
  const hemSideX = centerX + s(hemHalfWidth);
  const hemInnerX = centerX - s(hemHalfWidth);

  // Build the front panel outline
  const buildPath = () => {
    let path = "";

    // Start at A1 — center front, waist
    path += `M ${a1X} ${a1Y}`;

    // Waist: A1 → B1 (slight curve for waist shaping)
    //  path += ` L ${b1X} ${b1Y}`;
    path += ` Q ${(a1X + b1X) / 2} ${a1Y + 5}, ${b1X} ${b1Y}`;

    // Side seam: B1 → H (hip, side) with curve
    path += ` Q ${offsetX + s(hipQuarter + 0.5)} ${offsetY + s(hipHeight * 0.5)} ${hipSideX} ${hipY}`;
    //`C ${pB1.x} ${pB1.y + 20}, ${pHip.x} ${pHip.y - 20}, ${pHip.x} ${pHip.y}`,

    // Side seam: H → F
    path += ` L ${hipSideX} ${crotchY}`;

    // Side seam: F → thigh level (L1)
    path += ` L ${thighSideX} ${iY}`;

    // Side seam: thigh → knee
    //   path += ` L ${kneeSideX} ${kneeYPos}`;

    // Side seam: knee → hem (D1)
    path += ` L ${hemSideX} ${hemY}`;

    // Hem line: D1 → C1
    path += ` L ${hemInnerX} ${hemY}`;

    // Inseam: C1 → knee inner
    //  path += ` L ${kneeInnerX} ${kneeYPos}`;

    // Inseam: knee → thigh inner (I1)
    path += ` L ${thighInnerX} ${iY}`;

    // Inseam: thigh → crotch (center front at crotch depth)
    path += ` L ${offsetX} ${crotchY}`;

    // Crotch curve: center front → E1 (extension)
    path += ` Q ${e1X + s(0.5)} ${crotchY + s(0.5)} ${e1X} ${crotchY - s(1.5)}`;

    // Crotch curve: E1 → G (hip level center) → A1 (waist) — "con linea curva"
    path += ` Q ${e1X} ${hipY} ${offsetX} ${offsetY + s(hipHeight * 0.5)}`;
    //`C ${pE1.x} ${pE1.y - 40}, ${offsetX} ${hipY}, ${a1X} ${a1Y}`,
    // Center front back to waist
    path += ` L ${a1X} ${a1Y}`;

    path += ` Z`;
    return path;
  };

  const panelHeight = s(totalLength);

  return (
    <g>
      {/* Main pattern piece */}
      <path d={buildPath()} fill="hsl(var(--pattern-fill))" stroke="hsl(var(--pattern-stroke))" strokeWidth="2" />

      {/* Hip line (reference) */}
      <line
        x1={e1X}
        y1={hipY}
        x2={hipSideX}
        y2={hipY}
        stroke="hsl(var(--muted-foreground))"
        strokeWidth="1"
        strokeDasharray="3,3"
      />

      {/* Crotch line (reference) */}
      <line
        x1={e1X}
        y1={crotchY}
        x2={thighSideX}
        y2={crotchY}
        stroke="hsl(var(--muted-foreground))"
        strokeWidth="1"
        strokeDasharray="3,3"
      />

      {/* I-L line — thigh reference */}
      <line
        x1={thighInnerX}
        y1={iY}
        x2={thighSideX}
        y2={iY}
        stroke="hsl(var(--muted-foreground))"
        strokeWidth="1"
        strokeDasharray="2,4"
      />

      {/* Knee line (reference) */}
      <line
        x1={kneeInnerX}
        y1={kneeYPos}
        x2={kneeSideX}
        y2={kneeYPos}
        stroke="hsl(var(--muted-foreground))"
        strokeWidth="1"
        strokeDasharray="3,3"
      />

      {/* Grain line — DRITTO FILO / LINEA PIEGA */}
      <line
        x1={centerX}
        y1={offsetY + s(3)}
        x2={centerX}
        y2={hemY - s(3)}
        stroke="hsl(var(--pattern-stroke))"
        strokeWidth="1.5"
        markerEnd="url(#pantsArrow)"
      />

      {/* Labels */}
      <text
        x={centerX}
        y={offsetY + panelHeight * 0.45}
        textAnchor="middle"
        className="fill-foreground font-serif text-sm"
      >
        FRONT
      </text>
      <text
        x={centerX}
        y={offsetY + panelHeight * 0.45 + 16}
        textAnchor="middle"
        className="fill-muted-foreground text-xs"
      >
        Cut 2
      </text>

      {/* Measurement labels */}
      <text x={hipSideX + 5} y={hipY + 4} className="fill-muted-foreground text-[9px]">
        Hip
      </text>
      <text x={thighSideX + 5} y={crotchY + 4} className="fill-muted-foreground text-[9px]">
        Crotch
      </text>
      <text x={thighSideX + 5} y={iY + 4} className="fill-muted-foreground text-[9px]">
        Thigh
      </text>
      <text x={kneeSideX + 5} y={kneeYPos + 4} className="fill-muted-foreground text-[9px]">
        Knee
      </text>
    </g>
  );
}
