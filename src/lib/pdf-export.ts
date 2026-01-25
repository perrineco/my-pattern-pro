import jsPDF from 'jspdf';
import { SkirtMeasurements, BodiceMeasurements, isBodiceMeasurements } from '@/types/sloper';

export type SeamAllowance = 0 | 0.5 | 1 | 1.5;

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

function calculateSkirtDimensions(measurements: SkirtMeasurements, seamAllowance: SeamAllowance = 1): PatternDimensions {
  const { waist, hip, skirtLength } = measurements;
  const hipQuarter = hip / 4;
  const waistQuarter = waist / 4;
  const ease = 1;
  const dartWidth = 2.5;
  
  const widthCm = Math.max(hipQuarter + ease, waistQuarter + ease + dartWidth) + 4 + (seamAllowance * 2);
  const heightCm = skirtLength + 4 + (seamAllowance * 2);
  
  return { widthCm, heightCm };
}

function calculateBodiceDimensions(measurements: BodiceMeasurements, seamAllowance: SeamAllowance = 1): PatternDimensions {
  const { bust, waist, shoulderToWaist, shoulderWidth } = measurements;
  const bustQuarter = bust / 4;
  const waistQuarter = waist / 4;
  const shoulderHalf = shoulderWidth / 2;
  const ease = 1;
  
  const widthCm = Math.max(bustQuarter, waistQuarter, shoulderHalf) + ease + 5 + (seamAllowance * 2);
  const heightCm = shoulderToWaist + 5 + (seamAllowance * 2);
  
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
  seamAllowance: SeamAllowance = 1
) {
  const { waist, hip, waistToHip, skirtLength } = measurements;
  const seamMm = seamAllowance * 10;
  const waistQuarter = (waist / 4) * 10;
  const hipQuarter = (hip / 4) * 10;
  const ease = 10;
  const dartWidth = 25;
  const dartLength = (waistToHip * 0.7) * 10;
  const waistToHipMm = waistToHip * 10;
  const lengthMm = skirtLength * 10;
  
  const waistWidth = waistQuarter + ease + dartWidth;
  const patternWidth = hipQuarter + ease;
  
  if (seamMm > 0) {
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.3);
    doc.setLineDashPattern([2, 1], 0);
    
    const seamPoints: [number, number][] = [
      [offsetX - seamMm, offsetY - seamMm],
      [offsetX + waistWidth / 2 - dartWidth / 2, offsetY - seamMm],
      [offsetX + waistWidth / 2, offsetY + dartLength],
      [offsetX + waistWidth / 2 + dartWidth / 2, offsetY - seamMm],
      [offsetX + waistWidth + seamMm, offsetY - seamMm],
      [offsetX + patternWidth + seamMm, offsetY + waistToHipMm],
      [offsetX + patternWidth + seamMm, offsetY + lengthMm + seamMm],
      [offsetX - seamMm, offsetY + lengthMm + seamMm],
    ];
    
    for (let i = 0; i < seamPoints.length; i++) {
      const next = (i + 1) % seamPoints.length;
      doc.line(seamPoints[i][0], seamPoints[i][1], seamPoints[next][0], seamPoints[next][1]);
    }
    
    doc.setLineDashPattern([], 0);
  }
  
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  
  const points: [number, number][] = [
    [offsetX, offsetY],
    [offsetX + waistWidth / 2 - dartWidth / 2, offsetY],
    [offsetX + waistWidth / 2, offsetY + dartLength],
    [offsetX + waistWidth / 2 + dartWidth / 2, offsetY],
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
  doc.text('FRONT', offsetX + patternWidth / 2, offsetY + lengthMm / 2 - 5, { align: 'center' });
  
  doc.setFontSize(8);
  doc.text('Cut 1 on fold', offsetX + patternWidth / 2, offsetY + lengthMm / 2 + 5, { align: 'center' });
  
  if (seamMm > 0) {
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text(`SA: ${seamAllowance}cm`, offsetX + patternWidth / 2, offsetY + lengthMm / 2 + 12, { align: 'center' });
  }
  
  doc.setFontSize(7);
  doc.setTextColor(80, 80, 80);
  doc.text(`¼ waist + dart = ${(waist / 4 + 2.5 + 1).toFixed(1)}cm`, offsetX + waistWidth / 2, offsetY - 5, { align: 'center' });
  doc.text(`Length = ${skirtLength}cm`, offsetX - 8, offsetY + lengthMm / 2, { angle: 90 });
  doc.text(`¼ hip = ${(hip / 4 + 1).toFixed(1)}cm`, offsetX + patternWidth + 8, offsetY + waistToHipMm + (lengthMm - waistToHipMm) / 2, { angle: 270 });
}

