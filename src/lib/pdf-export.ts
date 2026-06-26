import jsPDF from 'jspdf';
import { SkirtMeasurements, BodiceMeasurements, SleeveMeasurements, PantsMeasurements, Category } from '@/types/sloper';
import { MeasurementUnit, cmToInches } from '@/components/UnitToggle';
import { Language } from '@/contexts/LanguageContext';

// PDF string translations
const pdfT = {
  pageOf: { en: (n: number, t: number) => `Page ${n} of ${t}`, fr: (n: number, t: number) => `Page ${n} sur ${t}` },
  rowCol: { en: (r: number, c: number) => `(Row ${r}, Col ${c})`, fr: (r: number, c: number) => `(Rangée ${r}, Col ${c})` },
  cutOnFold: { en: 'Cut on fold', fr: 'Couper sur le pli' },
  front: { en: 'FRONT', fr: 'DEVANT' },
  back: { en: 'BACK', fr: 'DOS' },
  cut1OnFold: { en: 'Cut 1 on fold', fr: 'Couper 1 sur le pli' },
  cut2: { en: 'Cut 2', fr: 'Couper 2' },
  sleeve: { en: 'SLEEVE', fr: 'MANCHE' },
  quarterWaistDart: { en: '¼ waist + dart', fr: '¼ taille + pince' },
  length: { en: 'Length', fr: 'Longueur' },
  quarterHip: { en: '¼ hip', fr: '¼ hanches' },
  quarterBust: { en: '¼ bust', fr: '¼ poitrine' },
  backLength: { en: 'Back length', fr: 'Longueur dos' },
  halfUpperArm: { en: '½ upper arm', fr: '½ bras' },
  halfWrist: { en: '½ wrist', fr: '½ poignet' },
  capHeight: { en: 'Cap height', fr: 'Hauteur tête' },
  testSquare: { en: '1cm test', fr: 'Test 1cm' },
  assemblyTitle: { en: 'Assembly Instructions', fr: "Instructions d'assemblage" },
  singlePanel: { en: 'Single Panel (Cut 2)', fr: 'Panneau unique (Couper 2)' },
  frontBackPanels: { en: 'Front & Back Panels', fr: 'Panneaux devant et dos' },
  instructions: {
    en: [
      '1. Print all pages at 100% scale (no scaling/fit to page).',
      '2. Verify the 1cm test square on the first page measures exactly 1cm x 1cm.',
      '3. Cut along the right and top edges of each page only (keep the left and bottom margins for taping pages together).',
      '4. Match up the alignment marks and circles from adjacent pages.',
      '5. Tape or glue pages together, starting from the top-left corner.',
      '6. Once assembled, cut out the pattern piece along the solid black line.',
      '7. This pattern is a basic block with no seam allowances.',
    ],
    fr: [
      "1. Imprimez toutes les pages à 100% (sans mise à l'échelle).",
      '2. Vérifiez que le carré test de 1cm mesure exactement 1cm x 1cm.',
      "3. Découpez le bord droit et le bord supérieur de chaque feuille uniquement (conserver les marges gauche et bas pour coller les feuilles ensemble).",
      '4. Alignez les repères et cercles des pages adjacentes.',
      '5. Collez ou scotchez les pages en commençant par le coin supérieur gauche.',
      '6. Une fois assemblé, découpez le patron le long du trait plein noir.',
      '7. Ce patron est un bloc de base sans marges de couture.',
    ],
  },
  patternLabel: { en: 'Pattern', fr: 'Patron' },
  basicBlock: { en: 'basic block', fr: 'patron de base' },
  dart: { en: 'dart', fr: 'pince' },
  outseam: { en: 'Outseam', fr: 'Longueur côté' },
  inseamWarning: { en: '⚠ Front/back inseam mismatch', fr: '⚠ Entrejambe avant/dos différent' },
  patternTypes: {
    en: { skirt: 'Skirt', bodice: 'Bodice', 'bodice-dartless': 'Dartless Bodice', 'bodice-with-darts': 'Bodice with Darts', 'bodice-knit': 'Knit Bodice', dress: 'Dress', sleeve: 'Sleeve', pants: 'Pants', 'pants-dartless': 'Pants (dartless)', 'pants-with-darts': 'Pants (with darts)' },
    fr: { skirt: 'Jupe', bodice: 'Corsage', 'bodice-dartless': 'Corsage sans pinces', 'bodice-with-darts': 'Corsage avec pinces', 'bodice-knit': 'Corsage jersey', dress: 'Robe', sleeve: 'Manche', pants: 'Pantalon', 'pants-dartless': 'Pantalon (sans pinces)', 'pants-with-darts': 'Pantalon (avec pinces)' },
  },
  totalPages: { en: 'Total pages', fr: 'Total pages' },
  measurementsUsed: { en: 'Measurements used:', fr: 'Mesures utilisées :' },
  pageLayout: { en: 'Page Layout:', fr: 'Plan des pages :' },
  // Measurement names
  upperArm: { en: 'Upper Arm', fr: 'Tour de bras' },
  wrist: { en: 'Wrist', fr: 'Poignet' },
  sleeveLength: { en: 'Sleeve Length', fr: 'Longueur manche' },
  elbowLength: { en: 'Elbow Length', fr: 'Longueur coude' },
  armholeDepth: { en: 'Armhole Depth', fr: 'Profondeur emmanchure' },
  bust: { en: 'Bust', fr: 'Poitrine' },
  neckline: { en: 'Neckline', fr: 'Encolure' },
  shoulderLength: { en: 'Shoulder Length', fr: 'Largeur épaule' },
  backWidth: { en: 'Back Width', fr: 'Largeur dos' },
  waist: { en: 'Waist', fr: 'Taille' },
  hip: { en: 'Hip', fr: 'Hanches' },
  waistToHip: { en: 'Waist to Hip', fr: 'Taille aux hanches' },
  skirtLength: { en: 'Skirt Length', fr: 'Longueur jupe' },
};

function tr<T>(key: { en: T; fr: T }, lang: Language): T {
  return key[lang];
}

// Helper to format measurement with unit
function formatMeasurement(valueCm: number, unit: MeasurementUnit): string {
  if (unit === 'inches') {
    return `${cmToInches(valueCm).toFixed(2)}″`;
  }
  return `${valueCm.toFixed(1)}cm`;
}

// A4 dimensions in mm
const A4_WIDTH = 210;
const A4_HEIGHT = 297;

// Printable area (with margins)
const MARGIN = 10;
const PRINTABLE_WIDTH = A4_WIDTH - (MARGIN * 2);
const PRINTABLE_HEIGHT = A4_HEIGHT - (MARGIN * 2);

// Alignment mark size
const MARK_SIZE = 8;
const MARK_OFFSET = 5;

interface PatternDimensions {
  widthCm: number;
  heightCm: number;
}

