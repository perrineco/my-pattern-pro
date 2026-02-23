import { ReactNode } from "react";
import { Category } from "@/types/sloper";

export interface BodyPositions {
  centerX: number;
  headCenterY: number;
  neckBaseY: number;
  shoulderY: number;
  bustY: number;
  backWidthY: number;
  waistY: number;
  hipY: number;
  hemY: number;
  ankleY: number;
  shoulderWidth: number;
  bustWidth: number;
  waistWidth: number;
  hipWidth: number;
  // Arm positions
  underarmY: number;
  elbowY: number;
  wristY: number;
  armWidth: number;
  wristWidth: number;
  // Shoulder endpoints (left/right)
  leftShoulderX: number;
  rightShoulderX: number;
}

function getPositions(category: Category): BodyPositions {
  const centerX = 120;

  if (category === "kids") {
    return {
      centerX,
      headCenterY: 28,
      neckBaseY: 58,
      shoulderY: 55,
      bustY: 90,
      backWidthY: 75,
      waistY: 115,
      hipY: 140,
      hemY: 210,
      ankleY: 240,
      shoulderWidth: 60,
      bustWidth: 54,
      waistWidth: 50,
      hipWidth: 54,
      underarmY: 80,
      elbowY: 145,
      wristY: 210,
      armWidth: 16,
      wristWidth: 12,
      leftShoulderX: centerX - 30,
      rightShoulderX: centerX + 30,
    };
  }

  if (category === "men") {
    return {
      centerX,
      headCenterY: 25,
      neckBaseY: 58,
      shoulderY: 52,
      bustY: 100,
      backWidthY: 78,
      waistY: 150,
      hipY: 180,
      hemY: 280,
      ankleY: 310,
      shoulderWidth: 100,
      bustWidth: 90,
      waistWidth: 78,
      hipWidth: 76,
      underarmY: 85,
      elbowY: 170,
      wristY: 260,
      armWidth: 26,
      wristWidth: 18,
      leftShoulderX: centerX - 50,
      rightShoulderX: centerX + 50,
    };
  }

  // Women
  return {
    centerX,
    headCenterY: 25,
    neckBaseY: 58,
    shoulderY: 53,
    bustY: 105,
    backWidthY: 80,
    waistY: 150,
    hipY: 182,
    hemY: 280,
    ankleY: 310,
    shoulderWidth: 80,
    bustWidth: 82,
    waistWidth: 56,
    hipWidth: 86,
    underarmY: 85,
    elbowY: 168,
    wristY: 255,
    armWidth: 22,
    wristWidth: 14,
    leftShoulderX: centerX - 40,
    rightShoulderX: centerX + 40,
  };
}

interface SharedBodyDiagramProps {
  category: Category;
  /** Render measurement overlay lines. Receives body positions so you can place markers accurately. */
  renderOverlay?: (pos: BodyPositions) => ReactNode;
  /** SVG viewBox height override. Default auto-calculated. */
  viewBoxHeight?: number;
  className?: string;
}

