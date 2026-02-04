import jsPDF from 'jspdf';
import { SkirtMeasurements, BodiceMeasurements, isBodiceMeasurements } from '@/types/sloper';
import { MeasurementUnit, cmToInches } from '@/components/UnitToggle';

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

function drawPageInfo(doc: jsPDF, pageNum: number, totalPages: number, col: number, row: number) {
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(`Page ${pageNum} of ${totalPages} (Row ${row + 1}, Col ${col + 1})`, A4_WIDTH / 2, A4_HEIGHT - 3, { align: 'center' });
  doc.text('Sloper Studio', MARGIN, A4_HEIGHT - 3);
  doc.text('Cut on fold', A4_WIDTH - MARGIN, A4_HEIGHT - 3, { align: 'right' });
}

function drawSkirtPatternPiece(
  doc: jsPDF,
  measurements: SkirtMeasurements,
  offsetX: number,
  offsetY: number,
  panel: 'front' | 'back' = 'front',
  unit: MeasurementUnit = 'cm'
) {
  const { waist, hip, waistToHip, skirtLength } = measurements;
  const waistQuarter = (waist / 4) * 10;
  const hipQuarter = (hip / 4) * 10;
  const ease = 10;
  
  // Back panel has larger dart
  const isFront = panel === 'front';
  const dartWidthBase = ((hip - waist) * 25) / 240; // Match preview calculation
  const dartWidth = (isFront ? dartWidthBase : dartWidthBase * 1.2) * 10;
  const dartLength = (waistToHip * (isFront ? 0.5 : 0.55)) * 10; // Back dart slightly longer
  const waistToHipMm = waistToHip * 10;
  const lengthMm = skirtLength * 10;
  
  const waistWidth = waistQuarter + ease + dartWidth;
  const patternWidth = hipQuarter + ease;
  
  // Dart position: front at 40%, back at 35% from center
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
  doc.text(isFront ? 'FRONT' : 'BACK', offsetX + patternWidth / 2, offsetY + lengthMm / 2 - 5, { align: 'center' });
  
  doc.setFontSize(8);
  doc.text('Cut 1 on fold', offsetX + patternWidth / 2, offsetY + lengthMm / 2 + 5, { align: 'center' });
  
  doc.setFontSize(7);
  doc.setTextColor(80, 80, 80);
  const dartWidthCm = isFront ? dartWidthBase : dartWidthBase * 1.2;
  doc.text(`¼ waist + dart = ${formatMeasurement(waist / 4 + dartWidthCm + 1, unit)}`, offsetX + waistWidth / 2, offsetY - 5, { align: 'center' });
  doc.text(`Length = ${formatMeasurement(skirtLength, unit)}`, offsetX - 8, offsetY + lengthMm / 2, { angle: 90 });
  doc.text(`¼ hip = ${formatMeasurement(hip / 4 + 1, unit)}`, offsetX + patternWidth + 8, offsetY + waistToHipMm + (lengthMm - waistToHipMm) / 2, { angle: 270 });
}

function drawBodicePatternPiece(
  doc: jsPDF,
  measurements: BodiceMeasurements,
  offsetX: number,
  offsetY: number,
  panel: 'front' | 'back' = 'front',
  unit: MeasurementUnit = 'cm'
) {
  const {
    bust,
    neckCircumference,
    shoulderLength,
    backWidth,
    backLength,
  } = measurements;
  
  const ease = 10; // 1cm in mm
  
  // Convert to mm
  const bustQuarterMm = (bust / 4 + 1) * 10;
  const neckWidthMm = (neckCircumference / 6) * 10; // Approximate neck width
  const shoulderLengthMm = shoulderLength * 10;
  const backLengthMm = backLength * 10;
  const shoulderSlopeMm = 40; // Standard 4cm slope
  
  // Armhole depth derived from back length
  const armholeDepthMm = backLength * 0.5 * 10;
  
  const isFront = panel === 'front';
  const neckDropMm = isFront ? 15 : 0; // Front has lower neckline
  
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  
  // Build pattern points
  const neckX = offsetX + neckWidthMm;
  const shoulderEndX = offsetX + neckWidthMm + shoulderLengthMm;
  const shoulderY = offsetY + shoulderSlopeMm;
  const sideX = offsetX + bustQuarterMm;
  const waistY = offsetY + backLengthMm;
  
  // Main pattern outline
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  
  // Center front/back to neck
  doc.line(offsetX, offsetY + neckDropMm, offsetX, waistY);
  
  // Neck curve (simplified as lines)
  doc.line(offsetX, offsetY + neckDropMm, neckX, offsetY);
  
  // Shoulder line
  doc.line(neckX, offsetY, shoulderEndX, shoulderY);
  
  // Armhole curve (simplified)
  doc.line(shoulderEndX, shoulderY, sideX, offsetY + armholeDepthMm);
  
  // Side seam
  doc.line(sideX, offsetY + armholeDepthMm, sideX, waistY);
  
  // Waist line
  doc.line(sideX, waistY, offsetX, waistY);
  
  // Grain line
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
  
  // Labels
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(isFront ? 'FRONT' : 'BACK', offsetX + bustQuarterMm / 2, offsetY + backLengthMm / 2 - 5, { align: 'center' });
  
  doc.setFontSize(8);
  doc.text('Cut 1 on fold', offsetX + bustQuarterMm / 2, offsetY + backLengthMm / 2 + 5, { align: 'center' });
  
  // Measurement annotations
  doc.setFontSize(7);
  doc.setTextColor(80, 80, 80);
  doc.text(`¼ bust = ${formatMeasurement(bust / 4 + 1, unit)}`, offsetX + bustQuarterMm / 2, offsetY + armholeDepthMm + 5);
  doc.text(`Back length = ${formatMeasurement(backLength, unit)}`, offsetX - 8, offsetY + backLengthMm / 2, { angle: 90 });
}

