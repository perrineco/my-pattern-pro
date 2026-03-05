import { useRef, useState, useEffect } from "react";
import { PantsMeasurements, Category } from "@/types/sloper";
import { PantsFrontPanel } from "./pants/PantsFrontPanel";
import { PantsBackPanel } from "./pants/PantsBackPanel";
import { PantsLegend } from "./pants/PantsLegend";
import { ZoomablePatternWrapper } from "./ZoomablePatternWrapper";

interface PantsPatternPreviewProps {
  measurements: PantsMeasurements;
  category: Category;
}

export function PantsPatternPreview({ measurements, category }: PantsPatternPreviewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

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

  // Pattern dimensions for single panel
  const hipQuarter = hip / 4;
  const frontCrotchExt = hip / 16 - 1; // Italian method: 1/16 hip - 1
  const backCrotchExt = hip / 16 + 3; // Back: 1/16 hip + 3
  const backRectWidth = hipQuarter + 2; // Back rectangle is wider
  const crotchExtension = Math.max(frontCrotchExt, backCrotchExt);
  const singlePatternWidth = Math.max(hipQuarter, backRectWidth) + crotchExtension + 10;
  const patternHeight = outseamLength + 10;

  // Calculate scale to fit both panels side by side
  const padding = 40;
  const availableWidth = (dimensions.width / 2) - padding * 2;
  const availableHeight = dimensions.height - padding * 2;
  const scale = Math.min(availableWidth / singlePatternWidth, availableHeight / patternHeight, 5);

  // Panel offsets - account for crotch extension
  const crotchExtensionScaled = crotchExtension * scale;
  const frontOffsetX = padding + crotchExtensionScaled;
  const offsetY = padding + 10; // Extra space for back rise

  const backOffsetX = dimensions.width / 2 + padding / 2 + crotchExtensionScaled;

  return (
    <ZoomablePatternWrapper className="w-full h-full bg-pattern-grid/30 rounded-lg" minHeight="600px">
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
        style={{ minHeight: "600px" }}
      >
        <defs>
          <marker id="pantsArrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="hsl(var(--pattern-stroke))" />
          </marker>
        </defs>

        {/* Front Panel */}
        <PantsFrontPanel
          measurements={measurements}
          offsetX={frontOffsetX}
          offsetY={offsetY}
          scale={scale}
          category={category}
        />

        {/* Back Panel */}
        <PantsBackPanel
          measurements={measurements}
          offsetX={backOffsetX}
          offsetY={offsetY}
          scale={scale}
          category={category}
        />
      </svg>

      {/* Legend */}
      <PantsLegend />
    </ZoomablePatternWrapper>
  );
}
