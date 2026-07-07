import jsPDF from 'jspdf';
import { SkirtMeasurements, BodiceMeasurements, SleeveMeasurements, PantsMeasurements, Category } from '@/types/sloper';
import { MeasurementUnit, cmToInches } from '@/components/UnitToggle';
import { Language } from '@/contexts/LanguageContext';
import { computePantsFrontDartlessGeometry } from '@/components/pants/PantsFrontPanel';
import { computePantsBackDartlessGeometry } from '@/components/pants/PantsBackPanel';
import { computePantsFrontDartedGeometry } from '@/components/pants/PantsWithDartsFrontPanel';
import { computePantsBackDartedGeometry } from '@/components/pants/PantsWithDartsBackPanel';
import { useDartlessBodicePath } from '@/components/dartless-bodice/DartlessBodicePanelPath';
import { useBodiceDartsPath } from '@/components/bodice-darts/BodiceDartsPanelPath';

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
      '2. Verify that the test square measures exactly {{SIZE}} x {{SIZE}}.',
      '3. Cut along the right and top edges of each page only',
      '   (keep the left and bottom margins for taping pages together).',
      '4. Match up the alignment marks and circles from adjacent pages.',
      '5. Tape or glue pages together, starting from the top-left corner.',
      '6. Once assembled, cut out the pattern piece along the solid black line.',
      '7. This pattern is a basic block with no seam allowances.',
    ],
    fr: [
      "1. Imprimez toutes les pages à 100% (sans mise à l'échelle).",
      '2. Vérifiez que le carré test mesure exactement {{SIZE}} x {{SIZE}}.',
      "3. Découpez le bord droit et le bord supérieur de chaque feuille uniquement (conserver les marges gauche et bas pour coller les feuilles ensemble).",
      '4. Alignez les repères triangulaires.',
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

const PAGE_FORMATS = {
  a4:     { width: 210, height: 297 },
  letter: { width: 216, height: 279 },
  a0:     { width: 841, height: 1189 },
} as const;
type TiledFormat = keyof typeof PAGE_FORMATS;

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

// Real (un-padded) horizontal reach of each panel, in cm from its own fold edge —
// sourced directly from the shared geometry (useDartlessBodicePath, scale=1 → cm) so
// this never drifts from what actually gets drawn. Used to size/position each panel
// individually so the gap between front and back reflects their actual widths rather
// than the width of whichever panel happens to be wider.
function calculateDartlessBodicePanelWidths(measurements: BodiceMeasurements, category: Category): { front: number; back: number } {
  const widthFor = (panel: 'front' | 'back') => {
    const g = useDartlessBodicePath({ measurements, offsetX: 0, offsetY: 0, scale: 1, panel, category });
    return Math.max(g.bustQuarterScaled, g.shoulderEndX);
  };

  return { front: widthFor('front'), back: widthFor('back') };
}

function calculateDartlessBodiceDimensions(measurements: BodiceMeasurements, category: Category): PatternDimensions {
  const { backLength } = measurements;
  const { front, back } = calculateDartlessBodicePanelWidths(measurements, category);

  // Small safety buffer only — drawDartlessBodicePiece already shifts the whole piece down
  // so the neckline peak lands at offsetY, so the true height is just backLength (+ buffer).
  const widthCm = Math.max(front, back) + 5;
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

function calculateTiles(dimensions: PatternDimensions, printableW = PRINTABLE_WIDTH, printableH = PRINTABLE_HEIGHT): TileInfo {
  const widthMm = dimensions.widthCm * 10;
  const heightMm = dimensions.heightCm * 10;

  const cols = Math.ceil(widthMm / printableW);
  const rows = Math.ceil(heightMm / printableH);

  return { cols, rows, totalPages: cols * rows };
}

function drawAlignmentMarks(doc: jsPDF, pageCol: number, pageRow: number, totalCols: number, totalRows: number, pageW = A4_WIDTH, pageH = A4_HEIGHT) {
  doc.setFillColor(190, 190, 190);
  doc.setDrawColor(190, 190, 190);

  // Isoceles triangle centered on the middle of each edge of the 1cm cut line, apex
  // pointing inward — replaces the old cross/L/circle registration marks. Shown only
  // on edges that actually border an adjacent tile.
  const half = 3;
  const triangle = (cx: number, cy: number, dirX: number, dirY: number) => {
    const tipX = cx + dirX * half * 1.4;
    const tipY = cy + dirY * half * 1.4;
    const baseX1 = cx - dirY * half;
    const baseY1 = cy + dirX * half;
    const baseX2 = cx + dirY * half;
    const baseY2 = cy - dirX * half;
    doc.triangle(tipX, tipY, baseX1, baseY1, baseX2, baseY2, 'F');
  };

  if (pageRow > 0) triangle(pageW / 2, MARGIN, 0, 1);
  if (pageRow < totalRows - 1) triangle(pageW / 2, pageH - MARGIN, 0, -1);
  if (pageCol > 0) triangle(MARGIN, pageH / 2, 1, 0);
  if (pageCol < totalCols - 1) triangle(pageW - MARGIN, pageH / 2, -1, 0);
}

function drawPageInfo(doc: jsPDF, tileNumber: number, pageW = A4_WIDTH, pageH = A4_HEIGHT) {
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('Petit Citron Studio', MARGIN, pageH - 3);

  // Large, light-gray tile number — quick visual reference when assembling the pages
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(100);
  doc.setTextColor(205, 205, 205);
  doc.text(`${tileNumber}`, pageW / 2, pageH / 2, { align: 'center', baseline: 'middle' });
  doc.setFont('helvetica', 'normal');
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
  }
}

// "bodice-with-darts": sourced directly from useBodiceDartsPath (the same geometry the
// SVG preview uses), so the printed pattern always matches it exactly.
function drawBodiceDartsPatternPiece(
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
  // The neckline peak (neckEndY) and shoulder point (shoulderEndY) both sit above the
  // panel's own offsetY anchor — probe at offsetY=0 first and push the real origin down
  // so the true top of the piece lands exactly at the intended offsetY.
  const probe = useBodiceDartsPath({ measurements, offsetX, offsetY: 0, scale: 10, panel, category });
  const adjOffsetY = offsetY + topOvershootMm(probe.neckEndY, probe.shoulderEndY);
  const g = useBodiceDartsPath({ measurements, offsetX, offsetY: adjOffsetY, scale: 10, panel, category });

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  drawSvgPathToPdf(doc, g.path);

  // Dart lines — highlighted, dashed
  doc.setLineWidth(0.35);
  doc.setLineDashPattern([1.5, 0.8], 0);
  drawSvgPathToPdf(doc, g.dartPath);
  doc.setLineDashPattern([], 0);
  doc.setLineWidth(0.5);

  // Grain line (same formula as BodiceDartsPanel.tsx)
  const grainX = offsetX + g.bustQuarterScaled * 0.3;
  const grainTop = adjOffsetY + g.backLengthScaled * 0.25;
  const grainBot = adjOffsetY + g.backLengthScaled * 0.75;
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
    const cx = offsetX + g.bustQuarterScaled / 2;
    const cy = adjOffsetY + g.backLengthScaled / 2;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(isFront ? tr(pdfT.front, lang) : tr(pdfT.back, lang), cx, cy - 5, { align: 'center' });
    doc.setFontSize(7);
    doc.setTextColor(80, 80, 80);
    doc.text(tr(pdfT.noSeamAllowance, lang), cx, cy, { align: 'center' });
  }
}

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
  // Same top-overshoot issue as bodice-with-darts (see topOvershootMm) — the neckline
  // peak and shoulder point both sit above offsetY, so probe first and push down.
  const probe = useDartlessBodicePath({ measurements, offsetX, offsetY: 0, scale: 10, panel, category });
  const adjOffsetY = offsetY + topOvershootMm(probe.neckEndY, probe.shoulderEndY);
  const g = useDartlessBodicePath({ measurements, offsetX, offsetY: adjOffsetY, scale: 10, panel, category });

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  drawSvgPathToPdf(doc, g.path);

  // Grain line (same formula as DartlessBodicePanel.tsx)
  const grainX = offsetX + g.bustQuarterScaled * 0.3;
  const grainTop = adjOffsetY + g.backLengthScaled * 0.25;
  const grainBot = adjOffsetY + g.backLengthScaled * 0.75;
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
    const cx = offsetX + g.bustQuarterScaled / 2;
    const cy = adjOffsetY + g.backLengthScaled / 2;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(isFront ? tr(pdfT.front, lang) : tr(pdfT.back, lang), cx, cy, { align: 'center' });
    doc.setFontSize(7);
    doc.setTextColor(80, 80, 80);
    doc.text(tr(pdfT.noSeamAllowance, lang), cx, cy + 5, { align: 'center' });
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