interface TileInfo {
  cols: number;
  rows: number;
  totalPages: number;
}

function calculateSkirtDimensions(measurements: SkirtMeasurements): PatternDimensions {
  const { waist, hip, skirtLength } = measurements;
  const hipQuarter = hip / 4;
  const waistQuarter = waist / 4;
  const ease = 1;
  const dartWidth = 2.5;

  const widthCm = Math.max(hipQuarter + ease, waistQuarter + ease + dartWidth) + 4;
  const heightCm = skirtLength + 4;

  return { widthCm, heightCm };
}

function calculateBodiceDimensions(measurements: BodiceMeasurements): PatternDimensions {
  const { bust, backWidth, backLength } = measurements;
  const bustQuarter = bust / 4;
  const backWidthHalf = backWidth / 2;
  const ease = 1;

  const widthCm = Math.max(bustQuarter, backWidthHalf) + ease + 5;
  const heightCm = backLength + 5;

  return { widthCm, heightCm };
}

function calculateSleeveDimensions(measurements: SleeveMeasurements): PatternDimensions {
  const { upperArm, sleeveLength, armholeDepth, ease = 2 } = measurements;
  const upperArmWithEase = upperArm / 2 + ease;

  const widthCm = upperArmWithEase + 4;
  const heightCm = sleeveLength + armholeDepth + 4;

  return { widthCm, heightCm };
}

function calculateTiles(dimensions: PatternDimensions): TileInfo {
  const widthMm = dimensions.widthCm * 10;
  const heightMm = dimensions.heightCm * 10;

  const cols = Math.ceil(widthMm / PRINTABLE_WIDTH);
  const rows = Math.ceil(heightMm / PRINTABLE_HEIGHT);

  return { cols, rows, totalPages: cols * rows };
}

function drawAlignmentMarks(doc: jsPDF, pageCol: number, pageRow: number, totalCols: number, totalRows: number) {
  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(0.3);

  // TL corner
  if (pageCol > 0 || pageRow > 0) {
    doc.line(MARGIN, MARGIN, MARGIN + MARK_SIZE, MARGIN);
    doc.line(MARGIN, MARGIN, MARGIN, MARGIN + MARK_SIZE);
    doc.line(MARGIN, MARGIN, MARGIN + MARK_OFFSET * 2, MARGIN + MARK_OFFSET * 2);
    doc.line(MARGIN + MARK_OFFSET * 2, MARGIN, MARGIN, MARGIN + MARK_OFFSET * 2);
  }

  // TR corner
  if (pageCol < totalCols - 1 || pageRow > 0) {
    doc.line(A4_WIDTH - MARGIN - MARK_SIZE, MARGIN, A4_WIDTH - MARGIN, MARGIN);
    doc.line(A4_WIDTH - MARGIN, MARGIN, A4_WIDTH - MARGIN, MARGIN + MARK_SIZE);
    doc.line(A4_WIDTH - MARGIN, MARGIN, A4_WIDTH - MARGIN - MARK_OFFSET * 2, MARGIN + MARK_OFFSET * 2);
    doc.line(A4_WIDTH - MARGIN - MARK_OFFSET * 2, MARGIN, A4_WIDTH - MARGIN, MARGIN + MARK_OFFSET * 2);
  }

  // BL corner
  if (pageCol > 0 || pageRow < totalRows - 1) {
    doc.line(MARGIN, A4_HEIGHT - MARGIN - MARK_SIZE, MARGIN, A4_HEIGHT - MARGIN);
    doc.line(MARGIN, A4_HEIGHT - MARGIN, MARGIN + MARK_SIZE, A4_HEIGHT - MARGIN);
    doc.line(MARGIN, A4_HEIGHT - MARGIN, MARGIN + MARK_OFFSET * 2, A4_HEIGHT - MARGIN - MARK_OFFSET * 2);
    doc.line(MARGIN + MARK_OFFSET * 2, A4_HEIGHT - MARGIN, MARGIN, A4_HEIGHT - MARGIN - MARK_OFFSET * 2);
  }

  // BR corner
  if (pageCol < totalCols - 1 || pageRow < totalRows - 1) {
    doc.line(A4_WIDTH - MARGIN - MARK_SIZE, A4_HEIGHT - MARGIN, A4_WIDTH - MARGIN, A4_HEIGHT - MARGIN);
    doc.line(A4_WIDTH - MARGIN, A4_HEIGHT - MARGIN - MARK_SIZE, A4_WIDTH - MARGIN, A4_HEIGHT - MARGIN);
    doc.line(A4_WIDTH - MARGIN, A4_HEIGHT - MARGIN, A4_WIDTH - MARGIN - MARK_OFFSET * 2, A4_HEIGHT - MARGIN - MARK_OFFSET * 2);
    doc.line(A4_WIDTH - MARGIN - MARK_OFFSET * 2, A4_HEIGHT - MARGIN, A4_WIDTH - MARGIN, A4_HEIGHT - MARGIN - MARK_OFFSET * 2);
  }

  const circleRadius = 2;
  doc.setFillColor(255, 255, 255);

  if (pageCol > 0 && pageRow > 0) {
    doc.circle(MARGIN, MARGIN, circleRadius, 'FD');
  }
  if (pageCol < totalCols - 1 && pageRow > 0) {
    doc.circle(A4_WIDTH - MARGIN, MARGIN, circleRadius, 'FD');
  }
  if (pageCol > 0 && pageRow < totalRows - 1) {
    doc.circle(MARGIN, A4_HEIGHT - MARGIN, circleRadius, 'FD');
  }
  if (pageCol < totalCols - 1 && pageRow < totalRows - 1) {
    doc.circle(A4_WIDTH - MARGIN, A4_HEIGHT - MARGIN, circleRadius, 'FD');
  }
}

function drawPageInfo(doc: jsPDF, pageNum: number, totalPages: number, col: number, row: number, lang: Language) {
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  const pageStr = tr(pdfT.pageOf, lang)(pageNum, totalPages);
  const rowColStr = tr(pdfT.rowCol, lang)(row + 1, col + 1);
  doc.text(`${pageStr} ${rowColStr}`, A4_WIDTH / 2, A4_HEIGHT - 3, { align: 'center' });
  doc.text('Petit Citron Studio', MARGIN, A4_HEIGHT - 3);
  if (col === 0) {
    doc.text(tr(pdfT.cutOnFold, lang), A4_WIDTH - MARGIN, A4_HEIGHT - 3, { align: 'right' });
  }
}

