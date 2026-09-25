export type Currency = 'EUR' | 'USD';

// US and Canada get USD; everywhere else defaults to EUR.
const USD_COUNTRIES = new Set(['US', 'CA']);

export function currencyFromCountryCode(country: string | null | undefined): Currency {
  if (country && USD_COUNTRIES.has(country.toUpperCase())) return 'USD';
  return 'EUR';
}

function currencyFromLocale(): Currency {
  const locales = (navigator.languages?.length ? navigator.languages : [navigator.language]).filter(Boolean);
  for (const loc of locales) {
    const region = loc.split('-')[1]?.toUpperCase();
    if (region) return currencyFromCountryCode(region);
  }
  return 'EUR';
}

/**
 * Detects the currency to display: tries the server-side geo-IP lookup first
 * (Netlify edge function, not available on `npm run dev`), then falls back
 * to the browser locale.
 */
export async function detectCurrency(): Promise<Currency> {
  if (!import.meta.env.DEV) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2500);
      const res = await fetch('/api/geo', { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) {
        const data = await res.json();
        if (data?.country) return currencyFromCountryCode(data.country);
      }
    } catch {
      // network/edge function unavailable - fall back to locale below
    }
  }
  return currencyFromLocale();
}
