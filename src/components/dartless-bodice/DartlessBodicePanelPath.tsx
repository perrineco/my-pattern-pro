import { BodiceMeasurements, Category } from "@/types/sloper";

interface DartlessBodicePanelPathProps {
  measurements: BodiceMeasurements;
  offsetX: number;
  offsetY: number;
  scale: number;
  offsetYDiff?: number;
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
    neckWidthAdd: -0.5,
    frontNeckDepthDivisor: 5,
    frontNeckDepthAdd: 0,
    backNeckDepthDivisor: 20,
    backNeckDepthAdd: 0,
    shoulderAngle: 20,
    armholeDepthRatio: 0.48,
    midpointFrontAdd: 0,
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
    extraDropFront: 2.75,
    frontShoulderAdd: 0.5,
    backShoulderAdd: 0,
  },
};

export function useDartlessBodicePath({
  measurements,
  offsetX,
  offsetY,
  scale,
  offsetYDiff = 0,
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
  const backNeckDepthBase = neckCircumference / config.backNeckDepthDivisor + config.backNeckDepthAdd;
  const neckHalfHeight = panel === "front" 
  ? frontNeckDepthBase * scale 
  : backNeckDepthBase * scale;

  const shoulderLengthScaled = shoulderLength * scale;
  const angleRadBack = Math.atan2(config.riseBack, backWidth / 2 + config.midpointBackAdd - neckHalfWidth / scale);
  const angleRadFront = Math.atan2(
    config.extraDropFront,
    backWidth / 2 + config.midpointFrontAdd - neckHalfWidth / scale,
  );

const L_back = shoulderLength + config.backShoulderAdd;
const L_front = L_back + config.frontShoulderAdd;

  // Dos — identique femme/enfants/hommes
const shoulderSlopeYBack = category === "women"
  ? s(backNeckDepthBase + 2.5)
  : category === "men"
  ? s(backNeckDepthBase + armholeDepth / 8 - 0.55)
  : s(Math.sin(angleRadBack) * L_back);

// Devant — sin 25° × L_front pour femme, formule angulaire pour les autres
const shoulderSlopeYFront = category === "women"
  ? s(Math.sin(25 * Math.PI / 180) * L_front)
  : category === "men"
  ? s(backNeckDepthBase + armholeDepth / 8 - 0.55)
  : s(Math.sin(angleRadFront) * L_front);

const shoulderSlopeY = panel === "back" ? shoulderSlopeYBack : shoulderSlopeYFront;

// shoulderWidthX — Pythagore pour femme (hyp = shoulderLength - 1.5), trigonométrie pour les autres
const shoulderWidthX = category === "women"
  ? panel === "back"
    ? s(Math.sqrt(Math.max(0, (shoulderLength - 1.5) ** 2 - (backNeckDepthBase + 2.5) ** 2)))
    : s(Math.sqrt(Math.max(0, (shoulderLength - 1.5) ** 2 - (Math.sin(25 * Math.PI / 180) * L_front) ** 2)))
  : category === "men"
  ? s(backWidth / 2 + 1.6 - neckHalfWidth / scale)
  : panel === "back"
    ? s(Math.cos(angleRadBack) * L_back)
    : s(Math.cos(angleRadFront) * L_front);
    
const bustQuarterScaled = (bustQuarter + ease) * scale;
const backLengthScaled =
    panel === "front" 
      ? s(backLength + frontNeckDepthBase - backNeckDepthBase)
    : s(backLength);
  // const armholeDepthScaled = backLengthScaled / 2 + neckHalfHeight - shoulderSlopeY - s(backLength / 6);
const armholeDepthScaled = backLengthScaled / 6;
const armholeRetreatX = s(bust / 4 + ease - backWidth / 2 - config.midpointFrontAdd);
const waistAbsY = offsetY + backLengthScaled;
  const midPointX =offsetX + bustQuarterScaled - armholeRetreatX;
  const midPointY =
    category === "kids"
      ? panel === "front" 
        ? offsetY+ s(frontNeckDepthBase) + backLengthScaled / 2 - backLengthScaled / 6  - shoulderSlopeY
        : offsetY + backLengthScaled / 2 + s(backNeckDepthBase)- backLengthScaled / 6 + backNeckDepthBase * scale - shoulderSlopeY
    : category === "women"
      ? panel === "front"
        ? offsetY + s(frontNeckDepthBase) + backNeckDepthBase * scale+ s(backLength) / 2 - s(backLength) / 6 - shoulderSlopeYBack
      : offsetY + backLengthScaled / 2 + s(backNeckDepthBase) - backLengthScaled / 6 + backNeckDepthBase * scale - shoulderSlopeYBack
    : category === "men"
      ? panel === "front"
        ? offsetY + s(frontNeckDepthBase) + backNeckDepthBase * scale+ s(backLength) / 2 - s(backLength) / 6 - shoulderSlopeYBack
      : offsetY + backLengthScaled / 2 + s(backNeckDepthBase) - backLengthScaled / 6 + backNeckDepthBase * scale - shoulderSlopeYBack
      : offsetY + backLengthScaled / 2 + s(backNeckDepthBase) - backLengthScaled / 6 + backNeckDepthBase * scale - shoulderSlopeYBack
console.log('panel:', panel,'scale:', scale, 'neckCircumference:', neckCircumference, 'shoulderSlopeY:', shoulderSlopeY, 'midPointY:', midPointY, 'backLengthScaled:', backLengthScaled, 'backNeckDepthBase:', backNeckDepthBase, 'frontNeckDepthBase:', frontNeckDepthBase, 's(backLength):', s(backLength), 'frontNeckDepthBase:', frontNeckDepthBase);

const neckTopY = category === "men"
  ? panel === "front"
    ? offsetY + s(frontNeckDepthBase) + 2*s(backNeckDepthBase)
    : offsetY 
  : panel === "front"
    ? offsetY + s(frontNeckDepthBase)
    : offsetY;

const buildPath = () => {
    const points: string[] = [];

    // Start at neck center
  

    points.push(`M ${offsetX} ${neckTopY}`);

    // Neck curve to shoulder
    const cp1x = offsetX + neckHalfWidth * 0.65;
    const cp1y = neckTopY;
    const cp2x = offsetX + neckHalfWidth * 0.85;
    const cp2y = neckTopY - neckHalfHeight * 0.5;
    const endX = offsetX + neckHalfWidth;
    const endY = neckTopY - neckHalfHeight;

    points.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`);

    // Shoulder line
    const neckEndX = offsetX + neckHalfWidth;
    const neckEndY = neckTopY - neckHalfHeight;
    const shoulderEndX = neckEndX + shoulderWidthX;
    const shoulderEndY = neckEndY + shoulderSlopeY;
    points.push(`L ${shoulderEndX} ${shoulderEndY}`);

    // Armhole curve
    const armholeRiseY = s(backLength / 6);

    const cp1_1x = shoulderEndX;
    const cp1_1y = shoulderEndY;
    const cp1_2x = midPointX;
    const cp1_2y = midPointY + (shoulderEndY - midPointY) * 0.5;

    points.push(`C ${cp1_1x} ${cp1_1y}, ${cp1_2x} ${cp1_2y}, ${midPointX} ${midPointY}`);

    const ArmholeDendX = offsetX + bustQuarterScaled; //a revoir for kids
    const ArmholeDendY =  midPointY + s(backLength) / 6;

    const cp2_1x = midPointX;
    const cp2_1y = midPointY + (ArmholeDendY - midPointY) * 0.8;
    const cp2_2x = ArmholeDendX - (ArmholeDendX - midPointX) * 0.5;
    const cp2_2y = ArmholeDendY;

    points.push(`C ${cp2_1x} ${cp2_1y}, ${cp2_2x} ${cp2_2y}, ${ArmholeDendX} ${ArmholeDendY}`);

    // Side seam to waist
    points.push(`L ${offsetX + bustQuarterScaled} ${offsetY + backLengthScaled}`);

    // Waist line back to center
    points.push(`L ${offsetX} ${offsetY + backLengthScaled}`);

    points.push(`Z`);

    return points.join(" ");
  };

  // Side seam: straight run from the armhole curve's end down to the waist line
  const sideSeamTopY = offsetY + backLengthScaled - s(backLength) / 2;
  const sideSeamBottomY = offsetY + backLengthScaled;
  const sideSeamLengthScaled = sideSeamBottomY - sideSeamTopY;

  // Shoulder line: from neckline/shoulder corner to armhole/shoulder corner
  const neckEndX = offsetX + neckHalfWidth;
  const neckEndY = neckTopY - neckHalfHeight;
  const shoulderEndX = neckEndX + shoulderWidthX;
  const shoulderEndY = neckEndY + shoulderSlopeY;

  // Front bodice height: back length, minus the front neck depth, plus the (shallower) back neck depth
  const frontBodiceHeight = backLength - frontNeckDepthBase + backNeckDepthBase;

  return {
    path: buildPath(),
    bustQuarterScaled,
    armholeDepthScaled,
    backLengthScaled,
    ease,
    neckHalfWidth,
    neckHalfHeight,
    neckTopY,
    midPointX,
    midPointY,
    sideSeamTopY,
    sideSeamBottomY,
    sideSeamLengthScaled,
    shoulderWidthX,
    shoulderSlopeY,
    neckEndX,
    neckEndY,
    shoulderEndX,
    shoulderEndY,
    frontBodiceHeight,
  };
}