function drawSkirtPatternPiece(
  doc: jsPDF,
  measurements: SkirtMeasurements,
  offsetX: number,
  offsetY: number,
  panel: 'front' | 'back' = 'front',
  unit: MeasurementUnit = 'cm',
  lang: Language = 'en'
) {
  const { waist, hip, waistToHip, skirtLength } = measurements;
  const waistQuarter = (waist / 4) * 10;
  const hipQuarter = (hip / 4) * 10;
  const ease = 10;

  const isFront = panel === 'front';
  const dartWidthBase = ((hip - waist) * 25) / 240;
  const dartWidth = (isFront ? dartWidthBase : dartWidthBase * 1.2) * 10;
  const dartLength = (waistToHip * (isFront ? 0.5 : 0.55)) * 10;
  const waistToHipMm = waistToHip * 10;
  const lengthMm = skirtLength * 10;

  const waistWidth = waistQuarter + ease + dartWidth;
  const patternWidth = hipQuarter + ease;

  const centerToDart = patternWidth * (isFront ? 0.4 : 0.35);

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);

  const points: [number, number][] = [
    [offsetX, offsetY],
    [offsetX + centerToDart, offsetY],
    [offsetX + centerToDart + dartWidth / 2, offsetY + dartLength],
    [offsetX + centerToDart + dartWidth, offsetY],
    [offsetX + waistWidth, offsetY],
    [offsetX + patternWidth, offsetY + waistToHipMm],
    [offsetX + patternWidth, offsetY + lengthMm],
    [offsetX, offsetY + lengthMm],
  ];

  for (let i = 0; i < points.length; i++) {
    const next = (i + 1) % points.length;
    doc.line(points[i][0], points[i][1], points[next][0], points[next][1]);
  }

  const grainX = offsetX + patternWidth / 2;
  const grainTop = offsetY + 30;
  const grainBottom = offsetY + lengthMm - 30;

  doc.setLineDashPattern([3, 2], 0);
  doc.line(grainX, grainTop, grainX, grainBottom);
  doc.setLineDashPattern([], 0);

  const arrowSize = 4;
  doc.line(grainX - arrowSize, grainTop + arrowSize, grainX, grainTop);
  doc.line(grainX + arrowSize, grainTop + arrowSize, grainX, grainTop);
  doc.line(grainX - arrowSize, grainBottom - arrowSize, grainX, grainBottom);
  doc.line(grainX + arrowSize, grainBottom - arrowSize, grainX, grainBottom);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(isFront ? tr(pdfT.front, lang) : tr(pdfT.back, lang), offsetX + patternWidth / 2, offsetY + lengthMm / 2 - 5, { align: 'center' });

  doc.setFontSize(8);
  doc.text(tr(pdfT.cut1OnFold, lang), offsetX + patternWidth / 2, offsetY + lengthMm / 2 + 5, { align: 'center' });

  doc.setFontSize(7);
  doc.setTextColor(80, 80, 80);
  const dartWidthCm = isFront ? dartWidthBase : dartWidthBase * 1.2;
  doc.text(`${tr(pdfT.quarterWaistDart, lang)} = ${formatMeasurement(waist / 4 + dartWidthCm + 1, unit)}`, offsetX + waistWidth / 2, offsetY - 5, { align: 'center' });
  doc.text(`${tr(pdfT.length, lang)} = ${formatMeasurement(skirtLength, unit)}`, offsetX - 8, offsetY + lengthMm / 2, { angle: 90 });
  doc.text(`${tr(pdfT.quarterHip, lang)} = ${formatMeasurement(hip / 4 + 1, unit)}`, offsetX + patternWidth + 8, offsetY + waistToHipMm + (lengthMm - waistToHipMm) / 2, { angle: 270 });
}

function drawBodicePatternPiece(
  doc: jsPDF,
  measurements: BodiceMeasurements,
  offsetX: number,
  offsetY: number,
  panel: 'front' | 'back' = 'front',
  unit: MeasurementUnit = 'cm',
  lang: Language = 'en'
) {
  const {
    bust,
    neckCircumference,
    shoulderLength,
    backLength,
  } = measurements;

  const bustQuarterMm = (bust / 4 + 1) * 10;
  const neckWidthMm = (neckCircumference / 6) * 10;
  const shoulderLengthMm = shoulderLength * 10;
  const backLengthMm = backLength * 10;
  const shoulderSlopeMm = 40;

  const armholeDepthMm = backLength * 0.5 * 10 + 10;

  const isFront = panel === 'front';
  const neckDropMm = isFront ? 15 : 0;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);

  const neckX = offsetX + neckWidthMm;
  const shoulderEndX = offsetX + neckWidthMm + shoulderLengthMm;
  const shoulderY = offsetY + shoulderSlopeMm;
  const sideX = offsetX + bustQuarterMm;
  const waistY = offsetY + backLengthMm;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);

  doc.line(offsetX, offsetY + neckDropMm, offsetX, waistY);
  doc.line(offsetX, offsetY + neckDropMm, neckX, offsetY);
  doc.line(neckX, offsetY, shoulderEndX, shoulderY);
  doc.line(shoulderEndX, shoulderY, sideX, offsetY + armholeDepthMm);
  doc.line(sideX, offsetY + armholeDepthMm, sideX, waistY);
  doc.line(sideX, waistY, offsetX, waistY);

  const grainX = offsetX + bustQuarterMm * 0.4;
  const grainTop = offsetY + backLengthMm * 0.2;
  const grainBottom = offsetY + backLengthMm * 0.8;

  doc.setDrawColor(0, 0, 0);
  doc.setLineDashPattern([3, 2], 0);
  doc.line(grainX, grainTop, grainX, grainBottom);
  doc.setLineDashPattern([], 0);

  const arrowSize = 4;
  doc.line(grainX - arrowSize, grainTop + arrowSize, grainX, grainTop);
  doc.line(grainX + arrowSize, grainTop + arrowSize, grainX, grainTop);
  doc.line(grainX - arrowSize, grainBottom - arrowSize, grainX, grainBottom);
  doc.line(grainX + arrowSize, grainBottom - arrowSize, grainX, grainBottom);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(isFront ? tr(pdfT.front, lang) : tr(pdfT.back, lang), offsetX + bustQuarterMm / 2, offsetY + backLengthMm / 2 - 5, { align: 'center' });

  doc.setFontSize(8);
  doc.text(tr(pdfT.cut1OnFold, lang), offsetX + bustQuarterMm / 2, offsetY + backLengthMm / 2 + 5, { align: 'center' });

  doc.setFontSize(7);
  doc.setTextColor(80, 80, 80);
  doc.text(`${tr(pdfT.quarterBust, lang)} = ${formatMeasurement(bust / 4 + 1, unit)}`, sideX + 8, offsetY + armholeDepthMm + (backLengthMm - armholeDepthMm) / 2, { angle: 270 });
  doc.text(`${tr(pdfT.backLength, lang)} = ${formatMeasurement(backLength, unit)}`, offsetX - 8, offsetY + backLengthMm / 2, { angle: 90 });
}

