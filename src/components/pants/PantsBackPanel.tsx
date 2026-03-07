import { PantsMeasurements, Category } from "@/types/sloper";

interface PantsBackPanelProps {
  measurements: PantsMeasurements;
  offsetX: number;
  offsetY: number;
  scale: number;
  category: Category;
  mirrored?: boolean;
}

export function PantsBackPanel({ measurements, offsetX, offsetY, scale, category }: PantsBackPanelProps) {
  const { waist, hip, thigh, knee, ankle, hipHeight, crotchDepth, outseamLength, inseamLength } = measurements;
  const ease = measurements.ease ?? 2;

  const s = (v: number) => v * scale;

  // === CONSTRUCTION BACK ===

  // Rectangle ABCD
  // A-B = 1/4 hip + ease
  const hipQuarter = hip / 4 + ease;
  const rectWidth = hipQuarter + ease;
  const totalLength = outseamLength;

  // E-E1 =  (back crotch extension)
  const crotchExtension = category === "women" ? hip / 16 + 3 : hip / 16 - 1;

  // E1-E2 = 1cm (crotch point raised)
  const e2Rise = 1;

  // A-G = hip height (Altezza Fianco) — from measurements

  // E-I = A-E (same as crotch depth going down from E)
  // I-L line at 2/3 A-E below E
  const iLineY = crotchDepth + (2 / 3) * crotchDepth;

  // E1-X = midpoint of E1-F
  // E1 is at -crotchExtension, F is at rectWidth
  const xCenter = (-crotchExtension + hipQuarter) / 2;

  // M-O = knee height
  const kneeY = crotchDepth + inseamLength * 0.4;

  // A-A1 = 2cm, A1-A2 = 2cm (center back shifts)
  const a1Shift = category === "women" ? 3.5 : 2; // A-A1 horizontal
  const a2Shift = category === "women" ? outseamLength * 0.027 : 2; // A1-A2 vertical (raised waist)

  // B-B1 (waist reduction at side)
  const waistReduction = hipQuarter - waist / 4 - 5;

  // B1 raised by 1cm for women only
  const b1Rise = category === "women" ? 1 : 0;

  // Hem: N-C1 = 10cm, N-D1 = 10cm (or custom)
  const hemHalfWidth = hip / 10 + 1.5;
  const thighHalfSpread = hemHalfWidth + 1;
  // Knee width
  const kneeHalfSpread = knee / 4 + 1;

  // N-N1 = 1cm (hem center shift)
  const hemShift = 1;

  // A2 — center back waist (shifted and raised)
  const a2X = offsetX + s(a1Shift);
  const a2Y = offsetY - s(a2Shift);

  // B1 — side waist (raised 1cm for women)
  const b1X = offsetX + s(hipQuarter - waistReduction);
  const b1Y = offsetY;

  // Hip level
  const hipSideX = offsetX + s(hipQuarter);
  const hipY = offsetY + s(hipHeight);

  // Crotch level
  const crotchY = offsetY + s(crotchDepth);
  const e1X = offsetX - s(crotchExtension);
  const e2X = e1X;
  const e2Y = crotchY - s(e2Rise);

  // Center line X
  const centerX = offsetX + s(xCenter);

  // Thigh level (I-L)
  const iY = offsetY + s(iLineY);
  const thighSideX = centerX + s(thighHalfSpread);
  const thighInnerX = centerX - s(thighHalfSpread);

  // Knee level
  const kneeYPos = offsetY + s(kneeY);
  const kneeSideX = centerX + s(kneeHalfSpread);
  const kneeInnerX = centerX - s(kneeHalfSpread);

  // Hem level
  const hemY = offsetY + s(totalLength);
  const hemCenterX = centerX - s(hemShift); // N-N1 shift
  const hemSideX = hemCenterX + s(hemHalfWidth);
  const hemInnerX = hemCenterX - s(hemHalfWidth);

  // F point (side at crotch level)
  const fX = offsetX + s(hipQuarter);
  const fY = crotchY;

  // Build the back panel outline
  const buildPath = () => {
    let path = "";

    // Start at A2 — center back waist (shifted)
    path += `M ${a2X} ${a2Y}`;

    // Waist: A2 → B1 (slight curve)
    // path += ` Q ${offsetX + s(hipQuarter * 0.5)} ${offsetY - s(0.5)} ${b1X} ${b1Y}`;
    path += ` L  ${b1X} ${b1Y}`;

    // Side seam: B1 → H (hip)
    //  path += ` Q ${offsetX + s(hipQuarter + 0.5)} ${offsetY + s(hipHeight * 0.5)} ${hipSideX} ${hipY}`;
    path += ` L  ${hipSideX} ${hipY}`;

    // Side seam: H → F (crotch level)
    path += ` L ${fX} ${fY}`;

    // Side seam: F → L1 (thigh)
    path += ` L ${thighSideX} ${iY}`;

    // Side seam: L1 → knee → D1 (hem)
    //  path += ` L ${kneeSideX} ${kneeYPos}`;
    path += ` L ${hemSideX} ${hemY}`;

    // Hem: D1 → N1 → C1
    //    path += ` Q ${hemCenterX} ${hemY + s(0.5)} ${hemInnerX} ${hemY}`;
    path += ` L ${hemInnerX} ${hemY}`;

    // Inseam: C1 → I1 (thigh inner)
    // path += ` L ${kneeInnerX} ${kneeYPos}`;
    path += ` L ${thighInnerX} ${iY}`;

    // Inseam: I1 → E2
    //    path += ` Q ${offsetX - s(crotchExtension * 0.3)} ${iY - s(2)} ${e2X} ${e2Y}`;
    path += ` L ${e2X} ${e2Y}`;

    // Crotch curve: E2 → G
    path += ` C ${e2X + (offsetX - e2X) * 0.8} ${crotchY - (hipY - crotchY) / 8}, ${offsetX - s(1)} ${hipY - (hipY - crotchY) / 4}, ${offsetX} ${hipY}`;
    path += ` L ${a2X} ${a2Y}`;

    path += ` Z`;
    return path;
  };

  const panelWidth = Math.max(s(hipQuarter), thighSideX - e1X);
  const panelHeight = hemY - offsetY;

  return (
    <g>
      {/* Main pattern piece */}
      <path d={buildPath()} fill="hsl(var(--pattern-fill))" stroke="hsl(var(--pattern-stroke))" strokeWidth="2" />

      {/* Hip line — BACINO (G-H reference) */}
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
        x2={fX}
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
        BACK
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
      <text x={fX + 5} y={crotchY + 4} className="fill-muted-foreground text-[9px]">
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
