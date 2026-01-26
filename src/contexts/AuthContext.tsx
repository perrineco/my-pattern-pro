import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { SubscriptionTier, getSubscriptionTierFromProductId, isTestProAccount } from '@/lib/stripe-config';

interface SubscriptionState {
  tier: SubscriptionTier;
  subscriptionEnd: string | null;
  patternsUsedThisMonth: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  subscription: SubscriptionState;
  purchasedPatterns: string[];
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  checkSubscription: () => Promise<void>;
  refreshPurchasedPatterns: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionState>({
    tier: 'none',
    subscriptionEnd: null,
    patternsUsedThisMonth: 0,
  });
  const [purchasedPatterns, setPurchasedPatterns] = useState<string[]>([]);

  const checkSubscription = async () => {
    if (!session?.access_token) return;

    // Check for test account bypass FIRST - before calling edge function
    const userEmail = session?.user?.email;
    if (isTestProAccount(userEmail)) {
      console.log('Test Pro account detected:', userEmail);
      setSubscription({
        tier: 'pro',
        subscriptionEnd: null,
        patternsUsedThisMonth: 0,
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (error) {
        console.error('Error checking subscription:', error);
        return;
      }

      const tier = getSubscriptionTierFromProductId(data?.product_id);
      setSubscription({
        tier,
        subscriptionEnd: data?.subscription_end || null,
        patternsUsedThisMonth: data?.patterns_used || 0,
      });
    } catch (err) {
      console.error('Failed to check subscription:', err);
    }
  };

  const refreshPurchasedPatterns = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('pattern_purchases')
        .select('pattern_type')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching purchases:', error);
        return;
      }

      const patterns = [...new Set(data?.map((p) => p.pattern_type) || [])];
      setPurchasedPatterns(patterns);
    } catch (err) {
      console.error('Failed to fetch purchases:', err);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Defer data fetching
        if (session?.user) {
          setTimeout(() => {
            checkSubscription();
            refreshPurchasedPatterns();
          }, 0);
        } else {
          setSubscription({ tier: 'none', subscriptionEnd: null, patternsUsedThisMonth: 0 });
          setPurchasedPatterns([]);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        setTimeout(() => {
          checkSubscription();
          refreshPurchasedPatterns();
        }, 0);
      }
    });

    return () => authSubscription.unsubscribe();
  }, []);

  // Periodic subscription check
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      checkSubscription();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [session]);

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    // Clear local state first to ensure user is logged out regardless of API response
    setUser(null);
    setSession(null);
    setSubscription({ tier: 'none', subscriptionEnd: null, patternsUsedThisMonth: 0 });
    setPurchasedPatterns([]);
    
    // Then try to sign out from server (might fail if session already expired)
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.log('Sign out from server failed, but local state cleared');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        subscription,
        purchasedPatterns,
        signUp,
        signIn,
        signOut,
        checkSubscription,
        refreshPurchasedPatterns,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