function drawSleevePatternPiece(
  doc: jsPDF,
  measurements: SleeveMeasurements,
  offsetX: number,
  offsetY: number,
  unit: MeasurementUnit = 'cm',
  lang: Language = 'en'
) {
  const { upperArm, wrist, sleeveLength, elbowLength, armholeDepth, ease = 2 } = measurements;

  const upperArmWithEase = (upperArm / 2 + ease) * 10;
  const wristWithEase = (wrist / 2 + ease * 0.5) * 10;
  const capHeightMm = armholeDepth * 10;
  const totalLengthMm = sleeveLength * 10;
  const elbowPositionMm = elbowLength * 10;

  const halfUpperWidth = upperArmWithEase / 2;
  const halfWristWidth = wristWithEase / 2;

  const centerX = offsetX + halfUpperWidth;
  const capTop = offsetY;
  const underarmY = offsetY + capHeightMm;
  const elbowY = offsetY + capHeightMm + elbowPositionMm;
  const wristY = offsetY + capHeightMm + totalLengthMm;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);

  const leftUnderarm = [centerX - halfUpperWidth, underarmY];
  const rightUnderarm = [centerX + halfUpperWidth, underarmY];
  const capPeak = [centerX, capTop];

  doc.line(leftUnderarm[0], leftUnderarm[1], centerX - halfUpperWidth * 0.7, capTop + capHeightMm * 0.3);
  doc.line(centerX - halfUpperWidth * 0.7, capTop + capHeightMm * 0.3, centerX - halfUpperWidth * 0.3, capTop + capHeightMm * 0.1);
  doc.line(centerX - halfUpperWidth * 0.3, capTop + capHeightMm * 0.1, capPeak[0], capPeak[1]);

  doc.line(capPeak[0], capPeak[1], centerX + halfUpperWidth * 0.3, capTop + capHeightMm * 0.1);
  doc.line(centerX + halfUpperWidth * 0.3, capTop + capHeightMm * 0.1, centerX + halfUpperWidth * 0.7, capTop + capHeightMm * 0.3);
  doc.line(centerX + halfUpperWidth * 0.7, capTop + capHeightMm * 0.3, rightUnderarm[0], rightUnderarm[1]);

  const elbowRatio = elbowPositionMm / totalLengthMm;
  const halfElbowWidth = halfUpperWidth - (halfUpperWidth - halfWristWidth) * elbowRatio;

  doc.line(leftUnderarm[0], leftUnderarm[1], centerX - halfElbowWidth - 2, elbowY);
  doc.line(centerX - halfElbowWidth - 2, elbowY, centerX - halfWristWidth, wristY);

  doc.line(rightUnderarm[0], rightUnderarm[1], centerX + halfElbowWidth, elbowY);
  doc.line(centerX + halfElbowWidth, elbowY, centerX + halfWristWidth, wristY);

  doc.line(centerX - halfWristWidth, wristY, centerX + halfWristWidth, wristY);

  const dartWidth = 8;
  const dartLength = 25;
  doc.setLineDashPattern([2, 1], 0);
  doc.line(centerX - halfElbowWidth - 2, elbowY, centerX - halfElbowWidth - 2 + dartLength, elbowY - dartWidth / 2);
  doc.line(centerX - halfElbowWidth - 2, elbowY, centerX - halfElbowWidth - 2 + dartLength, elbowY + dartWidth / 2);
  doc.setLineDashPattern([], 0);

  const grainTop = underarmY + 20;
  const grainBottom = wristY - 20;

  doc.setLineDashPattern([3, 2], 0);
  doc.line(centerX, grainTop, centerX, grainBottom);
  doc.setLineDashPattern([], 0);

  const arrowSize = 4;
  doc.line(centerX - arrowSize, grainTop + arrowSize, centerX, grainTop);
  doc.line(centerX + arrowSize, grainTop + arrowSize, centerX, grainTop);
  doc.line(centerX - arrowSize, grainBottom - arrowSize, centerX, grainBottom);
  doc.line(centerX + arrowSize, grainBottom - arrowSize, centerX, grainBottom);

  const notchY = underarmY + 15;
  const notchSize = 5;

  doc.line(rightUnderarm[0], notchY, rightUnderarm[0] + notchSize, notchY);

  doc.line(leftUnderarm[0], notchY - 3, leftUnderarm[0] - notchSize, notchY - 3);
  doc.line(leftUnderarm[0], notchY + 3, leftUnderarm[0] - notchSize, notchY + 3);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(tr(pdfT.sleeve, lang), centerX, underarmY + totalLengthMm / 2 - 5, { align: 'center' });

  doc.setFontSize(8);
  doc.text(tr(pdfT.cut2, lang), centerX, underarmY + totalLengthMm / 2 + 5, { align: 'center' });

  doc.setFontSize(7);
  doc.setTextColor(80, 80, 80);
  doc.text(`${tr(pdfT.halfUpperArm, lang)} = ${formatMeasurement(upperArm / 2 + ease, unit)}`, centerX, underarmY - 5, { align: 'center' });
  doc.text(`${tr(pdfT.halfWrist, lang)} = ${formatMeasurement(wrist / 2 + ease * 0.5, unit)}`, centerX, wristY + 8, { align: 'center' });
  doc.text(`${tr(pdfT.length, lang)} = ${formatMeasurement(sleeveLength, unit)}`, offsetX - 8, underarmY + totalLengthMm / 2, { angle: 90 });
  doc.text(`${tr(pdfT.capHeight, lang)} = ${formatMeasurement(armholeDepth, unit)}`, centerX + halfUpperWidth + 8, capTop + capHeightMm / 2, { angle: 270 });
}

function draw1cmTestSquare(doc: jsPDF, unit: MeasurementUnit, lang: Language) {
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.rect(MARGIN + 5, MARGIN + 5, 10, 10);
  doc.setFontSize(6);
  doc.setTextColor(0, 0, 0);
  const label = unit === 'inches' ? `${tr(pdfT.testSquare, lang)} / 0.39″` : tr(pdfT.testSquare, lang);
  doc.text(label, MARGIN + 10, MARGIN + 20, { align: 'center' });
}

function drawDiagramSkirt(
  doc: jsPDF,
  m: SkirtMeasurements,
  startX: number,
  startY: number,
  panel: 'front' | 'back',
  scaleX: number,
  scaleY: number
) {
  const isFront = panel === 'front';
  const waistQuarter = (m.waist / 4) * 10;
  const hipQuarter = (m.hip / 4) * 10;
  const ease = 10;
  const dartWidthBase = ((m.hip - m.waist) * 25) / 240;
  const dartWidth = (isFront ? dartWidthBase : dartWidthBase * 1.2) * 10;
  const dartLength = m.waistToHip * (isFront ? 0.5 : 0.55) * 10;
  const waistToHipMm = m.waistToHip * 10;
  const lengthMm = m.skirtLength * 10;
  const waistWidth = waistQuarter + ease + dartWidth;
  const patternWidth = hipQuarter + ease;
  const centerToDart = patternWidth * (isFront ? 0.4 : 0.35);

  doc.setFillColor(238, 246, 225);
  doc.setDrawColor(110, 150, 60);
  doc.setLineWidth(0.3);
  doc.lines(
    [
      [centerToDart * scaleX, 0],
      [(dartWidth / 2) * scaleX, dartLength * scaleY],
      [(dartWidth / 2) * scaleX, -dartLength * scaleY],
      [(waistWidth - centerToDart - dartWidth) * scaleX, 0],
      [(patternWidth - waistWidth) * scaleX, waistToHipMm * scaleY],
      [0, (lengthMm - waistToHipMm) * scaleY],
      [-patternWidth * scaleX, 0],
    ] as [number, number][],
    startX, startY, [1, 1], 'FD', true
  );
}

