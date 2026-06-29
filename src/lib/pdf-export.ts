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
      '3. Cut along the right and top edges of each page only',
      '   (keep the left and bottom margins for taping pages together).',
      '4. Match up the alignment marks and circles from adjacent pages.',
      '5. Tape or glue pages together, starting from the top-left corner.',
      '6. Once assembled, cut out the pattern piece along the solid black line.',
      '7. This pattern is a basic block with no seam allowances.',
    ],
    fr: [
      "1. Imprimez toutes les pages à 100% (sans mise à l'échelle).",
      '2. Vérifiez que le carré test de 1cm mesure exactement 1cm x 1cm.',
      "3. Découpez le bord droit et le bord supérieur de chaque feuille uniquement",
      "   (conserver les marges gauche et bas pour coller les feuilles ensemble).",
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
  noSeamAllowance: { en: 'No seam allowances', fr: 'Sans marges de couture' },
  seamWarnLine1: {
    en: '⚠ WARNING: This pattern contains no seam allowances.',
    fr: '⚠ ATTENTION : ce patron ne contient pas de marges de couture.',
  },
  seamWarnLine2: {
    en: 'Add seam allowances (typically 1–1.5 cm) when transferring to fabric.',
    fr: 'Ajoutez vos marges (généralement 1 à 1,5 cm) lors du transfert sur le tissu.',
  },
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
  if (col === 0 && row === 0) {
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
  lang: Language = 'en',
  tileCol: number = 0,
  tileRow: number = 0,
  category: Category = 'women'
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
  const waistRiseMm = category === 'kids' ? 10 : 12.5;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);

  // Fold edge (center)
  doc.line(offsetX, offsetY, offsetX, offsetY + lengthMm);

  // Waist: center → dart start
  doc.line(offsetX, offsetY, offsetX + centerToDart, offsetY);

  // Dart
  const afterDartX = offsetX + centerToDart + dartWidth;
  doc.line(offsetX + centerToDart, offsetY, offsetX + centerToDart + dartWidth / 2, offsetY + dartLength);
  doc.line(offsetX + centerToDart + dartWidth / 2, offsetY + dartLength, afterDartX, offsetY);

  // Waist curve: after dart → waist end (raised by waistRiseMm)
  const waistEndX = offsetX + waistWidth;
  const waistEndY = offsetY - waistRiseMm;
  drawCubicBezier(doc,
    afterDartX, offsetY,
    afterDartX + (waistEndX - afterDartX) / 2, offsetY,
    waistEndX, waistEndY,
    waistEndX, waistEndY,
    8
  );

  // Side seam bezier: waist end → hip level
  const hipEndX = offsetX + patternWidth;
  const hipEndY = offsetY + waistToHipMm + waistRiseMm;
  drawCubicBezier(doc,
    waistEndX, waistEndY,
    waistEndX, waistEndY,
    hipEndX, offsetY + waistToHipMm / 4,
    hipEndX, hipEndY,
    10
  );

  // Hip → hem (straight)
  doc.line(hipEndX, hipEndY, hipEndX, offsetY + lengthMm);

  // Hem
  doc.line(hipEndX, offsetY + lengthMm, offsetX, offsetY + lengthMm);

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

  if (tileCol === 0 && tileRow === 0) {
    // Clamp label Y so it stays within the first tile even for long skirts
    const labelY = offsetY + Math.min(lengthMm / 2, PRINTABLE_HEIGHT * 0.45);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(isFront ? tr(pdfT.front, lang) : tr(pdfT.back, lang), offsetX + patternWidth / 2, labelY, { align: 'center' });

    doc.setFontSize(7);
    doc.setTextColor(80, 80, 80);
    doc.text(tr(pdfT.noSeamAllowance, lang), offsetX + patternWidth / 2, labelY + 5, { align: 'center' });

    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(tr(pdfT.cut1OnFold, lang), offsetX + patternWidth / 2, labelY + 10, { align: 'center' });

    doc.setFontSize(7);
    doc.setTextColor(80, 80, 80);
    const dartWidthCm = isFront ? dartWidthBase : dartWidthBase * 1.2;
    doc.text(`${tr(pdfT.quarterWaistDart, lang)} = ${formatMeasurement(waist / 4 + dartWidthCm + 1, unit)}`, offsetX + waistWidth / 2, offsetY - 5, { align: 'center' });
    doc.text(`${tr(pdfT.length, lang)} = ${formatMeasurement(skirtLength, unit)}`, offsetX - 8, labelY, { angle: 90 });
    doc.text(`${tr(pdfT.quarterHip, lang)} = ${formatMeasurement(hip / 4 + 1, unit)}`, offsetX + patternWidth + 8, offsetY + waistToHipMm + (lengthMm - waistToHipMm) / 2, { angle: 270 });
  }
}

