import { SkirtMeasurements } from "@/types/sloper";
import { useEffect, useRef, useState } from "react";
import type { SeamAllowance } from "@/lib/pdf-export";

interface SkirtPatternPreviewProps {
  measurements: SkirtMeasurements;
  seamAllowance?: SeamAllowance;
}

export function SkirtPatternPreview({ measurements, seamAllowance = 1 }: SkirtPatternPreviewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 500 });

  // Calculate pattern pieces
  const { waist, hip, waistToHip, skirtLength } = measurements;

  // Front panel calculations (half of the pattern)
  const waistQuarter = waist / 4;
  const hipQuarter = hip / 4;
  const ease = 1; // Ease allowance in cm
  const dartWidth = ((hip - waist) * 25) / 240; // Dart width at waist
  const dartLength = waistToHip * 0.5; // Dart length

  // Scale factor to fit the pattern in the view
  const scale = Math.min(
    (dimensions.width - 80) / (hipQuarter + ease + 10),
    (dimensions.height - 80) / (skirtLength + 10),
  );

  // Pattern coordinates (scaled)
  const patternWidth = (hipQuarter + ease) * scale;
  const patternHeight = skirtLength * scale;
  const centerToDartScaled = hipQuarter * 0.4 * scale;
  const waistWidthScaled = (waistQuarter + ease + dartWidth) * scale;
  const dartWidthScaled = dartWidth * scale;
  const dartLengthScaled = dartLength * scale;
  const waistToHipScaled = waistToHip * scale;

  // Center the pattern
  const offsetX = (dimensions.width - patternWidth) / 2;
  const offsetY = 40;

  // Create the path for the front panel
  const hipCurveOffset = scale * 0.8; // Ajustez cette valeur pour plus/moins de courbe

  const panelPath = `
  M ${offsetX} ${offsetY}
  L ${offsetX + centerToDartScaled} ${offsetY}
  L ${offsetX + centerToDartScaled + dartWidthScaled / 2} ${offsetY + dartLengthScaled}
  L ${offsetX + centerToDartScaled + dartWidthScaled} ${offsetY}
  C ${offsetX + waistWidthScaled * 0.5} ${offsetY - 1.25 * 0.5 * scale}
    ${offsetX + waistWidthScaled * 0.7} ${offsetY - 1.25 * 0.75 * scale}
    ${offsetX + waistWidthScaled} ${offsetY - 1.25 * scale}
  C ${offsetX + patternWidth * 0.6} ${offsetY + waistToHipScaled * 0.4 + 1.25 * scale}
    ${offsetX + patternWidth * 0.8}  ${offsetY + waistToHipScaled * 0.8 + 1.25 * scale}
    ${offsetX + patternWidth} ${offsetY + waistToHipScaled + 1.25 * scale}
  L ${offsetX + patternWidth} ${offsetY + patternHeight}
  L ${offsetX} ${offsetY + patternHeight}
  Z
`;

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current?.parentElement) {
        const { width, height } = svgRef.current.parentElement.getBoundingClientRect();
        setDimensions({ width: Math.max(300, width), height: Math.max(400, height) });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

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
        {/* Seam allowance outline */}
        {seamAllowance > 0 && (
          <path
            d={`
              M ${offsetX - seamAllowance * scale} ${offsetY - seamAllowance * scale}
              L ${offsetX + waistWidthScaled / 2 - dartWidthScaled / 2} ${offsetY - seamAllowance * scale}
              L ${offsetX + waistWidthScaled / 2} ${offsetY + dartLengthScaled}
              L ${offsetX + waistWidthScaled / 2 + dartWidthScaled / 2} ${offsetY - seamAllowance * scale}
              L ${offsetX + waistWidthScaled + seamAllowance * scale} ${offsetY - seamAllowance * scale}
              L ${offsetX + patternWidth + seamAllowance * scale} ${offsetY + waistToHipScaled}
              L ${offsetX + patternWidth + seamAllowance * scale} ${offsetY + patternHeight + seamAllowance * scale}
              L ${offsetX - seamAllowance * scale} ${offsetY + patternHeight + seamAllowance * scale}
              Z
            `}
            fill="none"
            stroke="hsl(var(--pattern-stroke))"
            strokeWidth="1"
            strokeDasharray="4,2"
            opacity={0.5}
          />
        )}

        {/* Pattern piece */}
        <path
          d={panelPath}
          fill="hsl(var(--pattern-fill))"
          stroke="hsl(var(--pattern-stroke))"
          strokeWidth="2"
          className="animate-fade-in"
        />

        {/* Grain line */}
        <line
          x1={offsetX + patternWidth / 2}
          y1={offsetY + 30}
          x2={offsetX + patternWidth / 2}
          y2={offsetY + patternHeight - 30}
          stroke="hsl(var(--pattern-stroke))"
          strokeWidth="1"
          strokeDasharray="8,4"
          markerEnd="url(#arrow)"
          markerStart="url(#arrow)"
        />

        {/* Arrow marker definition */}
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <polygon points="0,0 6,3 0,6" fill="hsl(var(--pattern-stroke))" />
          </marker>
        </defs>

        {/* Measurement labels */}
        {/* Waist measurement */}
        <g className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <line
            x1={offsetX - 10}
            y1={offsetY - 15}
            x2={offsetX + waistWidthScaled + 10}
            y2={offsetY - 15}
            stroke="hsl(var(--measure-line))"
            strokeWidth="1"
          />
          <line
            x1={offsetX}
            y1={offsetY - 20}
            x2={offsetX}
            y2={offsetY - 10}
            stroke="hsl(var(--measure-line))"
            strokeWidth="1"
          />
          <line
            x1={offsetX + waistWidthScaled}
            y1={offsetY - 20}
            x2={offsetX + waistWidthScaled}
            y2={offsetY - 10}
            stroke="hsl(var(--measure-line))"
            strokeWidth="1"
          />
          <text
            x={offsetX + waistWidthScaled / 2}
            y={offsetY - 22}
            textAnchor="middle"
            className="fill-primary text-xs font-sans"
          >
            ¼ waist + dart = {(waistQuarter + dartWidth + ease).toFixed(1)}cm
          </text>
        </g>

        {/* Hip measurement */}
        <g className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <line
            x1={offsetX + patternWidth + 15}
            y1={offsetY + waistToHipScaled}
            x2={offsetX + patternWidth + 15}
            y2={offsetY + patternHeight}
            stroke="hsl(var(--measure-line))"
            strokeWidth="1"
          />
          <text
            x={offsetX + patternWidth + 25}
            y={offsetY + waistToHipScaled + (patternHeight - waistToHipScaled) / 2}
            textAnchor="start"
            className="fill-primary text-xs font-sans"
            transform={`rotate(90, ${offsetX + patternWidth + 25}, ${offsetY + waistToHipScaled + (patternHeight - waistToHipScaled) / 2})`}
          >
            {(skirtLength - waistToHip).toFixed(1)}cm
          </text>
        </g>

        {/* Length measurement */}
        <g className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <line
            x1={offsetX - 25}
            y1={offsetY}
            x2={offsetX - 25}
            y2={offsetY + patternHeight}
            stroke="hsl(var(--measure-line))"
            strokeWidth="1"
          />
          <line
            x1={offsetX - 30}
            y1={offsetY}
            x2={offsetX - 20}
            y2={offsetY}
            stroke="hsl(var(--measure-line))"
            strokeWidth="1"
          />
          <line
            x1={offsetX - 30}
            y1={offsetY + patternHeight}
            x2={offsetX - 20}
            y2={offsetY + patternHeight}
            stroke="hsl(var(--measure-line))"
            strokeWidth="1"
          />
          <text
            x={offsetX - 35}
            y={offsetY + patternHeight / 2}
            textAnchor="middle"
            className="fill-primary text-xs font-sans"
            transform={`rotate(-90, ${offsetX - 35}, ${offsetY + patternHeight / 2})`}
          >
            Length = {skirtLength}cm
          </text>
        </g>

        {/* Label */}
        <text
          x={offsetX + patternWidth / 2}
          y={offsetY + patternHeight / 2}
          textAnchor="middle"
          className="fill-foreground font-serif text-sm"
        >
          FRONT
        </text>
        <text
          x={offsetX + patternWidth / 2}
          y={offsetY + patternHeight / 2 + 18}
          textAnchor="middle"
          className="fill-muted-foreground text-xs font-sans"
        >
          Cut 1 on fold
        </text>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm p-3 rounded-md border border-border text-xs space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-pattern-stroke" />
          <span className="text-muted-foreground">Pattern edge</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 border-t border-dashed border-pattern-stroke" />
          <span className="text-muted-foreground">Grain line</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-primary" />
          <span className="text-muted-foreground">Measurements</span>
        </div>
      </div>
    </div>
  );
}