// The test square is 4in x 4in on letter pages and 10cm x 10cm on A4/A0 pages —
// shared by drawTestSquare and the assembly-instructions text so both always agree.
function testSquareSizeLabel(format: TiledFormat): string {
  return format === 'letter' ? '4 in' : '10 cm';
}

function drawTestSquare(doc: jsPDF, format: TiledFormat, lang: Language, x: number, y: number) {
  const sizeMm = format === 'letter' ? 4 * 25.4 : 100;
  const sizeLabel = testSquareSizeLabel(format);

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.rect(x, y, sizeMm, sizeMm);
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  const label = lang === 'fr' ? `Test ${sizeLabel} / ${sizeLabel}` : `${sizeLabel} test / ${sizeLabel}`;
  doc.text(label, x + sizeMm / 2, y + sizeMm / 2, { align: 'center', baseline: 'middle' });
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

  // Outline only (no fill), matching the pants diagram style.
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
    startX, startY, [1, 1], 'D', true
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

function drawDiagramBodiceDarts(
  doc: jsPDF,
  m: BodiceMeasurements,
  category: Category,
  startX: number,
  startY: number,
  panel: 'front' | 'back',
  scaleX: number
) {
  const probe = useBodiceDartsPath({ measurements: m, offsetX: startX, offsetY: 0, scale: 10 * scaleX, panel, category });
  const adjStartY = startY + topOvershootMm(probe.neckEndY, probe.shoulderEndY);
  const g = useBodiceDartsPath({ measurements: m, offsetX: startX, offsetY: adjStartY, scale: 10 * scaleX, panel, category });

  doc.setDrawColor(110, 150, 60);
  doc.setLineWidth(0.3);
  drawSvgPathToPdf(doc, g.path);
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
  // scaleX/scaleY are always equal in practice (a single diagram shrink factor);
  // combine with the usual 10mm-per-cm to get the effective scale for the hook.
  const probe = useDartlessBodicePath({ measurements: m, offsetX: startX, offsetY: 0, scale: 10 * scaleX, panel, category });
  const adjStartY = startY + topOvershootMm(probe.neckEndY, probe.shoulderEndY);
  const g = useDartlessBodicePath({ measurements: m, offsetX: startX, offsetY: adjStartY, scale: 10 * scaleX, panel, category });

  doc.setDrawColor(110, 150, 60);
  doc.setLineWidth(0.3);
  drawSvgPathToPdf(doc, g.path);
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

function drawDiagramPants(
  doc: jsPDF,
  m: PantsMeasurements,
  startX: number,
  startY: number,
  panel: 'front' | 'back',
  scale: number,
  category: Category,
  hasDarts: boolean
) {
  const compute = panel === 'front'
    ? (hasDarts ? computePantsFrontDartedGeometry : computePantsFrontDartlessGeometry)
    : (hasDarts ? computePantsBackDartedGeometry : computePantsBackDartlessGeometry);

  // `scale` here is the diagram shrink ratio (tileWDiag / printableW), a fraction of 1.
  // The geometry functions expect mm-per-cm (10 in the real render, see drawPantsFrontPanel)
  // — passing the shrink ratio straight through was rendering the outline ~10x too small.
  const geometryScale = scale * 10;
  const probe = compute(m, 0, 0, geometryScale, category) as { e1X: number; a1Y?: number; a2Y?: number; b1Y: number };
  const hipOriginX = startX - probe.e1X;
  const topShift = topOvershootMm(probe.a1Y ?? probe.a2Y ?? 0, probe.b1Y);
  const g = compute(m, hipOriginX, startY + topShift, geometryScale, category);

  doc.setDrawColor(110, 150, 60);
  doc.setLineWidth(0.3);
  drawSvgPathToPdf(doc, g.path);
}

// ─────────────────────────────── PANTS ───────────────────────────────────────

function calculatePantsDimensions(m: PantsMeasurements, category: Category): PatternDimensions {
  // Derived from the same shared geometry the panels are drawn with (scale=1 → values in cm),
  // so the estimated page/tile size always matches what actually gets drawn.
  const front = computePantsFrontDartlessGeometry(m, 0, 0, 1, category);
  const back = computePantsBackDartlessGeometry(m, 0, 0, 1, category);

  const widthCm = Math.max(front.hipSideX - front.e1X, back.hipSideX - back.e1X) + 2;
  const heightCm = Math.max(front.hemY, back.hemY) + 2;

  return { widthCm, heightCm };
}

// Gap left between the front and back panels when they share one tile grid (see
// getPanelWidthsCm) — wide enough to cut/tape without the two pieces touching.
const PANEL_GAP_CM = 2;

// Real per-panel width (cm), used to lay front and back side by side in one shared
// tile grid instead of giving each panel its own full page set. Falls back to the
// shared worst-case dimensions.widthCm when front/back are the same width (skirt,
// bodice-with-darts) since there's nothing panel-specific to compute there.
function getPanelWidthsCm(
  patternType: string,
  dimensions: PatternDimensions,
  measurements: SkirtMeasurements | BodiceMeasurements | SleeveMeasurements | PantsMeasurements,
  category: Category
): { front: number; back: number } {
  if (patternType === 'bodice-dartless') {
    const w = calculateDartlessBodicePanelWidths(measurements as BodiceMeasurements, category);
    return { front: w.front + 3, back: w.back + 3 };
  }
  if (patternType === 'pants' || patternType === 'pants-dartless' || patternType === 'pants-with-darts') {
    const pm = measurements as PantsMeasurements;
    const front = computePantsFrontDartlessGeometry(pm, 0, 0, 1, category);
    const back = computePantsBackDartlessGeometry(pm, 0, 0, 1, category);
    return {
      front: front.hipSideX - front.e1X + 2,
      back: back.hipSideX - back.e1X + 2,
    };
  }
  return { front: dimensions.widthCm, back: dimensions.widthCm };
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

function drawQuadraticBezier(
  doc: jsPDF,
  x0: number, y0: number,
  cx: number, cy: number,
  x1: number, y1: number,
  steps = 8
) {
  let px = x0, py = y0;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    const nx = u*u*x0 + 2*u*t*cx + t*t*x1;
    const ny = u*u*y0 + 2*u*t*cy + t*t*y1;
    doc.line(px, py, nx, ny);
    px = nx; py = ny;
  }
}

// Several panel geometries (pants back panel, bodice necklines) rise above their own
// `offsetY` origin — e.g. the pants back waist point is raised by `a2Shift`, and a
// bodice neckline peak sits above its neck-center anchor. None of the shared geometry
// functions compensate for that internally, so left alone the peak can end up above the
// page's top margin (or, worse, above the tile's clip rect and simply not print). Pass
// the candidate topmost-point Y values (probed with offsetY=0) and this returns how much
// to push the real offsetY down so the highest point lands exactly at the intended top.
function topOvershootMm(...candidateYs: number[]): number {
  return Math.max(0, -Math.min(...candidateYs));
}

// Replays an SVG path string ("M/L/Q/C/Z", the same format the pants preview
// components build for their <path d=...>) as jsPDF drawing calls. Since the pants
// PDF panels draw from the exact same shared geometry functions as the SVG preview,
// this guarantees the printed outline always matches the preview — no separate
// control-point transcription to keep in sync.
function drawSvgPathToPdf(doc: jsPDF, d: string) {
  const tokens = d.match(/[MLCQZ]|-?\d*\.?\d+(?:e-?\d+)?/gi) ?? [];
  let i = 0;
  let curX = 0, curY = 0;
  let startX = 0, startY = 0;
  const next = () => parseFloat(tokens[i++]);
  while (i < tokens.length) {
    const cmd = tokens[i++];
    switch (cmd) {
      case 'M':
        curX = next(); curY = next();
        startX = curX; startY = curY;
        break;
      case 'L': {
        const x = next(), y = next();
        doc.line(curX, curY, x, y);
        curX = x; curY = y;
        break;
      }
      case 'Q': {
        const cx = next(), cy = next(), x = next(), y = next();
        drawQuadraticBezier(doc, curX, curY, cx, cy, x, y);
        curX = x; curY = y;
        break;
      }
      case 'C': {
        const cx1 = next(), cy1 = next(), cx2 = next(), cy2 = next(), x = next(), y = next();
        drawCubicBezier(doc, curX, curY, cx1, cy1, cx2, cy2, x, y);
        curX = x; curY = y;
        break;
      }
      case 'Z':
        // Close path — SVG 'Z' draws a straight line back to the last 'M' point.
        doc.line(curX, curY, startX, startY);
        curX = startX; curY = startY;
        break;
      default:
        break;
    }
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
// offsetX (this function's own param) = innermost crotch point (e1X in the shared
// geometry's convention). The shared compute functions expect the hip-quarter
// reference point instead (their own `offsetX`) — shift between the two once, using
// a throwaway probe call, rather than re-deriving the crotch-extension formula here.
function drawPantsBackPanel(
  doc: jsPDF,
  m: PantsMeasurements,
  offsetX: number,
  offsetY: number,
  category: Category,
  hasDarts: boolean,
  unit: MeasurementUnit,
  lang: Language,
  isA0 = false
) {
  const scale = 10; // mm per cm, matching the rest of this file's cm→mm convention

  const compute = hasDarts ? computePantsBackDartedGeometry : computePantsBackDartlessGeometry;
  const probe = compute(m, 0, 0, scale, category);
  const hipOriginX = offsetX - probe.e1X;
  // Back's waist point (a2Y) sits above offsetY (raised by a2Shift) — push the real
  // origin down so that raised point lands at the intended offsetY instead of poking
  // above it (and potentially above the page's clip rect).
  const topShift = topOvershootMm(probe.a2Y, probe.b1Y);
  const adjOffsetY = offsetY + topShift;
  const g = compute(m, hipOriginX, adjOffsetY, scale, category);

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);

  drawSvgPathToPdf(doc, g.path);

  const dg = hasDarts ? (g as ReturnType<typeof computePantsBackDartedGeometry>) : null;
  if (dg) {
    // notch at dart tip
    doc.setLineWidth(0.25);
    doc.line(dg.dartTipX - 3, dg.dartTipY, dg.dartTipX + 3, dg.dartTipY);
    doc.setLineWidth(0.5);
  }

  // ── Reference lines ──
  doc.setLineWidth(0.2);
  doc.setLineDashPattern([2, 2], 0);
  doc.setDrawColor(160, 160, 160);
  doc.line(offsetX, g.hipY, g.hipSideX, g.hipY);
  doc.line(offsetX, g.crotchY, g.hipSideX, g.crotchY);
  doc.setLineDashPattern([], 0);
  doc.setDrawColor(0, 0, 0);

  // ── Grain line ──
  doc.setLineWidth(0.4);
  drawPantsGrainLine(doc, g.centerX, adjOffsetY + 30, g.hemY - 30);

  // ── Labels ──
  const midY = adjOffsetY + Math.min(g.panelHeight / 2, PRINTABLE_HEIGHT * 0.45);
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(tr(pdfT.back, lang), g.centerX, midY - 5, { align: 'center' });
  doc.setFontSize(7);
  doc.setTextColor(80, 80, 80);
  doc.text(tr(pdfT.noSeamAllowance, lang), g.centerX, midY, { align: 'center' });
  if (!isA0) {
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(tr(pdfT.cut2, lang), g.centerX, midY + 8, { align: 'center' });
  }
}

// Front panel.
// offsetX (this function's own param) = innermost crotch point (e1X in the shared
// geometry's convention). See drawPantsBackPanel for why we shift via a probe call.
function drawPantsFrontPanel(
  doc: jsPDF,
  m: PantsMeasurements,
  offsetX: number,
  offsetY: number,
  category: Category,
  hasDarts: boolean,
  unit: MeasurementUnit,
  lang: Language,
  isA0 = false
) {
  const scale = 10; // mm per cm, matching the rest of this file's cm→mm convention

  const compute = hasDarts ? computePantsFrontDartedGeometry : computePantsFrontDartlessGeometry;
  const probe = compute(m, 0, 0, scale, category);
  const hipOriginX = offsetX - probe.e1X;
  // b1Y (side waist, raised 1cm for women) can sit above offsetY — same top-shift as
  // the back panel, so front's own peak lands exactly at the intended offsetY too.
  const topShift = topOvershootMm(probe.a1Y, probe.b1Y);
  const adjOffsetY = offsetY + topShift;
  const g = compute(m, hipOriginX, adjOffsetY, scale, category);

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);

  drawSvgPathToPdf(doc, g.path);

  const dg = hasDarts ? (g as ReturnType<typeof computePantsFrontDartedGeometry>) : null;
  if (dg) {
    doc.setLineWidth(0.25);
    doc.line(dg.dartTipX - 3, dg.dartTipY, dg.dartTipX + 3, dg.dartTipY);
    doc.setLineWidth(0.5);
  }

  // ── Reference lines ──
  doc.setLineWidth(0.2);
  doc.setLineDashPattern([2, 2], 0);
  doc.setDrawColor(160, 160, 160);
  doc.line(offsetX, g.hipY, g.hipSideX, g.hipY);
  doc.line(offsetX, g.crotchY, g.hipSideX, g.crotchY);
  doc.setLineDashPattern([], 0);
  doc.setDrawColor(0, 0, 0);

  // ── Grain line ──
  doc.setLineWidth(0.4);
  drawPantsGrainLine(doc, g.centerX, adjOffsetY + 30, g.hemY - 30);

  // ── Labels ──
  const midY = adjOffsetY + Math.min(g.panelHeight / 2, PRINTABLE_HEIGHT * 0.45);
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(tr(pdfT.front, lang), g.centerX, midY - 5, { align: 'center' });
  doc.setFontSize(7);
  doc.setTextColor(80, 80, 80);
  doc.text(tr(pdfT.noSeamAllowance, lang), g.centerX, midY, { align: 'center' });
  if (!isA0) {
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(tr(pdfT.cut2, lang), g.centerX, midY + 8, { align: 'center' });
  }
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
      img.src = '/logo-petitcitron-new.png.png';
    });
  } catch {
    return null;
  }
}

