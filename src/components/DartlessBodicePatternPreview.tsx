import { useRef, useState, useEffect } from 'react';
import { DartlessBodiceMeasurements } from '@/components/DartlessBodiceMeasurementForm';
import { SeamAllowance } from '@/lib/pdf-export';

interface DartlessBodicePatternPreviewProps {
  measurements: DartlessBodiceMeasurements;
  seamAllowance?: SeamAllowance;
  panel?: 'front' | 'back';
}

export function DartlessBodicePatternPreview({
  measurements,
  seamAllowance = 1,
  panel = 'front',
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
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const {
    bust,
    waist,
    shoulderToWaist,
    shoulderWidth,
    backWidth,
    armholeDepth,
    neckWidth,
    neckDepthFront,
    neckDepthBack,
    shoulderSlope,
  } = measurements;

  const isFront = panel === 'front';

  // Calculate pattern dimensions (half panel - center front/back)
  const bustQuarter = bust / 4;
  const waistQuarter = waist / 4;
  const shoulderHalf = shoulderWidth / 2;
  const ease = 1.5; // Ease for dartless bodice

  // Pattern dimensions with extra ease for dartless fit
  const patternWidth = Math.max(bustQuarter + ease, waistQuarter + ease, shoulderHalf) + 5;
  const patternHeight = shoulderToWaist + 5;

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
  const neckHalfWidth = (neckWidth / 2) * scale;
  const shoulderHalfWidth = shoulderHalf * scale;
  const bustQuarterScaled = (bustQuarter + ease) * scale;
  const waistQuarterScaled = (waistQuarter + ease) * scale;
  const armholeDepthScaled = s(armholeDepth);
  const shoulderToWaistScaled = s(shoulderToWaist);
  const shoulderSlopeScaled = s(shoulderSlope);
  const neckDepth = isFront ? s(neckDepthFront) : s(neckDepthBack);

  // Build pattern path - simple dartless shape
  const buildPatternPath = () => {
    const points: string[] = [];
    
    // Start at neck center (with front/back neck depth difference)
    points.push(`M ${offsetX} ${offsetY + neckDepth}`);
    
    // Neck curve to shoulder
    const neckControlX = offsetX + neckHalfWidth * 0.5;
    const neckControlY = offsetY + (isFront ? neckDepth * 0.3 : 0);
    points.push(`Q ${neckControlX} ${neckControlY} ${offsetX + neckHalfWidth} ${offsetY}`);
    
    // Shoulder line (with slope)
    points.push(`L ${offsetX + shoulderHalfWidth} ${offsetY + shoulderSlopeScaled}`);
    
    // Armhole curve - smooth curve to side seam
    const armholeControlX1 = offsetX + bustQuarterScaled + s(2);
    const armholeControlY1 = offsetY + shoulderSlopeScaled + armholeDepthScaled * 0.2;
    const armholeControlX2 = offsetX + bustQuarterScaled + s(1);
    const armholeControlY2 = offsetY + armholeDepthScaled * 0.7;
    points.push(`C ${armholeControlX1} ${armholeControlY1} ${armholeControlX2} ${armholeControlY2} ${offsetX + bustQuarterScaled} ${offsetY + armholeDepthScaled}`);
    
    // Side seam - straight to waist (no side dart)
    points.push(`L ${offsetX + waistQuarterScaled} ${offsetY + shoulderToWaistScaled}`);
    
    // Waist line back to center
    points.push(`L ${offsetX} ${offsetY + shoulderToWaistScaled}`);
    
    // Center front/back line back up
    points.push(`Z`);
    
    return points.join(' ');
  };

  // Build seam allowance path
  const buildSeamAllowancePath = () => {
    if (seamAllowance === 0) return '';
    
    const points: string[] = [];
    
    // Outer boundary with seam allowance
    points.push(`M ${offsetX - sa} ${offsetY + neckDepth}`);
    points.push(`Q ${offsetX + neckHalfWidth * 0.5} ${offsetY - sa} ${offsetX + neckHalfWidth + sa * 0.5} ${offsetY - sa}`);
    points.push(`L ${offsetX + shoulderHalfWidth + sa} ${offsetY + shoulderSlopeScaled - sa}`);
    points.push(`L ${offsetX + bustQuarterScaled + sa} ${offsetY + armholeDepthScaled}`);
    points.push(`L ${offsetX + waistQuarterScaled + sa} ${offsetY + shoulderToWaistScaled + sa}`);
    points.push(`L ${offsetX - sa} ${offsetY + shoulderToWaistScaled + sa}`);
    points.push(`Z`);
    
    return points.join(' ');
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      className="w-full h-full min-h-[400px]"
    >
      {/* Grid background */}
      <defs>
        <pattern
          id="dartlessBodiceGrid"
          width={scale}
          height={scale}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${scale} 0 L 0 0 0 ${scale}`}
            fill="none"
            stroke="hsl(var(--pattern-grid))"
            strokeWidth="0.5"
          />
        </pattern>
        <marker
          id="dartlessBodiceArrow"
          markerWidth="6"
          markerHeight="6"
          refX="3"
          refY="3"
          orient="auto"
        >
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
        y1={offsetY + shoulderToWaistScaled * 0.25}
        x2={offsetX + bustQuarterScaled * 0.3}
        y2={offsetY + shoulderToWaistScaled * 0.75}
        stroke="hsl(var(--pattern-stroke))"
        strokeWidth="1.5"
        markerEnd="url(#dartlessBodiceArrow)"
      />

      {/* Center front/back fold line indicator */}
      <line
        x1={offsetX}
        y1={offsetY + neckDepth}
        x2={offsetX}
        y2={offsetY + shoulderToWaistScaled}
        stroke="hsl(var(--primary))"
        strokeWidth="1"
        strokeDasharray="8,4"
      />

      {/* Labels */}
      <text
        x={offsetX + bustQuarterScaled / 2}
        y={offsetY + shoulderToWaistScaled / 2}
        textAnchor="middle"
        className="fill-foreground font-serif text-sm"
      >
        {isFront ? 'FRONT' : 'BACK'}
      </text>
      <text
        x={offsetX + bustQuarterScaled / 2}
        y={offsetY + shoulderToWaistScaled / 2 + 16}
        textAnchor="middle"
        className="fill-muted-foreground text-xs"
      >
        Cut 1 on fold
      </text>
      <text
        x={offsetX + bustQuarterScaled / 2}
        y={offsetY + shoulderToWaistScaled / 2 + 30}
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

      {/* Waist */}
      <text
        x={offsetX + waistQuarterScaled + 10}
        y={offsetY + shoulderToWaistScaled - 5}
        className="fill-muted-foreground text-[10px]"
      >
        Waist: {(waist / 4 + ease).toFixed(1)}cm
      </text>

      {/* Length */}
      <text
        x={offsetX - 8}
        y={offsetY + shoulderToWaistScaled / 2}
        textAnchor="end"
        className="fill-muted-foreground text-[10px]"
        transform={`rotate(-90 ${offsetX - 8} ${offsetY + shoulderToWaistScaled / 2})`}
      >
        {shoulderToWaist}cm
      </text>

      {/* Fold line indicator */}
      <text
        x={offsetX + 3}
        y={offsetY + shoulderToWaistScaled / 2}
        className="fill-primary text-[9px]"
        transform={`rotate(-90 ${offsetX + 3} ${offsetY + shoulderToWaistScaled / 2})`}
      >
        FOLD
      </text>

      {/* Legend */}
      <g transform={`translate(${dimensions.width - 120}, ${dimensions.height - 70})`}>
        <rect
          x="0"
          y="0"
          width="110"
          height="60"
          fill="hsl(var(--card))"
          stroke="hsl(var(--border))"
          rx="4"
        />
        <line x1="8" y1="15" x2="28" y2="15" stroke="hsl(var(--pattern-stroke))" strokeWidth="2" />
        <text x="34" y="18" className="fill-foreground text-[9px]">Pattern edge</text>
        
        <line x1="8" y1="30" x2="28" y2="30" stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeDasharray="4,2" />
        <text x="34" y="33" className="fill-foreground text-[9px]">Seam allowance</text>
        
        <line x1="8" y1="45" x2="28" y2="45" stroke="hsl(var(--primary))" strokeWidth="1" strokeDasharray="8,4" />
        <text x="34" y="48" className="fill-foreground text-[9px]">Fold line</text>
      </g>
    </svg>
  );
}