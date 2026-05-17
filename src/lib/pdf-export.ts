import jsPDF from 'jspdf';
import { SkirtMeasurements, BodiceMeasurements, SleeveMeasurements, isBodiceMeasurements, isSleeveMeasurements } from '@/types/sloper';
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
      '3. Cut along the outer edges of each page, leaving the alignment marks intact.',
      '4. Match up the alignment marks and circles from adjacent pages.',
      '5. Tape or glue pages together, starting from the top-left corner.',
      '6. Once assembled, cut out the pattern piece along the solid black line.',
    ],
    fr: [
      "1. Imprimez toutes les pages à 100% (sans mise à l'échelle).",
      '2. Vérifiez que le carré test de 1cm mesure exactement 1cm x 1cm.',
      '3. Découpez les bords extérieurs de chaque page en conservant les repères.',
      '4. Alignez les repères et cercles des pages adjacentes.',
      '5. Collez ou scotchez les pages en commençant par le coin supérieur gauche.',
      '6. Une fois assemblé, découpez le patron le long du trait plein noir.',
    ],
  },
  patternLabel: { en: 'Pattern', fr: 'Patron' },
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

  if (pageCol > 0 || pageRow > 0) {
    doc.line(MARGIN, MARGIN, MARGIN + MARK_SIZE, MARGIN);
    doc.line(MARGIN, MARGIN, MARGIN, MARGIN + MARK_SIZE);
    doc.line(MARGIN - MARK_OFFSET, MARGIN - MARK_OFFSET, MARGIN + MARK_OFFSET, MARGIN + MARK_OFFSET);
    doc.line(MARGIN - MARK_OFFSET, MARGIN + MARK_OFFSET, MARGIN + MARK_OFFSET, MARGIN - MARK_OFFSET);
  }

  if (pageCol < totalCols - 1 || pageRow > 0) {
    doc.line(A4_WIDTH - MARGIN - MARK_SIZE, MARGIN, A4_WIDTH - MARGIN, MARGIN);
    doc.line(A4_WIDTH - MARGIN, MARGIN, A4_WIDTH - MARGIN, MARGIN + MARK_SIZE);
  }

  if (pageCol > 0 || pageRow < totalRows - 1) {
    doc.line(MARGIN, A4_HEIGHT - MARGIN - MARK_SIZE, MARGIN, A4_HEIGHT - MARGIN);
    doc.line(MARGIN, A4_HEIGHT - MARGIN, MARGIN + MARK_SIZE, A4_HEIGHT - MARGIN);
  }

  if (pageCol < totalCols - 1 || pageRow < totalRows - 1) {
    doc.line(A4_WIDTH - MARGIN - MARK_SIZE, A4_HEIGHT - MARGIN, A4_WIDTH - MARGIN, A4_HEIGHT - MARGIN);
    doc.line(A4_WIDTH - MARGIN, A4_HEIGHT - MARGIN - MARK_SIZE, A4_WIDTH - MARGIN, A4_HEIGHT - MARGIN);
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
  doc.text(tr(pdfT.cutOnFold, lang), A4_WIDTH - MARGIN, A4_HEIGHT - 3, { align: 'right' });
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

  const armholeDepthMm = backLength * 0.5 * 10;

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
  doc.text(`${tr(pdfT.quarterBust, lang)} = ${formatMeasurement(bust / 4 + 1, unit)}`, offsetX + bustQuarterMm / 2, offsetY + armholeDepthMm + 5);
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

  doc.setFillColor(220, 235, 195);
  doc.setDrawColor(80, 120, 40);
  doc.setLineWidth(0.5);
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

  doc.setFillColor(220, 235, 195);
  doc.setDrawColor(80, 120, 40);
  doc.setLineWidth(0.5);
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

  doc.setFillColor(220, 235, 195);
  doc.setDrawColor(80, 120, 40);
  doc.setLineWidth(0.5);
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

export function generatePatternPDF(
  measurements: SkirtMeasurements | BodiceMeasurements | SleeveMeasurements,
  patternType: string = 'skirt',
  unit: MeasurementUnit = 'cm',
  lang: Language = 'en'
): void {
  const isBodice = isBodiceMeasurements(measurements);
  const isSleeve = isSleeveMeasurements(measurements);

  const dimensions = isSleeve
    ? calculateSleeveDimensions(measurements)
    : isBodice
      ? calculateBodiceDimensions(measurements)
      : calculateSkirtDimensions(measurements as SkirtMeasurements);

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
        if (pageNum > 0) {
          doc.addPage();
        }
        pageNum++;

        const viewOffsetX = col * PRINTABLE_WIDTH;
        const viewOffsetY = row * PRINTABLE_HEIGHT;

        drawAlignmentMarks(doc, col, row, tiles.cols, tiles.rows);
        drawPageInfo(doc, pageNum, tiles.totalPages * panels.length, col, row, lang);

        if (pageNum === 1) {
          draw1cmTestSquare(doc, unit, lang);
        }

        doc.saveGraphicsState();
        doc.rect(MARGIN, MARGIN, PRINTABLE_WIDTH, PRINTABLE_HEIGHT);

        const patternX = patternMarginMm - viewOffsetX + MARGIN;
        const patternY = patternMarginMm - viewOffsetY + MARGIN;

        if (isSleeve) {
          drawSleevePatternPiece(doc, measurements, patternX, patternY, unit, lang);
        } else if (isBodice) {
          drawBodicePatternPiece(doc, measurements, patternX, patternY, panel, unit, lang);
        } else {
          drawSkirtPatternPiece(doc, measurements as SkirtMeasurements, patternX, patternY, panel, unit, lang);
        }

        doc.restoreGraphicsState();
      }
    }
  }

  // Assembly instruction page
  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(tr(pdfT.assemblyTitle, lang), A4_WIDTH / 2, 30, { align: 'center' });

  doc.setFontSize(10);
  const panelDescription = isSleeve ? tr(pdfT.singlePanel, lang) : tr(pdfT.frontBackPanels, lang);
  const patternName = patternType.charAt(0).toUpperCase() + patternType.slice(1);
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
        `  • ${tr(pdfT.upperArm, lang)}: ${formatMeasurement((measurements as SleeveMeasurements).upperArm, unit)}`,
        `  • ${tr(pdfT.wrist, lang)}: ${formatMeasurement((measurements as SleeveMeasurements).wrist, unit)}`,
        `  • ${tr(pdfT.sleeveLength, lang)}: ${formatMeasurement((measurements as SleeveMeasurements).sleeveLength, unit)}`,
        `  • ${tr(pdfT.elbowLength, lang)}: ${formatMeasurement((measurements as SleeveMeasurements).elbowLength, unit)}`,
        `  • ${tr(pdfT.armholeDepth, lang)}: ${formatMeasurement((measurements as SleeveMeasurements).armholeDepth, unit)}`,
      ]
    : isBodice
      ? [
          `  • ${tr(pdfT.bust, lang)}: ${formatMeasurement((measurements as BodiceMeasurements).bust, unit)}`,
          `  • ${tr(pdfT.neckline, lang)}: ${formatMeasurement((measurements as BodiceMeasurements).neckCircumference, unit)}`,
          `  • ${tr(pdfT.shoulderLength, lang)}: ${formatMeasurement((measurements as BodiceMeasurements).shoulderLength, unit)}`,
          `  • ${tr(pdfT.backWidth, lang)}: ${formatMeasurement((measurements as BodiceMeasurements).backWidth, unit)}`,
          `  • ${tr(pdfT.backLength, lang)}: ${formatMeasurement((measurements as BodiceMeasurements).backLength, unit)}`,
        ]
      : [
          `  • ${tr(pdfT.waist, lang)}: ${formatMeasurement((measurements as SkirtMeasurements).waist, unit)}`,
          `  • ${tr(pdfT.hip, lang)}: ${formatMeasurement((measurements as SkirtMeasurements).hip, unit)}`,
          `  • ${tr(pdfT.waistToHip, lang)}: ${formatMeasurement((measurements as SkirtMeasurements).waistToHip, unit)}`,
          `  • ${tr(pdfT.skirtLength, lang)}: ${formatMeasurement((measurements as SkirtMeasurements).skirtLength, unit)}`,
        ];

  const allLines = [...baseInstructions, ...measurementLines];

  let y = 50;
  allLines.forEach((line) => {
    doc.text(line, MARGIN + 10, y);
    y += 7;
  });

  // Tile layout diagram
  y += 10;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(tr(pdfT.pageLayout, lang), MARGIN + 10, y);
  y += 8;

  const diagramScale = 22; // mm per page tile in diagram
  const panelGap = 12;     // mm between front and back grids
  const scaleX = diagramScale / PRINTABLE_WIDTH;
  const scaleY = diagramScale / PRINTABLE_HEIGHT;

  panels.forEach((panel, panelIndex) => {
    const panelDiagramX = MARGIN + 10 + panelIndex * (tiles.cols * diagramScale + panelGap);
    const panelDiagramY = y;

    // Draw tile grid with light gray background
    for (let row = 0; row < tiles.rows; row++) {
      for (let col = 0; col < tiles.cols; col++) {
        const tileX = panelDiagramX + col * diagramScale;
        const tileY = panelDiagramY + row * diagramScale;
        const pageNumber = panelIndex * tiles.totalPages + row * tiles.cols + col + 1;

        doc.setFillColor(245, 245, 245);
        doc.setDrawColor(180, 180, 180);
        doc.setLineWidth(0.3);
        doc.rect(tileX, tileY, diagramScale, diagramScale, 'FD');

        doc.setFontSize(6);
        doc.setTextColor(190, 190, 190);
        doc.text(String(pageNumber), tileX + 2.5, tileY + 4);
      }
    }

    // Draw pattern outline scaled to tile grid
    const patternStartX = panelDiagramX + patternMarginMm * scaleX;
    const patternStartY = panelDiagramY + patternMarginMm * scaleY;

    if (isSleeve) {
      drawDiagramSleeve(doc, measurements as SleeveMeasurements, patternStartX, patternStartY, scaleX, scaleY);
    } else if (isBodice) {
      drawDiagramBodice(doc, measurements as BodiceMeasurements, patternStartX, patternStartY, panel, scaleX, scaleY);
    } else {
      drawDiagramSkirt(doc, measurements as SkirtMeasurements, patternStartX, patternStartY, panel, scaleX, scaleY);
    }

    // Panel label below grid
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    const panelLabel = isSleeve
      ? tr(pdfT.sleeve, lang)
      : panel === 'front' ? tr(pdfT.front, lang) : tr(pdfT.back, lang);
    doc.text(panelLabel, panelDiagramX + (tiles.cols * diagramScale) / 2, panelDiagramY + tiles.rows * diagramScale + 6, { align: 'center' });
  });

  doc.save(`${patternType}-pattern.pdf`);
}
