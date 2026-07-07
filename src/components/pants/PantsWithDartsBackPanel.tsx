import { PantsMeasurements, Category } from "@/types/sloper";
import { useLanguage } from "@/contexts/LanguageContext";

interface PantsWithDartsBackPanelProps {
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
export function computePantsBackDartedGeometry(
  measurements: PantsMeasurements,
  offsetX: number,
  offsetY: number,
  scale: number,
  category: Category,
) {
  const { waist, hip, hipHeight, crotchDepth, outseamLength } = measurements;
  const ease = measurements.ease ?? 2;

  const s = (v: number) => v * scale;

  const hipQuarter = hip / 4 + ease;
  const totalLength = outseamLength;
  const crotchExtension = category === "women" ? hip / 16 + 3 : hip / 16 - 1;
  const e2Rise = 1;
  const iLineY = crotchDepth + (2 / 3) * crotchDepth;
  const xCenter = (-crotchExtension + hipQuarter) / 2;

  // Back dart — spreadsheet values
  const backDartWidth = category === "kids" ? 2 : category === "women" ? 2 : 2.5;
  const backDartLength = category === "women"
    ? hipHeight * 0.57
    : category === "men"
    ? hipHeight * 0.52
    : 9.55 + Math.max(0, Math.min(1, (hipHeight - 16) / 6)) * (17.1 - 9.55);

  const a1Shift = category === "women" ? 3 : 2;
  const a2Shift = category === "women" ? 3.5 : 2;
  const waistReduction = hipQuarter - waist / 4 - backDartWidth - ease;

  const hemHalfWidth = hip / 10 + 1.5;
  const thighHalfSpread = hemHalfWidth + 1;
  const hemShift = 1;

  // Dart position - centered on back waist
  const a2X = offsetX + s(a1Shift);
  const a2Y = offsetY - s(a2Shift);
  const b1X = category === "kids" ? offsetX + s(a1Shift) + s(waist/4+backDartWidth/2) : category === "women" ? offsetX + s(a1Shift) + s(waist/4+backDartWidth/2) : offsetX + s(hipQuarter - waistReduction);
  const b1Y = offsetY;

  const dartCenterX = (a2X + b1X) / 2;
  const dartHalfWidth = s(backDartWidth / 2);

  const hipSideX = offsetX + s(hipQuarter);
  const hipY = offsetY + s(hipHeight);
  const crotchY = offsetY + s(crotchDepth);
  const e1X = offsetX - s(crotchExtension);
  const e2X = category === "kids" ? offsetX-s(hip / 16+3): e1X;
  const e2Y = crotchY + s(e2Rise);
  const centerX = offsetX + s(xCenter);

  const iY = offsetY + s(iLineY);
  const thighSideX = centerX + s(thighHalfSpread);
  const thighInnerX = centerX - s(thighHalfSpread);
  const hemY = offsetY + s(totalLength);
  const hemCenterX = centerX - s(hemShift);
  const hemSideX = centerX + s(hemHalfWidth);
  const hemInnerX = centerX - s(hemHalfWidth);
  const fX = offsetX + s(hipQuarter);
  const fY = crotchY;

  const dartMidY = (a2Y + b1Y) / 2;

  const buildPath = () => {
    let path = "";
    path += `M ${a2X} ${a2Y}`;
    path += ` L ${dartCenterX - dartHalfWidth} ${dartMidY}`;
    path += ` L ${dartCenterX} ${dartMidY + s(backDartLength)}`;
    path += ` L ${dartCenterX + dartHalfWidth} ${dartMidY}`;
    path += ` L ${b1X} ${b1Y}`;
    path += ` C ${hipSideX} ${offsetY + s(hipHeight * 0.5)} ${hipSideX} ${hipY} ${hipSideX} ${hipY}`;
    path += ` L ${fX} ${fY}`;
    path += ` C ${fX} ${fY + (iY - fY) * 0.3} ${thighSideX } ${iY - (iY - fY) * 0.2} ${thighSideX} ${iY}`;
    path += ` L ${hemSideX} ${hemY}`;
    path += ` L ${hemInnerX} ${hemY}`;
    path += ` L ${thighInnerX} ${iY}`;
    path += ` C ${thighInnerX} ${(iY + e2Y)/2} ${e2X} ${e2Y} ${e2X} ${e2Y}`;
    path += ` C ${e2X + (offsetX - e2X) * 0.6} ${crotchY - (hipY - crotchY) / 2}, ${offsetX - (a2X - offsetX) / 4} ${hipY - (a2Y - hipY) / 4}, ${offsetX} ${hipY}`;
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
    hemY, hemCenterX, hemSideX, hemInnerX,
    fX, fY,
    dartCenterX, dartHalfWidth, backDartLength,
    dartLeftX: dartCenterX - dartHalfWidth,
    dartRightX: dartCenterX + dartHalfWidth,
    dartBaseY: dartMidY,
    dartTipX: dartCenterX,
    dartTipY: dartMidY + s(backDartLength),
  };
}

export function PantsWithDartsBackPanel({ measurements, offsetX, offsetY, scale, category, mirrored, showMeasurements = true }: PantsWithDartsBackPanelProps) {
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
    hemY, hemSideX, hemInnerX,
    fX,
  } = computePantsBackDartedGeometry(measurements, offsetX, offsetY, scale, category);

  const ml = "hsl(var(--measure-line))";

  return (
    <g>
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

          {/* Ankle width — horizontal, below hem */}
          <line x1={hemInnerX} y1={hemY + 15} x2={hemSideX} y2={hemY + 15} stroke={ml} strokeWidth="1" />
          <line x1={hemInnerX} y1={hemY + 9} x2={hemInnerX} y2={hemY + 21} stroke={ml} strokeWidth="1" />
          <line x1={hemSideX}  y1={hemY + 9} x2={hemSideX}  y2={hemY + 21} stroke={ml} strokeWidth="1" />
          <text x={(hemInnerX + hemSideX) / 2} y={hemY + 32} textAnchor="middle" className="fill-primary text-xs font-sans" style={tm}>
            {((hemSideX - hemInnerX) / scale).toFixed(1)}cm
          </text>
        </g>
      )}

      {/* Grain line */}
      <line
        x1={centerX}
        y1={offsetY + panelHeight * 0.40}
        x2={centerX}
        y2={offsetY + panelHeight * 0.65}
        stroke="hsl(var(--pattern-stroke))"
        strokeWidth="1"
        strokeDasharray="8,4"
        markerEnd="url(#pantsArrow)"
        markerStart="url(#pantsArrowReverse)"
      />

      {/* Labels */}
      <text x={centerX} y={offsetY + panelHeight * 0.35 - 66} textAnchor="middle" className="fill-foreground font-serif text-sm" style={tm}>
        {t('piece.back')}
      </text>
    </g>
  );
}