function drawDiagramBodice(
  doc: jsPDF,
  m: BodiceMeasurements,
  startX: number,
  startY: number,
  panel: 'front' | 'back',
  scaleX: number,
  scaleY: number
) {
  const isFront = panel === 'front';
  const bustQuarterMm = (m.bust / 4 + 1) * 10;
  const neckWidthMm = (m.neckCircumference / 6) * 10;
  const shoulderLengthMm = m.shoulderLength * 10;
  const backLengthMm = m.backLength * 10;
  const shoulderSlopeMm = 40;
  const armholeDepthMm = m.backLength * 0.5 * 10;
  const neckDropMm = isFront ? 15 : 0;

  doc.setFillColor(238, 246, 225);
  doc.setDrawColor(110, 150, 60);
  doc.setLineWidth(0.3);
  doc.lines(
    [
      [neckWidthMm * scaleX, -neckDropMm * scaleY],
      [shoulderLengthMm * scaleX, shoulderSlopeMm * scaleY],
      [(bustQuarterMm - neckWidthMm - shoulderLengthMm) * scaleX, (armholeDepthMm - shoulderSlopeMm) * scaleY],
      [0, (backLengthMm - armholeDepthMm) * scaleY],
      [-bustQuarterMm * scaleX, 0],
    ] as [number, number][],
    startX, startY + neckDropMm * scaleY, [1, 1], 'FD', true
  );
}

function drawDiagramSleeve(
  doc: jsPDF,
  m: SleeveMeasurements,
  startX: number,
  startY: number,
  scaleX: number,
  scaleY: number
) {
  const ease = m.ease ?? 2;
  const upperArmWithEase = (m.upperArm / 2 + ease) * 10;
  const wristWithEase = (m.wrist / 2 + ease * 0.5) * 10;
  const hu = upperArmWithEase / 2; // halfUpperWidth
  const hw = wristWithEase / 2;   // halfWristWidth
  const capMm = m.armholeDepth * 10;
  const lengthMm = m.sleeveLength * 10;
  const elbowMm = m.elbowLength * 10;
  const he = hu - (hu - hw) * (elbowMm / lengthMm); // halfElbowWidth

  doc.setFillColor(238, 246, 225);
  doc.setDrawColor(110, 150, 60);
  doc.setLineWidth(0.3);
  // Start at left underarm, go clockwise
  doc.lines(
    [
      [hu * 0.3 * scaleX, -capMm * 0.7 * scaleY],
      [hu * 0.4 * scaleX, -capMm * 0.2 * scaleY],
      [hu * 0.3 * scaleX, -capMm * 0.1 * scaleY],
      [hu * 0.3 * scaleX,  capMm * 0.1 * scaleY],
      [hu * 0.4 * scaleX,  capMm * 0.2 * scaleY],
      [hu * 0.3 * scaleX,  capMm * 0.7 * scaleY],
      [(he - hu) * scaleX, elbowMm * scaleY],
      [(hw - he) * scaleX, (lengthMm - elbowMm) * scaleY],
      [-hw * 2 * scaleX, 0],
      [(hw - he - 2) * scaleX, -(lengthMm - elbowMm) * scaleY],
      [-(hu - he - 2) * scaleX, -elbowMm * scaleY],
    ] as [number, number][],
    startX, startY + capMm * scaleY, [1, 1], 'FD', true
  );
}

// ─────────────────────────────── PANTS ───────────────────────────────────────

function calculatePantsDimensions(m: PantsMeasurements, category: Category): PatternDimensions {
  const ease = m.ease ?? 2;
  const crotchExt = category === 'men' ? m.hip / 16 - 1 : m.hip / 16 + 3;
  return {
    widthCm: crotchExt + m.hip / 4 + ease + 4,
    heightCm: m.outseamLength + 4,
  };
}

function drawCubicBezier(
  doc: jsPDF,
  x0: number, y0: number,
  cx1: number, cy1: number,
  cx2: number, cy2: number,
  x1: number, y1: number,
  steps = 8
) {
  let px = x0, py = y0;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    const nx = u*u*u*x0 + 3*u*u*t*cx1 + 3*u*t*t*cx2 + t*t*t*x1;
    const ny = u*u*u*y0 + 3*u*u*t*cy1 + 3*u*t*t*cy2 + t*t*t*y1;
    doc.line(px, py, nx, ny);
    px = nx; py = ny;
  }
}

function drawPantsGrainLine(doc: jsPDF, x: number, yTop: number, yBot: number) {
  doc.setLineDashPattern([3, 2], 0);
  doc.line(x, yTop, x, yBot);
  doc.setLineDashPattern([], 0);
  const a = 4;
  doc.line(x - a, yTop + a, x, yTop);
  doc.line(x + a, yTop + a, x, yTop);
  doc.line(x - a, yBot - a, x, yBot);
  doc.line(x + a, yBot - a, x, yBot);
}

