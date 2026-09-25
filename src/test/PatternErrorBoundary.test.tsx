import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PatternErrorBoundary } from "@/components/PatternErrorBoundary";

function Bomb({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error("boom");
  return <div>pants content</div>;
}

// Unit coverage for the safety net added after bug #9 (Femmes > Pantalon crashing
// the whole interface): a render error inside one tab's content must be contained
// to that tab, must not take the rest of the page down, and must clear itself when
// the user switches to a different tab (resetKey).
describe("PatternErrorBoundary", () => {
  it("shows a fallback instead of an uncaught crash when its content throws", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <div>
        <div>sibling content outside the boundary</div>
        <PatternErrorBoundary resetKey="pants">
          <Bomb shouldThrow />
        </PatternErrorBoundary>
      </div>
    );

    // The boundary's fallback is shown, not a blank subtree...
    expect(screen.getByText(/erreur est survenue/i)).toBeInTheDocument();
    // ...and content outside the boundary is completely unaffected.
    expect(screen.getByText("sibling content outside the boundary")).toBeInTheDocument();

    errorSpy.mockRestore();
  });

  it("recovers automatically when resetKey changes (switching tabs)", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    const { rerender } = render(
      <PatternErrorBoundary resetKey="pants">
        <Bomb shouldThrow />
      </PatternErrorBoundary>
    );
    expect(screen.getByText(/erreur est survenue/i)).toBeInTheDocument();

    // Simulate switching to another tab: same boundary instance, new resetKey, and
    // this time the content underneath doesn't throw - it must render normally
    // instead of staying stuck on the previous tab's fallback.
    rerender(
      <PatternErrorBoundary resetKey="skirt">
        <Bomb shouldThrow={false} />
      </PatternErrorBoundary>
    );
    expect(screen.getByText("pants content")).toBeInTheDocument();
    expect(screen.queryByText(/erreur est survenue/i)).not.toBeInTheDocument();

    vi.restoreAllMocks();
  });
});
