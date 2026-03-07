import { PantsMeasurements, Category } from "@/types/sloper";
import { useLanguage } from "@/contexts/LanguageContext";

interface PantsWithDartsFrontPanelProps {
  measurements: PantsMeasurements;
  offsetX: number;
  offsetY: number;
  scale: number;
  category: Category;
}

export function PantsWithDartsFrontPanel({ measurements, offsetX, offsetY, scale, category }: PantsWithDartsFrontPanelProps) {
  const { t } = useLanguage();
  const { waist, hip, thigh, knee, ankle, hipHeight, crotchDepth, outseamLength, inseamLength } = measurements;
  const ease = measurements.ease ?? 2;

  const s = (v: number) => v * scale;

  const hipQuarter = hip / 4 + ease;
  const totalLength = outseamLength;
  const crotchExtension = category === "women" ? hip / 20 : hip / 16 - 1;
  const iLineY = crotchDepth * 2;
  const xCenter = (-crotchExtension + hipQuarter) / 2;
  const kneeY = crotchDepth + inseamLength * 0.4;

  // Front dart calculations
  const frontDartWidth = category === "women" ? 2 : 1.5;
  const frontDartLength = category === "women" ? hipHeight * 0.75 : hipHeight * 0.6;

  // Waist reduction now accounts for dart
  const waistReduction = hipQuarter - waist / 4 - frontDartWidth;
  const b1Rise = category === "women" ? 1 : 0;

  const hemHalfWidth = hip / 10 + 1.5;
  const thighHalfSpread = hemHalfWidth + 1;
  const kneeHalfSpread = knee / 4 + 0.5;

  // Dart position: center of waist
  const dartCenterX = offsetX + s(hipQuarter - waistReduction) / 2;
  const dartHalfWidth = s(frontDartWidth / 2);

  // Points
  const a1X = offsetX;
  const a1Y = offsetY;
  const b1X = offsetX + s(hipQuarter - waistReduction);
  const b1Y = offsetY - s(b1Rise);

  const hipSideX = offsetX + s(hipQuarter);
  const hipY = offsetY + s(hipHeight);
  const crotchY = offsetY + s(crotchDepth);
  const e1X = offsetX - s(crotchExtension);
  const centerX = offsetX + s(xCenter);

  const iY = offsetY + s(iLineY);
  const thighSideX = centerX + s(thighHalfSpread);
  const thighInnerX = centerX - s(thighHalfSpread);
  const kneeYPos = offsetY + s(kneeY);
  const kneeSideX = centerX + s(kneeHalfSpread);
  const kneeInnerX = centerX - s(kneeHalfSpread);
  const hemY = offsetY + s(totalLength);
  const hemSideX = centerX + s(hemHalfWidth);
  const hemInnerX = centerX - s(hemHalfWidth);

  const buildPath = () => {
    let path = "";
    path += `M ${a1X} ${a1Y}`;
    // Waist to dart
    path += ` L ${dartCenterX - dartHalfWidth} ${a1Y}`;
    // Dart
    path += ` L ${dartCenterX} ${a1Y + s(frontDartLength)}`;
    path += ` L ${dartCenterX + dartHalfWidth} ${a1Y}`;
    // Dart to side waist
    path += ` L ${b1X} ${b1Y}`;
    // Side seam
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

  return (
    <g>
      <path d={buildPath()} fill="hsl(var(--pattern-fill))" stroke="hsl(var(--pattern-stroke))" strokeWidth="2" />

      {/* Hip line */}
      <line x1={e1X} y1={hipY} x2={hipSideX} y2={hipY} stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeDasharray="3,3" />
      {/* Crotch line */}
      <line x1={e1X} y1={crotchY} x2={thighSideX} y2={crotchY} stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeDasharray="3,3" />
      {/* Thigh line */}
      <line x1={thighInnerX} y1={iY} x2={thighSideX} y2={iY} stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeDasharray="2,4" />
      {/* Knee line */}
      <line x1={kneeInnerX} y1={kneeYPos} x2={kneeSideX} y2={kneeYPos} stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeDasharray="3,3" />

      {/* Grain line */}
      <line x1={centerX} y1={offsetY + s(3)} x2={centerX} y2={hemY - s(3)} stroke="hsl(var(--pattern-stroke))" strokeWidth="1.5" markerEnd="url(#pantsArrow)" />

      {/* Labels */}
      <text x={centerX} y={offsetY + panelHeight * 0.45} textAnchor="middle" className="fill-foreground font-serif text-sm">
        {t('piece.front')}
      </text>
      <text x={centerX} y={offsetY + panelHeight * 0.45 + 16} textAnchor="middle" className="fill-muted-foreground text-xs">
        {t('piece.cut2')}
      </text>

      {/* Measurement labels */}
      <text x={hipSideX + 5} y={hipY + 4} className="fill-muted-foreground text-[9px]">{t('piece.hip')}</text>
      <text x={thighSideX + 5} y={crotchY + 4} className="fill-muted-foreground text-[9px]">{t('piece.crotch')}</text>
      <text x={kneeSideX + 5} y={kneeYPos + 4} className="fill-muted-foreground text-[9px]">{t('piece.knee')}</text>
    </g>
  );
}
