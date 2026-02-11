import { useRef, useState, useEffect } from "react";
import { BodiceMeasurements, Category } from "@/types/sloper";
import { DartlessBodicePanel } from "./dartless-bodice/DartlessBodicePanel";
import { DartlessBodiceLegend } from "./dartless-bodice/DartlessBodiceLegend";

interface DartlessBodicePatternPreviewProps {
  measurements: BodiceMeasurements;
  category: Category;
}

export function DartlessBodicePatternPreview({ measurements, category }: DartlessBodicePatternPreviewProps) {
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

  const { bust, backWidth, backLength, neckCircumference } = measurements;

  const ease = measurements.ease ?? 2;
  const bustQuarter = bust / 4;
  const backWidthHalf = backWidth / 2;

  // Calculate front panel extra height (matches DartlessBodicePanelPath logic)
  const frontNeckDepthDivisor = category === "men" ? 5 : category === "kids" ? 6 : 6;
  const frontNeckDepthAdd = category === "men" ? 0 : category === "kids" ? 0.2 : 2;
  const frontExtraHeight = neckCircumference / 12 - (neckCircumference / frontNeckDepthDivisor + frontNeckDepthAdd);
  const neckHeightFront = neckCircumference / frontNeckDepthDivisor + frontNeckDepthAdd;
  const neckHeightBack = category === "men" ? 2 : category === "kids" ? 1.4 : neckCircumference / 16;
  const maxNeckHeight = Math.max(neckHeightFront, neckHeightBack);

  // Pattern dimensions for single panel
  const singlePatternWidth = Math.max(bustQuarter + ease, backWidthHalf) + 5;
  const frontPatternHeight = backLength + frontExtraHeight + 5;
  const backPatternHeight = backLength + 5;
  const maxPatternHeight = Math.max(frontPatternHeight, backPatternHeight);

  // Calculate scale to fit both panels side by side
  const padding = 40;
  const availableWidth = dimensions.width / 2 - padding * 2;
  const availableHeight = dimensions.height - padding * 2;
  const scale = Math.min(availableWidth / singlePatternWidth, availableHeight / maxPatternHeight, 8);

  // Front panel offset (left side)
  const frontOffsetX = padding;
  const frontOffsetY = padding;

  // Back panel offset (right side) - aligned at bottom with front
  const backOffsetX = dimensions.width / 2 + padding / 2;
  const heightDifference = (frontPatternHeight - backPatternHeight) * scale;
  const backOffsetY = padding + heightDifference;

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
          offsetY={frontOffsetY}
          scale={scale}
          panel="front"
          category={category}
        />

        {/* Back Panel */}
        <DartlessBodicePanel
          measurements={measurements}
          offsetX={backOffsetX}
          offsetY={backOffsetY}
          scale={scale}
          panel="back"
          category={category}
        />
      </svg>

      {/* Legend */}
      <DartlessBodiceLegend />
    </div>
  );
}