export function SharedBodyDiagram({ category, renderOverlay, viewBoxHeight, className }: SharedBodyDiagramProps) {
  const pos = getPositions(category);
  const cx = pos.centerX;
  const isMen = category === "men";
  const isKids = category === "kids";

  const vbWidth = 240;
  const vbHeight = viewBoxHeight ?? (isKids ? 260 : 330);

  // Neck width
  const neckHalf = isMen ? 10 : isKids ? 7 : 8;

  // Head proportions
  const headRx = isKids ? 20 : 18;
  const headRy = isKids ? 22 : 22;

  return (
    <svg
      viewBox={`0 0 ${vbWidth} ${vbHeight}`}
      className={className ?? "w-full max-w-[220px] h-auto"}
    >
      {/* Head */}
      <ellipse
        cx={cx}
        cy={pos.headCenterY}
        rx={headRx}
        ry={headRy}
        fill="none"
        stroke="hsl(var(--border))"
        strokeWidth="2"
      />

      {/* Neck */}
      <path
        d={`M ${cx - neckHalf} ${pos.headCenterY + headRy - 2} L ${cx - neckHalf} ${pos.neckBaseY}
            M ${cx + neckHalf} ${pos.headCenterY + headRy - 2} L ${cx + neckHalf} ${pos.neckBaseY}`}
        stroke="hsl(var(--border))"
        strokeWidth="2"
        fill="none"
      />

      {/* Body outline */}
      {isMen ? (
        <path
          d={`
            M ${pos.leftShoulderX} ${pos.shoulderY}
            L ${cx - neckHalf} ${pos.neckBaseY}
            Q ${cx} ${pos.neckBaseY - 4} ${cx + neckHalf} ${pos.neckBaseY}
            L ${pos.rightShoulderX} ${pos.shoulderY}
            Q ${cx + pos.bustWidth / 2 + 3} ${(pos.shoulderY + pos.bustY) / 2} ${cx + pos.bustWidth / 2} ${pos.bustY}
            Q ${cx + pos.waistWidth / 2 + 3} ${(pos.bustY + pos.waistY) / 2} ${cx + pos.waistWidth / 2} ${pos.waistY}
            Q ${cx + pos.hipWidth / 2 + 2} ${(pos.waistY + pos.hipY) / 2} ${cx + pos.hipWidth / 2} ${pos.hipY}
            L ${cx + 15} ${pos.ankleY}
            M ${cx - 15} ${pos.ankleY}
            L ${cx - pos.hipWidth / 2} ${pos.hipY}
            Q ${cx - pos.hipWidth / 2 - 2} ${(pos.waistY + pos.hipY) / 2} ${cx - pos.waistWidth / 2} ${pos.waistY}
            Q ${cx - pos.waistWidth / 2 - 3} ${(pos.bustY + pos.waistY) / 2} ${cx - pos.bustWidth / 2} ${pos.bustY}
            Q ${cx - pos.bustWidth / 2 - 3} ${(pos.shoulderY + pos.bustY) / 2} ${pos.leftShoulderX} ${pos.shoulderY}
          `}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="2"
        />
      ) : isKids ? (
        <path
          d={`
            M ${pos.leftShoulderX} ${pos.shoulderY}
            L ${cx - neckHalf} ${pos.neckBaseY}
            Q ${cx} ${pos.neckBaseY - 3} ${cx + neckHalf} ${pos.neckBaseY}
            L ${pos.rightShoulderX} ${pos.shoulderY}
            Q ${cx + pos.bustWidth / 2 + 2} ${(pos.shoulderY + pos.bustY) / 2} ${cx + pos.bustWidth / 2} ${pos.bustY}
            Q ${cx + pos.waistWidth / 2 + 2} ${(pos.bustY + pos.waistY) / 2} ${cx + pos.waistWidth / 2} ${pos.waistY}
            Q ${cx + pos.hipWidth / 2 + 1} ${(pos.waistY + pos.hipY) / 2} ${cx + pos.hipWidth / 2} ${pos.hipY}
            L ${cx + 12} ${pos.ankleY}
            M ${cx - 12} ${pos.ankleY}
            L ${cx - pos.hipWidth / 2} ${pos.hipY}
            Q ${cx - pos.hipWidth / 2 - 1} ${(pos.waistY + pos.hipY) / 2} ${cx - pos.waistWidth / 2} ${pos.waistY}
            Q ${cx - pos.waistWidth / 2 - 2} ${(pos.bustY + pos.waistY) / 2} ${cx - pos.bustWidth / 2} ${pos.bustY}
            Q ${cx - pos.bustWidth / 2 - 2} ${(pos.shoulderY + pos.bustY) / 2} ${pos.leftShoulderX} ${pos.shoulderY}
          `}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="2"
        />
      ) : (
        /* Women - defined waist, wider hips, bust curve */
        <path
          d={`
            M ${pos.leftShoulderX} ${pos.shoulderY}
            L ${cx - neckHalf} ${pos.neckBaseY}
            Q ${cx} ${pos.neckBaseY - 4} ${cx + neckHalf} ${pos.neckBaseY}
            L ${pos.rightShoulderX} ${pos.shoulderY}
            Q ${cx + pos.bustWidth / 2 + 6} ${(pos.shoulderY + pos.bustY) / 2} ${cx + pos.bustWidth / 2} ${pos.bustY}
            Q ${cx + pos.waistWidth / 2 - 2} ${(pos.bustY + pos.waistY) / 2} ${cx + pos.waistWidth / 2} ${pos.waistY}
            Q ${cx + pos.hipWidth / 2 + 5} ${(pos.waistY + pos.hipY) / 2} ${cx + pos.hipWidth / 2} ${pos.hipY}
            L ${cx + 14} ${pos.ankleY}
            M ${cx - 14} ${pos.ankleY}
            L ${cx - pos.hipWidth / 2} ${pos.hipY}
            Q ${cx - pos.hipWidth / 2 - 5} ${(pos.waistY + pos.hipY) / 2} ${cx - pos.waistWidth / 2} ${pos.waistY}
            Q ${cx - pos.waistWidth / 2 + 2} ${(pos.bustY + pos.waistY) / 2} ${cx - pos.bustWidth / 2} ${pos.bustY}
            Q ${cx - pos.bustWidth / 2 - 6} ${(pos.shoulderY + pos.bustY) / 2} ${pos.leftShoulderX} ${pos.shoulderY}
          `}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="2"
        />
      )}

      {/* Arms */}
      {/* Left arm */}
      <path
        d={`
          M ${pos.leftShoulderX} ${pos.shoulderY}
          Q ${pos.leftShoulderX - 12} ${pos.underarmY} ${pos.leftShoulderX - 8} ${pos.elbowY}
          Q ${pos.leftShoulderX - 10} ${(pos.elbowY + pos.wristY) / 2} ${pos.leftShoulderX - 5} ${pos.wristY}
        `}
        stroke="hsl(var(--border))"
        strokeWidth="2"
        fill="none"
      />
      {/* Left arm inner edge */}
      <path
        d={`
          M ${pos.leftShoulderX + pos.armWidth / 2} ${pos.underarmY + 5}
          Q ${pos.leftShoulderX - 2} ${(pos.underarmY + pos.elbowY) / 2} ${pos.leftShoulderX - 8 + pos.armWidth} ${pos.elbowY}
          Q ${pos.leftShoulderX - 5} ${(pos.elbowY + pos.wristY) / 2} ${pos.leftShoulderX - 5 + pos.wristWidth} ${pos.wristY}
        `}
        stroke="hsl(var(--border))"
        strokeWidth="1.5"
        fill="none"
      />

      {/* Right arm */}
      <path
        d={`
          M ${pos.rightShoulderX} ${pos.shoulderY}
          Q ${pos.rightShoulderX + 12} ${pos.underarmY} ${pos.rightShoulderX + 8} ${pos.elbowY}
          Q ${pos.rightShoulderX + 10} ${(pos.elbowY + pos.wristY) / 2} ${pos.rightShoulderX + 5} ${pos.wristY}
        `}
        stroke="hsl(var(--border))"
        strokeWidth="2"
        fill="none"
      />
      {/* Right arm inner edge */}
      <path
        d={`
          M ${pos.rightShoulderX - pos.armWidth / 2} ${pos.underarmY + 5}
          Q ${pos.rightShoulderX + 2} ${(pos.underarmY + pos.elbowY) / 2} ${pos.rightShoulderX + 8 - pos.armWidth} ${pos.elbowY}
          Q ${pos.rightShoulderX + 5} ${(pos.elbowY + pos.wristY) / 2} ${pos.rightShoulderX + 5 - pos.wristWidth} ${pos.wristY}
        `}
        stroke="hsl(var(--border))"
        strokeWidth="1.5"
        fill="none"
      />

      {/* Hands (small ellipses) */}
      <ellipse
        cx={pos.leftShoulderX - 5 + pos.wristWidth / 2}
        cy={pos.wristY + 8}
        rx={pos.wristWidth / 2 + 2}
        ry={6}
        fill="none"
        stroke="hsl(var(--border))"
        strokeWidth="1.5"
      />
      <ellipse
        cx={pos.rightShoulderX + 5 - pos.wristWidth / 2}
        cy={pos.wristY + 8}
        rx={pos.wristWidth / 2 + 2}
        ry={6}
        fill="none"
        stroke="hsl(var(--border))"
        strokeWidth="1.5"
      />

      {/* Inner leg separation line */}
      <line
        x1={cx}
        y1={pos.hipY + 15}
        x2={cx}
        y2={pos.ankleY}
        stroke="hsl(var(--border))"
        strokeWidth="1.5"
      />

      {/* Measurement overlay */}
      {renderOverlay?.(pos)}
    </svg>
  );
}

export { getPositions };
