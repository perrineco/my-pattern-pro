import { useRef, useState, useEffect } from "react";
import { BodiceMeasurements, Category } from "@/types/sloper";
import { DartlessBodicePanel } from "./dartless-bodice/DartlessBodicePanel";
import { useDartlessBodicePath } from "./dartless-bodice/DartlessBodicePanelPath";
import { DartlessBodiceLegend } from "./dartless-bodice/DartlessBodiceLegend";
import { ZoomablePatternWrapper } from "./ZoomablePatternWrapper";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface DartlessBodicePatternPreviewProps {
  measurements: BodiceMeasurements;
  category: Category;
}

export function DartlessBodicePatternPreview({ measurements, category }: DartlessBodicePatternPreviewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [showMeasurements, setShowMeasurements] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current?.parentElement) {
        const { width, height } = svgRef.current.parentElement.getBoundingClientRect();
        setDimensions({ width: Math.max(600, width), height: Math.max(400, height) });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const { bust, backWidth, backLength, neckCircumference } = measurements;

  const ease = measurements.ease ?? 2;
  const bustQuarter = bust / 4;
  const backWidthHalf = backWidth / 2;

  // Calculate front panel extra height (matches DartlessBodicePanelPath logic)
  const frontNeckDepthDivisor = category === "men" ? 5 : category === "kids" ? 6 : 6;
  const frontNeckDepthAdd = category === "men" ? 0 : category === "kids" ? 0.2 : 2;
  const frontExtraHeight = neckCircumference / 12 - (neckCircumference / frontNeckDepthDivisor + frontNeckDepthAdd);

  // Pattern dimensions for single panel
  const singlePatternWidth = Math.max(bustQuarter + ease, backWidthHalf) + 5;
  const frontPatternHeight = backLength + frontExtraHeight + 5;
  const backPatternHeight = backLength + 5;
  const maxPatternHeight = Math.max(frontPatternHeight, backPatternHeight);

  // Calculate scale to fit both panels side by side
  const padding = 80;
  const availableWidth = dimensions.width / 2 - padding * 2;
  const availableHeight = dimensions.height - padding * 2;
  const scale = Math.min(availableWidth / singlePatternWidth, availableHeight / maxPatternHeight, 8);

  const backPanelWidth = singlePatternWidth * scale;

  // Extra top margin so neckline arcs (which go above offsetY) don't clip
  const backNeckDepthDivisor = category === "men" ? 20 : category === "kids" ? 18 : 16;
  const backNeckDepthCm = neckCircumference / backNeckDepthDivisor;
  const frontNeckDepthCm = neckCircumference / frontNeckDepthDivisor + frontNeckDepthAdd;
  const neckTopPadding = backNeckDepthCm * scale;

  
  // Back panel offset (right side) - closer to front, mirrored
  const backOffsetY = padding + neckTopPadding + Math.max(0, (frontPatternHeight - backPatternHeight) * scale);
  
  // Front panel offset (left side)
  const frontOffsetX = padding;
  const backOffsetX = frontOffsetX + backPanelWidth + 25;
  const backMirrorX = 2 * backOffsetX + backPanelWidth;
//  const frontOffsetY = padding + neckTopPadding + Math.max(0, (backPatternHeight - frontPatternHeight) * scale);
  const frontOffsetY = backOffsetY - (frontNeckDepthCm - backNeckDepthCm) * scale;

  // Actual shoulder-tip points of each panel, used to draw a broken shoulder reference line
  const frontShoulder = useDartlessBodicePath({
    measurements,
    offsetX: frontOffsetX,
    offsetY: frontOffsetY,
    scale,
    panel: "front",
    category,
  });
  const backShoulder = useDartlessBodicePath({
    measurements,
    offsetX: backOffsetX,
    offsetY: backOffsetY,
    scale,
    panel: "back",
    category,
  });
  const frontShoulderX = frontShoulder.shoulderEndX;
 // const frontShoulderY = frontShoulder.neckEndY;
  // Back panel is drawn inside a translate(backMirrorX) scale(-1,1) group
  const backShoulderX = backMirrorX - backShoulder.shoulderEndX;
 // const backShoulderY = backShoulder.neckEndY;

  const backShoulderY  = backOffsetY - backNeckDepthCm * scale;   // remonte au-dessus de backOffsetY
  const frontShoulderY =  category === "men"
  ? backOffsetY - backNeckDepthCm * scale 
  : backOffsetY  + backNeckDepthCm * scale - frontNeckDepthCm * scale;
  return (
    <ZoomablePatternWrapper className="w-full h-full bg-pattern-grid/30 rounded-lg" minHeight="500px">
      {/* Grid pattern background */}
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
        style={{ minHeight: "500px" }}
      >
        <defs>
          <marker id="dartlessBodiceArrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="hsl(var(--pattern-stroke))" />
          </marker>
          <marker id="dartlessBodiceArrowReverse" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto-start-reverse">
            <path d="M0,0 L6,3 L0,6 Z" fill="hsl(var(--pattern-stroke))" />
          </marker>
        </defs>

        {/* Front Panel */}
        <DartlessBodicePanel
          measurements={measurements}
          offsetX={frontOffsetX}
          offsetY={frontOffsetY}
          scale={scale}
          panel="front"
          category={category}
          showMeasurements={showMeasurements}
       //={backOffsetY - frontOffsetY}
        />

        {/* Back Panel - mirrored */}
        <g transform={`translate(${backMirrorX}, 0) scale(-1, 1)`}>
          <DartlessBodicePanel
            measurements={measurements}
            offsetX={backOffsetX}
            offsetY={backOffsetY}
            scale={scale}
            panel="back"
            category={category}
            mirrored
            showMeasurements={showMeasurements}
          />
        </g>

        {/* Reference lines — drawn last to appear above both panels */}
        {showMeasurements && (() => {
          const bls         = backLength * scale;
          const col         = "hsl(var(--muted-foreground))";
          const rightEdge   = backOffsetX + backPanelWidth;
          const x1          = frontOffsetX / 2;
          const x2          = rightEdge + 50;
          const lx          = rightEdge + 55;

          const waistY      = backOffsetY + backLength*scale;
          const armholeY    = waistY - bls / 2 ;
          const carrureY    = armholeY  - bls/6;
          const bustY       = backOffsetY + bls / 6;
          
          const dash        = "3,3";
          const ml          = "hsl(var(--measure-line))";
          const lbl = (y: number, key: string) => (
            <text x={lx} y={y + 4} textAnchor="start" className="fill-muted-foreground text-[9px]">{t(key)}</text>
          );
    
          // Broken line through each panel's actual shoulder-tip point (the "décroché")
          const shoulderPoints = [
            [x1, frontShoulderY],
            [frontShoulderX+40, frontShoulderY],
            [backShoulderX-40, backShoulderY],
            [x2, backShoulderY],
          ]
            .map(([x, y]) => `${x},${y}`)
            .join(" ");

          return (<>
            <polyline points={shoulderPoints} fill="none" stroke={col} strokeWidth="1" strokeDasharray={dash} />
            {lbl(backShoulderY, 'piece.shoulder')}
            <line x1={x1} y1={carrureY}     x2={x2} y2={carrureY}     stroke={col} strokeWidth="1" strokeDasharray={dash} />
            {lbl(carrureY, 'piece.carrure')}
            <line x1={x1} y1={armholeY}  x2={x2} y2={armholeY}  stroke={col} strokeWidth="1" strokeDasharray={dash} />
            {lbl(armholeY, 'piece.armhole')}
            <line x1={x1} y1={waistY}    x2={x2} y2={waistY}    stroke={col} strokeWidth="1" strokeDasharray={dash} />
            {lbl(waistY, 'piece.waist')}

            
          </>);
        })()}
      </svg>

      {/* Legend */}
      <DartlessBodiceLegend />
    </ZoomablePatternWrapper>
  );
}
