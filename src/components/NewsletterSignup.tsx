import { useState } from 'react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';

const emailSchema = z.string().trim().email().max(255);

export function NewsletterSignup() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast.error(t('newsletter.invalidEmail'));
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('newsletter_subscribers').insert({
        email: parsed.data,
        source: 'welcome_page',
      });

      if (error) {
        if (error.code === '23505') {
          toast.success(t('newsletter.alreadySubscribed'));
          setEmail('');
          return;
        }
        throw error;
      }

      supabase.functions.invoke('send-newsletter-signup', {
        body: { email: parsed.data },
      }).catch(console.error);

      toast.success(t('newsletter.success'));
      setEmail('');
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast.error(t('newsletter.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 mb-10">
      <Card className="max-w-2xl mx-auto p-8 text-center bg-primary/5 border-primary/20">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-serif text-xl font-semibold text-foreground mb-2">{t('newsletter.title')}</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">{t('newsletter.desc')}</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
          <Input
            type="email"
            required
            placeholder={t('newsletter.placeholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            className="flex-1"
          />
          <Button type="submit" disabled={isSubmitting}>
            {t('newsletter.cta')}
          </Button>
        </form>
      </Card>
    </div>
  );
}
