import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { UnitProvider } from "@/contexts/UnitContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { createSupabaseTestMock } from "./testSupabaseMock";
import type { User, Session } from "@supabase/supabase-js";

// Local mocks only - see testSupabaseMock.ts. No real Supabase project, tester
// account, or external API is ever contacted by this suite.

const fakeUser = { id: "test-user-1", email: "test@example.com", user_metadata: {} } as unknown as User;
const fakeSession = { access_token: "test-token", user: fakeUser } as unknown as Session;

vi.mock("@/contexts/AuthContext", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => ({
    user: fakeUser,
    session: fakeSession,
    loading: false,
    subscription: { tier: "pro", subscriptionEnd: null, patternsUsedThisMonth: 0 },
    purchasedPatterns: [],
    signUp: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
    checkSubscription: vi.fn(),
    refreshPurchasedPatterns: vi.fn(),
  }),
}));

vi.mock("@/integrations/supabase/client", () => ({
  get supabase() {
    return supabaseMock;
  },
}));

let supabaseMock: ReturnType<typeof createSupabaseTestMock>;

beforeEach(() => {
  supabaseMock = createSupabaseTestMock();
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network disabled in tests")));
  localStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

import Index from "@/pages/Index";

function renderApp() {
  return render(
    <MemoryRouter initialEntries={["/app"]}>
      <LanguageProvider>
        <UnitProvider>
          <CurrencyProvider>
            <Index />
          </CurrencyProvider>
        </UnitProvider>
      </LanguageProvider>
    </MemoryRouter>
  );
}

// Ignore the pre-existing, unrelated <button>-in-<button> DOM-nesting warning from
// a Popover trigger elsewhere on the page (not part of either regression this suite
// targets). Anything else logged to console.error is an uncaught render error.
function unexpectedErrors(errorSpy: ReturnType<typeof vi.spyOn>) {
  return errorSpy.mock.calls.filter((call) => !String(call[0]).includes("validateDOMNesting"));
}

const CATEGORY_LABELS = ["Women", "Men", "Kids"];
// "Skirt" is intentionally excluded from men - it's hidden for that category (see
// PatternTypeNav's category filter) and clicking a hidden tab isn't a real user action.
const GARMENT_LABELS_BY_CATEGORY: Record<string, string[]> = {
  Women: ["Skirt", "Bodice", "Pants"],
  Men: ["Bodice", "Pants"],
  Kids: ["Skirt", "Bodice", "Pants"],
};

// Regression test for tracker bug #9: switching pattern-type tabs (jupe/corsage/
// pantalon) across every category used to be able to crash the whole interface -
// most infamously Femmes > Pantalon, whose PantsPatternPreview crashed on
// `.toFixed()` for a measurement missing from certain profiles. With no Error
// Boundary anywhere, that uncaught error unmounted the entire app, not just the
// active tab. This exercises every tab in every category and checks the app is
// still alive and responsive after each click.
describe("switching pattern-type tabs across all categories (bug #9)", () => {
  it("switches through every garment tab in every category without crashing the interface", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    renderApp();

    for (const categoryLabel of CATEGORY_LABELS) {
      const categoryButton = screen.getByRole("button", { name: categoryLabel });
      fireEvent.click(categoryButton);

      for (const garmentLabel of GARMENT_LABELS_BY_CATEGORY[categoryLabel]) {
        const garmentButton = screen.getByRole("button", { name: new RegExp(`^${garmentLabel}`, "i") });
        fireEvent.click(garmentButton);

        // The tab nav itself (and the rest of the page) must still be present after
        // every click - a crashed root would leave nothing here at all.
        expect(screen.getByRole("navigation")).toBeInTheDocument();
        expect(document.body.textContent?.trim().length).toBeGreaterThan(0);
      }
    }

    expect(unexpectedErrors(errorSpy)).toEqual([]);
  }, 20000);
});
