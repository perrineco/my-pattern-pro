import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Scissors, User, LogOut, CreditCard, MessageSquare, Wrench, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const navigate = useNavigate();
  const { user, subscription, signOut, loading } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Scissors className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-semibold text-foreground tracking-tight">
                Sloper Studio
              </h1>
              <p className="text-xs text-muted-foreground">
                {t('misc.createPatterns')}
              </p>
            </div>
          </button>

          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              className="gap-1.5 text-xs"
            >
              <Globe className="w-3.5 h-3.5" />
              {language === 'en' ? 'FR' : 'EN'}
            </Button>

            {!loading && (
              <>
                {user ? (
                  <>

                    <Button variant="outline" size="sm" onClick={() => navigate('/adjustments')}>
                      <Wrench className="w-4 h-4 mr-2" />
                      {t('action.adjustments')}
                    </Button>

                    <Button variant="outline" size="sm" onClick={() => navigate('/pricing')}>
                      <CreditCard className="w-4 h-4 mr-2" />
                      {t('action.plans')}
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <div className="px-3 py-2">
                          <p className="text-sm font-medium truncate">{user.email}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {subscription.tier === 'none' ? t('misc.free') : subscription.tier} {t('misc.plan')}
                          </p>
                        </div>
                        <DropdownMenuSeparator />
                        {(subscription.tier === 'basic' || subscription.tier === 'pro') && (
                          <DropdownMenuItem onClick={() => {
                            navigate('/?mode=profiles');
                          }}>
                            <User className="w-4 h-4 mr-2" />
                            {t('action.manageProfiles')}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => navigate('/app')}>
                          <Scissors className="w-4 h-4 mr-2" />
                          {t('title.patternPreview')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/pricing')}>
                          <CreditCard className="w-4 h-4 mr-2" />
                          {t('action.manageSubscription')}
                        </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => navigate('/contact')}>
                           <MessageSquare className="w-4 h-4 mr-2" />
                           {t('action.contactUs')}
                         </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut}>
                          <LogOut className="w-4 h-4 mr-2" />
                          {t('action.signOut')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/pricing')}>
                      {t('action.pricing')}
                    </Button>
                     <Button variant="ghost" size="sm" onClick={() => navigate('/contact')}>
                       {t('action.contact')}
                     </Button>
                    <Button size="sm" onClick={() => navigate('/auth')}>
                      {t('action.signIn')}
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
