import { vi } from "vitest";

// A minimal stand-in for the supabase-js query builder: every filter/select method
// returns itself (chainable, like the real builder) and the object is thenable so
// `await supabase.from(...).select(...).eq(...).order(...)` resolves to `result`
// no matter where in the chain the caller stops awaiting.
function makeQueryBuilder(result: { data: unknown; error: unknown }) {
  const builder: Record<string, unknown> = {};
  const chain = () => builder;
  builder.select = vi.fn(chain);
  builder.insert = vi.fn(chain);
  builder.update = vi.fn(chain);
  builder.delete = vi.fn(chain);
  builder.eq = vi.fn(chain);
  builder.order = vi.fn(chain);
  builder.single = vi.fn(() => Promise.resolve(result));
  builder.then = (resolve: (v: typeof result) => unknown) => Promise.resolve(result).then(resolve);
  return builder;
}

// Never touches the real project - every method here is a local stub, so tests
// using this mock cannot read or write petitcitron's production Supabase database
// or any real tester's account, regardless of what measurements/PDFs they exercise.
export function createSupabaseTestMock(options?: {
  savedRows?: unknown[];
  insertResult?: { data: unknown; error: unknown };
  updateResult?: { data: unknown; error: unknown };
}) {
  const savedRows = options?.savedRows ?? [];
  const insertResult = options?.insertResult ?? { data: savedRows[0] ?? null, error: null };
  const updateResult = options?.updateResult ?? { data: null, error: null };

  return {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
    functions: {
      invoke: vi.fn().mockResolvedValue({ data: null, error: null }),
    },
    from: vi.fn((table: string) => {
      if (table === "saved_measurements") {
        // select/order -> list of saved rows; insert/update -> configured results
        const builder = makeQueryBuilder({ data: savedRows, error: null });
        builder.insert = vi.fn(() => makeQueryBuilder(insertResult));
        builder.update = vi.fn(() => makeQueryBuilder(updateResult));
        return builder;
      }
      return makeQueryBuilder({ data: [], error: null });
    }),
  };
}
