import { useRef, useState, useEffect } from "react";
import { PantsMeasurements, Category } from "@/types/sloper";
import { PantsWithDartsFrontPanel } from "./pants/PantsWithDartsFrontPanel";
import { PantsWithDartsBackPanel } from "./pants/PantsWithDartsBackPanel";
import { PantsLegend } from "./pants/PantsLegend";
import { ZoomablePatternWrapper } from "./ZoomablePatternWrapper";

interface PantsWithDartsPatternPreviewProps {
  measurements: PantsMeasurements;
  category: Category;
}

export function PantsWithDartsPatternPreview({ measurements, category }: PantsWithDartsPatternPreviewProps) {
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
  const scale = Math.min(availableWidth / singlePatternWidth, availableHeight / patternHeight, 5);

  const crotchExtensionScaled = crotchExtension * scale;
  const frontOffsetX = padding + crotchExtensionScaled;
  const offsetY = padding + 10;

  const frontPanelRight = frontOffsetX + hipQuarter * scale;
  const backOffsetX = frontPanelRight + 30 + crotchExtensionScaled;

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

        <PantsWithDartsFrontPanel
          measurements={measurements}
          offsetX={frontOffsetX}
          offsetY={offsetY}
          scale={scale}
          category={category}
        />

        <g transform={`translate(${backMirrorX}, 0) scale(-1, 1)`}>
          <PantsWithDartsBackPanel
            measurements={measurements}
            offsetX={backOffsetX}
            offsetY={offsetY}
            scale={scale}
            category={category}
            mirrored
          />
        </g>
      </svg>

      <PantsLegend />
    </ZoomablePatternWrapper>
  );
}
