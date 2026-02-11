import { BodiceMeasurements, Category } from "@/types/sloper";

interface DartlessBodicePanelPathProps {
  measurements: BodiceMeasurements;
  offsetX: number;
  offsetY: number;
  scale: number;
  panel: "front" | "back";
  category: Category;
}

// Category-specific constants
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
    midpointFrontAdd: -1.3,
    midpointBackAdd: 0,
    riseBack: 4,
    extraDropFront: 5,
    frontShoulderAdd: 0,
    backShoulderAdd: 0,
  },
  men: {
    ease: 3,
    neckWidthDivisor: 5,
    neckWidthAdd: 0,
    frontNeckDepthDivisor: 5,
    frontNeckDepthAdd: 0.5,
    backNeckDepthDivisor: 20,
    backNeckDepthAdd: 0,
    shoulderAngle: 20,
    armholeDepthRatio: 0.48,
    midpointFrontAdd: 0.25,
    midpointBackAdd: 0,
    riseBack: 5,
    extraDropFront: 6,
    frontShoulderAdd: 0,
    backShoulderAdd: 0,
  },
  kids: {
    ease: 2.5,
    neckWidthDivisor: 6,
    neckWidthAdd: 0.2,
    frontNeckDepthDivisor: 6,
    frontNeckDepthAdd: 0.2,
    backNeckDepthDivisor: 18,
    backNeckDepthAdd: 0,
    shoulderAngle: 22,
    armholeDepthRatio: 0.52,
    midpointFrontAdd: 0,
    midpointBackAdd: 0,
    riseBack: 3.2,
    extraDropFront: 2.5,
    frontShoulderAdd: 0,
    backShoulderAdd: 0,
  },
};

export function useDartlessBodicePath({
  measurements,
  offsetX,
  offsetY,
  scale,
  panel,
  category,
}: DartlessBodicePanelPathProps) {
  const { bust, neckCircumference, shoulderLength, backWidth, backLength, ease: customEase } = measurements;
  const config = categoryConfig[category];

  // Use custom ease if provided, otherwise fall back to category default
  const ease = customEase ?? config.ease;
  const armholeDepth = backLength * config.armholeDepthRatio;
  const bustQuarter = bust / 4;

  const s = (v: number) => v * scale;

  const neckHalfWidth = (neckCircumference / config.neckWidthDivisor + config.neckWidthAdd) * scale;
  // Back neckline is shallower than front, with category-specific depths
  const frontNeckDepthBase = neckCircumference / config.frontNeckDepthDivisor + config.frontNeckDepthAdd;
  const neckHalfHeight =
    panel === "front"
      ? frontNeckDepthBase * scale
      : (neckCircumference / config.backNeckDepthDivisor + config.backNeckDepthAdd) * scale;

  const shoulderLengthScaled = shoulderLength * scale;
  const angleRadBack = Math.atan2(config.riseBack, backWidth / 2 + config.midpointBackAdd - neckHalfWidth);
  const angleRadFront = Math.atan2(config.extraDropFront, backWidth / 2 + config.midpointFrontAdd - neckHalfWidth);
  // const shoulderSlopeY = panel === "front" ? Math.sin(angleRad) * shoulderLengthScaled : neckHalfHeight + 2.5;
  //  const shoulderWidthX = Math.sqrt(
  //  (shoulderLengthScaled - 1.5) * (shoulderLengthScaled - 1.5) - shoulderSlopeY * shoulderSlopeY,
  // );

  const L_back = shoulderLength + config.backShoulderAdd;
  const L_front = L_back + config.frontShoulderAdd;

  const shoulderSlopeY = panel === "back" ? s(Math.sin(angleRadBack) * L_back) : s(Math.sin(angleRadFront) * L_front);
  const shoulderWidthX = panel === "back" ? -s(Math.cos(angleRadBack) * L_back) : -s(Math.cos(angleRadFront) * L_front);

  const bustQuarterScaled = (bustQuarter + ease) * scale;
  const backLengthScaled =
    panel === "front" ? s(backLength) + neckCircumference / 12 - frontNeckDepthBase * scale : s(backLength);
  const armholeDepthScaled = backLengthScaled / 2 + neckHalfHeight - shoulderSlopeY - s(backLength / 6);

  const buildPath = () => {
    const points: string[] = [];

    // Start at neck center
    const newoffsetY = offsetY + neckHalfHeight;
    points.push(`M ${offsetX} ${newoffsetY}`);

    // Neck curve to shoulder
    const cp1x = offsetX + neckHalfWidth * 0.65;
    const cp1y = newoffsetY;
    const cp2x = offsetX + neckHalfWidth * 0.85;
    const cp2y = newoffsetY - neckHalfHeight * 0.5;
    const endX = offsetX + neckHalfWidth;
    const endY = newoffsetY - neckHalfHeight;

    points.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`);

    // Shoulder line
    const neckEndX = offsetX + neckHalfWidth;
    const neckEndY = newoffsetY - neckHalfHeight;
    const shoulderEndX = neckEndX + shoulderWidthX;
    const shoulderEndY = neckEndY + shoulderSlopeY;
    points.push(`L ${shoulderEndX} ${shoulderEndY}`);

    // Armhole curve
    const armholeRetreatX = s(bust / 4 + ease - backWidth / 2 - config.midpointFrontAdd);
    const midPointX =
      panel === "front" ? offsetX + bustQuarterScaled - armholeRetreatX : offsetX + bustQuarterScaled - armholeRetreatX;
    const armholeRiseY = s(backLength / 6);
    const midPointY = neckEndY + shoulderSlopeY + armholeDepthScaled - armholeRiseY;

    const cp1_1x = shoulderEndX;
    const cp1_1y = shoulderEndY;
    const cp1_2x = midPointX;
    const cp1_2y = midPointY + (shoulderEndY - midPointY) * 0.5;

    points.push(`C ${cp1_1x} ${cp1_1y}, ${cp1_2x} ${cp1_2y}, ${midPointX} ${midPointY}`);

    const ArmholeDendX = offsetX + bustQuarterScaled;
    const ArmholeDendY = newoffsetY + armholeDepthScaled;

    const cp2_1x = midPointX;
    const cp2_1y = midPointY + (ArmholeDendY - midPointY) * 0.8;
    const cp2_2x = ArmholeDendX - (ArmholeDendX - midPointX) * 0.5;
    const cp2_2y = ArmholeDendY;

    points.push(`C ${cp2_1x} ${cp2_1y}, ${cp2_2x} ${cp2_2y}, ${ArmholeDendX} ${ArmholeDendY}`);

    // Side seam to waist
    points.push(`L ${offsetX + bustQuarterScaled} ${newoffsetY + backLengthScaled}`);

    // Waist line back to center
    points.push(`L ${offsetX} ${newoffsetY + backLengthScaled}`);

    points.push(`Z`);

    return points.join(" ");
  };

  return {
    path: buildPath(),
    bustQuarterScaled,
    armholeDepthScaled,
    backLengthScaled,
    ease,
  };
}