export async function generateTiledPDF(
  format: TiledFormat,
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
      ? patternType === 'bodice-dartless'
        ? calculateDartlessBodiceDimensions(bm, category)
        : calculateBodiceDimensions(bm)
      : isPants
        ? calculatePantsDimensions(pm, category)
        : calculateSkirtDimensions(sm);

  const fmt = PAGE_FORMATS[format];
  const fmtW = fmt.width;
  const fmtH = fmt.height;
  const printableW = fmtW - MARGIN * 2;
  const printableH = fmtH - MARGIN * 2;

  const panels: ('front' | 'back')[] = isSleeve ? ['front'] : ['front', 'back'];

  // Front and back share one tile grid, placed side by side, instead of each getting its
  // own full page set — halves the sheet count for two-panel patterns since the empty
  // margin at the end of one panel's columns is filled by the start of the other's.
  const panelWidthsCm = isSleeve
    ? { front: dimensions.widthCm, back: 0 }
    : getPanelWidthsCm(patternType, dimensions, measurements, category);
  const panelGapCm = isSleeve ? 0 : PANEL_GAP_CM;
  const combinedDimensions: PatternDimensions = {
    widthCm: panelWidthsCm.front + panelGapCm + panelWidthsCm.back,
    heightCm: dimensions.heightCm,
  };

  const tiles = calculateTiles(combinedDimensions, printableW, printableH);
  const isA0 = format === 'a0';

  // Cover page always A4; tile pages use the target format
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [210, 297] });

  const patternMarginMm = 20;

  const logoBase64 = await loadLogoBase64();

  const titleFont = 'times';
  const bodyFont = 'helvetica';

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

  // ── COVER PAGE (A4 format, toujours en première page) ───────────────────────
  // 1. Header — cream band
  fill(CREAM);
  doc.rect(0, 0, 210, 25, 'F');
  if (logoBase64) doc.addImage(logoBase64, 'PNG', 10, 1, 34, 23);
  doc.setFont(bodyFont, 'normal');
  doc.setFontSize(8);
  color(OLIVE);
  doc.text('studio.petitcitron.com', 200, 16, { align: 'right' });

  // 2. Title zone — cream band
  fill(CREAM);
  doc.rect(0, 25, 210, 33, 'F');
  doc.setFont(titleFont, 'bold');
  doc.setFontSize(24);
  doc.setTextColor(30, 30, 30);
  doc.text(patternName.toUpperCase(), 105, 42, { align: 'center' });
  doc.setFont(bodyFont, 'normal');
  doc.setFontSize(9);
  color(GRAY88);
  const subtitleLine = userName
    ? `${panelDescription} · ${dateStr} · ${userName}`
    : `${panelDescription} · ${dateStr}`;
  doc.text(doc.splitTextToSize(subtitleLine, 170) as string[], 105, 52, { align: 'center' });

  // 3. Warning box — raspberry left border
  fill(PINKBG);
  doc.rect(MARGIN, 62, 190, 20, 'F');
  fill(RASP);
  doc.rect(MARGIN, 62, 4, 20, 'F');
  fill(RASP);
  doc.lines([[2.5, 5], [-5, 0]], MARGIN + 9.5, 65, [1, 1], 'F', true);
  doc.setTextColor(255, 255, 255);
  doc.setFont(bodyFont, 'normal');
  doc.setFontSize(7);
  doc.text('!', MARGIN + 9.5, 69.5, { align: 'center' });
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
  // Narrower when the test square sits on this page (A4/letter), so instructions text
  // never runs under it; the right column (page-layout diagram) keeps its own fixed slot.
  const leftColW = format === 'a0' ? 104 : 85;
  const rightColX = 125;
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
  doc.text(`${tr(pdfT.totalPages, lang)}: ${tiles.totalPages + 1}`, leftColX, measY);
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
  const testSquareLabel = testSquareSizeLabel(format);
  for (const step of tr(pdfT.instructions, lang)) {
    if (!step) { measY += 3; continue; }
    const resolvedStep = step.replace(/\{\{SIZE\}\}/g, testSquareLabel);
    const stepLines = doc.splitTextToSize(resolvedStep, leftColW - 2) as string[];
    for (const line of stepLines) {
      if (measY < 267) doc.text(line, leftColX, measY);
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

  // Front and back are drawn on the same shared page grid (see panelWidthsCm above),
  // so the diagram mirrors that with one grid and two overlaid pattern outlines.
  const tileWDiag = Math.max(6, Math.min(18, Math.floor(rightColW / tiles.cols)));
  const tileHDiag = Math.round(tileWDiag * printableH / printableW);
  const diagScaleDiag = tileWDiag / printableW;
  const diagramX = rightColX;
  const diagramY = colY + 10;

  for (let row = 0; row < tiles.rows; row++) {
    for (let col = 0; col < tiles.cols; col++) {
      const tileX = diagramX + col * tileWDiag;
      const tileY = diagramY + row * tileHDiag;
      const pageNumber = row * tiles.cols + col + 1;
      doc.setFillColor(245, 245, 245);
      doc.setDrawColor(160, 160, 160);
      doc.setLineWidth(0.3);
      doc.rect(tileX, tileY, tileWDiag, tileHDiag, 'FD');
      doc.setFontSize(6);
      doc.setTextColor(100, 100, 100);
      doc.text(String(pageNumber), tileX + tileWDiag / 2, tileY + tileHDiag / 2 + 2, { align: 'center' });
    }
  }

  const patternStartY = diagramY + patternMarginMm * diagScaleDiag;
  const frontStartX = diagramX + patternMarginMm * diagScaleDiag;
  const backStartX = diagramX + (patternMarginMm + panelWidthsCm.front * 10 + panelGapCm * 10) * diagScaleDiag;

  panels.forEach((diagPanel) => {
    const patternStartX = diagPanel === 'front' ? frontStartX : backStartX;

    if (isSleeve) {
      drawDiagramSleeve(doc, slm, patternStartX, patternStartY, diagScaleDiag, diagScaleDiag);
    } else if (isBodice) {
      if (patternType === 'bodice-dartless') {
        drawDiagramDartlessBodice(doc, bm, category, patternStartX, patternStartY, diagPanel, diagScaleDiag, diagScaleDiag);
      } else if (patternType === 'bodice-with-darts') {
        drawDiagramBodiceDarts(doc, bm, category, patternStartX, patternStartY, diagPanel, diagScaleDiag);
      } else {
        drawDiagramBodice(doc, bm, patternStartX, patternStartY, diagPanel, diagScaleDiag, diagScaleDiag);
      }
    } else if (isPants) {
      drawDiagramPants(doc, pm, patternStartX, patternStartY, diagPanel, diagScaleDiag, category, pantsHasDarts);
    } else {
      drawDiagramSkirt(doc, sm, patternStartX, patternStartY, diagPanel, diagScaleDiag, diagScaleDiag, category);
    }
  });

  doc.setFontSize(7);
  doc.setTextColor(50, 50, 50);
  const diagramLabel = isSleeve
    ? tr(pdfT.sleeve, lang).toUpperCase()
    : `${tr(pdfT.front, lang)} + ${tr(pdfT.back, lang)}`.toUpperCase();
  doc.text(
    diagramLabel,
    diagramX + (tiles.cols * tileWDiag) / 2,
    diagramY + tiles.rows * tileHDiag + 5,
    { align: 'center' }
  );

  // Test square — right of the assembly instructions, bottom-aligned with them
  if (format !== 'a0') {
    const testSquareSize = format === 'letter' ? 4 * 25.4 : 100;
    drawTestSquare(doc, format, lang, 210 - MARGIN - testSquareSize, 267 - testSquareSize);
  }

  // 5. Footer
  stroke(OLIVE);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, 272, 200, 272);
  doc.setFont(bodyFont, 'normal');
  doc.setFontSize(8);
  color(GRAY88);
  const footerCenter = s(
    `Petit Citron Studio — patron généré le ${dateStr}`,
    `Petit Citron Studio — pattern generated on ${dateStr}`
  );
  doc.text(footerCenter, 105, 280, { align: 'center' });
  doc.text('studio.petitcitron.com', 200, 280, { align: 'right' });
  // ── End cover page ────────────────────────────────────────────────────────────

  // ── PATTERN TILE PAGES ────────────────────────────────────────────────────────
  // Page 1 = cover, tile pages start at 2. Front and back are drawn on every page from
  // the one shared grid computed above — each piece's geometry is clipped to the current
  // page's printable rect below, so only whichever panel(s) actually fall on this page show up.
  const totalTilePages = tiles.totalPages;
  let pageNum = 0;

  // Which page column contains the back panel's own local origin — lets drawSkirtPatternPiece
  // / drawBodicePatternPiece / drawDartlessBodicePiece know when they're on the back panel's
  // *own* first tile (for the front/back name label), even though that's rarely page column 0.
  const backOriginXMm = patternMarginMm + panelWidthsCm.front * 10 + panelGapCm * 10;
  const backStartCol = Math.floor(backOriginXMm / printableW);

  for (let row = 0; row < tiles.rows; row++) {
    for (let col = 0; col < tiles.cols; col++) {
      doc.addPage([fmtW, fmtH]);
      pageNum++;

      const viewOffsetX = col * printableW;
      const viewOffsetY = row * printableH;

      const showAlignmentMarks = !isA0 || totalTilePages > 1;
      if (showAlignmentMarks) {
        drawAlignmentMarks(doc, col, row, tiles.cols, tiles.rows, fmtW, fmtH);
      }

      // Trim/cut line, 1 cm from the page edge (A4/letter only)
      if (!isA0) {
        doc.setDrawColor(150, 150, 150);
        doc.setLineWidth(0.2);
        doc.rect(MARGIN, MARGIN, fmtW - MARGIN * 2, fmtH - MARGIN * 2);
      }

      drawPageInfo(doc, pageNum, fmtW, fmtH);

      // A4/letter: test square lives on the cover page instead (next to the instructions).
      if (pageNum === 1 && format === 'a0') {
        drawTestSquare(doc, format, lang, fmtW - MARGIN - 5 - 100, MARGIN + 5);
      }

      // A0 traceur footer
      if (isA0) {
        doc.setFont(bodyFont, 'normal');
        doc.setFontSize(7);
        doc.setTextColor(120, 120, 120);
        const traceurFooter = s(
          'Impression traceur A0 recommandée — 100% sans mise à l\'échelle',
          'A0 plotter printing recommended — 100% no scaling'
        );
        doc.text(traceurFooter, fmtW / 2, fmtH - 5, { align: 'center' });
      }

      doc.saveGraphicsState();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfInt = (doc as any).internal;
      const k: number = pdfInt.scaleFactor;
      const pH: number = pdfInt.pageSize.getHeight();
      pdfInt.write(
        `${(MARGIN * k).toFixed(3)} ${((pH - MARGIN - printableH) * k).toFixed(3)} ` +
        `${(printableW * k).toFixed(3)} ${(printableH * k).toFixed(3)} re W n`
      );

      const patternXFront = patternMarginMm - viewOffsetX + MARGIN;
      const patternXBack = patternMarginMm + panelWidthsCm.front * 10 + panelGapCm * 10 - viewOffsetX + MARGIN;
      const patternY = patternMarginMm - viewOffsetY + MARGIN;

      if (isSleeve) {
        drawSleevePatternPiece(doc, slm, patternXFront, patternY, unit, lang);
      } else if (isBodice) {
        if (patternType === 'bodice-dartless') {
          drawDartlessBodicePiece(doc, bm, category, patternXFront, patternY, 'front', unit, lang, col, row);
          drawDartlessBodicePiece(doc, bm, category, patternXBack, patternY, 'back', unit, lang, col - backStartCol, row);
        } else if (patternType === 'bodice-with-darts') {
          drawBodiceDartsPatternPiece(doc, bm, category, patternXFront, patternY, 'front', unit, lang, col, row);
          drawBodiceDartsPatternPiece(doc, bm, category, patternXBack, patternY, 'back', unit, lang, col - backStartCol, row);
        } else {
          drawBodicePatternPiece(doc, bm, patternXFront, patternY, 'front', unit, lang, col, row);
          drawBodicePatternPiece(doc, bm, patternXBack, patternY, 'back', unit, lang, col - backStartCol, row);
        }
      } else if (isPants) {
        drawPantsFrontPanel(doc, pm, patternXFront, patternY, category, pantsHasDarts, unit, lang, isA0);
        drawPantsBackPanel(doc, pm, patternXBack, patternY, category, pantsHasDarts, unit, lang, isA0);
      } else {
        drawSkirtPatternPiece(doc, sm, patternXFront, patternY, 'front', unit, lang, col, row, category);
        drawSkirtPatternPiece(doc, sm, patternXBack, patternY, 'back', unit, lang, col - backStartCol, row, category);
      }

      doc.restoreGraphicsState();
    }
  }

  const date = new Date().toISOString().slice(0, 10);
  const typeLabel = pdfT.patternTypes[lang][patternType] ?? patternType;
  const prefix = lang === 'fr' ? 'patron de base' : 'basic block';
  const namePart = userName ? ` - ${userName}` : '';
  doc.save(`${prefix} - ${typeLabel.toLowerCase()} - ${format} - ${date}${namePart}.pdf`);
}

