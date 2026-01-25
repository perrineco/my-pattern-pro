import { useRef, useState, useEffect } from 'react';
import { BodiceMeasurements } from '@/types/sloper';
import { SeamAllowance } from '@/lib/pdf-export';

interface BodicePatternPreviewProps {
  measurements: BodiceMeasurements;
  seamAllowance?: SeamAllowance;
  panel?: 'front' | 'back';
}

export function BodicePatternPreview({
  measurements,
  seamAllowance = 1,
  panel = 'front',
}: BodicePatternPreviewProps) {
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
    bustHeight,
    shoulderWidth,
    backWidth,
    chestWidth,
    armholeDepth,
    neckWidth,
    shoulderSlope,
  } = measurements;

  // Calculate pattern dimensions (half panel - center front/back)
  const bustQuarter = bust / 4;
  const waistQuarter = waist / 4;
  const shoulderHalf = shoulderWidth / 2;
  const ease = 1;

  // Pattern dimensions
  const patternWidth = Math.max(bustQuarter, waistQuarter, shoulderHalf) + ease + 5;
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
  const shoulderHalfWidth = (shoulderHalf) * scale;
  const bustQuarterScaled = (bustQuarter + ease) * scale;
  const waistQuarterScaled = (waistQuarter + ease) * scale;
  const armholeDepthScaled = s(armholeDepth);
  const bustHeightScaled = s(bustHeight);
  const shoulderToWaistScaled = s(shoulderToWaist);
  const shoulderSlopeScaled = s(shoulderSlope);

  // Front panel has bust dart, back panel has smaller shoulder dart
  const isFront = panel === 'front';
  
  // Dart calculations
  const bustDartWidth = isFront ? s(2.5) : 0;
  const bustDartDepth = isFront ? s(bustHeight * 0.85) : 0;
  const waistDartWidth = s(2);
  const waistDartDepth = s(shoulderToWaist * 0.35);

  // Calculate dart position (at bust point)
  const bustDartX = offsetX + bustQuarterScaled / 2;

  // Build pattern path
  const buildPatternPath = () => {
    const points: string[] = [];
    
    // Start at neck center
    points.push(`M ${offsetX} ${offsetY + (isFront ? s(1.5) : 0)}`);
    
    // Neck curve
    points.push(`Q ${offsetX + neckHalfWidth * 0.3} ${offsetY} ${offsetX + neckHalfWidth} ${offsetY}`);
    
    // Shoulder line (with slope)
    points.push(`L ${offsetX + shoulderHalfWidth} ${offsetY + shoulderSlopeScaled}`);
    
    // Armhole curve
    const armholeControlX = offsetX + bustQuarterScaled + s(1);
    points.push(`Q ${armholeControlX} ${offsetY + shoulderSlopeScaled + armholeDepthScaled * 0.3} ${offsetX + bustQuarterScaled} ${offsetY + armholeDepthScaled}`);
    
    // Side seam to waist
    points.push(`L ${offsetX + waistQuarterScaled} ${offsetY + shoulderToWaistScaled}`);
    
    // Waist dart (center of waist)
    const waistDartX = offsetX + waistQuarterScaled / 2;
    points.push(`L ${waistDartX + waistDartWidth / 2} ${offsetY + shoulderToWaistScaled}`);
    points.push(`L ${waistDartX} ${offsetY + shoulderToWaistScaled - waistDartDepth}`);
    points.push(`L ${waistDartX - waistDartWidth / 2} ${offsetY + shoulderToWaistScaled}`);
    
    // Back to center front
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
    points.push(`M ${offsetX - sa} ${offsetY + (isFront ? s(1.5) : 0) - sa}`);
    points.push(`L ${offsetX + neckHalfWidth} ${offsetY - sa}`);
    points.push(`L ${offsetX + shoulderHalfWidth + sa} ${offsetY + shoulderSlopeScaled - sa}`);
    points.push(`L ${offsetX + bustQuarterScaled + sa} ${offsetY + armholeDepthScaled}`);
    points.push(`L ${offsetX + waistQuarterScaled + sa} ${offsetY + shoulderToWaistScaled + sa}`);
    points.push(`L ${offsetX - sa} ${offsetY + shoulderToWaistScaled + sa}`);
    points.push(`Z`);
    
    return points.join(' ');
  };

  // Bust dart for front panel (side dart)
  const buildBustDartPath = () => {
    if (!isFront) return '';
    
    const dartY = offsetY + bustHeightScaled;
    const sideX = offsetX + bustQuarterScaled;
    
    return `
      M ${sideX} ${dartY - bustDartWidth}
      L ${sideX - bustDartDepth} ${dartY}
      L ${sideX} ${dartY + bustDartWidth}
    `;
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
          id="bodiceGrid"
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
          id="bodiceArrow"
          markerWidth="6"
          markerHeight="6"
          refX="3"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill="hsl(var(--pattern-stroke))" />
        </marker>
      </defs>

      <rect width="100%" height="100%" fill="url(#bodiceGrid)" />

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

      {/* Bust dart (front only) */}
      {isFront && (
        <path
          d={buildBustDartPath()}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
        />
      )}

      {/* Waist dart visualization */}
      <line
        x1={offsetX + waistQuarterScaled / 2}
        y1={offsetY + shoulderToWaistScaled}
        x2={offsetX + waistQuarterScaled / 2}
        y2={offsetY + shoulderToWaistScaled - waistDartDepth}
        stroke="hsl(var(--muted-foreground))"
        strokeWidth="1"
        strokeDasharray="2,2"
      />

      {/* Grain line */}
      <line
        x1={offsetX + bustQuarterScaled * 0.3}
        y1={offsetY + shoulderToWaistScaled * 0.25}
        x2={offsetX + bustQuarterScaled * 0.3}
        y2={offsetY + shoulderToWaistScaled * 0.75}
        stroke="hsl(var(--pattern-stroke))"
        strokeWidth="1.5"
        markerEnd="url(#bodiceArrow)"
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

      {/* Measurement labels */}
      {/* Bust line */}
      <line
        x1={offsetX + bustQuarterScaled + 15}
        y1={offsetY + bustHeightScaled}
        x2={offsetX + bustQuarterScaled + 35}
        y2={offsetY + bustHeightScaled}
        stroke="hsl(var(--primary))"
        strokeWidth="1"
      />
      <text
        x={offsetX + bustQuarterScaled + 40}
        y={offsetY + bustHeightScaled + 4}
        className="fill-primary text-[10px]"
      >
        Bust: {bust / 4}cm
      </text>

      {/* Waist */}
      <text
        x={offsetX + waistQuarterScaled + 10}
        y={offsetY + shoulderToWaistScaled - 5}
        className="fill-muted-foreground text-[10px]"
      >
        Waist: {waist / 4}cm
      </text>

      {/* Length */}
      <text
        x={offsetX - 5}
        y={offsetY + shoulderToWaistScaled / 2}
        textAnchor="end"
        className="fill-muted-foreground text-[10px]"
        transform={`rotate(-90 ${offsetX - 5} ${offsetY + shoulderToWaistScaled / 2})`}
      >
        {shoulderToWaist}cm
      </text>

      {/* Legend */}
      <g transform={`translate(${dimensions.width - 120}, ${dimensions.height - 80})`}>
        <rect
          x="0"
          y="0"
          width="110"
          height="70"
          fill="hsl(var(--card))"
          stroke="hsl(var(--border))"
          rx="4"
        />
        <line x1="8" y1="15" x2="28" y2="15" stroke="hsl(var(--pattern-stroke))" strokeWidth="2" />
        <text x="34" y="18" className="fill-foreground text-[9px]">Pattern edge</text>
        
        <line x1="8" y1="30" x2="28" y2="30" stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeDasharray="4,2" />
        <text x="34" y="33" className="fill-foreground text-[9px]">Seam allowance</text>
        
        <line x1="8" y1="45" x2="28" y2="45" stroke="hsl(var(--primary))" strokeWidth="1.5" />
        <text x="34" y="48" className="fill-foreground text-[9px]">Bust dart</text>
        
        <line x1="8" y1="60" x2="28" y2="60" stroke="hsl(var(--pattern-stroke))" strokeWidth="1.5" markerEnd="url(#bodiceArrow)" />
        <text x="34" y="63" className="fill-foreground text-[9px]">Grain line</text>
      </g>
    </svg>
  );
}
