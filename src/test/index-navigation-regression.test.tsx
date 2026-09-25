import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { UnitProvider } from "@/contexts/UnitContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { createSupabaseTestMock } from "./testSupabaseMock";
import type { User, Session } from "@supabase/supabase-js";

// This whole suite runs against local mocks only (see testSupabaseMock.ts and the
// AuthContext mock below) - it never talks to petitcitron's real Supabase project,
// a real tester's account, or any external API. Nothing here should ever be pointed
// at production credentials.

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

const savedUnifiedRow = {
  id: "profile-1",
  name: "Mon profil",
  created_at: new Date().toISOString(),
  measurements: {
    waist: 68, hip: 96, waistToHip: 20, skirtLength: 58,
    bust: 90, neckCircumference: 36, shoulderLength: 12, backWidth: 34, backLength: 40,
    thigh: 56, knee: 36, ankle: 23, hipHeight: 19, crotchDepth: 25, outseamLength: 100, inseamLength: 78,
    upperArm: 28, wrist: 16, sleeveLength: 58, elbowLength: 30, armholeDepth: 20,
  },
};

let supabaseMock: ReturnType<typeof createSupabaseTestMock>;

vi.mock("@/integrations/supabase/client", () => ({
  get supabase() {
    return supabaseMock;
  },
}));

beforeEach(() => {
  supabaseMock = createSupabaseTestMock({ savedRows: [savedUnifiedRow] });
  // Block every other test-suite category (currency conversion, geo-IP) from making
  // a real network call too - this is a hard guarantee, not just an assumption.
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network disabled in tests")));
  localStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

// Import Index *after* the mocks above are registered.
import Index from "@/pages/Index";

function renderApp(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
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

// Regression test for tracker bug #7: editing/saving the measurement profile then
// navigating back to "mes patrons" (/app, dropping ?mode=profiles) used to leave a
// blank page. handleLoadProfile() re-derives every garment's measurements from the
// updated profile - if that ever throws or leaves the pattern view with data it
// can't render, the whole page goes blank with nothing in the DOM.
describe("profile update -> back to patterns navigation (bug #7)", () => {
  it("still renders the pattern view after updating the measurement profile and navigating back", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    renderApp("/app?mode=profiles");

    // Wait for the saved profile to load and the "update" button to appear.
    const updateButton = await screen.findByRole("button", { name: /profile\.updateWithCurrent|mettre à jour|update/i });
    fireEvent.click(updateButton);

    // Simulate leaving profile mode the way the "back to patterns" button does.
    const backButton = screen.getByRole("button", { name: /back to patterns|retour.*patrons/i });
    fireEvent.click(backButton);

    // The normal pattern view must be back on screen - not a blank page.
    expect(await screen.findByRole("navigation")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(document.body.textContent?.trim().length).toBeGreaterThan(0);

    // Filter out the pre-existing, unrelated <button>-in-<button> DOM-nesting
    // warning from a Popover trigger elsewhere on the page - not what this
    // regression test is about. Anything else logged to console.error here would
    // be an uncaught render error, i.e. exactly the blank-page failure mode.
    const unexpectedErrors = errorSpy.mock.calls.filter(
      (call) => !String(call[0]).includes("validateDOMNesting")
    );
    expect(unexpectedErrors).toEqual([]);
  });
});
