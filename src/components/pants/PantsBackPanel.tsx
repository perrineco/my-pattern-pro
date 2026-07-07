import { PantsMeasurements, Category } from "@/types/sloper";
import { useLanguage } from "@/contexts/LanguageContext";

interface PantsBackPanelProps {
  measurements: PantsMeasurements;
  offsetX: number;
  offsetY: number;
  scale: number;
  category: Category;
  mirrored?: boolean;
  showMeasurements?: boolean;
}

// Shared geometry — also consumed by the PDF export (src/lib/pdf-export.ts) so the
// printed pattern always matches this preview exactly.
export function computePantsBackDartlessGeometry(
  measurements: PantsMeasurements,
  offsetX: number,
  offsetY: number,
  scale: number,
  category: Category,
) {
  const { waist, hip, hipHeight, crotchDepth, outseamLength, inseamLength } = measurements;
  const ease = measurements.ease ?? 2;

  const s = (v: number) => v * scale;

  // === CONSTRUCTION BACK ===

  // A-B = 1/4 hip + ease
  const hipQuarter = hip / 4 + ease;
  const totalLength = outseamLength;

  // E-E1 (back crotch extension)
  const crotchExtension = category === "women" ? hip / 16 + 3 : hip / 16 - 1;

  // E1-E2 = 1cm (crotch point raised)
  const e2Rise = 1;

  // I-L line at 2/3 A-E below E
  const iLineY = crotchDepth + (2 / 3) * crotchDepth;

  const xCenter = (-crotchExtension + hipQuarter) / 2;

  // M-O = knee height
  const kneeY = crotchDepth + inseamLength * 0.4;

  // A-A1, A1-A2 (center back shifts)
  const a1Shift = category === "women" ? 3.5 : 2;
  const a2Shift = category === "women" ? outseamLength * 0.027 : 2;

  // B-B1 (waist reduction at side)
  const waistReduction = hipQuarter - waist / 4 - ease;

  const hemHalfWidth = hip / 10 + 1.5;
  const thighHalfSpread = hemHalfWidth + 1;
  // N-N1 = 1cm (hem center shift)
  const hemShift = 1;

  // A2 — center back waist (shifted and raised)
  const a2X = offsetX + s(a1Shift);
  const a2Y = offsetY - s(a2Shift);

  // B1 — side waist
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

  const centerX = offsetX + s(xCenter);

  // Thigh level (I-L)
  const iY = offsetY + s(iLineY);
  const thighSideX = centerX + s(thighHalfSpread);
  const thighInnerX = centerX - s(thighHalfSpread);

  const kneeYPos = offsetY + s(kneeY);

  // Hem level
  const hemY = offsetY + s(totalLength);
  const hemCenterX = centerX - s(hemShift);
  const hemSideX = hemCenterX + s(hemHalfWidth);
  const hemInnerX = hemCenterX - s(hemHalfWidth);

  // F point (side at crotch level)
  const fX = offsetX + s(hipQuarter);
  const fY = crotchY;

  const buildPath = () => {
    let path = "";
    path += `M ${a2X} ${a2Y}`;
    path += ` L  ${b1X} ${b1Y}`;
    path += ` C ${hipSideX} ${offsetY + s(hipHeight * 0.5)} ${hipSideX} ${hipY} ${hipSideX} ${hipY}`;
    path += ` L ${fX} ${fY}`;
    path += ` C ${fX} ${fY + (iY - fY) * 0.3} ${thighSideX } ${iY - (iY - fY) * 0.2} ${thighSideX} ${iY}`;
    path += ` L ${hemSideX} ${hemY}`;
    path += ` L ${hemInnerX} ${hemY}`;
    path += ` L ${thighInnerX} ${iY}`;
    path += ` C ${thighInnerX} ${(iY + e2Y)/2} ${e2X} ${e2Y} ${e2X} ${e2Y}`;
    path += ` C ${e2X + (offsetX - e2X) * 0.8} ${crotchY - (hipY - crotchY) / 8}, ${offsetX - (a2X - offsetX) / 4} ${hipY - (a2Y - hipY) / 4}, ${offsetX} ${hipY}`;
    path += ` L ${a2X} ${a2Y}`;
    path += ` Z`;
    return path;
  };

  const panelHeight = hemY - offsetY;

  return {
    path: buildPath(),
    totalLength,
    panelHeight,
    a2X, a2Y, b1X, b1Y,
    hipSideX, hipY,
    crotchY, e1X, e2X, e2Y,
    centerX,
    iY, thighSideX, thighInnerX,
    kneeYPos,
    hemY, hemCenterX, hemSideX, hemInnerX,
    fX, fY,
  };
}

export function PantsBackPanel({ measurements, offsetX, offsetY, scale, category, mirrored, showMeasurements = true }: PantsBackPanelProps) {
  const { t } = useLanguage();
  const tm: React.CSSProperties | undefined = mirrored
    ? { transform: 'scaleX(-1)', transformBox: 'fill-box' as const, transformOrigin: 'center' }
    : undefined;

  const {
    path,
    panelHeight,
    a2X, a2Y, b1X,
    crotchY, e2X,
    centerX,
    fX,
  } = computePantsBackDartlessGeometry(measurements, offsetX, offsetY, scale, category);

  const ml = "hsl(var(--measure-line))";

  return (
    <g>
      {/* Main pattern piece */}
      <path d={path} fill="hsl(var(--pattern-fill))" stroke="hsl(var(--pattern-stroke))" strokeWidth="2" />

      {showMeasurements && (
        <g>
          {/* Waist width */}
          <line x1={a2X} y1={a2Y - 18} x2={b1X} y2={a2Y - 18} stroke={ml} strokeWidth="1" />
          <line x1={a2X} y1={a2Y - 24} x2={a2X} y2={a2Y - 12} stroke={ml} strokeWidth="1" />
          <line x1={b1X} y1={a2Y - 24} x2={b1X} y2={a2Y - 12} stroke={ml} strokeWidth="1" />
          <text x={(a2X + b1X) / 2} y={a2Y - 26} textAnchor="middle" className="fill-primary text-xs font-sans" style={tm}>
            {((b1X - a2X) / scale).toFixed(1)}cm
          </text>

          {/* Crotch width — horizontal, below crotch line */}
          <line x1={e2X} y1={crotchY + 12} x2={fX} y2={crotchY + 12} stroke={ml} strokeWidth="1" />
          <line x1={e2X} y1={crotchY + 6} x2={e2X} y2={crotchY + 18} stroke={ml} strokeWidth="1" />
          <line x1={fX}  y1={crotchY + 6} x2={fX}  y2={crotchY + 18} stroke={ml} strokeWidth="1" />
          <text x={(e2X + fX) / 2} y={crotchY + 28} textAnchor="middle" className="fill-primary text-xs font-sans" style={tm}>
            {((fX - e2X) / scale).toFixed(1)}cm
          </text>
        </g>
      )}

      {/* Grain line */}
      <line
        x1={centerX}
        y1={offsetY + panelHeight * 0.35}
        x2={centerX}
        y2={offsetY + panelHeight * 0.65}
        stroke="hsl(var(--pattern-stroke))"
        strokeWidth="1"
        strokeDasharray="8,4"
        markerEnd="url(#pantsArrow)"
        markerStart="url(#pantsArrowReverse)"
      />

      {/* Labels */}
      <text
        x={centerX}
        y={offsetY + panelHeight * 0.35 - 62}
        textAnchor="middle"
        className="fill-foreground font-serif text-sm"
        style={tm}
      >
        {t('piece.back')}
      </text>
    </g>
  );
}
