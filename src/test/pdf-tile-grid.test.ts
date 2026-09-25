import { describe, it, expect } from "vitest";
import { calculateTiles, getTileGrid } from "@/lib/pdf-export";

// A4 printable area used throughout pdf-export.ts (210x297mm page, 10mm margins).
const PRINTABLE_W = 190;
const PRINTABLE_H = 277;

// Small / medium / large pattern sizes (cm), roughly matching a kid's skirt, an average
// adult bodice-plus-skirt combined width, and a plus-size pants front+back combined width.
const SIZES: { label: string; widthCm: number; heightCm: number }[] = [
  { label: "petit (jupe enfant)", widthCm: 22, heightCm: 38 },
  { label: "moyen (corsage adulte)", widthCm: 48, heightCm: 62 },
  { label: "grand (pantalon grande taille)", widthCm: 97, heightCm: 112 },
];

describe("getTileGrid", () => {
  for (const { label, widthCm, heightCm } of SIZES) {
    it(`tiles the ${label} pattern with no gap or overflow between adjacent tiles`, () => {
      const dimensions = { widthCm, heightCm };
      const tiles = calculateTiles(dimensions, PRINTABLE_W, PRINTABLE_H);
      const grid = getTileGrid(dimensions, PRINTABLE_W, PRINTABLE_H);

      expect(grid).toHaveLength(tiles.totalPages);

      // Every tile is exactly one printable page in size — no drift from rounding.
      for (const tile of grid) {
        expect(tile.xEnd - tile.xStart).toBe(PRINTABLE_W);
        expect(tile.yEnd - tile.yStart).toBe(PRINTABLE_H);
      }

      // Tiles within the same row are perfectly contiguous: the last column's right edge
      // lands exactly on col * PRINTABLE_W, not a hair short or past it (the reported bug —
      // a ~1mm drift on the last tile of a row from an intermediate rounding step).
      for (let row = 0; row < tiles.rows; row++) {
        const rowTiles = grid.filter((t) => t.row === row).sort((a, b) => a.col - b.col);
        expect(rowTiles).toHaveLength(tiles.cols);
        for (let col = 0; col < rowTiles.length; col++) {
          expect(rowTiles[col].xStart).toBe(col * PRINTABLE_W);
          expect(rowTiles[col].xEnd).toBe((col + 1) * PRINTABLE_W);
          if (col > 0) {
            expect(rowTiles[col].xStart).toBe(rowTiles[col - 1].xEnd);
          }
        }
        // The grid must fully cover the pattern's right edge — the last tile's xEnd
        // is at or past the total pattern width, never short of it.
        expect(rowTiles[rowTiles.length - 1].xEnd).toBeGreaterThanOrEqual(widthCm * 10);
      }

      // Same contiguity check down each column, for the bottom row of tiles.
      for (let col = 0; col < tiles.cols; col++) {
        const colTiles = grid.filter((t) => t.col === col).sort((a, b) => a.row - b.row);
        expect(colTiles).toHaveLength(tiles.rows);
        for (let row = 0; row < colTiles.length; row++) {
          expect(colTiles[row].yStart).toBe(row * PRINTABLE_H);
          if (row > 0) {
            expect(colTiles[row].yStart).toBe(colTiles[row - 1].yEnd);
          }
        }
        expect(colTiles[colTiles.length - 1].yEnd).toBeGreaterThanOrEqual(heightCm * 10);
      }
    });
  }

  it("never produces a tile whose bounds exceed a whole number of printable-page multiples", () => {
    // Guards against any future reintroduction of an intermediate Math.round/floor in the
    // offset computation: tile edges must always land on an exact multiple of the page's
    // printable width/height, in both directions, for every tile in the grid.
    for (const { widthCm, heightCm } of SIZES) {
      const grid = getTileGrid({ widthCm, heightCm }, PRINTABLE_W, PRINTABLE_H);
      for (const tile of grid) {
        expect(tile.xStart % PRINTABLE_W).toBe(0);
        expect(tile.yStart % PRINTABLE_H).toBe(0);
      }
    }
  });
});
