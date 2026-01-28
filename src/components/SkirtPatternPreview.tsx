import { SkirtMeasurements } from "@/types/sloper";
import { useEffect, useRef, useState } from "react";
import type { SeamAllowance } from "@/lib/pdf-export";
import { SkirtFrontPanel } from "./skirt/SkirtFrontPanel";
import { SkirtBackPanel } from "./skirt/SkirtBackPanel";
import { SkirtLegend } from "./skirt/SkirtLegend";

interface SkirtPatternPreviewProps {
  measurements: SkirtMeasurements;
  seamAllowance?: SeamAllowance;
}

export function SkirtPatternPreview({ measurements, seamAllowance = 1 }: SkirtPatternPreviewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  // Calculate pattern pieces
  const { waist, hip, waistToHip, skirtLength } = measurements;

  // Pattern calculations (shared between front and back)
  const waistQuarter = waist / 4;
  const hipQuarter = hip / 4;
  const ease = 1;
  const dartWidth = ((hip - waist) * 25) / 240;
  const dartLength = waistToHip * 0.5;

  // Scale factor to fit both panels
  const scale = Math.min(
    (dimensions.width / 2 - 80) / (hipQuarter + ease + 10),
    (dimensions.height - 80) / (skirtLength + 10),
  );

  // Pattern coordinates (scaled)
  const patternWidth = (hipQuarter + ease) * scale;
  const patternHeight = skirtLength * scale;
  const waistWidthScaled = (waistQuarter + ease + dartWidth) * scale;
  const dartWidthScaled = dartWidth * scale;
  const dartLengthScaled = dartLength * scale;
  const waistToHipScaled = waistToHip * scale;

  // Front panel offset (left side)
  const frontOffsetX = 40;
  const offsetY = 40;

  // Back panel offset (right side)
  const backOffsetX = dimensions.width / 2 + 20;

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

  const sharedProps = {
    waist,
    waistQuarter,
    hipQuarter,
    ease,
    dartWidth,
    dartLength,
    skirtLength,
    waistToHip,
    scale,
    patternWidth,
    patternHeight,
    waistWidthScaled,
    dartWidthScaled,
    dartLengthScaled,
    waistToHipScaled,
    offsetY,
    seamAllowance,
  };

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
        {/* Arrow marker definition */}
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <polygon points="0,0 6,3 0,6" fill="hsl(var(--pattern-stroke))" />
          </marker>
        </defs>

        {/* Front Panel */}
        <SkirtFrontPanel {...sharedProps} offsetX={frontOffsetX} />

        {/* Back Panel */}
        <SkirtBackPanel {...sharedProps} offsetX={backOffsetX} />
      </svg>

      {/* Legend */}
      <SkirtLegend />
    </div>
  );
}