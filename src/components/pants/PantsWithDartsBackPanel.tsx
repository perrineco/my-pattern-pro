import { PantsMeasurements, Category } from "@/types/sloper";
import { useLanguage } from "@/contexts/LanguageContext";

interface PantsWithDartsBackPanelProps {
  measurements: PantsMeasurements;
  offsetX: number;
  offsetY: number;
  scale: number;
  category: Category;
  mirrored?: boolean;
}

export function PantsWithDartsBackPanel({ measurements, offsetX, offsetY, scale, category, mirrored }: PantsWithDartsBackPanelProps) {
  const { t } = useLanguage();
  const tm: React.CSSProperties | undefined = mirrored
    ? { transform: 'scaleX(-1)', transformBox: 'fill-box' as const, transformOrigin: 'center' }
    : undefined;

  const { waist, hip, thigh, knee, ankle, hipHeight, crotchDepth, outseamLength, inseamLength } = measurements;
  const ease = measurements.ease ?? 2;

  const s = (v: number) => v * scale;

  const hipQuarter = hip / 4 + ease;
  const rectWidth = hipQuarter + ease;
  const totalLength = outseamLength;
  const crotchExtension = category === "women" ? hip / 16 + 3 : hip / 16 - 1;
  const e2Rise = 1;
  const iLineY = crotchDepth + (2 / 3) * crotchDepth;
  const xCenter = (-crotchExtension + hipQuarter) / 2;
  const kneeY = crotchDepth + inseamLength * 0.4;

  // Back dart calculations - larger than front
  const backDartWidth = category === "women" ? 3 : 2;
  const backDartLength = category === "women" ? hipHeight * 0.85 : hipHeight * 0.7;

  const a1Shift = category === "women" ? 3.5 : 2;
  const a2Shift = category === "women" ? outseamLength * 0.027 : 2;
  const waistReduction = hipQuarter - waist / 4 - 5 - backDartWidth;
  const b1Rise = category === "women" ? 1 : 0;

  const hemHalfWidth = hip / 10 + 1.5;
  const thighHalfSpread = hemHalfWidth + 1;
  const kneeHalfSpread = knee / 4 + 1;
  const hemShift = 1;

  // Dart position - centered on back waist
  const a2X = offsetX + s(a1Shift);
  const a2Y = offsetY - s(a2Shift);
  const b1X = offsetX + s(hipQuarter - waistReduction);
  const b1Y = offsetY;

  const dartCenterX = (a2X + b1X) / 2;
  const dartHalfWidth = s(backDartWidth / 2);

  const hipSideX = offsetX + s(hipQuarter);
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
  const fX = offsetX + s(hipQuarter);
  const fY = crotchY;

  const buildPath = () => {
    let path = "";
    path += `M ${a2X} ${a2Y}`;
    // Waist to dart
    path += ` L ${dartCenterX - dartHalfWidth} ${(a2Y + b1Y) / 2}`;
    // Dart
    path += ` L ${dartCenterX} ${(a2Y + b1Y) / 2 + s(backDartLength)}`;
    path += ` L ${dartCenterX + dartHalfWidth} ${(a2Y + b1Y) / 2}`;
    // Dart to side waist
    path += ` L ${b1X} ${b1Y}`;
    // Side seam
    path += ` L ${hipSideX} ${hipY}`;
    path += ` L ${fX} ${fY}`;
    path += ` L ${thighSideX} ${iY}`;
    path += ` L ${hemSideX} ${hemY}`;
    path += ` L ${hemInnerX} ${hemY}`;
    path += ` L ${thighInnerX} ${iY}`;
    path += ` L ${e2X} ${e2Y}`;
    // Crotch curve
    path += ` C ${e2X + (offsetX - e2X) * 0.8} ${crotchY - (hipY - crotchY) / 8}, ${offsetX - (a2X - offsetX) / 4} ${hipY - (a2Y - hipY) / 4}, ${offsetX} ${hipY}`;
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
      <line x1={centerX} y1={offsetY + s(3)} x2={centerX} y2={hemY - s(3)} stroke="hsl(var(--pattern-stroke))" strokeWidth="1.5" markerEnd="url(#pantsArrow)" />

      {/* Labels */}
      <text x={centerX} y={offsetY + panelHeight * 0.45} textAnchor="middle" className="fill-foreground font-serif text-sm" style={tm}>
        {t('piece.back')}
      </text>
      <text x={centerX} y={offsetY + panelHeight * 0.45 + 16} textAnchor="middle" className="fill-muted-foreground text-xs" style={tm}>
        {t('piece.cut2')}
      </text>

      {/* Measurement labels */}
      <text x={hipSideX + 5} y={hipY + 4} className="fill-muted-foreground text-[9px]" style={tm}>{t('piece.hip')}</text>
      <text x={fX + 5} y={crotchY + 4} className="fill-muted-foreground text-[9px]" style={tm}>{t('piece.crotch')}</text>
      <text x={thighSideX + 5} y={iY + 4} className="fill-muted-foreground text-[9px]" style={tm}>{t('piece.thigh')}</text>
      <text x={kneeSideX + 5} y={kneeYPos + 4} className="fill-muted-foreground text-[9px]" style={tm}>{t('piece.knee')}</text>
    </g>
  );
}
