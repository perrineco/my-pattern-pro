import { useCurrency } from '@/contexts/CurrencyContext';
import { cn } from '@/lib/utils';

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div
      role="group"
      aria-label="Devise / Currency"
      className="flex items-center rounded-full border border-input bg-background p-0.5 text-xs shrink-0"
    >
      <button
        type="button"
        aria-pressed={currency === 'EUR'}
        onClick={() => setCurrency('EUR')}
        className={cn(
          'px-2 py-1 rounded-full font-medium transition-colors',
          currency === 'EUR' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        €
      </button>
      <button
        type="button"
        aria-pressed={currency === 'USD'}
        onClick={() => setCurrency('USD')}
        className={cn(
          'px-2 py-1 rounded-full font-medium transition-colors',
          currency === 'USD' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        $
      </button>
    </div>
  );
}
