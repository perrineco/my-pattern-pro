interface SleevePanelPathProps {
  centerX: number;
  startY: number;
  capHeight: number;
  totalLength: number;
  elbowPosition: number;
  upperWidth: number;
  wristWidth: number;
}

export function SleevePanelPath({
  centerX,
  startY,
  capHeight,
  totalLength,
  elbowPosition,
  upperWidth,
  wristWidth,
}: SleevePanelPathProps) {
  // Key points for the sleeve pattern
  const capTop = startY;
  const capBottom = startY + capHeight;
  const elbowY = capBottom + elbowPosition;
  const wristY = capBottom + totalLength - capHeight;
  
  // Half widths
  const halfUpperWidth = upperWidth / 2;
  const halfWristWidth = wristWidth / 2;
  
  // Elbow width (interpolate between upper arm and wrist)
  const elbowRatio = elbowPosition / (totalLength - capHeight);
  const elbowWidth = halfUpperWidth - (halfUpperWidth - halfWristWidth) * elbowRatio;
  
  // Sleeve cap curve control points
  // Front (left) side curve
  const frontCapCtrl1X = centerX - halfUpperWidth * 0.3;
  const frontCapCtrl1Y = capTop + capHeight * 0.1;
  const frontCapCtrl2X = centerX - halfUpperWidth * 0.8;
  const frontCapCtrl2Y = capTop + capHeight * 0.4;
  
  // Back (right) side curve - slightly different for front/back distinction
  const backCapCtrl1X = centerX + halfUpperWidth * 0.3;
  const backCapCtrl1Y = capTop + capHeight * 0.15;
  const backCapCtrl2X = centerX + halfUpperWidth * 0.85;
  const backCapCtrl2Y = capTop + capHeight * 0.45;
  
  // Elbow dart (small shaping dart on back seam)
  const dartWidth = 4;
  const dartDepth = 15;
  
  // Build the path
  // Start at cap top (center)
  const path = [
    // Cap top center
    `M ${centerX} ${capTop}`,
    
    // Front cap curve (left side) - smoother curve to underarm
    `C ${frontCapCtrl1X} ${frontCapCtrl1Y}, ${frontCapCtrl2X} ${frontCapCtrl2Y}, ${centerX - halfUpperWidth} ${capBottom}`,
    
    // Front seam (left side) - straight to elbow then to wrist
    `L ${centerX - elbowWidth} ${elbowY}`,
    `L ${centerX - halfWristWidth} ${wristY}`,
    
    // Wrist line
    `L ${centerX + halfWristWidth} ${wristY}`,
    
    // Back seam with elbow dart (right side)
    `L ${centerX + elbowWidth + dartWidth} ${elbowY}`,
    `L ${centerX + elbowWidth} ${elbowY - dartDepth}`,
    `L ${centerX + elbowWidth} ${elbowY}`,
    `L ${centerX + halfUpperWidth} ${capBottom}`,
    
    // Back cap curve (right side)
    `C ${backCapCtrl2X} ${backCapCtrl2Y}, ${backCapCtrl1X} ${backCapCtrl1Y}, ${centerX} ${capTop}`,
    
    'Z'
  ].join(' ');

  return (
    <g>
      {/* Main sleeve outline */}
      <path
        d={path}
        fill="none"
        stroke="hsl(var(--foreground))"
        strokeWidth="1.5"
      />
      
      {/* Elbow line (dashed) */}
      <line
        x1={centerX - elbowWidth - 5}
        y1={elbowY}
        x2={centerX + elbowWidth + dartWidth + 5}
        y2={elbowY}
        stroke="hsl(var(--muted-foreground))"
        strokeWidth="0.5"
        strokeDasharray="3 2"
      />
      <text
        x={centerX - elbowWidth - 10}
        y={elbowY + 3}
        className="fill-muted-foreground"
        style={{ fontSize: '7px' }}
        textAnchor="end"
      >
        Elbow
      </text>
      
      {/* Cap height indicator */}
      <line
        x1={centerX - halfUpperWidth - 10}
        y1={capTop}
        x2={centerX - halfUpperWidth - 10}
        y2={capBottom}
        stroke="hsl(var(--primary))"
        strokeWidth="0.5"
      />
      <line
        x1={centerX - halfUpperWidth - 15}
        y1={capTop}
        x2={centerX - halfUpperWidth - 5}
        y2={capTop}
        stroke="hsl(var(--primary))"
        strokeWidth="0.5"
      />
      <line
        x1={centerX - halfUpperWidth - 15}
        y1={capBottom}
        x2={centerX - halfUpperWidth - 5}
        y2={capBottom}
        stroke="hsl(var(--primary))"
        strokeWidth="0.5"
      />
      <text
        x={centerX - halfUpperWidth - 18}
        y={capTop + capHeight / 2 + 3}
        className="fill-primary"
        style={{ fontSize: '7px' }}
        textAnchor="end"
      >
        Cap
      </text>
      
      {/* Notches for matching to bodice */}
      {/* Front notch (single) */}
      <line
        x1={centerX - halfUpperWidth * 0.6}
        y1={capTop + capHeight * 0.25 - 3}
        x2={centerX - halfUpperWidth * 0.6}
        y2={capTop + capHeight * 0.25 + 3}
        stroke="hsl(var(--foreground))"
        strokeWidth="1.5"
      />
      
      {/* Back notches (double) */}
      <line
        x1={centerX + halfUpperWidth * 0.5}
        y1={capTop + capHeight * 0.3 - 3}
        x2={centerX + halfUpperWidth * 0.5}
        y2={capTop + capHeight * 0.3 + 3}
        stroke="hsl(var(--foreground))"
        strokeWidth="1.5"
      />
      <line
        x1={centerX + halfUpperWidth * 0.6}
        y1={capTop + capHeight * 0.35 - 3}
        x2={centerX + halfUpperWidth * 0.6}
        y2={capTop + capHeight * 0.35 + 3}
        stroke="hsl(var(--foreground))"
        strokeWidth="1.5"
      />
    </g>
  );
}
