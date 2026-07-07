import { useRef, useState, useEffect } from "react";
import { PantsMeasurements, Category } from "@/types/sloper";
import { PantsFrontPanel } from "./pants/PantsFrontPanel";
import { PantsBackPanel } from "./pants/PantsBackPanel";
import { PantsLegend } from "./pants/PantsLegend";
import { ZoomablePatternWrapper } from "./ZoomablePatternWrapper";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PantsPatternPreviewProps {
  measurements: PantsMeasurements;
  category: Category;
}

export function PantsPatternPreview({ measurements, category }: PantsPatternPreviewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [showMeasurements, setShowMeasurements] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current?.parentElement) {
        const { width, height } = svgRef.current.parentElement.getBoundingClientRect();
        setDimensions({ width: Math.max(600, width), height: Math.max(500, height) });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const { hip, outseamLength } = measurements;

  const hipQuarter = hip / 4;
  const frontCrotchExt = hip / 16 - 1;
  const backCrotchExt = hip / 16 + 3;
  const backRectWidth = hipQuarter + 2;
  const crotchExtension = Math.max(frontCrotchExt, backCrotchExt);
  const singlePatternWidth = Math.max(hipQuarter, backRectWidth) + crotchExtension + 10;
  const patternHeight = outseamLength + 10;

  const padding = 40;
  const availableWidth = (dimensions.width / 2) - padding * 2;
  const availableHeight = dimensions.height - padding * 2;
  const maxScale = category === 'kids' ? 10 : 5;
  const scale = Math.min(availableWidth / singlePatternWidth, availableHeight / patternHeight, maxScale);

  const crotchExtensionScaled = crotchExtension * scale;
  const frontOffsetX = padding + crotchExtensionScaled;
  const offsetY = padding + 10;

  const frontPanelRight = frontOffsetX + hipQuarter * scale;
  const backOffsetX = frontPanelRight + 90 + crotchExtensionScaled;

  const backLeftEdge = backOffsetX - backCrotchExt * scale;
  const backRightEdge = backOffsetX + backRectWidth * scale;
  const backMirrorX = backLeftEdge + backRightEdge;

  return (
    <ZoomablePatternWrapper className="w-full h-full bg-pattern-grid/30 rounded-lg" minHeight="600px">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Measurements toggle */}
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1.5 text-xs bg-card/90 backdrop-blur-sm"
          onClick={() => setShowMeasurements(prev => !prev)}
        >
          {showMeasurements ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {t('piece.showMeasures')}
        </Button>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="w-full h-full"
        style={{ minHeight: "600px" }}
      >
        <defs>
          <marker id="pantsArrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="hsl(var(--pattern-stroke))" />
          </marker>
          <marker id="pantsArrowReverse" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto-start-reverse">
            <path d="M0,0 L6,3 L0,6 Z" fill="hsl(var(--pattern-stroke))" />
          </marker>
        </defs>

        <PantsFrontPanel
          measurements={measurements}
          offsetX={frontOffsetX}
          offsetY={offsetY}
          scale={scale}
          category={category}
          showMeasurements={showMeasurements}
        />

        <g transform={`translate(${backMirrorX}, 0) scale(-1, 1)`}>
          <PantsBackPanel
            measurements={measurements}
            offsetX={backOffsetX}
            offsetY={offsetY}
            scale={scale}
            category={category}
            mirrored
            showMeasurements={showMeasurements}
          />
        </g>

        {/* Reference lines — drawn last to appear above both panels */}
        {showMeasurements && (() => {
          const s = (v: number) => v * scale;
          const hipY     = offsetY + s(measurements.hipHeight);
          const crotchY  = offsetY + s(measurements.crotchDepth);
          const thighY   = offsetY + s(measurements.crotchDepth * 2);
          const kneeY    = offsetY + s(measurements.crotchDepth + measurements.inseamLength * 0.4);
          const dash1 = "3,3";
          const dash2 = "2,4";
          const col = "hsl(var(--muted-foreground))";
          const ml = "hsl(var(--measure-line))";
          const labelX = backRightEdge + 55;
          const gapX1 = frontPanelRight + 20;
          const gapX2 = frontPanelRight + 55;
          return (<>
            <line x1={frontOffsetX/2} y1={hipY}    x2={backRightEdge + 50} y2={hipY}    stroke={col} strokeWidth="1" strokeDasharray={dash1} />
            <line x1={frontOffsetX/2} y1={crotchY} x2={backRightEdge + 50} y2={crotchY} stroke={col} strokeWidth="1" strokeDasharray={dash1} />
            <line x1={frontOffsetX/2} y1={thighY}  x2={backRightEdge + 50} y2={thighY}  stroke={col} strokeWidth="1" strokeDasharray={dash2} />
            <line x1={frontOffsetX/2} y1={kneeY}   x2={backRightEdge + 50} y2={kneeY}   stroke={col} strokeWidth="1" strokeDasharray={dash1} />
            <text x={labelX} y={hipY + 4}    textAnchor="start" className="fill-muted-foreground text-[9px]">{t('piece.hip')}</text>
            <text x={labelX} y={crotchY + 4} textAnchor="start" className="fill-muted-foreground text-[9px]">{t('piece.crotch')}</text>
            <text x={labelX} y={thighY + 4}  textAnchor="start" className="fill-muted-foreground text-[9px]">{t('piece.thigh')}</text>
            <text x={labelX} y={kneeY + 4}   textAnchor="start" className="fill-muted-foreground text-[9px]">{t('piece.knee')}</text>

            {/* Taille-hanche */}
            <line x1={gapX1} y1={offsetY} x2={gapX1} y2={hipY} stroke={ml} strokeWidth="1" />
            <line x1={gapX1 - 6} y1={offsetY} x2={gapX1 + 6} y2={offsetY} stroke={ml} strokeWidth="1" />
            <line x1={gapX1 - 6} y1={hipY}    x2={gapX1 + 6} y2={hipY}    stroke={ml} strokeWidth="1" />
            <text x={gapX1 + 10} y={(offsetY + hipY) / 2} textAnchor="middle" className="fill-primary text-xs font-sans" transform={`rotate(90, ${gapX1 + 10}, ${(offsetY + hipY) / 2})`}>
              {measurements.hipHeight.toFixed(1)}cm
            </text>

            {/* Taille-entrejambe */}
            <line x1={gapX2} y1={offsetY} x2={gapX2} y2={crotchY} stroke={ml} strokeWidth="1" />
            <line x1={gapX2 - 6} y1={offsetY} x2={gapX2 + 6} y2={offsetY} stroke={ml} strokeWidth="1" />
            <line x1={gapX2 - 6} y1={crotchY} x2={gapX2 + 6} y2={crotchY} stroke={ml} strokeWidth="1" />
            <text x={gapX2 + 10} y={(offsetY + crotchY) / 2} textAnchor="middle" className="fill-primary text-xs font-sans" transform={`rotate(90, ${gapX2 + 10}, ${(offsetY + crotchY) / 2})`}>
              {measurements.crotchDepth.toFixed(1)}cm
            </text>
          </>);
        })()}
      </svg>

      <PantsLegend />
    </ZoomablePatternWrapper>
  );
}
