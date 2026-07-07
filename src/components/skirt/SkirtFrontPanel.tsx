import { Category } from "@/types/sloper";
import { useLanguage } from "@/contexts/LanguageContext";

interface SkirtFrontPanelProps {
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
  frontwaistRise: number;
  showMeasurements: boolean;
}

export function SkirtFrontPanel({
  skirtLength,
  waistToHip,
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
  frontwaistRise,
  showMeasurements,
}: SkirtFrontPanelProps) {
  const { t } = useLanguage();

  const panelPath = `
    M ${offsetX} ${offsetY}
    L ${offsetX + centerToDartScaled} ${offsetY}
    L ${offsetX + centerToDartScaled + dartWidthScaled / 2} ${offsetY + dartLengthScaled}
    L ${offsetX + centerToDartScaled + dartWidthScaled} ${offsetY}
    C ${offsetX + centerToDartScaled + dartWidthScaled + (waistWidthScaled - (centerToDartScaled + dartWidthScaled)) / 2} ${offsetY},
      ${offsetX + waistWidthScaled} ${offsetY - frontwaistRise * scale},
      ${offsetX + waistWidthScaled} ${offsetY - frontwaistRise * scale}
    C ${offsetX + waistWidthScaled} ${offsetY - frontwaistRise * scale},
      ${offsetX + patternWidth} ${offsetY + waistToHipScaled / 4},
      ${offsetX + patternWidth} ${offsetY + waistToHipScaled + frontwaistRise * scale}
    L ${offsetX + patternWidth} ${offsetY + patternHeight}
    L ${offsetX} ${offsetY + patternHeight}
    Z
  `;

  const grainY1 = offsetY + patternHeight * 0.35;
  const grainY2 = offsetY + patternHeight * 0.65;

  const ml = "hsl(var(--measure-line))";
  const t6 = 6; // tick half-length
  const hemY = offsetY + patternHeight;

  return (
    <g className="front-panel">
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
            <text x={offsetX + waistWidthScaled / 2} y={offsetY - 26} textAnchor="middle" className="fill-primary text-xs font-sans">
              {(waistWidthScaled / scale).toFixed(1)}cm
            </text>
          </g>

          {/* Skirt length — vertical, left side */}
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
            >
              {skirtLength}cm
            </text>
          </g>

          {/* Waist-to-hip — vertical, right side */}
          <g className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <line x1={offsetX + patternWidth + 20} y1={offsetY} x2={offsetX + patternWidth + 20} y2={offsetY + waistToHipScaled} stroke={ml} strokeWidth="1" />
            <line x1={offsetX + patternWidth + 14} y1={offsetY} x2={offsetX + patternWidth + 26} y2={offsetY} stroke={ml} strokeWidth="1" />
            <line x1={offsetX + patternWidth + 14} y1={offsetY + waistToHipScaled} x2={offsetX + patternWidth + 26} y2={offsetY + waistToHipScaled} stroke={ml} strokeWidth="1" />
            <text
              x={offsetX + patternWidth + 34}
              y={offsetY + waistToHipScaled / 2}
              textAnchor="middle"
              className="fill-primary text-xs font-sans"
              transform={`rotate(90, ${offsetX + patternWidth + 34}, ${offsetY + waistToHipScaled / 2})`}
            >
              {waistToHip.toFixed(1)}cm
            </text>
          </g>

          {/* Hip width — horizontal, below hem */}
          <g className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <line x1={offsetX} y1={hemY + 15} x2={offsetX + patternWidth} y2={hemY + 15} stroke={ml} strokeWidth="1" />
            <line x1={offsetX} y1={hemY + 15 - t6} x2={offsetX} y2={hemY + 15 + t6} stroke={ml} strokeWidth="1" />
            <line x1={offsetX + patternWidth} y1={hemY + 15 - t6} x2={offsetX + patternWidth} y2={hemY + 15 + t6} stroke={ml} strokeWidth="1" />
            <text x={offsetX + patternWidth / 2} y={hemY + 32} textAnchor="middle" className="fill-primary text-xs font-sans">
              {(patternWidth / scale).toFixed(1)}cm
            </text>
          </g>
        </>
      )}

      {/* Labels */}
      <text x={offsetX + patternWidth / 2} y={grainY1 - 22} textAnchor="middle" className="fill-foreground font-serif text-sm">
        {t('piece.front')}
      </text>
      
    </g>
  );
}
