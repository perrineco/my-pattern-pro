import { SleeveMeasurements, Category } from '@/types/sloper';
import { SleevePanelPath } from './SleevePanelPath';

interface SleevePanelProps {
  measurements: SleeveMeasurements;
  category: Category;
}

export function SleevePanel({ measurements, category }: SleevePanelProps) {
  const { upperArm, wrist, sleeveLength, elbowLength, armholeDepth, ease = 2 } = measurements;
  
  // Calculate dimensions with ease
  const upperArmWithEase = upperArm / 2 + ease;
  const wristWithEase = wrist / 2 + ease * 0.5;
  
  // Scale for display (similar to other patterns)
  const scale = 3.5;
  
  // Pattern dimensions
  const capHeight = armholeDepth * scale;
  const totalLength = sleeveLength * scale;
  const elbowPosition = elbowLength * scale;
  const upperWidth = upperArmWithEase * scale;
  const wristWidth = wristWithEase * scale;
  
  // SVG viewBox dimensions with padding
  const padding = 40;
  const viewWidth = upperWidth + padding * 2;
  const viewHeight = totalLength + capHeight + padding * 2;
  
  // Center offset
  const centerX = viewWidth / 2;
  const startY = padding;

  return (
    <div className="bg-background rounded-lg p-4">
      <svg
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        className="w-full h-auto max-h-[500px]"
        style={{ maxWidth: '400px' }}
      >
        {/* Grid pattern */}
        <defs>
          <pattern id="sleeveGrid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="hsl(var(--muted))" strokeWidth="0.5" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sleeveGrid)" />
        
        <SleevePanelPath
          centerX={centerX}
          startY={startY}
          capHeight={capHeight}
          totalLength={totalLength}
          elbowPosition={elbowPosition}
          upperWidth={upperWidth}
          wristWidth={wristWidth}
        />
        
        {/* Labels */}
        <text
          x={centerX}
          y={startY + capHeight + totalLength / 2}
          textAnchor="middle"
          className="fill-foreground font-serif text-sm"
          style={{ fontSize: '12px' }}
        >
          SLEEVE
        </text>
        <text
          x={centerX}
          y={startY + capHeight + totalLength / 2 + 14}
          textAnchor="middle"
          className="fill-muted-foreground text-xs"
          style={{ fontSize: '9px' }}
        >
          Cut 2
        </text>
        
        {/* Grain line */}
        <line
          x1={centerX}
          y1={startY + capHeight + 20}
          x2={centerX}
          y2={startY + totalLength - 20}
          stroke="hsl(var(--foreground))"
          strokeWidth="1"
          strokeDasharray="4 2"
        />
        <polygon
          points={`${centerX},${startY + capHeight + 20} ${centerX - 4},${startY + capHeight + 28} ${centerX + 4},${startY + capHeight + 28}`}
          fill="hsl(var(--foreground))"
        />
        <polygon
          points={`${centerX},${startY + totalLength - 20} ${centerX - 4},${startY + totalLength - 28} ${centerX + 4},${startY + totalLength - 28}`}
          fill="hsl(var(--foreground))"
        />
        
        {/* Measurement annotations */}
        <text
          x={centerX + upperWidth / 2 + 8}
          y={startY + capHeight + 10}
          className="fill-muted-foreground"
          style={{ fontSize: '8px' }}
        >
          ½ upper arm = {upperArmWithEase.toFixed(1)}cm
        </text>
        <text
          x={centerX + wristWidth / 2 + 8}
          y={startY + totalLength - 5}
          className="fill-muted-foreground"
          style={{ fontSize: '8px' }}
        >
          ½ wrist = {wristWithEase.toFixed(1)}cm
        </text>
        <text
          x={padding / 2}
          y={startY + capHeight + totalLength / 2}
          className="fill-muted-foreground"
          style={{ fontSize: '8px' }}
          transform={`rotate(-90 ${padding / 2} ${startY + capHeight + totalLength / 2})`}
          textAnchor="middle"
        >
          Length = {sleeveLength}cm
        </text>
      </svg>
    </div>
  );
}
