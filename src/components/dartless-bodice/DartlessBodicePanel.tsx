import { BodiceMeasurements, Category } from "@/types/sloper";
import { useDartlessBodicePath } from "./DartlessBodicePanelPath";
import { useLanguage } from "@/contexts/LanguageContext";

interface DartlessBodicePanelProps {
  measurements: BodiceMeasurements;
  offsetX: number;
  offsetY: number;
  scale: number;
  offsetYDiff?: number;
  panel: "front" | "back";
  category: Category;
  mirrored?: boolean;
  showMeasurements?: boolean;
}

export function DartlessBodicePanel({
  measurements,
  offsetX,
  offsetY,
  scale,
  offsetYDiff = 0,
  panel,
  category,
  mirrored,
  showMeasurements = true,
}: DartlessBodicePanelProps) {
  const { t } = useLanguage();

  const {
    path,
    bustQuarterScaled,
    armholeDepthScaled,
    backLengthScaled,
    ease,
    neckHalfWidth,
    neckHalfHeight,
    neckTopY,
    midPointX,
    midPointY,
    sideSeamTopY,
    sideSeamBottomY,
    sideSeamLengthScaled,
    shoulderWidthX,
    shoulderSlopeY,
    neckEndX,
    neckEndY,
    shoulderEndX,
    shoulderEndY,
    frontBodiceHeight,
  } = useDartlessBodicePath({
    measurements,
 //   offsetYDiff,    
    offsetX,
    offsetY,
    scale,
    panel,
    category,
  });

  const isFront = panel === "front";
  const tm: React.CSSProperties | undefined = mirrored
    ? { transform: 'scaleX(-1)', transformBox: 'fill-box' as const, transformOrigin: 'center' }
    : undefined;

  return (
    <g>
      {/* Main pattern piece */}
      <path
        d={path}
        fill="hsl(var(--pattern-fill))"
        stroke="hsl(var(--pattern-stroke))"
        strokeWidth="2"
      />

      
      {/* Grain line */}
      <line
        x1={offsetX + bustQuarterScaled * 0.3}
        y1={offsetY + backLengthScaled * 0.25}
        x2={offsetX + bustQuarterScaled * 0.3}
        y2={offsetY + backLengthScaled * 0.75}
        stroke="hsl(var(--pattern-stroke))"
        strokeDasharray="8,4"
        markerStart="url(#dartlessBodiceArrowReverse)"
        markerEnd="url(#dartlessBodiceArrow)"
      />

      {/* Labels */}
      <text
        x={offsetX + bustQuarterScaled / 2}
        y={offsetY + backLengthScaled / 2}
        textAnchor="middle"
        className="fill-foreground font-serif text-sm"
        style={tm}
      >
        {isFront ? t('piece.front') : t('piece.back')}
      </text>
      

      {/* Measurement labels */}
      {showMeasurements && isFront && (
        <>
          <line
            x1={offsetX}
            y1={midPointY}
            x2={+midPointX}
            y2={midPointY}
            stroke="hsl(var(--measure-line))"
            strokeWidth="1"
          />
      
          <text
            x={ + midPointX/2 }
            y={midPointY  + 12}
            className="fill-primary text-xs font-sans"
          >
             {((midPointX-offsetX)/ scale).toFixed(1)}cm
          </text>
         
        </>
      )}

      {showMeasurements && isFront && (
        <>
        <line x1={offsetX - 20} y1={neckTopY } x2={offsetX - 20} y2={sideSeamBottomY} stroke="hsl(var(--measure-line))" strokeWidth="1"/>
        <line x1={offsetX - 26} y1={neckTopY - neckHalfHeight} x2={offsetX -16} y2={neckTopY - neckHalfHeight} stroke="hsl(var(--measure-line))" strokeWidth="0" />
        <line x1={offsetX - 26} y1={offsetY + backLengthScaled} x2={offsetX - 16} y2={offsetY + backLengthScaled} stroke="hsl(var(--measure-line))" strokeWidth="0" 
        />
        <text
          x={offsetX - 24}
          y={offsetY + backLengthScaled / 2}
          textAnchor="end"
          className="fill-primary text-xs font-sans"
          transform={`rotate(-90 ${offsetX - 24} ${offsetY + backLengthScaled / 2})`}
          style={tm}
        >
          {frontBodiceHeight.toFixed(1)}cm
        </text>
        </>
      )}

      {/* Side seam length — vertical, in the gap between front and back */}
      {showMeasurements && isFront && (
        <>
          <line
            x1={offsetX + bustQuarterScaled + 55}
            y1={sideSeamTopY}
            x2={offsetX + bustQuarterScaled + 55}
            y2={sideSeamBottomY}
            stroke="hsl(var(--measure-line))"
            strokeWidth="1"
          />
          <line
            x1={offsetX + bustQuarterScaled + 49}
            y1={sideSeamTopY}
            x2={offsetX + bustQuarterScaled + 61}
            y2={sideSeamTopY}
            stroke="hsl(var(--measure-line))"
            strokeWidth="1"
          />
          <line
            x1={offsetX + bustQuarterScaled + 49}
            y1={sideSeamBottomY}
            x2={offsetX + bustQuarterScaled + 61}
            y2={sideSeamBottomY}
            stroke="hsl(var(--measure-line))"
            strokeWidth="1"
          />
          <text
            x={offsetX + bustQuarterScaled + 65}
            y={(sideSeamTopY + sideSeamBottomY) / 2}
            textAnchor="start"
            className="fill-primary text-xs font-sans"
            transform={`rotate(-90 ${offsetX + bustQuarterScaled + 65} ${(sideSeamTopY + sideSeamBottomY) / 2})`}
          >
            {(sideSeamLengthScaled / scale).toFixed(1)}cm
          </text>
        </>
      )}

      {/* Neck width — horizontal, above neckline */}
      {showMeasurements && (
        <>
          <line
            x1={offsetX}
            y1={neckTopY - neckHalfHeight - 14}
            x2={offsetX + neckHalfWidth}
            y2={neckTopY - neckHalfHeight - 14}
            stroke="hsl(var(--measure-line))"
            strokeWidth="1"
          />
          <line
            x1={offsetX}
            y1={neckTopY - neckHalfHeight - 18}
            x2={offsetX}
            y2={neckTopY - neckHalfHeight - 10}
            stroke="hsl(var(--measure-line))"
            strokeWidth="1"
          />
          <line
            x1={offsetX + neckHalfWidth}
            y1={neckTopY - neckHalfHeight - 18}
            x2={offsetX + neckHalfWidth}
            y2={neckTopY - neckHalfHeight - 10}
            stroke="hsl(var(--measure-line))"
            strokeWidth="1"
          />
          <text
            x={offsetX + neckHalfWidth / 2}
            y={neckTopY - neckHalfHeight - 22}
            textAnchor="middle"
            className="fill-primary text-xs font-sans"
            style={tm}
          >
            {(neckHalfWidth / scale).toFixed(1)}cm
          </text>
        </>
      )}

      {/* Neck depth — vertical, left of center */}
      {showMeasurements && (
        <>
          <line
            x1={offsetX - 20}
            y1={neckTopY}
            x2={offsetX - 20}
            y2={neckTopY - neckHalfHeight}
            stroke="hsl(var(--measure-line))"
            strokeWidth="1"
          />
          <line
            x1={offsetX - 26}
            y1={neckTopY}
            x2={offsetX - 14}
            y2={neckTopY}
            stroke="hsl(var(--measure-line))"
            strokeWidth="1"
          />
          <line
            x1={offsetX - 26}
            y1={neckTopY - neckHalfHeight}
            x2={offsetX - 14}
            y2={neckTopY - neckHalfHeight}
            stroke="hsl(var(--measure-line))"
            strokeWidth="1"
          />
          <text
            x={offsetX - 30}
            y={neckTopY - neckHalfHeight / 2}
            textAnchor="middle"
            className="fill-primary text-xs font-sans"
            transform={`rotate(-90 ${offsetX - 30} ${neckTopY - neckHalfHeight / 2})`}
            style={tm}
          >
            {(neckHalfHeight / scale).toFixed(1)}cm
          </text>
        </>
      )}

      {/* Shoulder width — horizontal, above the shoulder line */}
      {showMeasurements && (
        <>
          <line
            x1={neckEndX}
            y1={neckEndY - 14}
            x2={shoulderEndX}
            y2={neckEndY - 14}
            stroke="hsl(var(--measure-line))"
            strokeWidth="1"
          />
          <line
            x1={neckEndX}
            y1={neckEndY - 18}
            x2={neckEndX}
            y2={neckEndY - 10}
            stroke="hsl(var(--measure-line))"
            strokeWidth="1"
          />
          <line
            x1={shoulderEndX}
            y1={neckEndY - 18}
            x2={shoulderEndX}
            y2={neckEndY - 10}
            stroke="hsl(var(--measure-line))"
            strokeWidth="1"
          />
          <text
            x={(neckEndX + shoulderEndX) / 2}
            y={neckEndY - 22}
            textAnchor="middle"
            className="fill-primary text-xs font-sans"
            style={tm}
          >
            {(shoulderWidthX / scale).toFixed(1)}cm
          </text>
        </>
      )}

      {/* Shoulder height — vertical, right of the shoulder line */}
      {showMeasurements && (
        <>
          <line
            x1={shoulderEndX + 14}
            y1={neckEndY}
            x2={shoulderEndX + 14}
            y2={shoulderEndY}
            stroke="hsl(var(--measure-line))"
            strokeWidth="1"
          />
          <line
            x1={shoulderEndX + 8}
            y1={neckEndY}
            x2={shoulderEndX + 20}
            y2={neckEndY}
            stroke="hsl(var(--measure-line))"
            strokeWidth="1"
          />
          <line
            x1={shoulderEndX + 8}
            y1={shoulderEndY}
            x2={shoulderEndX + 20}
            y2={shoulderEndY}
            stroke="hsl(var(--measure-line))"
            strokeWidth="1"
          />
          <text
            x={shoulderEndX + 24}
            y={(neckEndY + shoulderEndY) / 2}
            textAnchor="start"
            className="fill-primary text-xs font-sans"
            transform={`rotate(-90 ${shoulderEndX + 24} ${(neckEndY + shoulderEndY) / 2})`}
            style={tm}
          >
            {(shoulderSlopeY / scale).toFixed(1)}cm
          </text>
        </>
      )}

      {/* Waist width — horizontal, below waist line */}
      {showMeasurements && (
        <g style={tm}>
          <line
            x1={offsetX}
            y1={offsetY + backLengthScaled + 18}
            x2={offsetX + bustQuarterScaled}
            y2={offsetY + backLengthScaled + 18}
            stroke="hsl(var(--measure-line))"
            strokeWidth="1"
          />
          <line
            x1={offsetX}
            y1={offsetY + backLengthScaled + 12}
            x2={offsetX}
            y2={offsetY + backLengthScaled + 24}
            stroke="hsl(var(--measure-line))"
            strokeWidth="1"
          />
          <line
            x1={offsetX + bustQuarterScaled}
            y1={offsetY + backLengthScaled + 12}
            x2={offsetX + bustQuarterScaled}
            y2={offsetY + backLengthScaled + 24}
            stroke="hsl(var(--measure-line))"
            strokeWidth="1"
          />
          <text
            x={offsetX + bustQuarterScaled / 2}
            y={offsetY + backLengthScaled + 36}
            textAnchor="middle"
            className="fill-primary text-xs font-sans"
          >
            {(bustQuarterScaled / scale).toFixed(1)}cm
          </text>
        </g>
      )}
    </g>
  );
}
