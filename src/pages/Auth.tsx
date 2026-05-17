import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Scissors, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const authSchema = (t: (k: string) => string) => z.object({
  email: z.string().email(t('auth.invalidEmail')),
  password: z.string().min(6, t('auth.passwordMin')),
});

const emailSchema = (t: (k: string) => string) => z.object({
  email: z.string().email(t('auth.invalidEmail')),
});

type AuthMode = 'login' | 'signup' | 'forgot-password' | 'reset-password';

// Check for recovery token synchronously before component renders
const getInitialMode = (): AuthMode => {
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const type = hashParams.get('type');
  const accessToken = hashParams.get('access_token');
  
  if (type === 'recovery' && accessToken) {
    return 'reset-password';
  }
  return 'login';
};

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>(getInitialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});
  
  const { signIn, signUp, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't redirect if we're in reset-password mode
    if (user && mode !== 'reset-password') {
      navigate('/');
    }
  }, [user, navigate, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (mode === 'forgot-password') {
      const result = emailSchema(t).safeParse({ email });
      if (!result.success) {
        setErrors({ email: result.error.errors[0]?.message });
        return;
      }

      setLoading(true);
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });

        if (error) {
          toast.error(error.message);
        } else {
          toast.success(t('auth.resetEmailSent'));
          setMode('login');
        }
      } catch {
        toast.error(t('auth.unexpectedError'));
      } finally {
        setLoading(false);
      }
      return;
    }

    if (mode === 'reset-password') {
      if (newPassword.length < 6) {
        setErrors({ password: t('auth.passwordMin') });
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrors({ confirmPassword: t('auth.passwordsNoMatch') });
        return;
      }

      setLoading(true);
      try {
        const { error } = await supabase.auth.updateUser({ password: newPassword });

        if (error) {
          toast.error(error.message);
        } else {
          toast.success(t('auth.passwordUpdated'));
          // Clear hash from URL
          window.history.replaceState(null, '', window.location.pathname);
          navigate('/');
        }
      } catch (err) {
        toast.error('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Login or Signup
    const result = authSchema(t).safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === 'email') fieldErrors.email = err.message;
        if (err.path[0] === 'password') fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error(t('auth.invalidCredentials'));
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success(t('auth.welcomeBackToast'));
          navigate('/');
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error(t('auth.emailRegistered'));
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success(t('auth.accountCreated'));
          navigate('/');
        }
      }
    } catch (err) {
      toast.error(t('auth.unexpectedError'));
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'signup': return t('auth.createAccount');
      case 'forgot-password': return t('auth.resetPassword');
      case 'reset-password': return t('auth.setNewPassword');
      default: return t('auth.welcomeBack');
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'signup': return t('auth.createAccountDesc');
      case 'forgot-password': return t('auth.resetPasswordDesc');
      case 'reset-password': return t('auth.setNewPasswordDesc');
      default: return t('auth.welcomeBackDesc');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
            <Scissors className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-semibold text-foreground">
              Petit Citron Studio
            </h1>
          </div>
        </div>

        <div className="text-center">
          <h2 className="font-serif text-xl font-semibold text-foreground">
            {getTitle()}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {getSubtitle()}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode !== 'reset-password' && (
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
          )}

          {(mode === 'login' || mode === 'signup') && (
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>
          )}

          {mode === 'reset-password' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="newPassword">{t('auth.newPassword')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                )}
              </div>
            </>
          )}

          {mode === 'login' && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setMode('forgot-password')}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {t('auth.forgotPassword')}
              </button>
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {mode === 'login' && t('auth.signingIn')}
                {mode === 'signup' && t('auth.creatingAccount')}
                {mode === 'forgot-password' && t('auth.sendingEmail')}
                {mode === 'reset-password' && t('auth.updatingPassword')}
              </>
            ) : (
              <>
                {mode === 'login' && t('action.signIn')}
                {mode === 'signup' && t('auth.createAccountBtn')}
                {mode === 'forgot-password' && t('auth.sendResetLink')}
                {mode === 'reset-password' && t('auth.updatePassword')}
              </>
            )}
          </Button>
        </form>

        <div className="text-center space-y-2">
          {mode === 'forgot-password' && (
            <button
              type="button"
              onClick={() => setMode('login')}
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1 mx-auto"
            >
              <ArrowLeft className="w-3 h-3" />
              {t('auth.backToSignIn')}
            </button>
          )}

          {(mode === 'login' || mode === 'signup') && (
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {mode === 'login' ? t('auth.noAccount') : t('auth.hasAccount')}
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}