// Back panel.
// offsetX = left edge of pattern piece = innermost crotch point (e1/e2 x-coordinate).
// Center-back hip line is at offsetX + crotchExtMm.
function drawPantsBackPanel(
  doc: jsPDF,
  m: PantsMeasurements,
  offsetX: number,
  offsetY: number,
  category: Category,
  hasDarts: boolean,
  unit: MeasurementUnit,
  lang: Language
) {
  const ease = m.ease ?? 2;
  const v = (cm: number) => cm * 10;

  const crotchExtMm = category === 'men' ? v(m.hip / 16 - 1) : v(m.hip / 16 + 3);
  const O = offsetX + crotchExtMm;  // center-back hip reference X

  const hipQ   = v(m.hip / 4 + ease);
  const waistQ = v(m.waist / 4);
  const waistEase = category === 'men' ? 40 : 50;  // mm
  const excedent = hipQ - waistQ - waistEase;

  // Dart widths
  const dartW = hasDarts
    ? (category === 'women' ? 10 : category === 'kids' ? 25 : 0)
    : 0;

  // CB waist shift and side-seam reduction
  let cbShift: number, sideRed: number;
  if (category === 'men') {
    cbShift = Math.max(0, excedent / 2);
    sideRed = Math.max(0, excedent / 2);
  } else {
    cbShift = category === 'kids' ? 15 : 35;   // 1.5 cm kids, 3.5 cm women (mm)
    sideRed = Math.max(0, excedent - dartW);
  }
  const cbRaise = category === 'men' ? 20 : v(m.outseamLength * 0.027);

  const a2X = O + cbShift;
  const a2Y = offsetY - cbRaise;
  const b1X = O + hipQ - sideRed;
  const b1Y = category === 'women' ? offsetY - 10 : offsetY;

  const hipSideX = O + hipQ;
  const hipY   = offsetY + v(m.hipHeight);
  const crotchY = offsetY + v(m.crotchDepth);
  const e2Y    = crotchY - 10;

  const centerX = O + (hipQ - crotchExtMm) / 2;
  const iY      = offsetY + v(m.crotchDepth * (1 + 2 / 3));
  const hemHalfW = v(m.hip / 10 + 1.5);
  const thighSpread = hemHalfW + 10;
  const hemY     = offsetY + v(m.outseamLength);
  const hemSideX  = (centerX - 10) + hemHalfW;
  const hemInnerX = (centerX - 10) - hemHalfW;
  const thighSideX  = centerX + thighSpread;
  const thighInnerX = centerX - thighSpread;

  // Dart position
  let dartCX = 0, dartTipY = 0;
  if (dartW > 0) {
    if (category === 'women') {
      dartCX   = a2X + 10;       // 10 mm from CB waist (spreadsheet spec)
      dartTipY = a2Y + 120;      // 120 mm below waist  (spreadsheet spec)
    } else {
      dartCX   = (a2X + b1X) / 2;
      dartTipY = a2Y + v(m.hipHeight) * 0.75;
    }
  }
  const dHalf = dartW / 2;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);

  // ── Waist line (with or without dart) ──
  if (dartW > 0) {
    doc.line(a2X, a2Y, dartCX - dHalf, a2Y);
    doc.line(dartCX - dHalf, a2Y, dartCX, dartTipY);   // left side of dart
    doc.line(dartCX, dartTipY, dartCX + dHalf, a2Y);   // right side
    doc.line(dartCX + dHalf, a2Y, b1X, b1Y);
    // notch at dart tip
    doc.setLineWidth(0.25);
    doc.line(dartCX - 3, dartTipY, dartCX + 3, dartTipY);
    doc.setLineWidth(0.5);
  } else {
    doc.line(a2X, a2Y, b1X, b1Y);
  }

  // ── Side seam ──
  doc.line(b1X, b1Y, hipSideX, hipY);
  doc.line(hipSideX, hipY, hipSideX, crotchY);
  doc.line(hipSideX, crotchY, thighSideX, iY);
  doc.line(thighSideX, iY, hemSideX, hemY);

  // ── Hem ──
  doc.line(hemSideX, hemY, hemInnerX, hemY);

  // ── Inner seam ──
  doc.line(hemInnerX, hemY, thighInnerX, iY);
  doc.line(thighInnerX, iY, offsetX, e2Y);

  // ── Crotch curve (cubic Bezier) ──
  drawCubicBezier(doc,
    offsetX, e2Y,
    offsetX + (O - offsetX) * 0.8, crotchY - (hipY - crotchY) / 8,
    O - (a2X - O) / 4, hipY - (a2Y - hipY) / 4,
    O, hipY
  );

  // ── Center-back seam ──
  doc.line(O, hipY, a2X, a2Y);

  // ── Reference lines ──
  doc.setLineWidth(0.2);
  doc.setLineDashPattern([2, 2], 0);
  doc.setDrawColor(160, 160, 160);
  doc.line(offsetX, hipY, hipSideX, hipY);
  doc.line(offsetX, crotchY, hipSideX, crotchY);
  doc.setLineDashPattern([], 0);
  doc.setDrawColor(0, 0, 0);

  // ── Grain line ──
  doc.setLineWidth(0.4);
  drawPantsGrainLine(doc, centerX, offsetY + 30, hemY - 30);

  // ── Labels ──
  const midY = offsetY + v(m.outseamLength) / 2;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(tr(pdfT.back, lang), centerX, midY - 10, { align: 'center' });
  doc.setFontSize(8);
  doc.text(tr(pdfT.cut2, lang), centerX, midY, { align: 'center' });

  if (dartW > 0) {
    doc.setFontSize(7);
    doc.setTextColor(80, 80, 80);
    doc.text(`${tr(pdfT.dart, lang)} = ${dartW}mm`, dartCX + 4, a2Y + (dartTipY - a2Y) / 2);
  }

  doc.setFontSize(7);
  doc.setTextColor(80, 80, 80);
  doc.text(`${tr(pdfT.outseam, lang)} = ${formatMeasurement(m.outseamLength, unit)}`, O - 8, offsetY + v(m.outseamLength) / 2, { angle: 90 });
}

