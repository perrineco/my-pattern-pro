import { SkirtMeasurements, Category } from "@/types/sloper";
import { useEffect, useRef, useState } from "react";
import { SkirtFrontPanel } from "./skirt/SkirtFrontPanel";
import { SkirtBackPanel } from "./skirt/SkirtBackPanel";
import { SkirtLegend } from "./skirt/SkirtLegend";
import { ZoomablePatternWrapper } from "./ZoomablePatternWrapper";

interface SkirtPatternPreviewProps {
  measurements: SkirtMeasurements;
  category: Category;
}

export function SkirtPatternPreview({ measurements, category }: SkirtPatternPreviewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  // Calculate pattern pieces
  const { waist, hip, waistToHip, skirtLength, ease: customEase } = measurements;

  const isKids = category === "kids";

  const waistQuarter = waist / 4;
  const hipQuarter = hip / 4;
  const ease = customEase ?? (isKids ? 0.5 : 1);

  // Front dart calculations
  const frontDartWidth = ((hip - waist) * 25) / 240;
  const frontDartLength = isKids ? waistToHip * 0.4 : waistToHip * 0.5;

  // Back dart calculations
  const backDartWidth = isKids
    ? ((hip - waist) * 22) / 240
    : ((hip - waist) * 35) / 240;
  const backDartLength = isKids
    ? frontDartLength + 1
    : frontDartLength + 2;

  // Scale factor
  const scale = Math.min(
    (dimensions.width / 2 - 80) / (hipQuarter + ease + 10),
    (dimensions.height - 80) / (skirtLength + 10),
  );

  // Pattern coordinates (scaled)
  const patternWidthFront = isKids ? (hipQuarter + ease) * scale : (hipQuarter + ease + 0.5) * scale;
  const patternWidthBack = isKids ? (hipQuarter + ease) * scale : (hipQuarter + ease - 0.5) * scale;

  const patternHeight = skirtLength * scale;
  const waistToHipScaled = waistToHip * scale;

  // Front panel scaled values
  const frontWaistWidthScaled = (waistQuarter + ease + frontDartWidth) * scale;
  const frontDartWidthScaled = frontDartWidth * scale;
  const frontDartLengthScaled = frontDartLength * scale;

  // Back panel scaled values
  const backWaistWidthScaled = (waistQuarter + ease + backDartWidth) * scale;
  const backDartWidthScaled = backDartWidth * scale;
  const backDartLengthScaled = backDartLength * scale;

  // Front panel offset (left side)
  const frontOffsetX = 40;
  const offsetY = 40;

  // Back panel offset - closer gap, mirrored
  const gap = 30;
  const backOffsetX = frontOffsetX + patternWidthFront + gap;
  const backMirrorX = 2 * backOffsetX + patternWidthBack;

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

  // Category-specific dart positions
  const frontcenterToDartScaled = isKids
    ? (hip * scale) / 10 - frontDartWidthScaled / 2
    : (frontWaistWidthScaled - frontDartWidthScaled) / 2;
  const backcenterToDartScaled = isKids
    ? (hip * scale) / 10 - frontDartWidthScaled / 2
    : (frontWaistWidthScaled - frontDartWidthScaled) / 2;
  const frontwaistRise = isKids ? 1 : 1.25;

  const frontProps = {
    waist,
    waistQuarter,
    hipQuarter,
    ease,
    dartWidth: frontDartWidth,
    dartLength: frontDartLength,
    skirtLength,
    waistToHip,
    scale,
    patternWidth: patternWidthFront,
    patternHeight,
    waistWidthScaled: frontWaistWidthScaled,
    dartWidthScaled: frontDartWidthScaled,
    dartLengthScaled: frontDartLengthScaled,
    waistToHipScaled,
    offsetY,
    category,
    centerToDartScaled: frontcenterToDartScaled,
    frontwaistRise,
  };

  const backProps = {
    waist,
    waistQuarter,
    hipQuarter,
    ease,
    dartWidth: backDartWidth,
    dartLength: backDartLength,
    skirtLength,
    waistToHip,
    scale,
    patternWidth: patternWidthBack,
    patternHeight,
    waistWidthScaled: backWaistWidthScaled,
    dartWidthScaled: backDartWidthScaled,
    dartLengthScaled: backDartLengthScaled,
    waistToHipScaled,
    offsetY,
    category,
    centerToDartScaled: backcenterToDartScaled,
  };

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
        <SkirtFrontPanel {...frontProps} offsetX={frontOffsetX} />

        {/* Back Panel - mirrored */}
        <g transform={`translate(${backMirrorX}, 0) scale(-1, 1)`}>
          <SkirtBackPanel {...backProps} offsetX={backOffsetX} mirrored />
        </g>
      </svg>

      {/* Legend */}
      <SkirtLegend />
    </ZoomablePatternWrapper>
  );
}
