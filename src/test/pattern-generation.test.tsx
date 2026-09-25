import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SkirtMeasurementForm, defaultMeasurements as defaultSkirtMeasurements } from "@/components/SkirtMeasurementForm";
import { BodiceMeasurementForm, defaultBodiceMeasurements } from "@/components/BodiceMeasurementForm";
import { PantsMeasurementForm, defaultPantsMeasurements } from "@/components/PantsMeasurementForm";
import { SkirtPatternPreview } from "@/components/SkirtPatternPreview";
import { BodicePatternPreview } from "@/components/BodicePatternPreview";
import { PantsPatternPreview } from "@/components/PantsPatternPreview";
import type { Category } from "@/types/sloper";

const CATEGORIES: Category[] = ["women", "men", "kids"];

// Requirement 1 of the pre-commit suite: every garment x category combination must
// render, with the category's default measurements, without throwing or logging a
// console error. This is the level bug #9 (Femmes > Pantalon) lived at - a crash
// here is exactly what used to take down the whole tab.
describe("pattern generation: garment x category renders cleanly", () => {
  for (const category of CATEGORIES) {
    it(`skirt / ${category}`, () => {
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const m = defaultSkirtMeasurements[category];
      render(
        <LanguageProvider>
          <SkirtMeasurementForm measurements={m} onChange={() => {}} category={category} unit="cm" />
          <SkirtPatternPreview measurements={m} category={category} />
        </LanguageProvider>
      );
      expect(errorSpy).not.toHaveBeenCalled();
      errorSpy.mockRestore();
    });

    it(`bodice / ${category}`, () => {
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const m = defaultBodiceMeasurements[category];
      render(
        <LanguageProvider>
          <BodiceMeasurementForm measurements={m} onChange={() => {}} category={category} unit="cm" />
          <BodicePatternPreview measurements={m} panel="front" />
        </LanguageProvider>
      );
      expect(errorSpy).not.toHaveBeenCalled();
      errorSpy.mockRestore();
    });

    it(`pants / ${category}`, () => {
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const m = defaultPantsMeasurements[category];
      render(
        <LanguageProvider>
          <PantsMeasurementForm measurements={m} onChange={() => {}} category={category} unit="cm" />
          <PantsPatternPreview measurements={m} category={category} />
        </LanguageProvider>
      );
      expect(errorSpy).not.toHaveBeenCalled();
      errorSpy.mockRestore();
    });
  }
});
