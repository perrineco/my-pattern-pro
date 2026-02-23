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
  renderOverlay?: (pos: BodyPositions) => ReactNode;
  viewBoxHeight?: number;
  className?: string;
}

export function SharedBodyDiagram({ category, renderOverlay, viewBoxHeight, className }: SharedBodyDiagramProps) {
  const pos = getPositions(category);
  const cx = pos.centerX;
  const isMen = category === "men";
  const isKids = category === "kids";
  const isWomen = category === "women" || (!isMen && !isKids);

  const vbWidth = 240;
  const vbHeight = viewBoxHeight ?? (isKids ? 270 : 335);

  // ── shared measurements ──────────────────────────────────────────────
  const neckHalf = isMen ? 10 : isKids ? 7 : 8;
  const headRx = isKids ? 20 : 18;
  const headRy = isKids ? 24 : 23;

  const sw = pos.shoulderWidth / 2; // half-shoulder
  const bw = pos.bustWidth / 2;
  const ww = pos.waistWidth / 2;
  const hw = pos.hipWidth / 2;

  const lsx = pos.leftShoulderX; // left shoulder X
  const rsx = pos.rightShoulderX; // right shoulder X

  // ── Arm geometry ─────────────────────────────────────────────────────
  const armHalf = pos.armWidth / 2;
  const wristHalf = pos.wristWidth / 2;

  // Left arm outer / inner
  const leftArmOuterX = lsx - armHalf;
  const leftArmInnerX = lsx + armHalf;
  const rightArmInnerX = rsx - armHalf;
  const rightArmOuterX = rsx + armHalf;

  // ── Body path ────────────────────────────────────────────────────────
  // Built with cubic bezier curves for smooth organic shape.
  // Path goes clockwise: left shoulder → left side down → legs → right side up.

  let bodyPath = "";

  if (isMen) {
    // Broad shoulders, mild taper to waist, straight hips
    bodyPath = `
      M ${cx - neckHalf} ${pos.neckBaseY}
      C ${cx - neckHalf - 4} ${pos.shoulderY + 4}, ${lsx - 8} ${pos.shoulderY - 2}, ${lsx} ${pos.shoulderY}
      C ${lsx + 4} ${pos.shoulderY + 2}, ${cx - bw + 2} ${pos.bustY - 10}, ${cx - bw} ${pos.bustY}
      C ${cx - bw - 2} ${pos.bustY + 12}, ${cx - ww - 4} ${pos.waistY - 8}, ${cx - ww} ${pos.waistY}
      C ${cx - ww + 2} ${pos.waistY + 10}, ${cx - hw - 2} ${pos.hipY - 8}, ${cx - hw} ${pos.hipY}
      L ${cx - hw + 2} ${pos.hemY}
      C ${cx - hw + 2} ${pos.hemY + 8}, ${cx - 10} ${pos.hemY + 14}, ${cx - 8} ${pos.hemY + 20}
      L ${cx - 6} ${pos.ankleY}
      L ${cx + 6} ${pos.ankleY}
      L ${cx + 8} ${pos.hemY + 20}
      C ${cx + 10} ${pos.hemY + 14}, ${cx + hw - 2} ${pos.hemY + 8}, ${cx + hw - 2} ${pos.hemY}
      L ${cx + hw} ${pos.hipY}
      C ${cx + hw + 2} ${pos.hipY - 8}, ${cx + ww - 2} ${pos.waistY + 10}, ${cx + ww} ${pos.waistY}
      C ${cx + ww + 4} ${pos.waistY - 8}, ${cx + bw + 2} ${pos.bustY + 12}, ${cx + bw} ${pos.bustY}
      C ${cx + bw - 2} ${pos.bustY - 10}, ${rsx - 4} ${pos.shoulderY + 2}, ${rsx} ${pos.shoulderY}
      C ${rsx + 8} ${pos.shoulderY - 2}, ${cx + neckHalf + 4} ${pos.shoulderY + 4}, ${cx + neckHalf} ${pos.neckBaseY}
      C ${cx + neckHalf} ${pos.neckBaseY - 4}, ${cx - neckHalf} ${pos.neckBaseY - 4}, ${cx - neckHalf} ${pos.neckBaseY}
      Z
    `;
  } else if (isKids) {
    // Rounder, softer proportions, straighter silhouette
    bodyPath = `
      M ${cx - neckHalf} ${pos.neckBaseY}
      C ${cx - neckHalf - 3} ${pos.shoulderY + 3}, ${lsx - 4} ${pos.shoulderY}, ${lsx} ${pos.shoulderY}
      C ${lsx + 6} ${pos.shoulderY + 4}, ${cx - bw + 4} ${pos.bustY - 8}, ${cx - bw} ${pos.bustY}
      C ${cx - bw - 2} ${pos.bustY + 10}, ${cx - ww} ${pos.waistY - 6}, ${cx - ww} ${pos.waistY}
      C ${cx - ww} ${pos.waistY + 8}, ${cx - hw + 2} ${pos.hipY - 6}, ${cx - hw} ${pos.hipY}
      L ${cx - hw + 2} ${pos.hemY}
      C ${cx - hw + 2} ${pos.hemY + 6}, ${cx - 9} ${pos.hemY + 10}, ${cx - 7} ${pos.hemY + 16}
      L ${cx - 5} ${pos.ankleY}
      L ${cx + 5} ${pos.ankleY}
      L ${cx + 7} ${pos.hemY + 16}
      C ${cx + 9} ${pos.hemY + 10}, ${cx + hw - 2} ${pos.hemY + 6}, ${cx + hw - 2} ${pos.hemY}
      L ${cx + hw} ${pos.hipY}
      C ${cx + hw - 2} ${pos.hipY - 6}, ${cx + ww} ${pos.waistY + 8}, ${cx + ww} ${pos.waistY}
      C ${cx + ww} ${pos.waistY - 6}, ${cx + bw - 4} ${pos.bustY + 10}, ${cx + bw} ${pos.bustY}
      C ${cx + bw - 4} ${pos.bustY - 8}, ${rsx - 6} ${pos.shoulderY + 4}, ${rsx} ${pos.shoulderY}
      C ${rsx + 4} ${pos.shoulderY}, ${cx + neckHalf + 3} ${pos.shoulderY + 3}, ${cx + neckHalf} ${pos.neckBaseY}
      C ${cx + neckHalf} ${pos.neckBaseY - 4}, ${cx - neckHalf} ${pos.neckBaseY - 4}, ${cx - neckHalf} ${pos.neckBaseY}
      Z
    `;
  } else {
    // Women – defined waist, fuller hips, bust curve
    bodyPath = `
      M ${cx - neckHalf} ${pos.neckBaseY}
      C ${cx - neckHalf - 4} ${pos.shoulderY + 3}, ${lsx - 6} ${pos.shoulderY - 1}, ${lsx} ${pos.shoulderY}
      C ${lsx + 5} ${pos.shoulderY + 3}, ${cx - bw + 6} ${pos.bustY - 14}, ${cx - bw} ${pos.bustY}
      C ${cx - bw - 4} ${pos.bustY + 8}, ${cx - ww - 8} ${pos.waistY - 12}, ${cx - ww} ${pos.waistY}
      C ${cx - ww + 4} ${pos.waistY + 10}, ${cx - hw - 6} ${pos.hipY - 12}, ${cx - hw} ${pos.hipY}
      L ${cx - hw + 2} ${pos.hemY}
      C ${cx - hw + 2} ${pos.hemY + 8}, ${cx - 10} ${pos.hemY + 14}, ${cx - 8} ${pos.hemY + 20}
      L ${cx - 6} ${pos.ankleY}
      L ${cx + 6} ${pos.ankleY}
      L ${cx + 8} ${pos.hemY + 20}
      C ${cx + 10} ${pos.hemY + 14}, ${cx + hw - 2} ${pos.hemY + 8}, ${cx + hw - 2} ${pos.hemY}
      L ${cx + hw} ${pos.hipY}
      C ${cx + hw + 6} ${pos.hipY - 12}, ${cx + ww - 4} ${pos.waistY + 10}, ${cx + ww} ${pos.waistY}
      C ${cx + ww + 8} ${pos.waistY - 12}, ${cx + bw + 4} ${pos.bustY + 8}, ${cx + bw} ${pos.bustY}
      C ${cx + bw - 6} ${pos.bustY - 14}, ${rsx - 5} ${pos.shoulderY + 3}, ${rsx} ${pos.shoulderY}
      C ${rsx + 6} ${pos.shoulderY - 1}, ${cx + neckHalf + 4} ${pos.shoulderY + 3}, ${cx + neckHalf} ${pos.neckBaseY}
      C ${cx + neckHalf} ${pos.neckBaseY - 4}, ${cx - neckHalf} ${pos.neckBaseY - 4}, ${cx - neckHalf} ${pos.neckBaseY}
      Z
    `;
  }

  // ── Arm paths ────────────────────────────────────────────────────────
  // Each arm is a filled shape for a more realistic look

  // LEFT ARM
  // Outer edge curves slightly outward at elbow
  const leftElbowOuter = leftArmOuterX - (isMen ? 4 : isKids ? 2 : 3);
  const leftElbowInner = leftArmInnerX + 1;
  const leftWristOuter = lsx - wristHalf - 1;
  const leftWristInner = lsx + wristHalf - 1;

  const leftArmPath = `
    M ${leftArmOuterX} ${pos.shoulderY}
    C ${leftArmOuterX - 2} ${pos.underarmY + 10}, ${leftElbowOuter} ${pos.elbowY - 15}, ${leftElbowOuter} ${pos.elbowY}
    C ${leftElbowOuter + 1} ${pos.elbowY + 20}, ${leftWristOuter} ${pos.wristY - 10}, ${leftWristOuter} ${pos.wristY}
    C ${lsx - wristHalf} ${pos.wristY + 8}, ${lsx + wristHalf} ${pos.wristY + 8}, ${leftWristInner} ${pos.wristY}
    C ${leftWristInner} ${pos.wristY - 10}, ${leftElbowInner} ${pos.elbowY + 20}, ${leftElbowInner} ${pos.elbowY}
    C ${leftElbowInner} ${pos.elbowY - 10}, ${leftArmInnerX} ${pos.underarmY + 8}, ${leftArmInnerX} ${pos.underarmY}
    Z
  `;

  // RIGHT ARM (mirror)
  const rightElbowOuter = rightArmOuterX + (isMen ? 4 : isKids ? 2 : 3);
  const rightElbowInner = rightArmInnerX - 1;
  const rightWristOuter = rsx + wristHalf + 1;
  const rightWristInner = rsx - wristHalf + 1;

  const rightArmPath = `
    M ${rightArmOuterX} ${pos.shoulderY}
    C ${rightArmOuterX + 2} ${pos.underarmY + 10}, ${rightElbowOuter} ${pos.elbowY - 15}, ${rightElbowOuter} ${pos.elbowY}
    C ${rightElbowOuter - 1} ${pos.elbowY + 20}, ${rightWristOuter} ${pos.wristY - 10}, ${rightWristOuter} ${pos.wristY}
    C ${rsx + wristHalf} ${pos.wristY + 8}, ${rsx - wristHalf} ${pos.wristY + 8}, ${rightWristInner} ${pos.wristY}
    C ${rightWristInner} ${pos.wristY - 10}, ${rightElbowInner} ${pos.elbowY + 20}, ${rightElbowInner} ${pos.elbowY}
    C ${rightElbowInner} ${pos.elbowY - 10}, ${rightArmInnerX} ${pos.underarmY + 8}, ${rightArmInnerX} ${pos.underarmY}
    Z
  `;

  // ── Neck path ────────────────────────────────────────────────────────
  // A gentle trapezoid with rounded top connecting head to shoulders
  const neckTopHalf = neckHalf - (isKids ? 1 : 2);
  const neckPath = `
    M ${cx - neckTopHalf} ${pos.headCenterY + (isKids ? headRy - 4 : headRy - 2)}
    C ${cx - neckTopHalf} ${pos.neckBaseY - 6}, ${cx - neckHalf} ${pos.neckBaseY - 4}, ${cx - neckHalf} ${pos.neckBaseY}
    L ${cx + neckHalf} ${pos.neckBaseY}
    C ${cx + neckHalf} ${pos.neckBaseY - 4}, ${cx + neckTopHalf} ${pos.neckBaseY - 6}, ${cx + neckTopHalf} ${pos.headCenterY + (isKids ? headRy - 4 : headRy - 2)}
    Z
  `;

  // Unique gradient IDs per render (category-based)
  const gradId = `bodyGrad-${category}`;
  const armGradId = `armGrad-${category}`;
  const shadowId = `bodyShadow-${category}`;

  return (
    <svg
      viewBox={`0 0 ${vbWidth} ${vbHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Main body gradient – subtle warm skin tone */}
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e8c9a8" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#f2d9bc" />
          <stop offset="100%" stopColor="#e0b896" stopOpacity="0.95" />
        </linearGradient>

        {/* Arm gradient */}
        <linearGradient id={armGradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e0b896" stopOpacity="0.92" />
          <stop offset="50%" stopColor="#eed4b2" />
          <stop offset="100%" stopColor="#d9a882" stopOpacity="0.9" />
        </linearGradient>

        {/* Soft shadow filter */}
        <filter id={shadowId} x="-10%" y="-5%" width="120%" height="115%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#00000022" />
        </filter>
      </defs>

      {/* ── Arms (behind body) ── */}
      <path d={leftArmPath} fill={`url(#${armGradId})`} stroke="#c49070" strokeWidth="0.8" strokeLinejoin="round" />
      <path d={rightArmPath} fill={`url(#${armGradId})`} stroke="#c49070" strokeWidth="0.8" strokeLinejoin="round" />

      {/* Elbow highlight lines */}
      <path
        d={`M ${leftElbowOuter + 2} ${pos.elbowY - 4} Q ${(leftElbowOuter + leftElbowInner) / 2} ${pos.elbowY + 4} ${leftElbowInner - 1} ${pos.elbowY - 4}`}
        fill="none"
        stroke="#c49070"
        strokeWidth="0.6"
        strokeOpacity="0.5"
      />
      <path
        d={`M ${rightElbowInner + 1} ${pos.elbowY - 4} Q ${(rightElbowOuter + rightElbowInner) / 2} ${pos.elbowY + 4} ${rightElbowOuter - 2} ${pos.elbowY - 4}`}
        fill="none"
        stroke="#c49070"
        strokeWidth="0.6"
        strokeOpacity="0.5"
      />

      {/* ── Body ── */}
      <path
        d={bodyPath}
        fill={`url(#${gradId})`}
        stroke="#b8845a"
        strokeWidth="1"
        strokeLinejoin="round"
        filter={`url(#${shadowId})`}
      />

      {/* Body centerline (subtle) */}
      <line
        x1={cx}
        y1={pos.neckBaseY + 4}
        x2={cx}
        y2={pos.hemY - 4}
        stroke="#c49070"
        strokeWidth="0.5"
        strokeOpacity="0.35"
        strokeDasharray="3,4"
      />

      {/* Women: bust curve suggestion */}
      {isWomen && (
        <>
          <path
            d={`M ${cx - bw + 6} ${pos.bustY - 4} Q ${cx - bw / 2} ${pos.bustY + 10} ${cx - 2} ${pos.bustY + 4}`}
            fill="none"
            stroke="#c49070"
            strokeWidth="0.7"
            strokeOpacity="0.4"
          />
          <path
            d={`M ${cx + 2} ${pos.bustY + 4} Q ${cx + bw / 2} ${pos.bustY + 10} ${cx + bw - 6} ${pos.bustY - 4}`}
            fill="none"
            stroke="#c49070"
            strokeWidth="0.7"
            strokeOpacity="0.4"
          />
        </>
      )}

      {/* ── Neck ── */}
      <path d={neckPath} fill={`url(#${gradId})`} stroke="#b8845a" strokeWidth="0.8" strokeLinejoin="round" />

      {/* ── Head ── */}
      <ellipse
        cx={cx}
        cy={pos.headCenterY}
        rx={headRx}
        ry={headRy}
        fill={`url(#${gradId})`}
        stroke="#b8845a"
        strokeWidth="0.9"
        filter={`url(#${shadowId})`}
      />

      {/* Subtle ear marks */}
      <ellipse
        cx={cx - headRx + 1}
        cy={pos.headCenterY + 3}
        rx={2.5}
        ry={4}
        fill="#e0b896"
        stroke="#b8845a"
        strokeWidth="0.6"
      />
      <ellipse
        cx={cx + headRx - 1}
        cy={pos.headCenterY + 3}
        rx={2.5}
        ry={4}
        fill="#e0b896"
        stroke="#b8845a"
        strokeWidth="0.6"
      />

      {/* ── Leg separation (inner seam) ── */}
      <path
        d={`M ${cx} ${pos.hipY + (isKids ? 8 : 12)} L ${cx - (isKids ? 4 : 6)} ${pos.ankleY}`}
        stroke="#b8845a"
        strokeWidth="0.7"
        strokeOpacity="0.5"
        fill="none"
      />
      <path
        d={`M ${cx} ${pos.hipY + (isKids ? 8 : 12)} L ${cx + (isKids ? 4 : 6)} ${pos.ankleY}`}
        stroke="#b8845a"
        strokeWidth="0.7"
        strokeOpacity="0.5"
        fill="none"
      />

      {/* ── Feet ── */}
      <ellipse
        cx={cx - (isKids ? 5 : 7)}
        cy={pos.ankleY + (isKids ? 5 : 6)}
        rx={isKids ? 6 : 8}
        ry={isKids ? 3 : 4}
        fill="#e0b896"
        stroke="#b8845a"
        strokeWidth="0.7"
      />
      <ellipse
        cx={cx + (isKids ? 5 : 7)}
        cy={pos.ankleY + (isKids ? 5 : 6)}
        rx={isKids ? 6 : 8}
        ry={isKids ? 3 : 4}
        fill="#e0b896"
        stroke="#b8845a"
        strokeWidth="0.7"
      />

      {/* ── Measurement overlay ── */}
      {renderOverlay?.(pos)}
    </svg>
  );
}

export { getPositions };