// Front panel.
// offsetX = left edge = e1X (innermost crotch). CF seam is at offsetX + crotchExtMm.
function drawPantsFrontPanel(
  doc: jsPDF,
  m: PantsMeasurements,
  offsetX: number,
  offsetY: number,
  category: Category,
  hasDarts: boolean,
  unit: MeasurementUnit,
  lang: Language
) {
  const ease = m.ease ?? 2;
  const v = (cm: number) => cm * 10;

  const crotchExtMm = category === 'men' ? v(m.hip / 20) : v(m.hip / 20);
  const O = offsetX + crotchExtMm;  // CF seam reference X

  const hipQ   = v(m.hip / 4 + ease);
  const waistQ = v(m.waist / 4);
  const waistEase = category === 'men' ? 40 : 50;
  const excedent = hipQ - waistQ - waistEase;

  // Front dart widths per dart
  const dartW = hasDarts ? (category === 'kids' ? 10 : category === 'women' ? 10 : 0) : 0;
  const numDarts = category === 'women' && hasDarts ? 2 : (dartW > 0 ? 1 : 0);

  // Side-seam reduction absorbs remaining excess
  const totalDartMm = dartW * numDarts;
  const waistRed = category === 'men' ? Math.max(0, excedent) : Math.max(0, excedent - totalDartMm);

  const b1Rise = category === 'women' ? 10 : 0;

  const a1X = O;
  const a1Y = offsetY;
  const b1X = O + hipQ - waistRed;
  const b1Y = offsetY - b1Rise;

  const hipSideX = O + hipQ;
  const hipY    = offsetY + v(m.hipHeight);
  const crotchY  = offsetY + v(m.crotchDepth);
  const e1X     = offsetX;

  const iY      = offsetY + v(m.crotchDepth * 2);
  const centerX = O + (hipQ - crotchExtMm) / 2;
  const hemHalfW  = v(m.hip / 10 + 1.5);
  const thighSpread = hemHalfW + 10;
  const hemY      = offsetY + v(m.outseamLength);
  const hemSideX  = centerX + hemHalfW;
  const hemInnerX = centerX - hemHalfW;
  const thighSideX  = centerX + thighSpread;
  const thighInnerX = centerX - thighSpread;
  const dartDepth  = v(m.hipHeight * 0.6);
  const dHalf = dartW / 2;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);

  // ── Waist line ──
  if (numDarts === 2) {
    const d1X = a1X + (b1X - a1X) * 0.35;
    const d2X = a1X + (b1X - a1X) * 0.65;
    doc.line(a1X, a1Y, d1X - dHalf, a1Y);
    doc.line(d1X - dHalf, a1Y, d1X, a1Y + dartDepth);
    doc.line(d1X, a1Y + dartDepth, d1X + dHalf, a1Y);
    doc.line(d1X + dHalf, a1Y, d2X - dHalf, a1Y);
    doc.line(d2X - dHalf, a1Y, d2X, a1Y + dartDepth);
    doc.line(d2X, a1Y + dartDepth, d2X + dHalf, a1Y);
    doc.line(d2X + dHalf, a1Y, b1X, b1Y);
    doc.setLineWidth(0.25);
    doc.line(d1X - 3, a1Y + dartDepth, d1X + 3, a1Y + dartDepth);
    doc.line(d2X - 3, a1Y + dartDepth, d2X + 3, a1Y + dartDepth);
    doc.setLineWidth(0.5);
  } else if (numDarts === 1) {
    const dCX = (a1X + b1X) / 2;
    doc.line(a1X, a1Y, dCX - dHalf, a1Y);
    doc.line(dCX - dHalf, a1Y, dCX, a1Y + dartDepth);
    doc.line(dCX, a1Y + dartDepth, dCX + dHalf, a1Y);
    doc.line(dCX + dHalf, a1Y, b1X, b1Y);
    doc.setLineWidth(0.25);
    doc.line(dCX - 3, a1Y + dartDepth, dCX + 3, a1Y + dartDepth);
    doc.setLineWidth(0.5);
  } else {
    doc.line(a1X, a1Y, b1X, b1Y);
  }

  // ── Side seam ──
  doc.line(b1X, b1Y, hipSideX, hipY);
  doc.line(hipSideX, hipY, hipSideX, crotchY);
  doc.line(hipSideX, crotchY, thighSideX, iY);
  doc.line(thighSideX, iY, hemSideX, hemY);

  // ── Hem ──
  doc.line(hemSideX, hemY, hemInnerX, hemY);

  // ── Inner seam with crotch curves ──
  doc.line(hemInnerX, hemY, thighInnerX, iY);
  drawCubicBezier(doc,
    thighInnerX, iY,
    thighInnerX, iY + (crotchY - iY) * 0.75,
    e1X, crotchY,
    e1X, crotchY
  );
  drawCubicBezier(doc,
    e1X, crotchY,
    e1X + (a1X - e1X) / 2, crotchY + (hipY - crotchY) / 20,
    a1X - 10, hipY - (hipY - crotchY) / 4,
    a1X - 10, hipY
  );

  // ── CF seam ──
  doc.line(a1X - 10, hipY, a1X, a1Y);

  // ── Reference lines ──
  doc.setLineWidth(0.2);
  doc.setLineDashPattern([2, 2], 0);
  doc.setDrawColor(160, 160, 160);
  doc.line(e1X, hipY, hipSideX, hipY);
  doc.line(e1X, crotchY, hipSideX, crotchY);
  doc.setLineDashPattern([], 0);
  doc.setDrawColor(0, 0, 0);

  // ── Grain line ──
  doc.setLineWidth(0.4);
  drawPantsGrainLine(doc, centerX, offsetY + 30, hemY - 30);

  // ── Labels ──
  const midY = offsetY + v(m.outseamLength) / 2;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(tr(pdfT.front, lang), centerX, midY - 10, { align: 'center' });
  doc.setFontSize(8);
  doc.text(tr(pdfT.cut2, lang), centerX, midY, { align: 'center' });

  doc.setFontSize(7);
  doc.setTextColor(80, 80, 80);
  doc.text(`${tr(pdfT.outseam, lang)} = ${formatMeasurement(m.outseamLength, unit)}`, O - 8, offsetY + v(m.outseamLength) / 2, { angle: 90 });
}

// ─────────────────────────────────────────────────────────────────────────────

