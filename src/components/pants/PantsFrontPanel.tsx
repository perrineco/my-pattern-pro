import { PantsMeasurements, Category } from "@/types/sloper";
import { useLanguage } from "@/contexts/LanguageContext";

interface PantsFrontPanelProps {
  measurements: PantsMeasurements;
  offsetX: number;
  offsetY: number;
  scale: number;
  category: Category;
  showMeasurements?: boolean;
}

// Shared geometry — also consumed by the PDF export (src/lib/pdf-export.ts) so the
// printed pattern always matches this preview exactly.
export function computePantsFrontDartlessGeometry(
  measurements: PantsMeasurements,
  offsetX: number,
  offsetY: number,
  scale: number,
  category: Category,
) {
  const { waist, hip, knee, hipHeight, crotchDepth, outseamLength, inseamLength } = measurements;
  const ease = measurements.ease ?? 2;

  const s = (v: number) => v * scale;

  // === CONSTRUCTION FRONT ===

  // Rectangle ABCD
  // A-B = 1/4 hip circumference
  const hipQuarter = hip / 4 + ease;
  // A-C = total pants length
  const totalLength = outseamLength;

  // E-E1: crotch extension
  const crotchExtension = category === "women" ? hip / 20 : hip / 16 - 1;

  // I-L line: (thigh reference)
  const iLineY = crotchDepth * 2;

  // X = midpoint of E1-F on crotch line
  const xCenter = (-crotchExtension + hipQuarter) / 2;

  // M-O: knee height — approximate from measurements
  const kneeY = crotchDepth + inseamLength * 0.4;

  // B-B1 (waist reduction at side)
  const waistReduction = hipQuarter - waist / 4 - 5;

  // B1 raised by 1cm for women only
  const b1Rise = category === "women" ? 1 : 0;

  // Hem: N-C1 = N-D1 ≈ ankle/4 + 0.5 each side (or custom)
  const hemHalfWidth = hip / 10 + 1.5;
  const thighHalfSpread = hemHalfWidth + 1;

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

  const buildPath = () => {
    let path = "";
    path += `M ${a1X} ${a1Y}`;
    path += ` L ${b1X} ${b1Y}`;
    path += ` Q ${offsetX + s(hipQuarter + 0.5)} ${offsetY + s(hipHeight * 0.5)} ${hipSideX} ${hipY}`;
    path += ` L ${hipSideX} ${crotchY}`;
    path += ` L ${thighSideX} ${iY}`;
    path += ` L ${hemSideX} ${hemY}`;
    path += ` L ${hemInnerX} ${hemY}`;
    path += ` L ${thighInnerX} ${iY}`;
    path += ` C ${thighInnerX} ${iY + ((crotchY - iY) * 3) / 4}, ${e1X} ${crotchY}, ${e1X} ${crotchY}`;
    path += ` C ${e1X + (a1X - e1X) / 2} ${crotchY + (hipY - crotchY) / 20}, ${a1X - s(1)} ${hipY - (hipY - crotchY) / 4}, ${a1X - s(1)} ${hipY}`;
    path += ` L ${a1X} ${a1Y}`;
    path += ` Z`;
    return path;
  };

  const panelHeight = s(totalLength);

  return {
    path: buildPath(),
    totalLength,
    panelHeight,
    a1X, a1Y, b1X, b1Y,
    hipSideX, hipY,
    crotchY, e1X,
    centerX,
    iY, thighSideX, thighInnerX,
    kneeYPos, kneeSideX, kneeInnerX,
    hemY, hemSideX, hemInnerX,
  };
}

export function PantsFrontPanel({ measurements, offsetX, offsetY, scale, category, showMeasurements = true }: PantsFrontPanelProps) {
  const { t } = useLanguage();

  const {
    path,
    panelHeight,
    a1X, b1X,
    hipSideX,
    crotchY, e1X,
    centerX,
    hemY, hemSideX, hemInnerX,
    totalLength,
  } = computePantsFrontDartlessGeometry(measurements, offsetX, offsetY, scale, category);

  const ml = "hsl(var(--measure-line))";

  return (
    <g>
      {/* Main pattern piece */}
      <path d={path} fill="hsl(var(--pattern-fill))" stroke="hsl(var(--pattern-stroke))" strokeWidth="2" />

      {showMeasurements && (
        <g>
          {/* Waist width */}
          <line x1={a1X} y1={offsetY - 18} x2={b1X} y2={offsetY - 18} stroke={ml} strokeWidth="1" />
          <line x1={a1X} y1={offsetY - 24} x2={a1X} y2={offsetY - 12} stroke={ml} strokeWidth="1" />
          <line x1={b1X} y1={offsetY - 24} x2={b1X} y2={offsetY - 12} stroke={ml} strokeWidth="1" />
          <text x={(a1X + b1X) / 2} y={offsetY - 26} textAnchor="middle" className="fill-primary text-xs font-sans">
            {((b1X - a1X) / scale).toFixed(1)}cm
          </text>

          {/* Total length — vertical, left side */}
          <line x1={a1X - 15} y1={offsetY} x2={a1X - 15} y2={hemY} stroke={ml} strokeWidth="1" />
          <line x1={a1X - 21} y1={offsetY} x2={a1X - 9} y2={offsetY} stroke={ml} strokeWidth="1" />
          <line x1={a1X - 21} y1={hemY} x2={a1X - 9} y2={hemY} stroke={ml} strokeWidth="1" />
          <text
            x={a1X - 26}
            y={offsetY + panelHeight / 2}
            textAnchor="middle"
            className="fill-primary text-xs font-sans"
            transform={`rotate(-90, ${a1X - 26}, ${offsetY + panelHeight / 2})`}
          >
            {totalLength}cm
          </text>

          {/* Crotch width — horizontal, below crotch line */}
          <line x1={e1X} y1={crotchY + 12} x2={hipSideX} y2={crotchY + 12} stroke={ml} strokeWidth="1" />
          <line x1={e1X}     y1={crotchY + 6} x2={e1X}     y2={crotchY + 18} stroke={ml} strokeWidth="1" />
          <line x1={hipSideX} y1={crotchY + 6} x2={hipSideX} y2={crotchY + 18} stroke={ml} strokeWidth="1" />
          <text x={(e1X + hipSideX) / 2} y={crotchY + 28} textAnchor="middle" className="fill-primary text-xs font-sans">
            {((hipSideX - e1X) / scale).toFixed(1)}cm
          </text>

          {/* Hem width — horizontal, below hem */}
          <line x1={hemInnerX} y1={hemY + 15} x2={hemSideX} y2={hemY + 15} stroke={ml} strokeWidth="1" />
          <line x1={hemInnerX} y1={hemY + 9} x2={hemInnerX} y2={hemY + 21} stroke={ml} strokeWidth="1" />
          <line x1={hemSideX} y1={hemY + 9} x2={hemSideX} y2={hemY + 21} stroke={ml} strokeWidth="1" />
          <text x={(hemInnerX + hemSideX) / 2} y={hemY + 32} textAnchor="middle" className="fill-primary text-xs font-sans">
            {((hemSideX - hemInnerX) / scale).toFixed(1)}cm
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
      >
        {t('piece.front')}
      </text>
    </g>
  );
}
