import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { PantsMeasurementForm, defaultPantsMeasurements } from "@/components/PantsMeasurementForm";
import { PantsPatternPreview } from "@/components/PantsPatternPreview";
import { PantsWithDartsPatternPreview } from "@/components/PantsWithDartsPatternPreview";
import type { PantsMeasurements } from "@/types/sloper";

// Regression coverage for the "Femmes > Pantalon casse toute l'interface" tester
// report: clicking the pants tab crashed the whole app because
// PantsPatternPreview/PantsWithDartsPatternPreview called `.toFixed()` directly on
// measurements.hipHeight / measurements.crotchDepth, which were `undefined` for any
// saved profile that predates the pants garment (or belongs to another garment).
// With no ErrorBoundary anywhere in the app, that uncaught render error unmounted
// the entire tree — not just the pants tab's content.
describe("Femmes > Pantalon tab", () => {
  it("renders form + preview with default women measurements without console errors", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const m = defaultPantsMeasurements.women;
    render(
      <LanguageProvider>
        <PantsMeasurementForm measurements={m} onChange={() => {}} category="women" unit="cm" />
        <PantsPatternPreview measurements={m} category="women" />
      </LanguageProvider>
    );
    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it("does not crash when hipHeight/crotchDepth are missing, as for a legacy saved profile predating the pants garment", () => {
    const legacyMeasurements = { waist: 70, hip: 98 } as unknown as PantsMeasurements;

    expect(() =>
      render(
        <LanguageProvider>
          <PantsPatternPreview measurements={legacyMeasurements} category="women" />
        </LanguageProvider>
      )
    ).not.toThrow();

    expect(() =>
      render(
        <LanguageProvider>
          <PantsWithDartsPatternPreview measurements={legacyMeasurements} category="women" />
        </LanguageProvider>
      )
    ).not.toThrow();
  });
});