function draw1cmTestSquare(doc: jsPDF, unit: MeasurementUnit) {
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.rect(MARGIN + 5, MARGIN + 5, 10, 10);
  doc.setFontSize(6);
  doc.setTextColor(0, 0, 0);
  const label = unit === 'inches' ? '1cm / 0.39″' : '1cm test';
  doc.text(label, MARGIN + 10, MARGIN + 20, { align: 'center' });
}

export function generatePatternPDF(
  measurements: SkirtMeasurements | BodiceMeasurements,
  patternType: string = 'skirt',
  unit: MeasurementUnit = 'cm'
): void {
  const isBodice = isBodiceMeasurements(measurements);
  
  const dimensions = isBodice
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
  
  // Both skirt and bodice now have front and back panels
  const panels: ('front' | 'back')[] = ['front', 'back'];
  
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
        drawPageInfo(doc, pageNum, tiles.totalPages * panels.length, col, row);
        
        if (pageNum === 1) {
          draw1cmTestSquare(doc, unit);
        }
        
        doc.saveGraphicsState();
        doc.rect(MARGIN, MARGIN, PRINTABLE_WIDTH, PRINTABLE_HEIGHT);
        
        const patternX = patternMarginMm - viewOffsetX + MARGIN;
        const patternY = patternMarginMm - viewOffsetY + MARGIN;
        
        if (isBodice) {
          drawBodicePatternPiece(doc, measurements, patternX, patternY, panel, unit);
        } else {
          drawSkirtPatternPiece(doc, measurements as SkirtMeasurements, patternX, patternY, panel, unit);
        }
        
        doc.restoreGraphicsState();
      }
    }
  }
  
  // Assembly instruction page
  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Assembly Instructions', A4_WIDTH / 2, 30, { align: 'center' });
  
  doc.setFontSize(10);
  const baseInstructions = [
    '1. Print all pages at 100% scale (no scaling/fit to page).',
    '2. Verify the 1cm test square on the first page measures exactly 1cm x 1cm.',
    '3. Cut along the outer edges of each page, leaving the alignment marks intact.',
    '4. Match up the alignment marks and circles from adjacent pages.',
    '5. Tape or glue pages together, starting from the top-left corner.',
    '6. Once assembled, cut out the pattern piece along the solid black line.',
    '',
    `Pattern: ${patternType.charAt(0).toUpperCase() + patternType.slice(1)} Sloper - Front & Back Panels`,
    `Total pages: ${tiles.totalPages * panels.length}`,
    '',
    'Measurements used:',
  ];
  
  const measurementLines = isBodice
    ? [
        `  • Bust: ${formatMeasurement((measurements as BodiceMeasurements).bust, unit)}`,
        `  • Neckline: ${formatMeasurement((measurements as BodiceMeasurements).neckCircumference, unit)}`,
        `  • Shoulder Length: ${formatMeasurement((measurements as BodiceMeasurements).shoulderLength, unit)}`,
        `  • Back Width: ${formatMeasurement((measurements as BodiceMeasurements).backWidth, unit)}`,
        `  • Back Length: ${formatMeasurement((measurements as BodiceMeasurements).backLength, unit)}`,
      ]
    : [
        `  • Waist: ${formatMeasurement((measurements as SkirtMeasurements).waist, unit)}`,
        `  • Hip: ${formatMeasurement((measurements as SkirtMeasurements).hip, unit)}`,
        `  • Waist to Hip: ${formatMeasurement((measurements as SkirtMeasurements).waistToHip, unit)}`,
        `  • Skirt Length: ${formatMeasurement((measurements as SkirtMeasurements).skirtLength, unit)}`,
      ];
  
  const instructions = [...baseInstructions, ...measurementLines];
  
  let y = 50;
  instructions.forEach((line) => {
    doc.text(line, MARGIN + 10, y);
    y += 7;
  });
  
  // Tile layout diagram
  y += 10;
  doc.setFontSize(12);
  doc.text('Page Layout:', MARGIN + 10, y);
  y += 10;
  
  const diagramScale = 15;
  const diagramX = MARGIN + 20;
  
  for (let row = 0; row < tiles.rows; row++) {
    for (let col = 0; col < tiles.cols; col++) {
      const x = diagramX + col * diagramScale;
      const tileY = y + row * diagramScale;
      const pageNumber = row * tiles.cols + col + 1;
      
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.3);
      doc.rect(x, tileY, diagramScale, diagramScale);
      
      doc.setFontSize(8);
      doc.text(String(pageNumber), x + diagramScale / 2, tileY + diagramScale / 2 + 2, { align: 'center' });
    }
  }
  
  doc.save(`${patternType}-pattern.pdf`);
}
