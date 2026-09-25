// EUR -> USD conversion rate for display purposes only (not used for actual Stripe billing).
const CACHE_KEY = 'eur-usd-rate-cache';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
// Used only if no cached rate exists yet and the live fetch also fails.
const FALLBACK_RATE = 1.08;

interface RateCache {
  rate: number;
  timestamp: number;
}

function readCache(): RateCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.rate === 'number' && typeof parsed?.timestamp === 'number') {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function writeCache(rate: number) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ rate, timestamp: Date.now() }));
  } catch {
    // localStorage unavailable (private browsing, quota) - conversion still works, just uncached
  }
}

/** Synchronous best-known rate, for first render before the async fetch resolves. */
export function getCachedEurToUsdRate(): number {
  return readCache()?.rate ?? FALLBACK_RATE;
}

/** Resolves to a fresh EUR->USD rate, refreshing from the API only if the cache is >24h old. */
export async function fetchEurToUsdRate(): Promise<number> {
  const cached = readCache();
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.rate;
  }

  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=EUR&to=USD');
    if (!res.ok) throw new Error(`rate fetch failed: ${res.status}`);
    const data = await res.json();
    const rate = data?.rates?.USD;
    if (typeof rate !== 'number' || !Number.isFinite(rate) || rate <= 0) {
      throw new Error('invalid rate in response');
    }
    writeCache(rate);
    return rate;
  } catch (err) {
    console.warn('[exchangeRate] using fallback rate, live fetch failed:', err);
    return cached?.rate ?? FALLBACK_RATE;
  }
}
