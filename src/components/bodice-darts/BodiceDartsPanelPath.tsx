import { BodiceMeasurements, Category } from "@/types/sloper";

interface BodiceDartsPanelPathProps {
  measurements: BodiceMeasurements;
  offsetX: number;
  offsetY: number;
  scale: number;
  panel: "front" | "back";
  category: Category;
}

// Category-specific constants for bodice with darts
const categoryConfig = {
  women: {
    ease: 2,
    neckWidthDivisor: 6,
    neckWidthAdd: 1.6,
    frontNeckDepthDivisor: 6,
    frontNeckDepthAdd: 2,
    backNeckDepthDivisor: 16,
    backNeckDepthAdd: 0,
    shoulderAngle: 25,
    armholeDepthRatio: 0.5,
    // Dart specific
    frontDartWidth: 3, // cm - bust dart width
    backDartWidth: 2.5, // cm - back waist dart width
    bustPointRatio: 0.5, // Bust point position from center
  },
  men: {
    ease: 3,
    neckWidthDivisor: 6,
    neckWidthAdd: 2,
    frontNeckDepthDivisor: 8,
    frontNeckDepthAdd: 1.5,
    backNeckDepthDivisor: 20,
    backNeckDepthAdd: 0,
    shoulderAngle: 20,
    armholeDepthRatio: 0.48,
    // Dart specific - men have smaller darts
    frontDartWidth: 1.5,
    backDartWidth: 2,
    bustPointRatio: 0.45,
  },
  kids: {
    ease: 2.5,
    neckWidthDivisor: 5.5,
    neckWidthAdd: 1.2,
    frontNeckDepthDivisor: 7,
    frontNeckDepthAdd: 1.5,
    backNeckDepthDivisor: 18,
    backNeckDepthAdd: 0,
    shoulderAngle: 22,
    armholeDepthRatio: 0.52,
    // Dart specific - kids have minimal darts
    frontDartWidth: 1,
    backDartWidth: 1.5,
    bustPointRatio: 0.48,
  },
};