function drawBodicePatternPiece(
  doc: jsPDF,
  measurements: BodiceMeasurements,
  offsetX: number,
  offsetY: number,
  seamAllowance: SeamAllowance = 1,
  panel: 'front' | 'back' = 'front'
) {
  const {
    bust,
    waist,
    shoulderToWaist,
    bustHeight,
    shoulderWidth,
    armholeDepth,
    neckWidth,
    shoulderSlope,
  } = measurements;
  
  const seamMm = seamAllowance * 10;
  const ease = 10; // 1cm in mm
  
  // Convert to mm
  const bustQuarterMm = (bust / 4 + 1) * 10;
  const waistQuarterMm = (waist / 4 + 1) * 10;
  const shoulderHalfMm = (shoulderWidth / 2) * 10;
  const shoulderToWaistMm = shoulderToWaist * 10;
  const bustHeightMm = bustHeight * 10;
  const armholeDepthMm = armholeDepth * 10;
  const neckHalfMm = (neckWidth / 2) * 10;
  const shoulderSlopeMm = shoulderSlope * 10;
  
  const isFront = panel === 'front';
  const neckDropMm = isFront ? 15 : 0; // Front has lower neckline
  
  // Dart dimensions
  const waistDartWidth = 20; // 2cm
  const waistDartDepth = shoulderToWaistMm * 0.35;
  const bustDartWidth = isFront ? 25 : 0; // 2.5cm bust dart for front only
  const bustDartDepth = isFront ? bustHeightMm * 0.8 : 0;
  
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  
  // Build pattern points
  const neckX = offsetX + neckHalfMm;
  const shoulderX = offsetX + shoulderHalfMm;
  const shoulderY = offsetY + shoulderSlopeMm;
  const armholeX = offsetX + bustQuarterMm;
  const armholeY = offsetY + armholeDepthMm;
  const waistX = offsetX + waistQuarterMm;
  const waistY = offsetY + shoulderToWaistMm;
  
  // Draw seam allowance first
  if (seamMm > 0) {
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.3);
    doc.setLineDashPattern([2, 1], 0);
    
    // Simplified seam allowance outline
    doc.line(offsetX - seamMm, offsetY + neckDropMm - seamMm, neckX, offsetY - seamMm);
    doc.line(neckX, offsetY - seamMm, shoulderX + seamMm, shoulderY - seamMm);
    doc.line(shoulderX + seamMm, shoulderY - seamMm, armholeX + seamMm, armholeY);
    doc.line(armholeX + seamMm, armholeY, waistX + seamMm, waistY + seamMm);
    doc.line(waistX + seamMm, waistY + seamMm, offsetX - seamMm, waistY + seamMm);
    doc.line(offsetX - seamMm, waistY + seamMm, offsetX - seamMm, offsetY + neckDropMm - seamMm);
    
    doc.setLineDashPattern([], 0);
  }
  
  // Main pattern outline
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  
  // Center front/back to neck
  doc.line(offsetX, offsetY + neckDropMm, offsetX, waistY);
  
  // Neck curve (simplified as lines)
  doc.line(offsetX, offsetY + neckDropMm, neckX, offsetY);
  
  // Shoulder line
  doc.line(neckX, offsetY, shoulderX, shoulderY);
  
  // Armhole curve (simplified)
  doc.line(shoulderX, shoulderY, armholeX, armholeY);
  
  // Side seam
  doc.line(armholeX, armholeY, waistX, waistY);
  
  // Waist with dart
  const waistDartX = offsetX + waistQuarterMm / 2;
  doc.line(waistX, waistY, waistDartX + waistDartWidth / 2, waistY);
  doc.line(waistDartX + waistDartWidth / 2, waistY, waistDartX, waistY - waistDartDepth);
  doc.line(waistDartX, waistY - waistDartDepth, waistDartX - waistDartWidth / 2, waistY);
  doc.line(waistDartX - waistDartWidth / 2, waistY, offsetX, waistY);
  
  // Bust dart for front panel
  if (isFront && bustDartDepth > 0) {
    const bustDartY = offsetY + bustHeightMm;
    doc.setDrawColor(180, 80, 80);
    doc.line(armholeX, bustDartY - bustDartWidth / 2, armholeX - bustDartDepth, bustDartY);
    doc.line(armholeX - bustDartDepth, bustDartY, armholeX, bustDartY + bustDartWidth / 2);
  }
  
  // Grain line
  const grainX = offsetX + bustQuarterMm * 0.4;
  const grainTop = offsetY + shoulderToWaistMm * 0.2;
  const grainBottom = offsetY + shoulderToWaistMm * 0.8;
  
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
  doc.text(isFront ? 'FRONT' : 'BACK', offsetX + bustQuarterMm / 2, offsetY + shoulderToWaistMm / 2 - 5, { align: 'center' });
  
  doc.setFontSize(8);
  doc.text('Cut 1 on fold', offsetX + bustQuarterMm / 2, offsetY + shoulderToWaistMm / 2 + 5, { align: 'center' });
  
  if (seamMm > 0) {
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text(`SA: ${seamAllowance}cm`, offsetX + bustQuarterMm / 2, offsetY + shoulderToWaistMm / 2 + 12, { align: 'center' });
  }
  
  // Measurement annotations
  doc.setFontSize(7);
  doc.setTextColor(80, 80, 80);
  doc.text(`¼ bust = ${(bust / 4 + 1).toFixed(1)}cm`, offsetX + bustQuarterMm / 2, armholeY + 5);
  doc.text(`Length = ${shoulderToWaist}cm`, offsetX - 8, offsetY + shoulderToWaistMm / 2, { angle: 90 });
}

