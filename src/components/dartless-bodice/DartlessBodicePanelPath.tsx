import { BodiceMeasurements } from "@/types/sloper";

interface DartlessBodicePanelPathProps {
  measurements: BodiceMeasurements;
  offsetX: number;
  offsetY: number;
  scale: number;
  panel: "front" | "back";
}

export function useDartlessBodicePath({ measurements, offsetX, offsetY, scale, panel }: DartlessBodicePanelPathProps) {
  const { bust, neckCircumference, shoulderLength, backWidth, backLength } = measurements;

  const ease = 2;
  const armholeDepth = backLength * 0.5;
  const bustQuarter = bust / 4;

  const s = (v: number) => v * scale;

  const neckHalfWidth = (neckCircumference / 6 + 1.6) * scale;
  // Back neckline is shallower than front
  const neckHalfHeight = panel === "front" ? (neckCircumference / 6 + 2) * scale : (neckCircumference / 16) * scale;
  const shoulderLengthScaled = shoulderLength * scale;
  const angleRad = (25 * Math.PI) / 180;
  const shoulderSlopeY = panel === "front" ? Math.sin(angleRad) * shoulderLengthScaled : neckHalfHeight + 2.5;
  const shoulderWidthX = Math.sqrt(
    (shoulderLengthScaled - 1.5) * (shoulderLengthScaled - 1.5) - shoulderSlopeY * shoulderSlopeY,
  );
  const bustQuarterScaled = (bustQuarter + ease) * scale;
  const backLengthScaled =
    panel === "front" ? s(backLength) + neckCircumference / 12 - (neckCircumference / 6 + 2) * scale : s(backLength);
  const armholeDepthScaled = backLengthScaled / 2 + neckHalfHeight - shoulderSlopeY - s(backLength / 6);

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

    // Side seam to waist
    points.push(`L ${offsetX + bustQuarterScaled} ${offsetY + backLengthScaled}`);

    // Waist line back to center
    points.push(`L ${offsetX} ${offsetY + backLengthScaled}`);

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
