import jsPDF from 'jspdf';
import { SkirtMeasurements } from '@/types/sloper';

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

function calculatePatternDimensions(measurements: SkirtMeasurements): PatternDimensions {
  const { waist, hip, skirtLength } = measurements;
  const hipQuarter = hip / 4;
  const waistQuarter = waist / 4;
  const ease = 1;
  const dartWidth = 2.5;
  
  // Pattern piece dimensions in cm (actual size)
  const widthCm = Math.max(hipQuarter + ease, waistQuarter + ease + dartWidth) + 4; // +4 for margins
  const heightCm = skirtLength + 4; // +4 for margins
  
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
  
  // Top-left corner mark
  if (pageCol > 0 || pageRow > 0) {
    doc.line(MARGIN, MARGIN, MARGIN + MARK_SIZE, MARGIN);
    doc.line(MARGIN, MARGIN, MARGIN, MARGIN + MARK_SIZE);
    // Cross mark for alignment
    doc.line(MARGIN - MARK_OFFSET, MARGIN - MARK_OFFSET, MARGIN + MARK_OFFSET, MARGIN + MARK_OFFSET);
    doc.line(MARGIN - MARK_OFFSET, MARGIN + MARK_OFFSET, MARGIN + MARK_OFFSET, MARGIN - MARK_OFFSET);
  }
  
  // Top-right corner mark
  if (pageCol < totalCols - 1 || pageRow > 0) {
    doc.line(A4_WIDTH - MARGIN - MARK_SIZE, MARGIN, A4_WIDTH - MARGIN, MARGIN);
    doc.line(A4_WIDTH - MARGIN, MARGIN, A4_WIDTH - MARGIN, MARGIN + MARK_SIZE);
  }
  
  // Bottom-left corner mark
  if (pageCol > 0 || pageRow < totalRows - 1) {
    doc.line(MARGIN, A4_HEIGHT - MARGIN - MARK_SIZE, MARGIN, A4_HEIGHT - MARGIN);
    doc.line(MARGIN, A4_HEIGHT - MARGIN, MARGIN + MARK_SIZE, A4_HEIGHT - MARGIN);
  }
  
  // Bottom-right corner mark
  if (pageCol < totalCols - 1 || pageRow < totalRows - 1) {
    doc.line(A4_WIDTH - MARGIN - MARK_SIZE, A4_HEIGHT - MARGIN, A4_WIDTH - MARGIN, A4_HEIGHT - MARGIN);
    doc.line(A4_WIDTH - MARGIN, A4_HEIGHT - MARGIN - MARK_SIZE, A4_WIDTH - MARGIN, A4_HEIGHT - MARGIN);
  }
  
  // Draw registration circles at corners
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

function drawPatternPiece(
  doc: jsPDF,
  measurements: SkirtMeasurements,
  offsetX: number,
  offsetY: number
) {
  const { waist, hip, waistToHip, skirtLength } = measurements;
  
  // Calculate pattern dimensions (in mm for PDF)
  const waistQuarter = (waist / 4) * 10;
  const hipQuarter = (hip / 4) * 10;
  const ease = 10; // 1cm in mm
  const dartWidth = 25; // 2.5cm in mm
  const dartLength = (waistToHip * 0.7) * 10;
  const waistToHipMm = waistToHip * 10;
  const lengthMm = skirtLength * 10;
  
  const waistWidth = waistQuarter + ease + dartWidth;
  const patternWidth = hipQuarter + ease;
  
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  
  // Main pattern outline
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
  
  // Draw outline
  for (let i = 0; i < points.length; i++) {
    const next = (i + 1) % points.length;
    doc.line(points[i][0], points[i][1], points[next][0], points[next][1]);
  }
  
  // Draw grain line (dashed)
  const grainX = offsetX + patternWidth / 2;
  const grainTop = offsetY + 30;
  const grainBottom = offsetY + lengthMm - 30;
  
  doc.setLineDashPattern([3, 2], 0);
  doc.line(grainX, grainTop, grainX, grainBottom);
  doc.setLineDashPattern([], 0);
  
  // Draw arrow heads for grain line
  const arrowSize = 4;
  doc.line(grainX - arrowSize, grainTop + arrowSize, grainX, grainTop);
  doc.line(grainX + arrowSize, grainTop + arrowSize, grainX, grainTop);
  doc.line(grainX - arrowSize, grainBottom - arrowSize, grainX, grainBottom);
  doc.line(grainX + arrowSize, grainBottom - arrowSize, grainX, grainBottom);
  
  // Labels
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('FRONT', offsetX + patternWidth / 2, offsetY + lengthMm / 2 - 5, { align: 'center' });
  
  doc.setFontSize(8);
  doc.text('Cut 1 on fold', offsetX + patternWidth / 2, offsetY + lengthMm / 2 + 5, { align: 'center' });
  
  // Measurement annotations
  doc.setFontSize(7);
  doc.setTextColor(80, 80, 80);
  
  // Waist measurement
  doc.text(`¼ waist + dart = ${(waist / 4 + 2.5 + 1).toFixed(1)}cm`, offsetX + waistWidth / 2, offsetY - 5, { align: 'center' });
  
  // Length measurement (rotated text along side)
  doc.text(`Length = ${skirtLength}cm`, offsetX - 8, offsetY + lengthMm / 2, { angle: 90 });
  
  // Hip measurement
  doc.text(`¼ hip = ${(hip / 4 + 1).toFixed(1)}cm`, offsetX + patternWidth + 8, offsetY + waistToHipMm + (lengthMm - waistToHipMm) / 2, { angle: 270 });
}

function draw1cmTestSquare(doc: jsPDF) {
  // Draw a 1cm test square on the first page for size verification
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.rect(MARGIN + 5, MARGIN + 5, 10, 10); // 10mm = 1cm
  doc.setFontSize(6);
  doc.setTextColor(0, 0, 0);
  doc.text('1cm test', MARGIN + 10, MARGIN + 20, { align: 'center' });
}

export function generatePatternPDF(measurements: SkirtMeasurements, patternType: string = 'skirt'): void {
  const dimensions = calculatePatternDimensions(measurements);
  const tiles = calculateTiles(dimensions);
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  // Pattern offset (20mm margin in the actual pattern)
  const patternMarginMm = 20;
  
  let pageNum = 0;
  
  for (let row = 0; row < tiles.rows; row++) {
    for (let col = 0; col < tiles.cols; col++) {
      if (pageNum > 0) {
        doc.addPage();
      }
      pageNum++;
      
      // Calculate the view offset for this tile
      const viewOffsetX = col * PRINTABLE_WIDTH;
      const viewOffsetY = row * PRINTABLE_HEIGHT;
      
      // Draw alignment marks
      drawAlignmentMarks(doc, col, row, tiles.cols, tiles.rows);
      
      // Draw page info
      drawPageInfo(doc, pageNum, tiles.totalPages, col, row);
      
      // Draw 1cm test square on first page only
      if (pageNum === 1) {
        draw1cmTestSquare(doc);
      }
      
      // Save state and set clipping region
      doc.saveGraphicsState();
      doc.rect(MARGIN, MARGIN, PRINTABLE_WIDTH, PRINTABLE_HEIGHT);
      
      // Draw pattern piece with offset for this tile
      // The pattern is drawn at its full size, but we translate it so only the relevant portion is visible
      const patternX = patternMarginMm - viewOffsetX + MARGIN;
      const patternY = patternMarginMm - viewOffsetY + MARGIN;
      
      drawPatternPiece(doc, measurements, patternX, patternY);
      
      doc.restoreGraphicsState();
    }
  }
  
  // Add assembly instruction page
  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Assembly Instructions', A4_WIDTH / 2, 30, { align: 'center' });
  
  doc.setFontSize(10);
  const instructions = [
    '1. Print all pages at 100% scale (no scaling/fit to page).',
    '2. Verify the 1cm test square on the first page measures exactly 1cm x 1cm.',
    '3. Cut along the outer edges of each page, leaving the alignment marks intact.',
    '4. Match up the alignment marks and circles from adjacent pages.',
    '5. Tape or glue pages together, starting from the top-left corner.',
    '6. Once assembled, cut out the pattern piece along the solid black line.',
    '',
    `Pattern: ${patternType.charAt(0).toUpperCase() + patternType.slice(1)} Sloper - Front Panel`,
    `Total pages: ${tiles.totalPages} (${tiles.cols} columns × ${tiles.rows} rows)`,
    '',
    'Measurements used:',
    `  • Waist: ${measurements.waist}cm`,
    `  • Hip: ${measurements.hip}cm`,
    `  • Waist to Hip: ${measurements.waistToHip}cm`,
    `  • Skirt Length: ${measurements.skirtLength}cm`,
  ];
  
  let y = 50;
  instructions.forEach((line) => {
    doc.text(line, MARGIN + 10, y);
    y += 7;
  });
  
  // Draw tile layout diagram
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
  
  // Save the PDF
  const filename = `sloper-${patternType}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}