function draw1cmTestSquare(doc: jsPDF) {
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.rect(MARGIN + 5, MARGIN + 5, 10, 10);
  doc.setFontSize(6);
  doc.setTextColor(0, 0, 0);
  doc.text('1cm test', MARGIN + 10, MARGIN + 20, { align: 'center' });
}

export function generatePatternPDF(
  measurements: SkirtMeasurements | BodiceMeasurements,
  patternType: string = 'skirt',
  seamAllowance: SeamAllowance = 1
): void {
  const isBodice = isBodiceMeasurements(measurements);
  
  const dimensions = isBodice
    ? calculateBodiceDimensions(measurements, seamAllowance)
    : calculateSkirtDimensions(measurements as SkirtMeasurements, seamAllowance);
  
  const tiles = calculateTiles(dimensions);
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  const patternMarginMm = 20;
  let pageNum = 0;
  
  // For bodice, we generate front and back panels
  const panels: ('front' | 'back')[] = isBodice ? ['front', 'back'] : ['front'];
  
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
          draw1cmTestSquare(doc);
        }
        
        doc.saveGraphicsState();
        doc.rect(MARGIN, MARGIN, PRINTABLE_WIDTH, PRINTABLE_HEIGHT);
        
        const patternX = patternMarginMm - viewOffsetX + MARGIN;
        const patternY = patternMarginMm - viewOffsetY + MARGIN;
        
        if (isBodice) {
          drawBodicePatternPiece(doc, measurements, patternX, patternY, seamAllowance, panel);
        } else {
          drawSkirtPatternPiece(doc, measurements as SkirtMeasurements, patternX, patternY, seamAllowance);
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
    `Pattern: ${patternType.charAt(0).toUpperCase() + patternType.slice(1)} Sloper${isBodice ? ' - Front & Back Panels' : ' - Front Panel'}`,
    `Total pages: ${tiles.totalPages * panels.length}`,
    `Seam Allowance: ${seamAllowance === 0 ? 'None (cut on line)' : `${seamAllowance}cm`}`,
    '',
    'Measurements used:',
  ];
  
  const measurementLines = isBodice
    ? [
        `  • Bust: ${(measurements as BodiceMeasurements).bust}cm`,
        `  • Waist: ${(measurements as BodiceMeasurements).waist}cm`,
        `  • Shoulder to Waist: ${(measurements as BodiceMeasurements).shoulderToWaist}cm`,
        `  • Bust Height: ${(measurements as BodiceMeasurements).bustHeight}cm`,
        `  • Shoulder Width: ${(measurements as BodiceMeasurements).shoulderWidth}cm`,
        `  • Armhole Depth: ${(measurements as BodiceMeasurements).armholeDepth}cm`,
      ]
    : [
        `  • Waist: ${(measurements as SkirtMeasurements).waist}cm`,
        `  • Hip: ${(measurements as SkirtMeasurements).hip}cm`,
        `  • Waist to Hip: ${(measurements as SkirtMeasurements).waistToHip}cm`,
        `  • Skirt Length: ${(measurements as SkirtMeasurements).skirtLength}cm`,
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
  
  const filename = `sloper-${patternType}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}
