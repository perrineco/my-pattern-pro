import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Scissors, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, session, checkSubscription, refreshPurchasedPatterns } = useAuth();
  
  const sessionId = searchParams.get('session_id');
  const patternType = searchParams.get('pattern');

  useEffect(() => {
    const recordPurchase = async () => {
      if (!user || !session || !patternType) return;

      try {
        // Record the pattern purchase in the database
        const { error } = await supabase
          .from('pattern_purchases')
          .insert({
            user_id: user.id,
            pattern_type: patternType,
            stripe_payment_intent_id: sessionId,
          });

        if (error && !error.message.includes('duplicate')) {
          console.error('Error recording purchase:', error);
        }

        await refreshPurchasedPatterns();
      } catch (err) {
        console.error('Failed to record purchase:', err);
      }
    };

    // Refresh subscription status
    if (session) {
      checkSubscription();
      if (patternType) {
        recordPurchase();
      }
    }
  }, [session, user, patternType, sessionId]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        
        <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
          Payment Successful!
        </h1>
        
        <p className="text-muted-foreground mb-6">
          {patternType
            ? `You now have access to the ${patternType} pattern.`
            : 'Your subscription is now active. Start creating beautiful patterns!'}
        </p>

        <div className="space-y-3">
          <Button className="w-full" onClick={() => navigate('/')}>
            Start Creating Patterns
          </Button>
          <Button variant="outline" className="w-full" onClick={() => navigate('/pricing')}>
            View Plans
          </Button>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Scissors className="w-4 h-4" />
            <span>Sloper Studio</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