export async function generateProjectionPDF(
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
      ? patternType === 'bodice-dartless'
        ? calculateDartlessBodiceDimensions(bm, category)
        : calculateBodiceDimensions(bm)
      : isPants
        ? calculatePantsDimensions(pm, category)
        : calculateSkirtDimensions(sm);

  const pieceW = dimensions.widthCm * 10;
  const pieceH = dimensions.heightCm * 10;
  const panels: ('front' | 'back')[] = isSleeve ? ['front'] : ['front', 'back'];
  const gap = 30;

  // Front and back can have noticeably different widths (e.g. dartless bodice, where the
  // shoulder projection differs per panel) — position each panel by its own real width
  // instead of the shared worst-case estimate, so the gap between pieces stays consistent.
  const dartlessPanelWidthsMm = patternType === 'bodice-dartless'
    ? (() => {
        const w = calculateDartlessBodicePanelWidths(bm, category);
        return { front: (w.front + 3) * 10, back: (w.back + 3) * 10 };
      })()
    : null;

  const totalPatternW = dartlessPanelWidthsMm
    ? dartlessPanelWidthsMm.front + gap + dartlessPanelWidthsMm.back
    : panels.length === 1 ? pieceW : pieceW * 2 + gap;
  const projMargin = 40;
  const projMarginRight = projMargin + 50; // extra breathing room past the last piece
  const projHeaderH = 20;
  const projFooterH = 15;
  const projW = totalPatternW + projMargin + projMarginRight;
  const projH = pieceH + projMargin * 2 + projHeaderH + projFooterH;

  // ── COVER PAGE (A4 format, première page) ─────────────────────────────────────
  const doc = new jsPDF({ unit: 'mm', format: [210, 297] });
  const logoBase64 = await loadLogoBase64();
  const titleFont = 'times';
  const bodyFont = 'helvetica';
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
  const panelDescription = s('Page unique · Projection', 'Single page · Projection');
  const dateStr = new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB');

  // 1. Header
  fill(CREAM);
  doc.rect(0, 0, 210, 25, 'F');
  if (logoBase64) doc.addImage(logoBase64, 'PNG', 10, 1, 34, 23);
  doc.setFont(bodyFont, 'normal');
  doc.setFontSize(8);
  color(OLIVE);
  doc.text('studio.petitcitron.com', 200, 16, { align: 'right' });

  // 2. Title zone
  fill(CREAM);
  doc.rect(0, 25, 210, 33, 'F');
  doc.setFont(titleFont, 'bold');
  doc.setFontSize(24);
  doc.setTextColor(30, 30, 30);
  doc.text(patternName.toUpperCase(), 105, 42, { align: 'center' });
  doc.setFont(bodyFont, 'normal');
  doc.setFontSize(9);
  color(GRAY88);
  const projSubtitle = userName ? `${panelDescription} · ${dateStr} · ${userName}` : `${panelDescription} · ${dateStr}`;
  doc.text(doc.splitTextToSize(projSubtitle, 170) as string[], 105, 52, { align: 'center' });

  // 3. Warning box
  fill(PINKBG);
  doc.rect(MARGIN, 62, 190, 20, 'F');
  fill(RASP);
  doc.rect(MARGIN, 62, 4, 20, 'F');
  fill(RASP);
  doc.lines([[2.5, 5], [-5, 0]], MARGIN + 9.5, 65, [1, 1], 'F', true);
  doc.setTextColor(255, 255, 255);
  doc.setFont(bodyFont, 'normal');
  doc.setFontSize(7);
  doc.text('!', MARGIN + 9.5, 69.5, { align: 'center' });
  doc.setFontSize(10);
  color(RASP);
  const projWarn1 = tr(pdfT.seamWarnLine1, lang).replace(/^[^\w]*/, '');
  doc.text(projWarn1, MARGIN + 15, 70);
  doc.setFontSize(9);
  doc.text(tr(pdfT.seamWarnLine2, lang), MARGIN + 15, 78);

  // 4. Two columns
  const colY = 88;
  const leftColX = MARGIN;
  const leftColW = 104;
  const rightColX = MARGIN + leftColW + 11;
  const rightColW = 75;

  doc.setFont(titleFont, 'bold');
  doc.setFontSize(12);
  color(OLIVE);
  doc.text(s('Vos mesures', 'Your measurements'), leftColX, colY);
  stroke(OLIVE);
  doc.setLineWidth(0.5);
  doc.line(leftColX, colY + 3, leftColX + leftColW, colY + 3);

  const projMeasPairs: { key: string; val: string }[] = isSleeve
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
  for (const pair of projMeasPairs) {
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
  doc.text(`${tr(pdfT.totalPages, lang)}: 1`, leftColX, measY);
  measY += 10;

  stroke(OLIVE);
  doc.setLineWidth(0.5);
  doc.line(leftColX, measY, leftColX + leftColW, measY);
  measY += 8;

  doc.setFont(titleFont, 'bold');
  doc.setFontSize(12);
  color(OLIVE);
  doc.text(s('Format projection', 'Projection format'), leftColX, measY);
  doc.setLineWidth(0.5);
  doc.line(leftColX, measY + 3, leftColX + leftColW, measY + 3);
  measY += 10;

  doc.setFont(bodyFont, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);
  const projInfo = s(
    [
      `Dimensions page : ${Math.round(projW)} × ${Math.round(projH)} mm`,
      'Ouvrir dans un logiciel de projection',
      '(BenQ, Ishow) ou de découpe numérique.',
      'Ne pas imprimer à l\'échelle.',
      'Grille 10 cm (olive) et 2 pouces (rose)',
      'pour calibrage / alignement.',
    ],
    [
      `Page size: ${Math.round(projW)} × ${Math.round(projH)} mm`,
      'Open in a projection app (BenQ, Ishow)',
      'or digital cutting software.',
      'Do not print to scale.',
      '10 cm grid (olive) and 2-inch grid (pink)',
      'for calibration / alignment.',
    ]
  );
  for (const line of projInfo) {
    if (measY < 267) doc.text(line, leftColX, measY);
    measY += 5.5;
  }

  // Right column — single projection page diagram ("Plan")
  doc.setFont(titleFont, 'bold');
  doc.setFontSize(12);
  color(OLIVE);
  doc.text(s('Plan', 'Layout'), rightColX, colY);
  stroke(OLIVE);
  doc.setLineWidth(0.5);
  doc.line(rightColX, colY + 3, rightColX + rightColW, colY + 3);

  const diagBoxW = rightColW - 4;
  const diagBoxH = Math.min(80, diagBoxW * projH / projW);
  const diagBoxX = rightColX + 2;
  const diagBoxY = colY + 10;
  const diagScale = diagBoxW / projW;
  const diagStartY = projHeaderH + projMargin;

  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(160, 160, 160);
  doc.setLineWidth(0.3);
  doc.rect(diagBoxX, diagBoxY, diagBoxW, diagBoxH, 'FD');

  panels.forEach((panel, panelIndex) => {
    const panelStartX = dartlessPanelWidthsMm
      ? projMargin + (panelIndex === 0 ? 0 : dartlessPanelWidthsMm.front + gap)
      : projMargin + panelIndex * (pieceW + gap);
    const pieceDiagX = diagBoxX + panelStartX * diagScale;
    const pieceDiagY = diagBoxY + diagStartY * diagScale;

    if (isSleeve) {
      drawDiagramSleeve(doc, slm, pieceDiagX, pieceDiagY, diagScale, diagScale);
    } else if (isBodice) {
      if (patternType === 'bodice-dartless') {
        drawDiagramDartlessBodice(doc, bm, category, pieceDiagX, pieceDiagY, panel, diagScale, diagScale);
      } else if (patternType === 'bodice-with-darts') {
        drawDiagramBodiceDarts(doc, bm, category, pieceDiagX, pieceDiagY, panel, diagScale);
      } else {
        drawDiagramBodice(doc, bm, pieceDiagX, pieceDiagY, panel, diagScale, diagScale);
      }
    } else if (isPants) {
      drawDiagramPants(doc, pm, pieceDiagX, pieceDiagY, panel, diagScale, category, pantsHasDarts);
    } else {
      drawDiagramSkirt(doc, sm, pieceDiagX, pieceDiagY, panel, diagScale, diagScale, category);
    }
  });

  doc.setFontSize(7);
  doc.setTextColor(50, 50, 50);
  doc.text(s('PROJECTION', 'PROJECTION'), diagBoxX + diagBoxW / 2, diagBoxY + diagBoxH + 5, { align: 'center' });

  // 5. Footer
  stroke(OLIVE);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, 272, 200, 272);
  doc.setFont(bodyFont, 'normal');
  doc.setFontSize(8);
  color(GRAY88);
  doc.text(
    s(`Petit Citron Studio — patron généré le ${dateStr}`, `Petit Citron Studio — pattern generated on ${dateStr}`),
    105, 280, { align: 'center' }
  );
  doc.text('studio.petitcitron.com', 200, 280, { align: 'right' });

  // ── PAGE PROJECTION (page 2, format dynamique) ───────────────────────────────
  doc.addPage([projW, projH]);

  // Grid layers — drawn first so pattern pieces appear on top
  doc.setLineWidth(0.2);
  doc.setDrawColor(195, 205, 130);
  for (let x = 0; x <= projW + 1; x += 100) { doc.line(x, 0, x, projH); }
  for (let y = 0; y <= projH + 1; y += 100) { doc.line(0, y, projW, y); }

  const twoInchMm = 2 * 25.4;
  doc.setLineWidth(0.15);
  doc.setDrawColor(225, 185, 200);
  for (let x = 0; x <= projW + 1; x += twoInchMm) { doc.line(x, 0, x, projH); }
  for (let y = 0; y <= projH + 1; y += twoInchMm) { doc.line(0, y, projW, y); }

  // Header
  doc.setFont(bodyFont, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  const headerText = `Petit Citron Studio — ${patternName} — ${dateStr}${userName ? ` — ${userName}` : ''}`;
  doc.text(headerText, projW / 2, 12, { align: 'center' });

  // Pattern pieces side by side
  const startY = projHeaderH + projMargin;
  panels.forEach((panel, panelIndex) => {
    const startX = dartlessPanelWidthsMm
      ? projMargin + (panelIndex === 0 ? 0 : dartlessPanelWidthsMm.front + gap)
      : projMargin + panelIndex * (pieceW + gap);
    if (isSleeve) {
      drawSleevePatternPiece(doc, slm, startX, startY, unit, lang);
    } else if (isBodice) {
      if (patternType === 'bodice-dartless') {
        drawDartlessBodicePiece(doc, bm, category, startX, startY, panel, unit, lang, 0, 0);
      } else if (patternType === 'bodice-with-darts') {
        drawBodiceDartsPatternPiece(doc, bm, category, startX, startY, panel, unit, lang, 0, 0);
      } else {
        drawBodicePatternPiece(doc, bm, startX, startY, panel, unit, lang, 0, 0);
      }
    } else if (isPants) {
      if (panel === 'back') {
        drawPantsBackPanel(doc, pm, startX, startY, category, pantsHasDarts, unit, lang);
      } else {
        drawPantsFrontPanel(doc, pm, startX, startY, category, pantsHasDarts, unit, lang);
      }
    } else {
      drawSkirtPatternPiece(doc, sm, startX, startY, panel, unit, lang, 0, 0, category);
    }
  });

  // 10 cm ruler (bottom left)
  const rulerX = projMargin;
  const rulerY = projH - projFooterH - 10;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(rulerX, rulerY, rulerX + 100, rulerY);
  for (let i = 0; i <= 10; i++) {
    const tickX = rulerX + i * 10;
    const tickH = i % 5 === 0 ? 3 : 1.5;
    doc.line(tickX, rulerY - tickH, tickX, rulerY);
  }
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text('10 cm', rulerX + 50, rulerY + 4, { align: 'center' });

  // 4 inch ruler (stacked below the cm ruler)
  const inchMm = 25.4;
  const rulerInchY = rulerY + 9;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(rulerX, rulerInchY, rulerX + 4 * inchMm, rulerInchY);
  for (let i = 0; i <= 4; i++) {
    const tickX = rulerX + i * inchMm;
    const tickH = i % 2 === 0 ? 3 : 1.5;
    doc.line(tickX, rulerInchY - tickH, tickX, rulerInchY);
  }
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text('4 in', rulerX + 2 * inchMm, rulerInchY + 4, { align: 'center' });

  // Footer
  doc.setFont(bodyFont, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(
    s("Projection uniquement — ne pas imprimer à l'échelle", 'Projection only — do not print to scale'),
    projW / 2, projH - 5, { align: 'center' }
  );

  const date = new Date().toISOString().slice(0, 10);
  const typeLabel = pdfT.patternTypes[lang][patternType] ?? patternType;
  const namePart = userName ? ` - ${userName}` : '';
  doc.save(`projection - ${typeLabel.toLowerCase()} - ${date}${namePart}.pdf`);
}
