import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { detectCurrency, type Currency } from '@/lib/currency-detect';
import { fetchEurToUsdRate, getCachedEurToUsdRate } from '@/lib/exchangeRate';

export type { Currency };

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  EUR: '€',
  USD: '$',
};

const STORAGE_KEY = 'preferred-currency';
const MANUAL_KEY = 'preferred-currency-manual';

interface CurrencyContextType {
  currency: Currency;
  /** Manual override - persisted and takes priority over auto-detection on future visits. */
  setCurrency: (c: Currency) => void;
  symbol: string;
  /** Formats a price given in EUR, converting to the active display currency. Display only - never used for Stripe billing. */
  format: (eurPrice: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'EUR' || stored === 'USD' ? stored : 'EUR';
  });
  const [rate, setRate] = useState<number>(() => getCachedEurToUsdRate());

  useEffect(() => {
    if (localStorage.getItem(MANUAL_KEY) === 'true') return;
    let cancelled = false;
    detectCurrency().then((detected) => {
      if (!cancelled) setCurrencyState(detected);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchEurToUsdRate().then((r) => {
      if (!cancelled) setRate(r);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const setCurrency = (c: Currency) => {
    localStorage.setItem(STORAGE_KEY, c);
    localStorage.setItem(MANUAL_KEY, 'true');
    setCurrencyState(c);
  };

  const format = (eurPrice: number) => {
    if (currency === 'USD') {
      return `$${(eurPrice * rate).toFixed(2)}`;
    }
    return `${eurPrice.toFixed(2)} €`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, symbol: CURRENCY_SYMBOLS[currency], format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