function drawBodicePatternPiece(
  doc: jsPDF,
  measurements: BodiceMeasurements,
  offsetX: number,
  offsetY: number,
  panel: 'front' | 'back' = 'front',
  unit: MeasurementUnit = 'cm',
  lang: Language = 'en',
  tileCol: number = 0,
  tileRow: number = 0
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

  // Text labels only on the top-left tile of each panel.
  if (tileCol === 0 && tileRow === 0) {
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(isFront ? tr(pdfT.front, lang) : tr(pdfT.back, lang), offsetX + bustQuarterMm / 2, offsetY + backLengthMm / 2, { align: 'center' });

    doc.setFontSize(7);
    doc.setTextColor(80, 80, 80);
    doc.text(tr(pdfT.noSeamAllowance, lang), offsetX + bustQuarterMm / 2, offsetY + backLengthMm / 2 + 5, { align: 'center' });

    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(tr(pdfT.cut1OnFold, lang), offsetX + bustQuarterMm / 2, offsetY + backLengthMm / 2 + 10, { align: 'center' });

    doc.setFontSize(7);
    doc.setTextColor(80, 80, 80);
    // quarterBust centered below the name label (stays within this tile's bounds)
    doc.text(`${tr(pdfT.quarterBust, lang)} = ${formatMeasurement(bust / 4 + 1, unit)}`, offsetX + bustQuarterMm / 2, offsetY + backLengthMm / 2 + 18, { align: 'center' });
    // backLength along the fold edge (left margin)
    doc.text(`${tr(pdfT.backLength, lang)} = ${formatMeasurement(backLength, unit)}`, offsetX - 8, offsetY + backLengthMm / 2, { angle: 90 });
  }
}

// Mirrors categoryConfig in DartlessBodicePanelPath.tsx
const dartlessBodiceConfig: Record<string, {
  ease: number; neckWidthDivisor: number; neckWidthAdd: number;
  frontNeckDepthDivisor: number; frontNeckDepthAdd: number;
  backNeckDepthDivisor: number; backNeckDepthAdd: number;
  armholeDepthRatio: number; midpointFrontAdd: number; midpointBackAdd: number;
  riseBack: number; extraDropFront: number;
  frontShoulderAdd: number; backShoulderAdd: number;
}> = {
  women: {
    ease: 2, neckWidthDivisor: 6, neckWidthAdd: 1.6,
    frontNeckDepthDivisor: 6, frontNeckDepthAdd: 2,
    backNeckDepthDivisor: 16, backNeckDepthAdd: 0,
    armholeDepthRatio: 0.5, midpointFrontAdd: -1.3, midpointBackAdd: 0,
    riseBack: 4, extraDropFront: 5, frontShoulderAdd: 0, backShoulderAdd: 0,
  },
  men: {
    ease: 3, neckWidthDivisor: 5, neckWidthAdd: 0,
    frontNeckDepthDivisor: 5, frontNeckDepthAdd: 0.5,
    backNeckDepthDivisor: 20, backNeckDepthAdd: 0,
    armholeDepthRatio: 0.48, midpointFrontAdd: 0.25, midpointBackAdd: 0,
    riseBack: 5, extraDropFront: 6, frontShoulderAdd: 0, backShoulderAdd: 0,
  },
  kids: {
    ease: 2.5, neckWidthDivisor: 6, neckWidthAdd: 0.2,
    frontNeckDepthDivisor: 6, frontNeckDepthAdd: 0.2,
    backNeckDepthDivisor: 18, backNeckDepthAdd: 0,
    armholeDepthRatio: 0.52, midpointFrontAdd: 0, midpointBackAdd: 0,
    riseBack: 3.2, extraDropFront: 2.5, frontShoulderAdd: 0, backShoulderAdd: 0,
  },
};

