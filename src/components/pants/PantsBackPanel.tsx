import { PantsMeasurements, Category } from "@/types/sloper";

interface PantsBackPanelProps {
  measurements: PantsMeasurements;
  offsetX: number;
  offsetY: number;
  scale: number;
  category: Category;
  mirrored?: boolean;
}

export function PantsBackPanel({ measurements, offsetX, offsetY, scale, category, mirrored }: PantsBackPanelProps) {
  const { waist, hip, thigh, knee, ankle, hipHeight, crotchDepth, outseamLength, inseamLength } = measurements;

  const s = (v: number) => v * scale;
  const tm: React.CSSProperties | undefined = mirrored
    ? { transform: 'scaleX(-1)', transformBox: 'fill-box' as const, transformOrigin: 'center' }
    : undefined;

  // === CONSTRUCTION BACK ===
  const hipQuarter = hip / 4;
  const rectWidth = hipQuarter + 2;
  const totalLength = outseamLength;
  const crotchExtension = hip / 16 + 3;
  const e2Rise = 1;
  const iLineY = crotchDepth + (2 / 3) * crotchDepth;
  const xCenter = (-crotchExtension + rectWidth) / 2;
  const kneeY = crotchDepth + inseamLength * 0.4;
  const a1Shift = 2;
  const a2Shift = 2;
  const waistReduction = 2;
  const b1Rise = category === "women" ? 1 : 0;
  const thighHalfSpread = thigh / 4 + 2;
  const hemHalfWidth = ankle / 4 + 1;
  const kneeHalfSpread = knee / 4 + 1;
  const hemShift = 1;

  // === Scaled screen coordinates ===
  const ox = offsetX;
  const oy = offsetY;
  const a2X = offsetX + s(a1Shift);
  const a2Y = offsetY - s(a2Shift);
  const b1X = offsetX + s(rectWidth - waistReduction);
  const b1Y = offsetY - s(b1Rise);
  const hipSideX = offsetX + s(rectWidth);
  const hipY = offsetY + s(hipHeight);
  const crotchY = offsetY + s(crotchDepth);
  const e1X = offsetX - s(crotchExtension);
  const e2X = e1X;
  const e2Y = crotchY - s(e2Rise);
  const centerX = offsetX + s(xCenter);
  const iY = offsetY + s(iLineY);
  const thighSideX = centerX + s(thighHalfSpread);
  const thighInnerX = centerX - s(thighHalfSpread);
  const kneeYPos = offsetY + s(kneeY);
  const kneeSideX = centerX + s(kneeHalfSpread);
  const kneeInnerX = centerX - s(kneeHalfSpread);
  const hemY = offsetY + s(totalLength);
  const hemCenterX = centerX - s(hemShift);
  const hemSideX = hemCenterX + s(hemHalfWidth);
  const hemInnerX = hemCenterX - s(hemHalfWidth);
  const fX = offsetX + s(rectWidth);
  const fY = crotchY;

  const buildPath = () => {
    let path = "";
    path += `M ${a2X} ${a2Y}`;
    path += ` Q ${offsetX + s(rectWidth * 0.5)} ${offsetY - s(0.5)} ${b1X} ${b1Y}`;
    path += ` Q ${offsetX + s(rectWidth + 0.5)} ${offsetY + s(hipHeight * 0.5)} ${hipSideX} ${hipY}`;
    path += ` L ${fX} ${fY}`;
    path += ` L ${thighSideX} ${iY}`;
    path += ` L ${kneeSideX} ${kneeYPos}`;
    path += ` L ${hemSideX} ${hemY}`;
    path += ` Q ${hemCenterX} ${hemY + s(0.5)} ${hemInnerX} ${hemY}`;
    path += ` L ${kneeInnerX} ${kneeYPos}`;
    path += ` L ${thighInnerX} ${iY}`;
    path += ` Q ${offsetX - s(crotchExtension * 0.3)} ${iY - s(2)} ${e2X} ${e2Y}`;
    path += ` Q ${e1X} ${hipY} ${offsetX + s(a1Shift * 0.5)} ${offsetY + s(hipHeight * 0.4)}`;
    path += ` L ${a2X} ${a2Y}`;
    path += ` Z`;
    return path;
  };

  const panelHeight = hemY - offsetY;

  return (
    <g>
      <path d={buildPath()} fill="hsl(var(--pattern-fill))" stroke="hsl(var(--pattern-stroke))" strokeWidth="2" />

      {/* Hip line */}
      <line x1={e1X} y1={hipY} x2={hipSideX} y2={hipY} stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeDasharray="3,3" />

      {/* Crotch line */}
      <line x1={e1X} y1={crotchY} x2={fX} y2={crotchY} stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeDasharray="3,3" />

      {/* Thigh line */}
      <line x1={thighInnerX} y1={iY} x2={thighSideX} y2={iY} stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeDasharray="2,4" />

      {/* Knee line */}
      <line x1={kneeInnerX} y1={kneeYPos} x2={kneeSideX} y2={kneeYPos} stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeDasharray="3,3" />

      {/* Grain line */}
      <line x1={centerX} y1={oy + s(3)} x2={centerX} y2={hemY - s(3)} stroke="hsl(var(--pattern-stroke))" strokeWidth="1.5" markerEnd="url(#pantsArrow)" />

      {/* Labels */}
      <text x={centerX} y={oy + panelHeight * 0.45} textAnchor="middle" className="fill-foreground font-serif text-sm" style={tm}>
        BACK
      </text>
      <text x={centerX} y={oy + panelHeight * 0.45 + 16} textAnchor="middle" className="fill-muted-foreground text-xs" style={tm}>
        Cut 2
      </text>

      {/* Measurement labels */}
      <text x={hipSideX + 5} y={hipY + 4} className="fill-muted-foreground text-[9px]" style={tm}>
        Hip
      </text>
      <text x={fX + 5} y={crotchY + 4} className="fill-muted-foreground text-[9px]" style={tm}>
        Crotch
      </text>
      <text x={thighSideX + 5} y={iY + 4} className="fill-muted-foreground text-[9px]" style={tm}>
        Thigh
      </text>
      <text x={kneeSideX + 5} y={kneeYPos + 4} className="fill-muted-foreground text-[9px]" style={tm}>
        Knee
      </text>
    </g>
  );
}
