import { useRef, useState, useEffect } from "react";
import { BodiceMeasurements } from "@/types/sloper";

interface BodicePatternPreviewProps {
  measurements: BodiceMeasurements;
  panel?: "front" | "back";
}

export function BodicePatternPreview({ measurements, panel = "front" }: BodicePatternPreviewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 500 });

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

  const { bust, neckCircumference, shoulderLength, backWidth, backLength } = measurements;

  // Calculate pattern dimensions (half panel - center front/back)
  const bustQuarter = bust / 4;
  const backWidthHalf = backWidth / 2;
  const neckWidthCalc = neckCircumference / 6; // Approximate neck width from circumference
  const neckHalfHeightCm = panel === "front" ? neckCircumference / 6 + 2 : neckCircumference / 16;
  const ease = 1;

  // Pattern dimensions
  const patternWidth = Math.max(bustQuarter, backWidthHalf) + ease + 5;
  const patternHeight = backLength + neckHalfHeightCm + 5;

  // Calculate scale to fit in view
  const padding = 60;
  const availableWidth = dimensions.width - padding * 2;
  const availableHeight = dimensions.height - padding * 2;
  const scale = Math.min(availableWidth / patternWidth, availableHeight / patternHeight, 8);

  const scaledWidth = patternWidth * scale;
  const scaledHeight = patternHeight * scale;
  const offsetX = (dimensions.width - scaledWidth) / 2;
  const offsetY = (dimensions.height - scaledHeight) / 2 + neckHalfHeightCm * scale;

  // Scaled measurements
  const s = (v: number) => v * scale;

  // Key pattern points (relative to top-left of pattern)
  const neckHalfWidth = neckWidthCalc * scale;
  const shoulderLengthScaled = s(shoulderLength);
  const bustQuarterScaled = (bustQuarter + ease) * scale;
  const backLengthScaled = s(backLength);
  const shoulderSlopeScaled = s(4); // Standard shoulder slope

  // Armhole depth derived from back length (approximately 50% of back length)
  const armholeDepthScaled = s(backLength * 0.5);

  // Front panel has lower neckline
  const isFront = panel === "front";

  // Build pattern path
  const buildPatternPath = () => {
    const points: string[] = [];

    // Start at neck center
    points.push(`M ${offsetX} ${offsetY + (isFront ? s(1.5) : 0)}`);

    // Neck curve
    points.push(`Q ${offsetX + neckHalfWidth * 0.3} ${offsetY} ${offsetX + neckHalfWidth} ${offsetY}`);

    // Shoulder line (shoulder length from neck point)
    const shoulderEndX = offsetX + neckHalfWidth + shoulderLengthScaled;
    points.push(`L ${shoulderEndX} ${offsetY + shoulderSlopeScaled}`);

    // Armhole curve
    const armholeControlX = offsetX + bustQuarterScaled + s(1);
    points.push(
      `Q ${armholeControlX} ${offsetY + shoulderSlopeScaled + armholeDepthScaled * 0.3} ${offsetX + bustQuarterScaled} ${offsetY + armholeDepthScaled}`,
    );

    // Side seam to waist
    points.push(`L ${offsetX + bustQuarterScaled} ${offsetY + backLengthScaled}`);

    // Back to center front
    points.push(`L ${offsetX} ${offsetY + backLengthScaled}`);

    // Center front/back line back up
    points.push(`Z`);

    return points.join(" ");
  };

  return (
    <svg ref={svgRef} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} className="w-full h-full min-h-[400px]">
      {/* Grid background */}
      <defs>
        <pattern id="bodiceGrid" width={scale} height={scale} patternUnits="userSpaceOnUse">
          <path d={`M ${scale} 0 L 0 0 0 ${scale}`} fill="none" stroke="hsl(var(--pattern-grid))" strokeWidth="0.5" />
        </pattern>
        <marker id="bodiceArrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="hsl(var(--pattern-stroke))" />
        </marker>
      </defs>

      <rect width="100%" height="100%" fill="url(#bodiceGrid)" />

      {/* Main pattern piece */}
      <path
        d={buildPatternPath()}
        fill="hsl(var(--pattern-fill))"
        stroke="hsl(var(--pattern-stroke))"
        strokeWidth="2"
      />

      {/* Grain line */}
      <line
        x1={offsetX + bustQuarterScaled * 0.3}
        y1={offsetY + backLengthScaled * 0.25}
        x2={offsetX + bustQuarterScaled * 0.3}
        y2={offsetY + backLengthScaled * 0.75}
        stroke="hsl(var(--pattern-stroke))"
        strokeWidth="1.5"
        markerEnd="url(#bodiceArrow)"
      />

      {/* Labels */}
      <text
        x={offsetX + bustQuarterScaled / 2}
        y={offsetY + backLengthScaled / 2}
        textAnchor="middle"
        className="fill-foreground font-serif text-sm"
      >
        {isFront ? "FRONT" : "BACK"}
      </text>
      <text
        x={offsetX + bustQuarterScaled / 2}
        y={offsetY + backLengthScaled / 2 + 16}
        textAnchor="middle"
        className="fill-muted-foreground text-xs"
      >
        Cut 1 on fold
      </text>

      {/* Measurement labels */}
      {/* Bust line */}
      <line
        x1={offsetX + bustQuarterScaled + 15}
        y1={offsetY + armholeDepthScaled}
        x2={offsetX + bustQuarterScaled + 35}
        y2={offsetY + armholeDepthScaled}
        stroke="hsl(var(--primary))"
        strokeWidth="1"
      />
      <text
        x={offsetX + bustQuarterScaled + 40}
        y={offsetY + armholeDepthScaled + 4}
        className="fill-primary text-[10px]"
      >
        Bust: {bust / 4}cm
      </text>

      {/* Back length */}
      <text
        x={offsetX - 5}
        y={offsetY + backLengthScaled / 2}
        textAnchor="end"
        className="fill-muted-foreground text-[10px]"
        transform={`rotate(-90 ${offsetX - 5} ${offsetY + backLengthScaled / 2})`}
      >
        {backLength}cm
      </text>

      {/* Legend */}
      <g transform={`translate(${dimensions.width - 120}, ${dimensions.height - 50})`}>
        <rect x="0" y="0" width="110" height="40" fill="hsl(var(--card))" stroke="hsl(var(--border))" rx="4" />
        <line x1="8" y1="15" x2="28" y2="15" stroke="hsl(var(--pattern-stroke))" strokeWidth="2" />
        <text x="34" y="18" className="fill-foreground text-[9px]">
          Pattern edge
        </text>

        <line
          x1="8"
          y1="30"
          x2="28"
          y2="30"
          stroke="hsl(var(--pattern-stroke))"
          strokeWidth="1.5"
          markerEnd="url(#bodiceArrow)"
        />
        <text x="34" y="33" className="fill-foreground text-[9px]">
          Grain line
        </text>
      </g>
    </svg>
  );
}