function drawDartlessBodicePiece(
  doc: jsPDF,
  measurements: BodiceMeasurements,
  category: Category,
  offsetX: number,
  offsetY: number,
  panel: 'front' | 'back',
  unit: MeasurementUnit,
  lang: Language,
  tileCol: number = 0,
  tileRow: number = 0
) {
  const { bust, neckCircumference, shoulderLength, backWidth, backLength, ease: customEase } = measurements;
  const cfg = dartlessBodiceConfig[category] ?? dartlessBodiceConfig['women'];
  const mm = (cm: number) => cm * 10;
  const ease = customEase ?? cfg.ease;

  // Neckline dimensions (same formulas as DartlessBodicePanelPath)
  const neckHalfWidthCm = neckCircumference / cfg.neckWidthDivisor + cfg.neckWidthAdd;
  const neckHalfWidthMm = mm(neckHalfWidthCm);
  const frontNeckDepthCm = neckCircumference / cfg.frontNeckDepthDivisor + cfg.frontNeckDepthAdd;
  const backNeckDepthCm  = neckCircumference / cfg.backNeckDepthDivisor  + cfg.backNeckDepthAdd;
  const neckHalfHeightMm = panel === 'front' ? mm(frontNeckDepthCm) : mm(backNeckDepthCm);

  // Shift the whole pattern down so the neckline arc peak (which goes
  // backNeckDepthCm above the neck centre) lands at offsetY, not above the clip margin.
  const neckShiftY = mm(backNeckDepthCm);

  // Front panel also shifted so both panels share the same waist Y
  const newOffsetY = panel === 'front'
    ? offsetY + neckShiftY + mm(frontNeckDepthCm - backNeckDepthCm)
    : offsetY + neckShiftY;

  // Shoulder slope — trig-based (same as SVG component)
  const angleBack  = Math.atan2(cfg.riseBack,       backWidth / 2 + cfg.midpointBackAdd  - neckHalfWidthCm);
  const angleFront = Math.atan2(cfg.extraDropFront, backWidth / 2 + cfg.midpointFrontAdd - neckHalfWidthCm);
  const angle = panel === 'back' ? angleBack : angleFront;
  const L     = panel === 'back'
    ? shoulderLength + cfg.backShoulderAdd
    : shoulderLength + cfg.backShoulderAdd + cfg.frontShoulderAdd;

  const shoulderWidthX = mm(Math.cos(angle) * L);
  const shoulderSlopeY = mm(Math.sin(angle) * L);

  const bustQuarterMm = mm(bust / 4 + ease);
  const backLengthMm  = panel === 'front'
    ? mm(backLength) + mm(backNeckDepthCm) - mm(frontNeckDepthCm)
    : mm(backLength);

  // Key geometry points
  const neckEndX     = offsetX + neckHalfWidthMm;
  const neckEndY     = newOffsetY - neckHalfHeightMm;
  const shoulderEndX = neckEndX + shoulderWidthX;
  const shoulderEndY = neckEndY + shoulderSlopeY;

  const armholeRetreatX = mm(bust / 4 + ease - backWidth / 2 - cfg.midpointFrontAdd);
  const midPointX = offsetX + bustQuarterMm - armholeRetreatX;
  const midPointY = offsetY + backLengthMm / 3;

  const armholeEndX = offsetX + bustQuarterMm;
  const armholeEndY = newOffsetY + backLengthMm - mm(backLength) / 2 + mm(1);

  const waistY = newOffsetY + backLengthMm;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);

  // Fold edge (center front / center back)
  doc.line(offsetX, newOffsetY, offsetX, waistY);

  // Neckline bezier curve
  drawCubicBezier(doc,
    offsetX, newOffsetY,
    offsetX + neckHalfWidthMm * 0.65, newOffsetY,
    offsetX + neckHalfWidthMm * 0.85, newOffsetY - neckHalfHeightMm * 0.5,
    neckEndX, neckEndY,
    12
  );

  // Shoulder line
  doc.line(neckEndX, neckEndY, shoulderEndX, shoulderEndY);

  // Armhole — first bezier (shoulder → midpoint)
  drawCubicBezier(doc,
    shoulderEndX, shoulderEndY,
    shoulderEndX, shoulderEndY,
    midPointX, midPointY + (shoulderEndY - midPointY) * 0.5,
    midPointX, midPointY,
    10
  );

  // Armhole — second bezier (midpoint → side seam)
  drawCubicBezier(doc,
    midPointX, midPointY,
    midPointX, midPointY + (armholeEndY - midPointY) * 0.8,
    armholeEndX - (armholeEndX - midPointX) * 0.5, armholeEndY,
    armholeEndX, armholeEndY,
    10
  );

  // Side seam
  doc.line(armholeEndX, armholeEndY, offsetX + bustQuarterMm, waistY);

  // Waist
  doc.line(offsetX + bustQuarterMm, waistY, offsetX, waistY);

  // Grain line
  const grainX = offsetX + bustQuarterMm * 0.4;
  const grainTop = newOffsetY + backLengthMm * 0.2;
  const grainBot = newOffsetY + backLengthMm * 0.8;
  doc.setLineDashPattern([3, 2], 0);
  doc.line(grainX, grainTop, grainX, grainBot);
  doc.setLineDashPattern([], 0);
  const a = 4;
  doc.line(grainX - a, grainTop + a, grainX, grainTop);
  doc.line(grainX + a, grainTop + a, grainX, grainTop);
  doc.line(grainX - a, grainBot - a, grainX, grainBot);
  doc.line(grainX + a, grainBot - a, grainX, grainBot);

  if (tileCol === 0 && tileRow === 0) {
    const isFront = panel === 'front';
    const cx = offsetX + bustQuarterMm / 2;
    const cy = newOffsetY + backLengthMm / 2;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(isFront ? tr(pdfT.front, lang) : tr(pdfT.back, lang), cx, cy, { align: 'center' });
    doc.setFontSize(7);
    doc.setTextColor(80, 80, 80);
    doc.text(tr(pdfT.noSeamAllowance, lang), cx, cy + 5, { align: 'center' });
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(tr(pdfT.cut1OnFold, lang), cx, cy + 10, { align: 'center' });
    doc.setFontSize(7);
    doc.setTextColor(80, 80, 80);
    doc.text(`${tr(pdfT.quarterBust, lang)} = ${formatMeasurement(bust / 4 + ease, unit)}`, cx, cy + 18, { align: 'center' });
    doc.text(`${tr(pdfT.backLength, lang)} = ${formatMeasurement(backLength, unit)}`, offsetX - 8, newOffsetY + backLengthMm / 2, { angle: 90 });
  }
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
  doc.text(tr(pdfT.sleeve, lang), centerX, underarmY + totalLengthMm / 2, { align: 'center' });
  doc.setFontSize(7);
  doc.setTextColor(80, 80, 80);
  doc.text(tr(pdfT.noSeamAllowance, lang), centerX, underarmY + totalLengthMm / 2 + 5, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text(tr(pdfT.cut2, lang), centerX, underarmY + totalLengthMm / 2 + 10, { align: 'center' });

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
  scaleY: number,
  category: Category = 'women'
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
  const afterDart = centerToDart + dartWidth;
  const waistRise = category === 'kids' ? 10 : 12.5;

  // Waist bezier: cp1 at mid-x same Y, cp2=end at waistWidth raised by waistRise
  const wCp1x = (waistWidth - afterDart) / 2; // relative half-distance
  const wDx = waistWidth - afterDart;

  // Side seam bezier: from (waistWidth, -waistRise) to (patternWidth, waistToHipMm + waistRise)
  const sDx = patternWidth - waistWidth;

  doc.setFillColor(238, 246, 225);
  doc.setDrawColor(110, 150, 60);
  doc.setLineWidth(0.3);
  doc.lines(
    [
      // Center → dart start
      [centerToDart * scaleX, 0],
      // Dart down
      [(dartWidth / 2) * scaleX, dartLength * scaleY],
      // Dart up
      [(dartWidth / 2) * scaleX, -dartLength * scaleY],
      // Waist bezier: after dart → waist end (raised)
      [wCp1x * scaleX, 0, wDx * scaleX, -waistRise * scaleY, wDx * scaleX, -waistRise * scaleY],
      // Side seam bezier: waist end → hip level
      [0, 0, sDx * scaleX, (waistToHipMm / 4 + waistRise) * scaleY, sDx * scaleX, (waistToHipMm + 2 * waistRise) * scaleY],
      // Hip → hem
      [0, (lengthMm - waistToHipMm - waistRise) * scaleY],
      // Hem
      [-patternWidth * scaleX, 0],
      // Fold edge closed automatically
    ] as number[][],
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

function drawDiagramDartlessBodice(
  doc: jsPDF,
  m: BodiceMeasurements,
  category: Category,
  startX: number,
  startY: number,
  panel: 'front' | 'back',
  scaleX: number,
  scaleY: number
) {
  const cfg = dartlessBodiceConfig[category] ?? dartlessBodiceConfig['women'];
  const mm = (cm: number) => cm * 10;
  const ease = m.ease ?? cfg.ease;
  const { bust, neckCircumference, shoulderLength, backWidth, backLength } = m;

  const neckHalfWidthCm = neckCircumference / cfg.neckWidthDivisor + cfg.neckWidthAdd;
  const nW = mm(neckHalfWidthCm);
  const frontNeckDepthCm = neckCircumference / cfg.frontNeckDepthDivisor + cfg.frontNeckDepthAdd;
  const backNeckDepthCm  = neckCircumference / cfg.backNeckDepthDivisor  + cfg.backNeckDepthAdd;
  const nH = panel === 'front' ? mm(frontNeckDepthCm) : mm(backNeckDepthCm);

  // Shift down so the neckline arc peak aligns with startY (arc goes up by backNeckDepth)
  const topOffset = mm(backNeckDepthCm) * scaleY;
  const newOffsetY = panel === 'front'
    ? startY + topOffset + mm(frontNeckDepthCm - backNeckDepthCm) * scaleY
    : startY + topOffset;

  const angleBack  = Math.atan2(cfg.riseBack,       backWidth / 2 + cfg.midpointBackAdd  - neckHalfWidthCm);
  const angleFront = Math.atan2(cfg.extraDropFront,  backWidth / 2 + cfg.midpointFrontAdd - neckHalfWidthCm);
  const angle = panel === 'back' ? angleBack : angleFront;
  const L = panel === 'back'
    ? shoulderLength + cfg.backShoulderAdd
    : shoulderLength + cfg.backShoulderAdd + cfg.frontShoulderAdd;
  const sWx = mm(Math.cos(angle) * L);
  const sWy = mm(Math.sin(angle) * L);

  const bqMm = mm(bust / 4 + ease);
  const blMm = panel === 'front'
    ? mm(backLength) + mm(backNeckDepthCm) - mm(frontNeckDepthCm)
    : mm(backLength);

  const arX = mm(bust / 4 + ease - backWidth / 2 - cfg.midpointFrontAdd);
  const mPx = bqMm - arX;
  const mPy = blMm / 3;
  const aEy = blMm - mm(backLength) / 2 + mm(1);

  // Relative coordinates in mm for each intermediate point (from neck-center origin)
  const sEndX = nW + sWx;
  const sEndY = -nH + sWy;

  doc.setFillColor(238, 246, 225);
  doc.setDrawColor(110, 150, 60);
  doc.setLineWidth(0.3);
  doc.lines(
    [
      // Neckline bezier: neck center → shoulder start
      [nW * 0.65 * scaleX, 0, nW * 0.85 * scaleX, -nH * 0.5 * scaleY, nW * scaleX, -nH * scaleY],
      // Shoulder line
      [sWx * scaleX, sWy * scaleY],
      // Armhole part 1: shoulder → midpoint
      [0, 0, (mPx - sEndX) * scaleX, (mPy - sEndY) * 0.5 * scaleY, (mPx - sEndX) * scaleX, (mPy - sEndY) * scaleY],
      // Armhole part 2: midpoint → armhole end
      [0, (aEy - mPy) * 0.8 * scaleY, (bqMm - mPx) * 0.5 * scaleX, (aEy - mPy) * scaleY, (bqMm - mPx) * scaleX, (aEy - mPy) * scaleY],
      // Side seam (straight down)
      [0, (blMm - aEy) * scaleY],
      // Waist
      [-bqMm * scaleX, 0],
      // Fold edge closed automatically
    ] as number[][],
    startX, newOffsetY, [1, 1], 'FD', true
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
  const midY = offsetY + Math.min(v(m.outseamLength) / 2, PRINTABLE_HEIGHT * 0.45);
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(tr(pdfT.back, lang), centerX, midY - 5, { align: 'center' });
  doc.setFontSize(7);
  doc.setTextColor(80, 80, 80);
  doc.text(tr(pdfT.noSeamAllowance, lang), centerX, midY, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text(tr(pdfT.cut2, lang), centerX, midY + 8, { align: 'center' });

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
  const midY = offsetY + Math.min(v(m.outseamLength) / 2, PRINTABLE_HEIGHT * 0.45);
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(tr(pdfT.front, lang), centerX, midY - 5, { align: 'center' });
  doc.setFontSize(7);
  doc.setTextColor(80, 80, 80);
  doc.text(tr(pdfT.noSeamAllowance, lang), centerX, midY, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text(tr(pdfT.cut2, lang), centerX, midY + 8, { align: 'center' });

  doc.setFontSize(7);
  doc.setTextColor(80, 80, 80);
  doc.text(`${tr(pdfT.outseam, lang)} = ${formatMeasurement(m.outseamLength, unit)}`, O - 8, offsetY + v(m.outseamLength) / 2, { angle: 90 });
}

// ─────────────────────────────────────────────────────────────────────────────

async function loadLogoBase64(): Promise<string | null> {
  try {
    return await new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => reject(new Error('logo load failed'));
      img.src = '/logo-petitcitron.gif';
    });
  } catch {
    return null;
  }
}

export async function generatePatternPDF(
  measurements: SkirtMeasurements | BodiceMeasurements | SleeveMeasurements | PantsMeasurements,
  patternType: string = 'skirt',
  unit: MeasurementUnit = 'cm',
  lang: Language = 'en',
  userName: string = '',
  category: Category = 'women'
): Promise<void> {
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

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const patternMarginMm = 20;
  const panels: ('front' | 'back')[] = isSleeve ? ['front'] : ['front', 'back'];

  const logoBase64 = await loadLogoBase64();
  // Font setup — swap to custom fonts when /public/fonts/ files are present:
  // CormorantGaramond-Bold.ttf → titleFont,  DMSans-Regular.ttf → bodyFont
  const titleFont = 'times';
  const bodyFont = 'helvetica';

  // ── COVER PAGE (page 1, already created by jsPDF constructor) ────────────────
  const OLIVE:  [number,number,number] = [144, 155,  27];
  const RASP:   [number,number,number] = [178,  75, 113];
  const CREAM:  [number,number,number] = [250, 247, 240];
  const PINKBG: [number,number,number] = [255, 240, 243];
  const GRAY88: [number,number,number] = [136, 136, 136];
  const fill   = (c: [number,number,number]) => doc.setFillColor(c[0], c[1], c[2]);
  const stroke = (c: [number,number,number]) => doc.setDrawColor(c[0], c[1], c[2]);
  const color  = (c: [number,number,number]) => doc.setTextColor(c[0], c[1], c[2]);
  const s = (fr: string, en: string) => lang === 'fr' ? fr : en;

  const patternName = pdfT.patternTypes[lang][patternType] ?? patternType.charAt(0).toUpperCase() + patternType.slice(1);
  const panelDescription = isSleeve ? tr(pdfT.singlePanel, lang) : tr(pdfT.frontBackPanels, lang);
  const dateStr = new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB');

  // 1. Header — olive band
  fill(OLIVE);
  doc.rect(0, 0, A4_WIDTH, 25, 'F');
  fill(CREAM);
  doc.rect(10, 2.5, 42, 20, 'F');
  if (logoBase64) doc.addImage(logoBase64, 'PNG', 11, 3, 40, 19);
  doc.setFont(bodyFont, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('studio.petitcitron.com', A4_WIDTH - MARGIN, 16, { align: 'right' });

  // 2. Title zone — cream band
  fill(CREAM);
  doc.rect(0, 25, A4_WIDTH, 33, 'F');
  doc.setFont(titleFont, 'bold');
  doc.setFontSize(24);
  doc.setTextColor(30, 30, 30);
  doc.text(patternName.toUpperCase(), A4_WIDTH / 2, 42, { align: 'center' });
  doc.setFont(bodyFont, 'normal');
  doc.setFontSize(9);
  color(GRAY88);
  const subtitleLine = userName
    ? `${panelDescription} · ${dateStr} · ${userName}`
    : `${panelDescription} · ${dateStr}`;
  doc.text(doc.splitTextToSize(subtitleLine, 170) as string[], A4_WIDTH / 2, 52, { align: 'center' });

  // 3. Warning box — raspberry left border
  fill(PINKBG);
  doc.rect(MARGIN, 62, 190, 20, 'F');
  fill(RASP);
  doc.rect(MARGIN, 62, 4, 20, 'F');
  // Warning icon: filled raspberry triangle (⚠ unicode unsupported in standard PDF fonts)
  // lines(segments, x, y, scale, style, closed): start at top-center, two sides, close
  fill(RASP);
  doc.lines([[2.5, 5], [-5, 0]], MARGIN + 9.5, 65, [1, 1], 'F', true);
  doc.setTextColor(255, 255, 255);
  doc.setFont(bodyFont, 'normal');
  doc.setFontSize(7);
  doc.text('!', MARGIN + 9.5, 69.5, { align: 'center' });
  // Warning text — normal weight only (helvetica bold causes letter-spacing artifact in jsPDF)
  doc.setFont(bodyFont, 'normal');
  doc.setFontSize(10);
  color(RASP);
  const warn1 = tr(pdfT.seamWarnLine1, lang).replace(/^[^\w]*/, '');
  doc.text(warn1, MARGIN + 15, 70);
  doc.setFontSize(9);
  doc.text(tr(pdfT.seamWarnLine2, lang), MARGIN + 15, 78);

  // 4. Two columns
  const colY = 88;
  const leftColX = MARGIN;
  const leftColW = 104;
  const rightColX = MARGIN + leftColW + 11;
  const rightColW = 75;

  // Left column — measurements
  doc.setFont(titleFont, 'bold');
  doc.setFontSize(12);
  color(OLIVE);
  doc.text(s('Vos mesures', 'Your measurements'), leftColX, colY);
  stroke(OLIVE);
  doc.setLineWidth(0.5);
  doc.line(leftColX, colY + 3, leftColX + leftColW, colY + 3);

  const measPairs: { key: string; val: string }[] = isSleeve
    ? [
        { key: tr(pdfT.upperArm, lang), val: formatMeasurement(slm.upperArm, unit) },
        { key: tr(pdfT.wrist, lang), val: formatMeasurement(slm.wrist, unit) },
        { key: tr(pdfT.sleeveLength, lang), val: formatMeasurement(slm.sleeveLength, unit) },
        { key: tr(pdfT.elbowLength, lang), val: formatMeasurement(slm.elbowLength, unit) },
        { key: tr(pdfT.armholeDepth, lang), val: formatMeasurement(slm.armholeDepth, unit) },
      ]
    : isBodice
      ? [
          { key: tr(pdfT.bust, lang), val: formatMeasurement(bm.bust, unit) },
          { key: tr(pdfT.neckline, lang), val: formatMeasurement(bm.neckCircumference, unit) },
          { key: tr(pdfT.shoulderLength, lang), val: formatMeasurement(bm.shoulderLength, unit) },
          { key: tr(pdfT.backWidth, lang), val: formatMeasurement(bm.backWidth, unit) },
          { key: tr(pdfT.backLength, lang), val: formatMeasurement(bm.backLength, unit) },
        ]
      : isPants
        ? [
            { key: tr(pdfT.waist, lang), val: formatMeasurement(pm.waist, unit) },
            { key: tr(pdfT.hip, lang), val: formatMeasurement(pm.hip, unit) },
            { key: tr(pdfT.outseam, lang), val: formatMeasurement(pm.outseamLength, unit) },
          ]
        : [
            { key: tr(pdfT.waist, lang), val: formatMeasurement(sm.waist, unit) },
            { key: tr(pdfT.hip, lang), val: formatMeasurement(sm.hip, unit) },
            { key: tr(pdfT.waistToHip, lang), val: formatMeasurement(sm.waistToHip, unit) },
            { key: tr(pdfT.skirtLength, lang), val: formatMeasurement(sm.skirtLength, unit) },
          ];

  doc.setFont(bodyFont, 'normal');
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  let measY = colY + 10;
  for (const pair of measPairs) {
    doc.text(pair.key, leftColX, measY);
    doc.text(pair.val, leftColX + leftColW, measY, { align: 'right' });
    doc.setDrawColor(210, 210, 210);
    doc.setLineWidth(0.2);
    doc.line(leftColX, measY + 2, leftColX + leftColW, measY + 2);
    measY += 7;
  }
  measY += 2;
  doc.setFontSize(9);
  color(GRAY88);
  doc.text(`${tr(pdfT.totalPages, lang)}: ${tiles.totalPages * panels.length}`, leftColX, measY);
  measY += 10;

  stroke(OLIVE);
  doc.setLineWidth(0.5);
  doc.line(leftColX, measY, leftColX + leftColW, measY);
  measY += 8;

  doc.setFont(titleFont, 'bold');
  doc.setFontSize(12);
  color(OLIVE);
  doc.text(s("Instructions d'assemblage", 'Assembly instructions'), leftColX, measY);
  doc.setLineWidth(0.5);
  doc.line(leftColX, measY + 3, leftColX + leftColW, measY + 3);
  measY += 10;

  doc.setFont(bodyFont, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);
  for (const step of tr(pdfT.instructions, lang)) {
    if (!step) { measY += 3; continue; }
    const stepLines = doc.splitTextToSize(step, leftColW - 2) as string[];
    for (const line of stepLines) {
      if (measY < 265) doc.text(line, leftColX, measY);
      measY += 5.5;
    }
  }

  // Right column — page diagram
  doc.setFont(titleFont, 'bold');
  doc.setFontSize(12);
  color(OLIVE);
  doc.text(tr(pdfT.pageLayout, lang), rightColX, colY);
  stroke(OLIVE);
  doc.setLineWidth(0.5);
  doc.line(rightColX, colY + 3, rightColX + rightColW, colY + 3);

  const panelGapDiag = 8;
  const tileWDiag = Math.max(6, Math.min(18,
    Math.floor((rightColW - (panels.length - 1) * panelGapDiag) / (panels.length * tiles.cols))
  ));
  const tileHDiag = Math.round(tileWDiag * PRINTABLE_HEIGHT / PRINTABLE_WIDTH);
  const diagScaleDiag = tileWDiag / PRINTABLE_WIDTH;
  const diagStartY = colY + 10;

  panels.forEach((diagPanel, panelIndex) => {
    const panelDiagramX = rightColX + panelIndex * (tiles.cols * tileWDiag + panelGapDiag);
    const panelDiagramY = diagStartY;

    for (let row = 0; row < tiles.rows; row++) {
      for (let col = 0; col < tiles.cols; col++) {
        const tileX = panelDiagramX + col * tileWDiag;
        const tileY = panelDiagramY + row * tileHDiag;
        const pageNumber = panelIndex * tiles.totalPages + row * tiles.cols + col + 2;
        doc.setFillColor(245, 245, 245);
        doc.setDrawColor(160, 160, 160);
        doc.setLineWidth(0.3);
        doc.rect(tileX, tileY, tileWDiag, tileHDiag, 'FD');
        doc.setFontSize(6);
        doc.setTextColor(100, 100, 100);
        doc.text(String(pageNumber), tileX + tileWDiag / 2, tileY + tileHDiag / 2 + 2, { align: 'center' });
      }
    }

    const patternStartX = panelDiagramX + patternMarginMm * diagScaleDiag;
    const patternStartY = panelDiagramY + patternMarginMm * diagScaleDiag;

    if (isSleeve) {
      drawDiagramSleeve(doc, slm, patternStartX, patternStartY, diagScaleDiag, diagScaleDiag);
    } else if (isBodice) {
      if (patternType === 'bodice-dartless') {
        drawDiagramDartlessBodice(doc, bm, category, patternStartX, patternStartY, diagPanel, diagScaleDiag, diagScaleDiag);
      } else {
        drawDiagramBodice(doc, bm, patternStartX, patternStartY, diagPanel, diagScaleDiag, diagScaleDiag);
      }
    } else if (!isPants) {
      drawDiagramSkirt(doc, sm, patternStartX, patternStartY, diagPanel, diagScaleDiag, diagScaleDiag, category);
    }

    doc.setFontSize(7);
    doc.setTextColor(50, 50, 50);
    const panelLabel = (isSleeve
      ? tr(pdfT.sleeve, lang)
      : diagPanel === 'front' ? tr(pdfT.front, lang) : tr(pdfT.back, lang)
    ).toUpperCase();
    doc.text(
      panelLabel,
      panelDiagramX + (tiles.cols * tileWDiag) / 2,
      panelDiagramY + tiles.rows * tileHDiag + 5,
      { align: 'center' }
    );
  });

  // 5. Footer
  stroke(OLIVE);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, 272, MARGIN + 190, 272);
  doc.setFont(bodyFont, 'normal');
  doc.setFontSize(8);
  color(GRAY88);
  const footerCenter = s(
    `Petit Citron Studio — patron généré le ${dateStr}`,
    `Petit Citron Studio — pattern generated on ${dateStr}`
  );
  doc.text(footerCenter, A4_WIDTH / 2, 280, { align: 'center' });
  doc.text('studio.petitcitron.com', MARGIN + 190, 280, { align: 'right' });
  // ── End cover page ────────────────────────────────────────────────────────────

  // ── PATTERN TILE PAGES (pages 2..N) ──────────────────────────────────────────
  let pageNum = 0;

  for (const panel of panels) {
    for (let row = 0; row < tiles.rows; row++) {
      for (let col = 0; col < tiles.cols; col++) {
        doc.addPage();
        pageNum++;

        const viewOffsetX = col * PRINTABLE_WIDTH;
        const viewOffsetY = row * PRINTABLE_HEIGHT;

        drawAlignmentMarks(doc, col, row, tiles.cols, tiles.rows);
        drawPageInfo(doc, pageNum, tiles.totalPages * panels.length, col, row, lang);

        if (pageNum === 1) draw1cmTestSquare(doc, unit, lang);

        doc.saveGraphicsState();
        // Clip content to the printable tile so pattern lines never bleed across pages.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pdfInt = (doc as any).internal;
        const k: number = pdfInt.scaleFactor;
        const pH: number = pdfInt.pageSize.getHeight();
        pdfInt.write(
          `${(MARGIN * k).toFixed(3)} ${((pH - MARGIN - PRINTABLE_HEIGHT) * k).toFixed(3)} ` +
          `${(PRINTABLE_WIDTH * k).toFixed(3)} ${(PRINTABLE_HEIGHT * k).toFixed(3)} re W n`
        );

        const patternX = patternMarginMm - viewOffsetX + MARGIN;
        const patternY = patternMarginMm - viewOffsetY + MARGIN;

        if (isSleeve) {
          drawSleevePatternPiece(doc, slm, patternX, patternY, unit, lang);
        } else if (isBodice) {
          if (patternType === 'bodice-dartless') {
            drawDartlessBodicePiece(doc, bm, category, patternX, patternY, panel, unit, lang, col, row);
          } else {
            drawBodicePatternPiece(doc, bm, patternX, patternY, panel, unit, lang, col, row);
          }
        } else if (isPants) {
          if (panel === 'back') {
            drawPantsBackPanel(doc, pm, patternX, patternY, category, pantsHasDarts, unit, lang);
          } else {
            drawPantsFrontPanel(doc, pm, patternX, patternY, category, pantsHasDarts, unit, lang);
          }
        } else {
          drawSkirtPatternPiece(doc, sm, patternX, patternY, panel, unit, lang, col, row, category);
        }

        doc.restoreGraphicsState();
      }
    }
  }

  const date = new Date().toISOString().slice(0, 10);
  const typeLabel = pdfT.patternTypes[lang][patternType] ?? patternType;
  const prefix = lang === 'fr' ? 'patron de base' : 'basic block';
  const namePart = userName ? ` - ${userName}` : '';
  doc.save(`${prefix} - ${typeLabel.toLowerCase()} - ${date}${namePart}.pdf`);
}
