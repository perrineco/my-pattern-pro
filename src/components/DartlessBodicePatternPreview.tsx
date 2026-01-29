import { useRef, useState, useEffect } from "react";
import { BodiceMeasurements } from "@/types/sloper";
import { DartlessBodicePanel } from "./dartless-bodice/DartlessBodicePanel";
import { DartlessBodiceLegend } from "./dartless-bodice/DartlessBodiceLegend";

interface DartlessBodicePatternPreviewProps {
  measurements: BodiceMeasurements;
}

export function DartlessBodicePatternPreview({ measurements }: DartlessBodicePatternPreviewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

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

  const { bust, backWidth, backLength } = measurements;

  const ease = 2;
  const bustQuarter = bust / 4;
  const backWidthHalf = backWidth / 2;

  // Pattern dimensions for single panel
  const singlePatternWidth = Math.max(bustQuarter + ease, backWidthHalf) + 5;
  const patternHeight = backLength + 5;

  // Calculate scale to fit both panels side by side
  const padding = 40;
  const availableWidth = (dimensions.width / 2) - padding * 2;
  const availableHeight = dimensions.height - padding * 2;
  const scale = Math.min(availableWidth / singlePatternWidth, availableHeight / patternHeight, 8);

  // Front panel offset (left side)
  const frontOffsetX = padding;
  const offsetY = padding;

  // Back panel offset (right side)
  const backOffsetX = dimensions.width / 2 + padding / 2;

  return (
    <div className="w-full h-full min-h-[500px] bg-pattern-grid/30 rounded-lg relative overflow-hidden">
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
        </defs>

        {/* Front Panel */}
        <DartlessBodicePanel
          measurements={measurements}
          offsetX={frontOffsetX}
          offsetY={offsetY}
          scale={scale}
          panel="front"
        />

        {/* Back Panel */}
        <DartlessBodicePanel
          measurements={measurements}
          offsetX={backOffsetX}
          offsetY={offsetY}
          scale={scale}
          panel="back"
        />
      </svg>

      {/* Legend */}
      <DartlessBodiceLegend />
    </div>
  );
}
