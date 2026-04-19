import { Header } from '@/components/Header';
import { ArrowLeft, Globe, Ruler } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUnit } from '@/contexts/UnitContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function Settings() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { unit, setUnit } = useUnit();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-lg py-8 px-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>

        <h1 className="font-serif text-3xl font-bold text-foreground mb-8">Paramètres</h1>

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
                Unités de mesure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Label className={`text-sm font-medium ${unit === 'cm' ? 'text-foreground' : 'text-muted-foreground'}`}>
                  Centimètres (cm)
                </Label>
                <Switch
                  checked={unit === 'inches'}
                  onCheckedChange={(checked) => setUnit(checked ? 'inches' : 'cm')}
                  className="data-[state=checked]:bg-primary"
                />
                <Label className={`text-sm font-medium ${unit === 'inches' ? 'text-foreground' : 'text-muted-foreground'}`}>
                  Pouces (in)
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
