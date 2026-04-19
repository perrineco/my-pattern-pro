import { Header } from '@/components/Header';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Settings() {
  const navigate = useNavigate();
  const { t } = useLanguage();

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
      </main>
    </div>
  );
}
