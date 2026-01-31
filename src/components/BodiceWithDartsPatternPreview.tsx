import { useRef, useState, useEffect } from "react";
import { BodiceMeasurements, Category } from "@/types/sloper";
import { BodiceDartsPanel } from "./bodice-darts/BodiceDartsPanel";
import { BodiceDartsLegend } from "./bodice-darts/BodiceDartsLegend";

interface BodiceWithDartsPatternPreviewProps {
  measurements: BodiceMeasurements;
  category: Category;
}

export function BodiceWithDartsPatternPreview({ measurements, category }: BodiceWithDartsPatternPreviewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

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

  const { bust, backLength, backWidth, ease } = measurements;

  // Calculate pattern dimensions
  const bustQuarter = bust / 4;
  const easeValue = ease ?? 2;
  const patternWidth = bustQuarter + easeValue + 5;
  const patternHeight = backLength + 5;

  // Calculate scale to fit both panels side by side
  const padding = 60;
  const gap = 40;
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

  return (
    <svg ref={svgRef} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} className="w-full h-full min-h-[400px]">
      {/* Grid background */}
      <defs>
        <pattern id="bodiceDartsGrid" width={scale} height={scale} patternUnits="userSpaceOnUse">
          <path d={`M ${scale} 0 L 0 0 0 ${scale}`} fill="none" stroke="hsl(var(--pattern-grid))" strokeWidth="0.5" />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="url(#bodiceDartsGrid)" />

      {/* Panel labels */}
      <text
        x={frontOffsetX + scaledWidth / 2}
        y={offsetY - scaledHeight * 0.15}
        textAnchor="middle"
        className="fill-muted-foreground text-xs font-medium uppercase tracking-wider"
      >
        Front Panel
      </text>
      <text
        x={backOffsetX + scaledWidth / 2}
        y={offsetY - scaledHeight * 0.15}
        textAnchor="middle"
        className="fill-muted-foreground text-xs font-medium uppercase tracking-wider"
      >
        Back Panel
      </text>

      {/* Front panel */}
      <BodiceDartsPanel
        measurements={measurements}
        offsetX={frontOffsetX}
        offsetY={offsetY}
        scale={scale}
        panel="front"
        category={category}
      />

      {/* Back panel */}
      <BodiceDartsPanel
        measurements={measurements}
        offsetX={backOffsetX}
        offsetY={offsetY}
        scale={scale}
        panel="back"
        category={category}
      />

      {/* Measurement annotations */}
      <g className="text-[10px]">
        {/* Bust measurement */}
        <text x={frontOffsetX + scaledWidth + 15} y={offsetY + scaledHeight * 0.5} className="fill-primary">
          Bust/4: {(bust / 4).toFixed(1)}cm
        </text>

        {/* Back length */}
        <text
          x={frontOffsetX - 5}
          y={offsetY + scaledHeight / 2}
          textAnchor="end"
          className="fill-muted-foreground"
          transform={`rotate(-90 ${frontOffsetX - 5} ${offsetY + scaledHeight / 2})`}
        >
          {backLength}cm
        </text>
      </g>

      {/* Legend */}
      <BodiceDartsLegend x={dimensions.width - 135} y={dimensions.height - 70} />
    </svg>
  );
}