export function useBodiceDartsPath({ measurements, offsetX, offsetY, scale, panel, category }: BodiceDartsPanelPathProps) {
  const { bust, neckCircumference, shoulderLength, backWidth, backLength, ease: customEase } = measurements;
  const config = categoryConfig[category];

  const ease = customEase ?? config.ease;
  const armholeDepth = backLength * config.armholeDepthRatio;
  const bustQuarter = bust / 4;

  const s = (v: number) => v * scale;

  const neckHalfWidth = (neckCircumference / config.neckWidthDivisor + config.neckWidthAdd) * scale;
  const neckHalfHeight = panel === "front" 
    ? (neckCircumference / config.frontNeckDepthDivisor + config.frontNeckDepthAdd) * scale 
    : (neckCircumference / config.backNeckDepthDivisor + config.backNeckDepthAdd) * scale;
  
  const shoulderLengthScaled = shoulderLength * scale;
  const angleRad = (config.shoulderAngle * Math.PI) / 180;
  const shoulderSlopeY = panel === "front" ? Math.sin(angleRad) * shoulderLengthScaled : neckHalfHeight + 2.5;
  const shoulderWidthX = Math.sqrt(
    (shoulderLengthScaled - 1.5) * (shoulderLengthScaled - 1.5) - shoulderSlopeY * shoulderSlopeY,
  );
  const bustQuarterScaled = (bustQuarter + ease) * scale;
  const backLengthScaled =
    panel === "front" ? s(backLength) + neckCircumference / 12 - (neckCircumference / config.frontNeckDepthDivisor + config.frontNeckDepthAdd) * scale : s(backLength);
  const armholeDepthScaled = backLengthScaled / 2 + neckHalfHeight - shoulderSlopeY - s(backLength / 6);

  // Dart calculations
  const dartWidth = panel === "front" ? s(config.frontDartWidth) : s(config.backDartWidth);
  const dartDepth = panel === "front" ? armholeDepthScaled * 0.7 : backLengthScaled * 0.4;
  const dartPositionX = panel === "front" 
    ? offsetX + bustQuarterScaled * config.bustPointRatio 
    : offsetX + bustQuarterScaled * 0.5;

  const buildPath = () => {
    const points: string[] = [];

    // Start at neck center
    points.push(`M ${offsetX} ${offsetY}`);

    // Neck curve to shoulder
    const cp1x = offsetX + neckHalfWidth * 0.65;
    const cp1y = offsetY;
    const cp2x = offsetX + neckHalfWidth * 0.85;
    const cp2y = offsetY - neckHalfHeight * 0.5;
    const endX = offsetX + neckHalfWidth;
    const endY = offsetY - neckHalfHeight;

    points.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`);

    // Shoulder line
    const neckEndX = offsetX + neckHalfWidth;
    const neckEndY = offsetY - neckHalfHeight;
    const shoulderEndX = neckEndX + shoulderWidthX;
    const shoulderEndY = neckEndY + shoulderSlopeY;
    points.push(`L ${shoulderEndX} ${shoulderEndY}`);

    // Armhole curve
    const armholeRetreatX = s(bust / 4 + ease - backWidth / 2);
    const midPointX =
      panel === "front"
        ? offsetX + bustQuarterScaled - armholeRetreatX + 1.3
        : offsetX + bustQuarterScaled - armholeRetreatX;
    const armholeRiseY = s(backLength / 6);
    const midPointY = neckEndY + shoulderSlopeY + armholeDepthScaled - armholeRiseY;

    const cp1_1x = shoulderEndX;
    const cp1_1y = shoulderEndY;
    const cp1_2x = midPointX;
    const cp1_2y = midPointY + (shoulderEndY - midPointY) * 0.5;

    points.push(`C ${cp1_1x} ${cp1_1y}, ${cp1_2x} ${cp1_2y}, ${midPointX} ${midPointY}`);

    const ArmholeDendX = offsetX + bustQuarterScaled;
    const ArmholeDendY = offsetY + armholeDepthScaled;

    const cp2_1x = midPointX;
    const cp2_1y = midPointY + (ArmholeDendY - midPointY) * 0.8;
    const cp2_2x = ArmholeDendX - (ArmholeDendX - midPointX) * 0.5;
    const cp2_2y = ArmholeDendY;

    points.push(`C ${cp2_1x} ${cp2_1y}, ${cp2_2x} ${cp2_2y}, ${ArmholeDendX} ${ArmholeDendY}`);

    // Side seam to waist (with dart on front panel at side seam)
    if (panel === "front") {
      // Side seam bust dart for front
      const dartTopY = offsetY + armholeDepthScaled;
      const dartPointY = dartTopY + dartDepth * 0.6;
      const dartBottomY = offsetY + backLengthScaled;
      
      // Draw side seam with bust dart notch
      points.push(`L ${offsetX + bustQuarterScaled} ${dartTopY}`);
      // Dart intake - go inward
      points.push(`L ${offsetX + bustQuarterScaled - dartWidth} ${dartPointY}`);
      // Continue to waist
      points.push(`L ${offsetX + bustQuarterScaled} ${dartBottomY}`);
    } else {
      // Back panel - straight side seam
      points.push(`L ${offsetX + bustQuarterScaled} ${offsetY + backLengthScaled}`);
    }

    // Waist line with darts
    if (panel === "back") {
      // Back waist dart
      const waistY = offsetY + backLengthScaled;
      const dartLeft = dartPositionX - dartWidth / 2;
      const dartRight = dartPositionX + dartWidth / 2;
      const dartPointY = waistY - dartDepth;
      
      points.push(`L ${dartRight} ${waistY}`);
      points.push(`L ${dartPositionX} ${dartPointY}`);
      points.push(`L ${dartLeft} ${waistY}`);
      points.push(`L ${offsetX} ${waistY}`);
    } else {
      // Front waist - also has a waist dart
      const waistY = offsetY + backLengthScaled;
      const frontDartX = offsetX + bustQuarterScaled * config.bustPointRatio;
      const frontDartWidth = dartWidth * 0.6;
      const frontDartDepth = dartDepth * 0.5;
      
      const dartLeft = frontDartX - frontDartWidth / 2;
      const dartRight = frontDartX + frontDartWidth / 2;
      const dartPointY = waistY - frontDartDepth;
      
      points.push(`L ${dartRight} ${waistY}`);
      points.push(`L ${frontDartX} ${dartPointY}`);
      points.push(`L ${dartLeft} ${waistY}`);
      points.push(`L ${offsetX} ${waistY}`);
    }

    points.push(`Z`);

    return points.join(" ");
  };

  // Build dart paths for visualization
  const buildDartPath = () => {
    if (panel === "front") {
      // Front has side seam bust dart (already in main path) and small waist dart
      const waistY = offsetY + backLengthScaled;
      const frontDartX = offsetX + bustQuarterScaled * config.bustPointRatio;
      const frontDartWidthVal = dartWidth * 0.6;
      const frontDartDepth = dartDepth * 0.5;
      
      return `M ${frontDartX - frontDartWidthVal / 2} ${waistY} L ${frontDartX} ${waistY - frontDartDepth} L ${frontDartX + frontDartWidthVal / 2} ${waistY}`;
    } else {
      // Back waist dart
      const waistY = offsetY + backLengthScaled;
      const dartLeft = dartPositionX - dartWidth / 2;
      const dartRight = dartPositionX + dartWidth / 2;
      const dartPointY = waistY - dartDepth;
      
      return `M ${dartLeft} ${waistY} L ${dartPositionX} ${dartPointY} L ${dartRight} ${waistY}`;
    }
  };

  return {
    path: buildPath(),
    dartPath: buildDartPath(),
    bustQuarterScaled,
    armholeDepthScaled,
    backLengthScaled,
    ease,
    dartWidth,
    dartDepth,
  };
}
