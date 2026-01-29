import { useRef, useState, useEffect } from "react";
import { BodiceMeasurements } from "@/types/sloper";
import { SeamAllowance } from "@/lib/pdf-export";

interface DartlessBodicePatternPreviewProps {
  measurements: BodiceMeasurements;
  seamAllowance?: SeamAllowance;
  panel?: "front" | "back";
}

export function DartlessBodicePatternPreview({
  measurements,
  seamAllowance = 1,
  panel = "front",
}: DartlessBodicePatternPreviewProps) {
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

  const isFront = panel === "front";

  // Derive pattern dimensions from the 5 core measurements
  const neckWidth = neckCircumference / Math.PI; // Approximate neck width from circumference
  const armholeDepth = backLength * 0.5; // Armhole depth as proportion of back length

  const ease = 1.5; // Ease for dartless bodice

  // Calculate pattern dimensions (half panel - center front/back)
  const bustQuarter = bust / 4;
  const backWidthHalf = backWidth / 2;

  // Pattern dimensions
  const patternWidth = Math.max(bustQuarter + ease, backWidthHalf) + 5;
  const patternHeight = backLength + 5;

  // Calculate scale to fit in view
  const padding = 60;
  const availableWidth = dimensions.width - padding * 2;
  const availableHeight = dimensions.height - padding * 2;
  const scale = Math.min(availableWidth / patternWidth, availableHeight / patternHeight, 8);

  const scaledWidth = patternWidth * scale;
  const scaledHeight = patternHeight * scale;
  const offsetX = (dimensions.width - scaledWidth) / 2;
  const offsetY = (dimensions.height - scaledHeight) / 2;

  // Scaled measurements
  const s = (v: number) => v * scale;
  const sa = seamAllowance * scale;

  // Key pattern points (relative to top-left of pattern)
  const neckHalfWidth = (neckCircumference / 6 + 1.6) * scale;
  const neckHalfHeight = (neckCircumference / 6 + 2) * scale;
  const shoulderLengthScaled = shoulderLength * scale;
  const bustQuarterScaled = (bustQuarter + ease) * scale;
  const backWidthHalfScaled = backWidthHalf * scale;
  const armholeDepthScaled = s(armholeDepth);
  const backLengthScaled = s(backLength);
  const neckDepth = isFront ? s(neckWidth * 0.5) : s(neckWidth * 0.15);
  const angleRad = (25 * Math.PI) / 180;
  const shoulderSlopeY = Math.sin(angleRad) * shoulderLengthScaled;
  const shoulderWidthX = Math.sqrt(
    (shoulderLengthScaled - 1.5) * (shoulderLengthScaled - 1.5) - shoulderSlopeY * shoulderSlopeY,
  );
  // Build pattern path - simple dartless shape
  const buildPatternPath = () => {
    const points: string[] = [];

    // Start at neck center (with front/back neck depth difference)
    points.push(`M ${offsetX} ${offsetY + neckDepth}`);

    // Neck curve to shoulder
    const cp1x = offsetX + neckHalfWidth * 0.65;
    const cp1y = offsetY;

    const cp2x = offsetX + neckHalfWidth * 0.85;
    const cp2y = offsetY - neckHalfHeight * 0.5;

    const endX = offsetX + neckHalfWidth;
    const endY = offsetY - neckHalfHeight;

    // Construction de la courbe de Bézier cubique (C)
    points.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`);

    // Shoulder line (with slope) - using shoulder length

    const neckEndX = offsetX + neckHalfWidth;
    const neckEndY = offsetY + neckDepth - neckHalfHeight;

    const shoulderEndX = neckEndX + shoulderWidthX;
    const shoulderEndY = neckEndY + shoulderSlopeY;
    points.push(`L ${shoulderEndX} ${shoulderEndY}`);

    // Armhole curve - smooth curve to side seam
    // --- Calcul du point intermédiaire de l'emmanchure ---
    const armholeRetreatX = s(bust / 4 + ease * 2 - backWidth / 2);
    const midPointX = offsetX + bustQuarterScaled - armholeRetreatX;

    // Position Y = (Ligne de poitrine) - (backLength / 6)
    const armholeRiseY = s(backLength / 6);
    const midPointY = offsetY + armholeDepthScaled - armholeRiseY;

    // --- Tracé des deux courbes ---

    // 1ère courbe : de l'épaule au point intermédiaire
    const cp1_1x = shoulderEndX;
    const cp1_1y = shoulderEndY + (midPointY - shoulderEndY) * 0.5;
    const cp1_2x = midPointX;
    const cp1_2y = midPointY + s(1); // Légère cambrure

    points.push(`C ${cp1_1x} ${cp1_1y}, ${cp1_2x} ${cp1_2y}, ${midPointX} ${midPointY}`);

    // 2ème courbe : du point intermédiaire au dessous de l'aisselle
    // On veut une arrivée horizontale à l'aisselle (tangente)
    const ArmholeDendX = offsetX + bustQuarterScaled;
    const ArmholeDendY = offsetY + armholeDepthScaled;

    const cp2_1x = midPointX;
    const cp2_1y = midPointY + (ArmholeDendY - midPointY) * 0.8;
    const cp2_2x = ArmholeDendX - (ArmholeDendX - midPointX) * 0.5;
    const cp2_2y = ArmholeDendY;

    points.push(`C ${cp2_1x} ${cp2_1y}, ${cp2_2x} ${cp2_2y}, ${ArmholeDendX} ${ArmholeDendY}`);

    // Side seam - straight to waist (no side dart)
    points.push(`L ${offsetX + bustQuarterScaled} ${offsetY + backLengthScaled}`);

    // Waist line back to center
    points.push(`L ${offsetX} ${offsetY + backLengthScaled}`);

    // Center front/back line back up
    points.push(`Z`);

    return points.join(" ");
  };

  // Build seam allowance path
  const buildSeamAllowancePath = () => {
    if (seamAllowance === 0) return "";

    const shoulderEndX = offsetX + neckHalfWidth + shoulderLengthScaled;

    const points: string[] = [];

    // Outer boundary with seam allowance
    points.push(`M ${offsetX - sa} ${offsetY + neckDepth}`);
    points.push(
      `Q ${offsetX + neckHalfWidth * 0.5} ${offsetY - sa} ${offsetX + neckHalfWidth + sa * 0.5} ${offsetY - sa}`,
    );
    points.push(`L ${shoulderEndX + sa} ${offsetY + shoulderSlopeY - sa}`);
    points.push(`L ${offsetX + bustQuarterScaled + sa} ${offsetY + armholeDepthScaled}`);
    points.push(`L ${offsetX + bustQuarterScaled + sa} ${offsetY + backLengthScaled + sa}`);
    points.push(`L ${offsetX - sa} ${offsetY + backLengthScaled + sa}`);
    points.push(`Z`);

    return points.join(" ");
  };

  return (
    <svg ref={svgRef} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} className="w-full h-full min-h-[400px]">
      {/* Grid background */}
      <defs>
        <pattern id="dartlessBodiceGrid" width={scale} height={scale} patternUnits="userSpaceOnUse">
          <path d={`M ${scale} 0 L 0 0 0 ${scale}`} fill="none" stroke="hsl(var(--pattern-grid))" strokeWidth="0.5" />
        </pattern>
        <marker id="dartlessBodiceArrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="hsl(var(--pattern-stroke))" />
        </marker>
      </defs>

      <rect width="100%" height="100%" fill="url(#dartlessBodiceGrid)" />

      {/* Seam allowance outline */}
      {seamAllowance > 0 && (
        <path
          d={buildSeamAllowancePath()}
          fill="none"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="1"
          strokeDasharray="4,2"
        />
      )}

      {/* Main pattern piece */}
      <path
        d={buildPatternPath()}
        fill="hsl(var(--pattern-fill))"
        stroke="hsl(var(--pattern-stroke))"
        strokeWidth="2"
      />

      {/* Bust line (reference) */}
      <line
        x1={offsetX}
        y1={offsetY + armholeDepthScaled}
        x2={offsetX + bustQuarterScaled}
        y2={offsetY + armholeDepthScaled}
        stroke="hsl(var(--muted-foreground))"
        strokeWidth="1"
        strokeDasharray="3,3"
      />

      {/* Grain line */}
      <line
        x1={offsetX + bustQuarterScaled * 0.3}
        y1={offsetY + backLengthScaled * 0.25}
        x2={offsetX + bustQuarterScaled * 0.3}
        y2={offsetY + backLengthScaled * 0.75}
        stroke="hsl(var(--pattern-stroke))"
        strokeWidth="1.5"
        markerEnd="url(#dartlessBodiceArrow)"
      />

      {/* Center front/back fold line indicator */}
      <line
        x1={offsetX}
        y1={offsetY + neckDepth}
        x2={offsetX}
        y2={offsetY + backLengthScaled}
        stroke="hsl(var(--primary))"
        strokeWidth="1"
        strokeDasharray="8,4"
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
      <text x={bustQuarterScaled + 5} y={backLengthScaled} fontSize="14" fill="red">
        neckHalfHeight: {Math.round(neckHalfHeight)}, {Math.round(neckHalfWidth)}
        épaule: {Math.round(shoulderWidthX)}, {Math.round(shoulderLengthScaled)}
      </text>
      <text
        x={offsetX + bustQuarterScaled / 2}
        y={offsetY + backLengthScaled / 2 + 16}
        textAnchor="middle"
        className="fill-muted-foreground text-xs"
      >
        Cut 1 on fold
      </text>
      <text
        x={offsetX + bustQuarterScaled / 2}
        y={offsetY + backLengthScaled / 2 + 30}
        textAnchor="middle"
        className="fill-primary/70 text-[10px] italic"
      >
        Dartless
      </text>

      {/* Measurement labels */}
      {/* Bust line label */}
      <line
        x1={offsetX + bustQuarterScaled + 15}
        y1={offsetY + armholeDepthScaled}
        x2={offsetX + bustQuarterScaled + 35}
        y2={offsetY + armholeDepthScaled}
        stroke="hsl(var(--muted-foreground))"
        strokeWidth="1"
      />
      <text
        x={offsetX + bustQuarterScaled + 40}
        y={offsetY + armholeDepthScaled + 4}
        className="fill-muted-foreground text-[10px]"
      >
        Bust: {(bust / 4 + ease).toFixed(1)}cm
      </text>

      {/* Back width */}
      <text
        x={offsetX + bustQuarterScaled + 10}
        y={offsetY + backLengthScaled - 5}
        className="fill-muted-foreground text-[10px]"
      >
        Back width: {(backWidth / 2).toFixed(1)}cm
      </text>

      {/* Length */}
      <text
        x={offsetX - 8}
        y={offsetY + backLengthScaled / 2}
        textAnchor="end"
        className="fill-muted-foreground text-[10px]"
        transform={`rotate(-90 ${offsetX - 8} ${offsetY + backLengthScaled / 2})`}
      >
        {backLength}cm
      </text>

      {/* Fold line indicator */}
      <text
        x={offsetX + 3}
        y={offsetY + backLengthScaled / 2}
        className="fill-primary text-[9px]"
        transform={`rotate(-90 ${offsetX + 3} ${offsetY + backLengthScaled / 2})`}
      >
        FOLD
      </text>

      {/* Legend */}
      <g transform={`translate(${dimensions.width - 120}, ${dimensions.height - 70})`}>
        <rect x="0" y="0" width="110" height="60" fill="hsl(var(--card))" stroke="hsl(var(--border))" rx="4" />
        <line x1="8" y1="15" x2="28" y2="15" stroke="hsl(var(--pattern-stroke))" strokeWidth="2" />
        <text x="34" y="18" className="fill-foreground text-[9px]">
          Pattern edge
        </text>

        <line
          x1="8"
          y1="30"
          x2="28"
          y2="30"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="1"
          strokeDasharray="4,2"
        />
        <text x="34" y="33" className="fill-foreground text-[9px]">
          Seam allowance
        </text>

        <line x1="8" y1="45" x2="28" y2="45" stroke="hsl(var(--primary))" strokeWidth="1" strokeDasharray="8,4" />
        <text x="34" y="48" className="fill-foreground text-[9px]">
          Fold line
        </text>
      </g>
    </svg>
  );
}
