import { useRef, useState, useEffect } from "react";
import { BodiceMeasurements, Category } from "@/types/sloper";
import { BodiceDartsPanel } from "./bodice-darts/BodiceDartsPanel";
import { BodiceDartsLegend } from "./bodice-darts/BodiceDartsLegend";
import { ZoomablePatternWrapper } from "./ZoomablePatternWrapper";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface BodiceWithDartsPatternPreviewProps {
  measurements: BodiceMeasurements;
  category: Category;
}

export function BodiceWithDartsPatternPreview({ measurements, category }: BodiceWithDartsPatternPreviewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [showMeasurements, setShowMeasurements] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current?.parentElement) {
        const { width, height } = svgRef.current.parentElement.getBoundingClientRect();
        setDimensions({ width, height: Math.max(height, 400) });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const { bust, ease } = measurements;

  // Calculate pattern dimensions
  const bustQuarter = bust / 4;
  const easeValue = ease ?? 2;
  const patternWidth = bustQuarter + easeValue + 5;
  const patternHeight = measurements.backLength + 5;

  // Calculate scale to fit both panels side by side
  const padding = 60;
  const gap = 100; // extra room for the side-seam / bust / back width measurement labels
  const availableWidth = dimensions.width - padding * 2 - gap;
  const availableHeight = dimensions.height - padding * 2;
  const scale = Math.min(availableWidth / (patternWidth * 2), availableHeight / patternHeight, 8);

  const scaledWidth = patternWidth * scale;
  const scaledHeight = patternHeight * scale;

  // Position panels side by side
  const totalWidth = scaledWidth * 2 + gap;
  const startX = (dimensions.width - totalWidth) / 2;
  const offsetY = (dimensions.height - scaledHeight) / 2 + scaledHeight * 0.1;

  const frontOffsetX = startX;
  const backOffsetX = startX + scaledWidth + gap;
  const backMirrorX = 2 * backOffsetX + scaledWidth;

  return (
    <ZoomablePatternWrapper minHeight="400px">
      {/* Work-in-progress notice */}
      <div className="absolute top-2 left-2 z-10 text-xs font-semibold text-destructive bg-card/90 backdrop-blur-sm px-2 py-1 rounded-md">
        {t('misc.inDevelopment')}
      </div>

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

      {/* Legend */}
      <BodiceDartsLegend />

    <svg ref={svgRef} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} className="w-full h-full min-h-[400px]">
      {/* Grid background */}
      <defs>
        <pattern id="bodiceDartsGrid" width={scale} height={scale} patternUnits="userSpaceOnUse">
          <path d={`M ${scale} 0 L 0 0 0 ${scale}`} fill="none" stroke="hsl(var(--pattern-grid))" strokeWidth="0.5" />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="url(#bodiceDartsGrid)" />


      {/* Front panel */}
      <BodiceDartsPanel
        measurements={measurements}
        offsetX={frontOffsetX}
        offsetY={offsetY}
        scale={scale}
        panel="front"
        category={category}
        showMeasurements={showMeasurements}
      />

      {/* Back panel - mirrored */}
      <g transform={`translate(${backMirrorX}, 0) scale(-1, 1)`}>
        <BodiceDartsPanel
          measurements={measurements}
          offsetX={backOffsetX}
          offsetY={offsetY}
          scale={scale}
          panel="back"
          category={category}
          mirrored
          showMeasurements={showMeasurements}
        />
      </g>
    </svg>
    </ZoomablePatternWrapper>
  );
}
