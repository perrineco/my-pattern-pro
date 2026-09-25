import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import fs from "node:fs";
import { generateTiledPDF, generateProjectionPDF } from "@/lib/pdf-export";
import { defaultMeasurements as defaultSkirtMeasurements } from "@/components/SkirtMeasurementForm";
import { defaultBodiceMeasurements } from "@/components/BodiceMeasurementForm";
import { defaultPantsMeasurements } from "@/components/PantsMeasurementForm";
import type { Category } from "@/types/sloper";

// jsdom never fires a real network request for the logo image, so `new Image()`
// would hang forever waiting for onload/onerror. loadLogoBase64() already treats a
// failed logo load as non-fatal (falls back to no logo), so this stub just forces
// that path deterministically and fast - it changes no production behavior.
beforeEach(() => {
  class FakeImage {
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    set src(_v: string) {
      queueMicrotask(() => this.onerror?.());
    }
  }
  // @ts-expect-error test stub, see comment above
  global.Image = FakeImage;

  // Under Vitest, jsPDF resolves to its Node build, where doc.save() calls
  // fs.writeFileSync/writeFile directly instead of triggering a browser download -
  // without this stub, every run of this suite (including from the pre-commit hook)
  // would litter real .pdf files into the repo's working directory.
  vi.spyOn(fs, "writeFileSync").mockImplementation(() => undefined);
  vi.spyOn(fs, "writeFile").mockImplementation(((...args: unknown[]) => {
    const cb = args[args.length - 1] as (err: NodeJS.ErrnoException | null) => void;
    cb(null);
  }) as typeof fs.writeFile);
});

afterEach(() => {
  vi.restoreAllMocks();
});

const CATEGORIES: Category[] = ["women", "men", "kids"];
const TILED_FORMATS: Array<"a4" | "letter" | "a0"> = ["a4", "letter", "a0"];

const GARMENTS: Array<{
  label: string;
  patternType: string;
  measurementsByCategory: Record<Category, Record<string, number | undefined>>;
}> = [
  { label: "skirt", patternType: "skirt", measurementsByCategory: defaultSkirtMeasurements },
  { label: "bodice", patternType: "bodice", measurementsByCategory: defaultBodiceMeasurements },
  { label: "pants", patternType: "pants", measurementsByCategory: defaultPantsMeasurements },
];

// Requirement 2 of the pre-commit suite: every garment x category must export
// without throwing, in every offered format (A4, US Letter, A0, projection). PDF
// generation is pure jsPDF drawing (no canvas/html2canvas involved) so it runs fine
// under Vitest/jsdom - see the Image stub above for the one browser-only dependency
// (the logo fetch) it has.
describe("PDF export: garment x category x format generates without throwing", () => {
  for (const garment of GARMENTS) {
    for (const category of CATEGORIES) {
      const measurements = garment.measurementsByCategory[category];

      for (const format of TILED_FORMATS) {
        it(`${garment.label} / ${category} / ${format}`, async () => {
          await expect(
            generateTiledPDF(format, measurements as never, garment.patternType, "cm", "fr", "Test", category)
          ).resolves.not.toThrow();
        }, 15000);
      }

      it(`${garment.label} / ${category} / projection`, async () => {
        await expect(
          generateProjectionPDF(measurements as never, garment.patternType, "cm", "fr", "Test", category)
        ).resolves.not.toThrow();
      }, 15000);
    }
  }
});
