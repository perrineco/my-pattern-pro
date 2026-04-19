import { Header } from '@/components/Header';
import { ArrowLeft, Globe, Ruler, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUnit } from '@/contexts/UnitContext';
import { useCurrency, Currency, CURRENCY_SYMBOLS } from '@/contexts/CurrencyContext';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CURRENCIES: { value: Currency; label: string }[] = [
  { value: 'EUR', label: '€ Euro' },
  { value: 'USD', label: '$ Dollar américain' },
  { value: 'GBP', label: '£ Livre sterling' },
  { value: 'CAD', label: 'CA$ Dollar canadien' },
];

export default function Settings() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { unit, setUnit } = useUnit();
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-lg py-8 px-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" />
          {t('adj.back')}
        </Button>

        <h1 className="font-serif text-3xl font-bold text-foreground mb-8">
          {t('nav.settings')}
        </h1>

        <div className="space-y-4">
          {/* Langue */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                Langue / Language
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <span className={`text-sm font-medium ${language === 'fr' ? 'text-foreground' : 'text-muted-foreground'}`}>
                  Français
                </span>
                <Switch
                  checked={language === 'en'}
                  onCheckedChange={(checked) => setLanguage(checked ? 'en' : 'fr')}
                  className="data-[state=checked]:bg-primary"
                />
                <span className={`text-sm font-medium ${language === 'en' ? 'text-foreground' : 'text-muted-foreground'}`}>
                  English
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Unités */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Ruler className="w-4 h-4 text-primary" />
                {t('label.units')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <span className={`text-sm font-medium ${unit === 'cm' ? 'text-foreground' : 'text-muted-foreground'}`}>
                  cm
                </span>
                <Switch
                  checked={unit === 'inches'}
                  onCheckedChange={(checked) => setUnit(checked ? 'inches' : 'cm')}
                  className="data-[state=checked]:bg-primary"
                />
                <span className={`text-sm font-medium ${unit === 'inches' ? 'text-foreground' : 'text-muted-foreground'}`}>
                  in
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Devise */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                {language === 'fr' ? 'Devise' : 'Currency'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