export function generatePatternPDF(
  measurements: SkirtMeasurements | BodiceMeasurements | SleeveMeasurements | PantsMeasurements,
  patternType: string = 'skirt',
  unit: MeasurementUnit = 'cm',
  lang: Language = 'en',
  userName: string = '',
  category: Category = 'women'
): void {
  const bodiceTypes = ['bodice', 'bodice-dartless', 'bodice-with-darts', 'bodice-knit', 'dress'];
  const isBodice = bodiceTypes.includes(patternType);
  const isSleeve = patternType === 'sleeve';
  const isPants  = patternType === 'pants' || patternType === 'pants-dartless' || patternType === 'pants-with-darts';
  const pantsHasDarts = patternType === 'pants-with-darts';

  const sm = measurements as SkirtMeasurements;
  const bm = measurements as BodiceMeasurements;
  const slm = measurements as SleeveMeasurements;
  const pm  = measurements as PantsMeasurements;

  const dimensions = isSleeve
    ? calculateSleeveDimensions(slm)
    : isBodice
      ? calculateBodiceDimensions(bm)
      : isPants
        ? calculatePantsDimensions(pm, category)
        : calculateSkirtDimensions(sm);

  const tiles = calculateTiles(dimensions);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const patternMarginMm = 20;
  let pageNum = 0;

  const panels: ('front' | 'back')[] = isSleeve ? ['front'] : ['front', 'back'];

  for (const panel of panels) {
    for (let row = 0; row < tiles.rows; row++) {
      for (let col = 0; col < tiles.cols; col++) {
        if (pageNum > 0) doc.addPage();
        pageNum++;

        const viewOffsetX = col * PRINTABLE_WIDTH;
        const viewOffsetY = row * PRINTABLE_HEIGHT;

        drawAlignmentMarks(doc, col, row, tiles.cols, tiles.rows);
        drawPageInfo(doc, pageNum, tiles.totalPages * panels.length, col, row, lang);

        if (pageNum === 1) draw1cmTestSquare(doc, unit, lang);

        doc.saveGraphicsState();
        // Clip content to the printable tile so pattern lines never bleed across pages.
        // jsPDF internal coords: y-up from bottom, scaleFactor converts mm → PDF pts.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pdfInt = (doc as any).internal;
        const k: number = pdfInt.scaleFactor;
        const pH: number = pdfInt.pageSize.getHeight(); // mm
        pdfInt.write(
          `${(MARGIN * k).toFixed(3)} ${((pH - MARGIN - PRINTABLE_HEIGHT) * k).toFixed(3)} ` +
          `${(PRINTABLE_WIDTH * k).toFixed(3)} ${(PRINTABLE_HEIGHT * k).toFixed(3)} re W n`
        );

        const patternX = patternMarginMm - viewOffsetX + MARGIN;
        const patternY = patternMarginMm - viewOffsetY + MARGIN;

        if (isSleeve) {
          drawSleevePatternPiece(doc, slm, patternX, patternY, unit, lang);
        } else if (isBodice) {
          drawBodicePatternPiece(doc, bm, patternX, patternY, panel, unit, lang);
        } else if (isPants) {
          if (panel === 'back') {
            drawPantsBackPanel(doc, pm, patternX, patternY, category, pantsHasDarts, unit, lang);
          } else {
            drawPantsFrontPanel(doc, pm, patternX, patternY, category, pantsHasDarts, unit, lang);
          }
        } else {
          drawSkirtPatternPiece(doc, sm, patternX, patternY, panel, unit, lang);
        }

        doc.restoreGraphicsState();
      }
    }
  }

  // ── Assembly instruction page ──
  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(tr(pdfT.assemblyTitle, lang), A4_WIDTH / 2, 30, { align: 'center' });

  doc.setFontSize(10);
  const panelDescription = isSleeve ? tr(pdfT.singlePanel, lang) : tr(pdfT.frontBackPanels, lang);
  const patternName = pdfT.patternTypes[lang][patternType] ?? patternType.charAt(0).toUpperCase() + patternType.slice(1);
  const baseInstructions = [
    ...tr(pdfT.instructions, lang),
    '',
    `${tr(pdfT.patternLabel, lang)}: ${patternName} - ${panelDescription}`,
    `${tr(pdfT.totalPages, lang)}: ${tiles.totalPages * panels.length}`,
    '',
    tr(pdfT.measurementsUsed, lang),
  ];

  const measurementLines = isSleeve
    ? [
        `  • ${tr(pdfT.upperArm, lang)}: ${formatMeasurement(slm.upperArm, unit)}`,
        `  • ${tr(pdfT.wrist, lang)}: ${formatMeasurement(slm.wrist, unit)}`,
        `  • ${tr(pdfT.sleeveLength, lang)}: ${formatMeasurement(slm.sleeveLength, unit)}`,
        `  • ${tr(pdfT.elbowLength, lang)}: ${formatMeasurement(slm.elbowLength, unit)}`,
        `  • ${tr(pdfT.armholeDepth, lang)}: ${formatMeasurement(slm.armholeDepth, unit)}`,
      ]
    : isBodice
      ? [
          `  • ${tr(pdfT.bust, lang)}: ${formatMeasurement(bm.bust, unit)}`,
          `  • ${tr(pdfT.neckline, lang)}: ${formatMeasurement(bm.neckCircumference, unit)}`,
          `  • ${tr(pdfT.shoulderLength, lang)}: ${formatMeasurement(bm.shoulderLength, unit)}`,
          `  • ${tr(pdfT.backWidth, lang)}: ${formatMeasurement(bm.backWidth, unit)}`,
          `  • ${tr(pdfT.backLength, lang)}: ${formatMeasurement(bm.backLength, unit)}`,
        ]
      : isPants
        ? [
            `  • ${tr(pdfT.waist, lang)}: ${formatMeasurement(pm.waist, unit)}`,
            `  • ${tr(pdfT.hip, lang)}: ${formatMeasurement(pm.hip, unit)}`,
            `  • ${tr(pdfT.outseam, lang)}: ${formatMeasurement(pm.outseamLength, unit)}`,
          ]
        : [
            `  • ${tr(pdfT.waist, lang)}: ${formatMeasurement(sm.waist, unit)}`,
            `  • ${tr(pdfT.hip, lang)}: ${formatMeasurement(sm.hip, unit)}`,
            `  • ${tr(pdfT.waistToHip, lang)}: ${formatMeasurement(sm.waistToHip, unit)}`,
            `  • ${tr(pdfT.skirtLength, lang)}: ${formatMeasurement(sm.skirtLength, unit)}`,
          ];

  const allLines = [...baseInstructions, ...measurementLines];
  let y = 50;
  allLines.forEach((line) => { doc.text(line, MARGIN + 10, y); y += 7; });

  // ── Tile layout diagram ──
  y += 10;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(tr(pdfT.pageLayout, lang), MARGIN + 10, y);
  y += 8;

  const tileW = 18;
  const tileH = Math.round(tileW * PRINTABLE_HEIGHT / PRINTABLE_WIDTH);
  const panelGap = 12;
  const diagScale = tileW / PRINTABLE_WIDTH;

  panels.forEach((panel, panelIndex) => {
    const panelDiagramX = MARGIN + 10 + panelIndex * (tiles.cols * tileW + panelGap);
    const panelDiagramY = y;

    for (let row = 0; row < tiles.rows; row++) {
      for (let col = 0; col < tiles.cols; col++) {
        const tileX = panelDiagramX + col * tileW;
        const tileY = panelDiagramY + row * tileH;
        const pageNumber = panelIndex * tiles.totalPages + row * tiles.cols + col + 1;
        doc.setFillColor(245, 245, 245);
        doc.setDrawColor(160, 160, 160);
        doc.setLineWidth(0.3);
        doc.rect(tileX, tileY, tileW, tileH, 'FD');
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        doc.text(String(pageNumber), tileX + tileW / 2, tileY + tileH / 2 + 2, { align: 'center' });
      }
    }

    const patternStartX = panelDiagramX + patternMarginMm * diagScale;
    const patternStartY = panelDiagramY + patternMarginMm * diagScale;

    if (isSleeve) {
      drawDiagramSleeve(doc, slm, patternStartX, patternStartY, diagScale, diagScale);
    } else if (isBodice) {
      drawDiagramBodice(doc, bm, patternStartX, patternStartY, panel, diagScale, diagScale);
    } else if (!isPants) {
      drawDiagramSkirt(doc, sm, patternStartX, patternStartY, panel, diagScale, diagScale);
    }
    // Pants diagram: skip (pattern too complex for small tile)

    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    const panelLabel = isSleeve
      ? tr(pdfT.sleeve, lang)
      : panel === 'front' ? tr(pdfT.front, lang) : tr(pdfT.back, lang);
    doc.text(panelLabel, panelDiagramX + (tiles.cols * tileW) / 2, panelDiagramY + tiles.rows * tileH + 6, { align: 'center' });
  });

  const date = new Date().toISOString().slice(0, 10);
  const typeLabel = pdfT.patternTypes[lang][patternType] ?? patternType;
  const prefix = lang === 'fr' ? 'patron de base' : 'basic block';
  const namePart = userName ? ` - ${userName}` : '';
  doc.save(`${prefix} - ${typeLabel.toLowerCase()} - ${date}${namePart}.pdf`);
}
