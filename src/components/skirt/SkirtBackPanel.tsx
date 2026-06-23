import { Category } from "@/types/sloper";
import { useLanguage } from "@/contexts/LanguageContext";

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
  showMeasurements: boolean;
}

export function SkirtBackPanel({
  skirtLength,
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
  showMeasurements,
}: SkirtBackPanelProps) {
  const { t } = useLanguage();
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

  const grainY1 = offsetY + patternHeight * 0.35;
  const grainY2 = offsetY + patternHeight * 0.65;

  const ml = "hsl(var(--measure-line))";
  const t6 = 6;
  const hemY = offsetY + patternHeight;

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

      {/* Grain line — shorter, bidirectional arrows */}
      <line
        x1={offsetX + patternWidth / 2}
        y1={grainY1}
        x2={offsetX + patternWidth / 2}
        y2={grainY2}
        stroke="hsl(var(--pattern-stroke))"
        strokeWidth="1"
        strokeDasharray="8,4"
        markerEnd="url(#arrow)"
        markerStart="url(#arrowReverse)"
      />

      {showMeasurements && (
        <>
          {/* Waist width — horizontal, above pattern */}
          <g className="animate-fade-in">
            <line x1={offsetX} y1={offsetY - 18} x2={offsetX + waistWidthScaled} y2={offsetY - 18} stroke={ml} strokeWidth="1" />
            <line x1={offsetX} y1={offsetY - 18 - t6} x2={offsetX} y2={offsetY - 18 + t6} stroke={ml} strokeWidth="1" />
            <line x1={offsetX + waistWidthScaled} y1={offsetY - 18 - t6} x2={offsetX + waistWidthScaled} y2={offsetY - 18 + t6} stroke={ml} strokeWidth="1" />
            <text x={offsetX + waistWidthScaled / 2} y={offsetY - 26} textAnchor="middle" className="fill-primary text-xs font-sans" style={tm}>
              {(waistWidthScaled / scale).toFixed(1)}cm
            </text>
          </g>

          {/* Skirt length — vertical, outer side (local left = visual right after mirror) */}
          <g className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <line x1={offsetX - 15} y1={offsetY} x2={offsetX - 15} y2={hemY} stroke={ml} strokeWidth="1" />
            <line x1={offsetX - 15 - t6} y1={offsetY} x2={offsetX - 15 + t6} y2={offsetY} stroke={ml} strokeWidth="1" />
            <line x1={offsetX - 15 - t6} y1={hemY} x2={offsetX - 15 + t6} y2={hemY} stroke={ml} strokeWidth="1" />
            <text
              x={offsetX - 26}
              y={offsetY + patternHeight / 2}
              textAnchor="middle"
              className="fill-primary text-xs font-sans"
              transform={`rotate(-90, ${offsetX - 26}, ${offsetY + patternHeight / 2})`}
              style={tm}
            >
              {skirtLength}cm
            </text>
          </g>

          {/* Hip width — horizontal, below hem */}
          <g className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <line x1={offsetX} y1={hemY + 15} x2={offsetX + patternWidth} y2={hemY + 15} stroke={ml} strokeWidth="1" />
            <line x1={offsetX} y1={hemY + 15 - t6} x2={offsetX} y2={hemY + 15 + t6} stroke={ml} strokeWidth="1" />
            <line x1={offsetX + patternWidth} y1={hemY + 15 - t6} x2={offsetX + patternWidth} y2={hemY + 15 + t6} stroke={ml} strokeWidth="1" />
            <text x={offsetX + patternWidth / 2} y={hemY + 32} textAnchor="middle" className="fill-primary text-xs font-sans" style={tm}>
              {(patternWidth / scale).toFixed(1)}cm
            </text>
          </g>
        </>
      )}

      {/* Labels */}
      <text x={offsetX + patternWidth / 2} y={offsetY + patternHeight / 2} textAnchor="middle" className="fill-foreground font-serif text-sm" style={tm}>
        {t('piece.back')}
      </text>
      <text x={offsetX + patternWidth / 2} y={offsetY + patternHeight / 2 + 18} textAnchor="middle" className="fill-muted-foreground text-xs font-sans" style={tm}>
        {t('piece.cutOnFold')}
      </text>
    </g>
  );
}
