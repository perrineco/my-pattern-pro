import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Category, PatternType, SkirtMeasurements, BodiceMeasurements, PantsMeasurements, SleeveMeasurements, Measurements, UnifiedMeasurements, toSkirtMeasurements, toBodiceMeasurements, toPantsMeasurements, toSleeveMeasurements } from '@/types/sloper';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUnit } from '@/contexts/UnitContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { LegalFooter } from '@/components/LegalFooter';
import { CategorySelector } from '@/components/CategorySelector';
import { PatternTypeNav } from '@/components/PatternTypeNav';
import { SkirtMeasurementForm, defaultMeasurements as defaultSkirtMeasurements } from '@/components/SkirtMeasurementForm';
import { BodiceMeasurementForm, defaultBodiceMeasurements } from '@/components/BodiceMeasurementForm';
import { DartlessBodiceMeasurementForm, defaultDartlessBodiceMeasurements } from '@/components/DartlessBodiceMeasurementForm';
import { BodiceDartsMeasurementForm, defaultBodiceDartsMeasurements } from '@/components/BodiceDartsMeasurementForm';
import { PantsMeasurementForm, defaultPantsMeasurements } from '@/components/PantsMeasurementForm';
import { KnitBodiceMeasurementForm, defaultKnitBodiceMeasurements } from '@/components/KnitBodiceMeasurementForm';
import { SleeveMeasurementForm, defaultSleeveMeasurements } from '@/components/SleeveMeasurementForm';
import { SkirtPatternPreview } from '@/components/SkirtPatternPreview';
import { BodicePatternPreview } from '@/components/BodicePatternPreview';
import { DartlessBodicePatternPreview } from '@/components/DartlessBodicePatternPreview';
import { BodiceWithDartsPatternPreview } from '@/components/BodiceWithDartsPatternPreview';
import { KnitBodicePatternPreview } from '@/components/KnitBodicePatternPreview';
import { PantsPatternPreview } from '@/components/PantsPatternPreview';
import { PantsWithDartsPatternPreview } from '@/components/PantsWithDartsPatternPreview';
import { SleevePatternPreview } from '@/components/SleevePatternPreview';
import { ProfileManager } from '@/components/ProfileManager';
import { ProfileManagerSimple } from '@/components/ProfileManagerSimple';
import { UnifiedMeasurementForm, defaultUnifiedMeasurements } from '@/components/UnifiedMeasurementForm';
import { UnitToggle, MeasurementUnit } from '@/components/UnitToggle';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { FileText, File, Scroll, Monitor, Lock, ArrowLeft, RotateCcw, Wrench, HelpCircle } from 'lucide-react';
import { MeasurementGuide } from '@/components/MeasurementGuide';
import { BodiceMeasurementGuide } from '@/components/BodiceMeasurementGuide';
import { SleeveMeasurementGuide } from '@/components/SleeveMeasurementGuide';
import { toast } from 'sonner';
import { getPatternsLimit, STRIPE_CONFIG } from '@/lib/stripe-config';
import { generateTiledPDF, generateProjectionPDF } from '@/lib/pdf-export';

const DRAFT_KEY = (cat: Category) => `pcs_draft_${cat}`;

interface DraftMeasurements {
  skirt: SkirtMeasurements;
  bodice: BodiceMeasurements;
  dartlessBodice: BodiceMeasurements;
  knitBodice: BodiceMeasurements;
  bodiceDarts: BodiceMeasurements;
  pants: PantsMeasurements;
  sleeve: SleeveMeasurements;
}

function loadDraft(cat: Category): DraftMeasurements | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY(cat));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const Index = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isProfileMode = searchParams.get('mode') === 'profiles';
  const { user, session, subscription, purchasedPatterns, loading } = useAuth();
  const { t, language } = useLanguage();
  const { unit: measurementUnit, setUnit: handleUnitChange } = useUnit();
  const { symbol: currencySymbol, currency } = useCurrency();
  const singlePrice = STRIPE_CONFIG.singlePurchase.price;
  const priceFormatted = currency === 'USD' || currency === 'CAD'
    ? `${currencySymbol}${singlePrice.toFixed(2)}`
    : `${singlePrice.toFixed(2)} ${currencySymbol}`;

  const [category, setCategory] = useState<Category>('women');
  const [patternType, setPatternType] = useState<PatternType>('skirt');
  const [skirtMeasurements, setSkirtMeasurements] = useState<SkirtMeasurements>(() => {
    const d = loadDraft('women'); return d?.skirt ?? defaultSkirtMeasurements.women;
  });
  const [bodiceMeasurements, setBodiceMeasurements] = useState<BodiceMeasurements>(() => {
    const d = loadDraft('women'); return d?.bodice ?? defaultBodiceMeasurements.women;
  });
  const [dartlessBodiceMeasurements, setDartlessBodiceMeasurements] = useState<BodiceMeasurements>(() => {
    const d = loadDraft('women'); return d?.dartlessBodice ?? defaultDartlessBodiceMeasurements.women;
  });
  const [knitBodiceMeasurements, setKnitBodiceMeasurements] = useState<BodiceMeasurements>(() => {
    const d = loadDraft('women'); return d?.knitBodice ?? defaultKnitBodiceMeasurements.women;
  });
  const [bodiceDartsMeasurements, setBodiceDartsMeasurements] = useState<BodiceMeasurements>(() => {
    const d = loadDraft('women'); return d?.bodiceDarts ?? defaultBodiceDartsMeasurements.women;
  });
  const [pantsMeasurements, setPantsMeasurements] = useState<PantsMeasurements>(() => {
    const d = loadDraft('women'); return d?.pants ?? defaultPantsMeasurements.women;
  });
  const [sleeveMeasurements, setSleeveMeasurements] = useState<SleeveMeasurements>(() => {
    const d = loadDraft('women'); return d?.sleeve ?? defaultSleeveMeasurements.women;
  });
  const [bodicePanel, setBodicePanel] = useState<'front' | 'back'>('front');
  const [selectedProfileName, setSelectedProfileName] = useState<string | null>(null);
  
  // Profile mode state
  const [unifiedMeasurements, setUnifiedMeasurements] = useState<UnifiedMeasurements>(
    defaultUnifiedMeasurements.women
  );
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
    const d = loadDraft(newCategory);
    setSkirtMeasurements(d?.skirt ?? defaultSkirtMeasurements[newCategory]);
    setBodiceMeasurements(d?.bodice ?? defaultBodiceMeasurements[newCategory]);
    setDartlessBodiceMeasurements(d?.dartlessBodice ?? defaultDartlessBodiceMeasurements[newCategory]);
    setKnitBodiceMeasurements(d?.knitBodice ?? defaultKnitBodiceMeasurements[newCategory]);
    setBodiceDartsMeasurements(d?.bodiceDarts ?? defaultBodiceDartsMeasurements[newCategory]);
    setPantsMeasurements(d?.pants ?? defaultPantsMeasurements[newCategory]);
    setSleeveMeasurements(d?.sleeve ?? defaultSleeveMeasurements[newCategory]);
    setUnifiedMeasurements(defaultUnifiedMeasurements[newCategory]);
    setSelectedProfileId(null);
  };

  useEffect(() => {
    try {
      const draft: DraftMeasurements = {
        skirt: skirtMeasurements,
        bodice: bodiceMeasurements,
        dartlessBodice: dartlessBodiceMeasurements,
        knitBodice: knitBodiceMeasurements,
        bodiceDarts: bodiceDartsMeasurements,
        pants: pantsMeasurements,
        sleeve: sleeveMeasurements,
      };
      localStorage.setItem(DRAFT_KEY(category), JSON.stringify(draft));
    } catch { /* localStorage unavailable */ }
  }, [category, skirtMeasurements, bodiceMeasurements, dartlessBodiceMeasurements, knitBodiceMeasurements, bodiceDartsMeasurements, pantsMeasurements, sleeveMeasurements]);

  const handlePatternTypeChange = (type: PatternType) => {
    setPatternType(type);
  };

  // Helper to check if current pattern is a bodice variant
  const isBodiceVariant = patternType.startsWith('bodice');
  const isBodiceDartless = patternType === 'bodice-dartless';
  const isBodiceWithDarts = patternType === 'bodice-with-darts';
  const isBodiceKnit = patternType === 'bodice-knit';
  const isPantsVariant = patternType.startsWith('pants');
  const isPantsDartless = patternType === 'pants-dartless' || patternType === 'pants';
  const isPantsWithDarts = patternType === 'pants-with-darts';

  // Get current measurements based on pattern type
  const getCurrentMeasurements = (): Measurements => {
    if (isBodiceDartless) {
      return dartlessBodiceMeasurements;
    }
    if (isBodiceWithDarts) {
      return bodiceDartsMeasurements;
    }
    if (isBodiceKnit) {
      return knitBodiceMeasurements;
    }
    if (patternType === 'bodice') {
      return bodiceMeasurements;
    }
    if (isPantsVariant || patternType === 'pants') {
      return pantsMeasurements;
    }
    if (patternType === 'sleeve') {
      return sleeveMeasurements;
    }
    return skirtMeasurements;
  };

  // Check if user can access the current pattern
  const canAccessPattern = (type: PatternType): boolean => {
    if (type === 'skirt') return true;
    if (subscription.tier === 'pro') return true;
    if (subscription.tier === 'basic') {
      const limit = getPatternsLimit('basic');
      return subscription.patternsUsedThisMonth < limit;
    }
    return purchasedPatterns.includes(type);
  };

  const handleLoadProfile = (loadedMeasurements: UnifiedMeasurements) => {
    setSkirtMeasurements(toSkirtMeasurements(loadedMeasurements));
    setBodiceMeasurements(toBodiceMeasurements(loadedMeasurements));
    setDartlessBodiceMeasurements(toBodiceMeasurements(loadedMeasurements));
    setKnitBodiceMeasurements(toBodiceMeasurements(loadedMeasurements));
    setBodiceDartsMeasurements(toBodiceMeasurements(loadedMeasurements));
    setPantsMeasurements(toPantsMeasurements(loadedMeasurements));
    setSleeveMeasurements(toSleeveMeasurements(loadedMeasurements));
  };

  const handlePatternPurchase = async (type: PatternType) => {
    if (!user) {
      toast.error(t('toast.signInToPurchase'));
      navigate('/auth');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-pattern-purchase', {
        body: { patternType: type },
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      console.error('Purchase error:', err);
      toast.error(t('toast.checkoutFailed'));
    }
  };

  const isPatternLocked = !canAccessPattern(patternType) && patternType !== 'skirt';

  const handleDownload = async (format: 'a4' | 'letter' | 'a0' | 'projection') => {
    try {
      if (patternType !== 'skirt') {
        const { data, error } = await supabase.functions.invoke('record-pattern-generation', {
          body: { patternType },
          headers: { Authorization: `Bearer ${session?.access_token}` },
        });
        if (error || !data?.ok) {
          toast.error(data?.error ?? t('toast.pdfError'));
          return;
        }
      }
      const measurements = getCurrentMeasurements();
      const userName = user?.user_metadata?.full_name || user?.email || '';
      if (format === 'projection') {
        await generateProjectionPDF(measurements, patternType, measurementUnit, language, userName, category);
      } else {
        await generateTiledPDF(format, measurements, patternType, measurementUnit, language, userName, category);
      }
      toast.success(t('toast.pdfDownloaded'));
    } catch {
      toast.error(t('toast.pdfError') ?? 'Failed to generate PDF');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {isProfileMode ? (
          /* Profile Management Mode */
          <div className="max-w-xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/app')}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('action.backToPatterns')}
              </Button>
            </div>

            <div className="text-center mb-8">
              <h1 className="font-serif text-2xl font-semibold text-foreground mb-2">
                {t('profile.manageTitle')}
              </h1>
              <p className="text-muted-foreground">
                {t('profile.manageDesc')}
              </p>
            </div>

            <div className="flex items-center justify-center">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground block">
                  {t('label.category')}
                </label>
                <CategorySelector selected={category} onSelect={handleCategoryChange} />
              </div>
            </div>

            {/* Profile Manager - displayed first */}
            {user && (subscription.tier === 'basic' || subscription.tier === 'pro') && (
              <ProfileManagerSimple
                userId={user.id}
                category={category}
                currentMeasurements={unifiedMeasurements}
                onLoadProfile={(m) => setUnifiedMeasurements(m)}
                selectedProfileId={selectedProfileId}
                onSelectProfile={setSelectedProfileId}
              />
            )}

            {/* Unified Measurements Form */}
            <UnifiedMeasurementForm
              measurements={unifiedMeasurements}
              onChange={setUnifiedMeasurements}
              category={category}
              unit={measurementUnit}
            />
          </div>
        ) : (
          /* Normal Pattern Mode */
          <>
            {/* Top controls */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 lg:gap-6 mb-6">
              <div className="flex flex-row items-end gap-4 flex-wrap">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    {t('label.category')}
                  </label>
                  <CategorySelector selected={category} onSelect={handleCategoryChange} />
                </div>
              </div>

              <div className="w-full lg:w-auto">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  {t('label.garmentType')}
                </label>
                <PatternTypeNav selected={patternType} onSelect={handlePatternTypeChange} category={category} />
              </div>
            </div>

            {/* Main content */}
            <div className="grid lg:grid-cols-[360px_1fr] gap-8">
              {/* Left panel - Measurements (order-2 on mobile so pattern shows first) */}
              <div className="space-y-6 order-2 lg:order-1">
                {/* Profile Manager - Basic/Pro only - Now at top */}
                {user && (subscription.tier === 'basic' || subscription.tier === 'pro') && (
                  <div id="profile-manager">
                    <ProfileManager
                      userId={user.id}
                      category={category}
                      patternType={patternType}
                      currentMeasurements={getCurrentMeasurements() as Measurements}
                      onLoadProfile={(m) => handleLoadProfile(m as UnifiedMeasurements)}
                      onProfileNameChange={setSelectedProfileName}
                    />
                  </div>
                )}

                {patternType === 'skirt' ? (
                  <SkirtMeasurementForm
                    measurements={skirtMeasurements}
                    onChange={setSkirtMeasurements}
                    category={category}
                    unit={measurementUnit}
                  />
                ) : isBodiceDartless ? (
                  <DartlessBodiceMeasurementForm
                    measurements={dartlessBodiceMeasurements}
                    onChange={setDartlessBodiceMeasurements}
                    category={category}
                    unit={measurementUnit}
                  />
                ) : isBodiceWithDarts ? (
                  <BodiceDartsMeasurementForm
                    measurements={bodiceDartsMeasurements}
                    onChange={setBodiceDartsMeasurements}
                    category={category}
                    unit={measurementUnit}
                  />
                ) : isBodiceKnit ? (
                  <KnitBodiceMeasurementForm
                    measurements={knitBodiceMeasurements}
                    onChange={setKnitBodiceMeasurements}
                    category={category}
                    unit={measurementUnit}
                  />
                ) : patternType === 'bodice' ? (
                  <BodiceMeasurementForm
                    measurements={bodiceMeasurements}
                    onChange={setBodiceMeasurements}
                    category={category}
                    unit={measurementUnit}
                  />
                ) : isPantsVariant || patternType === 'pants' ? (
                  <PantsMeasurementForm
                    measurements={pantsMeasurements}
                    onChange={setPantsMeasurements}
                    category={category}
                    unit={measurementUnit}
                  />
                ) : patternType === 'sleeve' ? (
                  <SleeveMeasurementForm
                    measurements={sleeveMeasurements}
                    onChange={setSleeveMeasurements}
                    category={category}
                    unit={measurementUnit}
                  />
                ) : (
                  <SkirtMeasurementForm
                    measurements={skirtMeasurements}
                    onChange={setSkirtMeasurements}
                    category={category}
                    unit={measurementUnit}
                  />
                )}
                {/* Adjustments link */}
                <button
                  onClick={() => navigate('/adjustments')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  {t('action.adjustments')}
                </button>

                {/* Format d'impression */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {t('pdf.formatLabel')}
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    <Button
                      className="flex flex-col h-auto py-3 gap-0.5 min-w-0"
                      disabled={isPatternLocked}
                      onClick={() => handleDownload('a4')}
                    >
                      <FileText className="w-4 h-4 shrink-0" />
                      <span className="text-sm font-semibold">A4</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex flex-col h-auto py-3 gap-0.5 min-w-0"
                      disabled={isPatternLocked}
                      onClick={() => handleDownload('letter')}
                    >
                      <File className="w-4 h-4 shrink-0" />
                      <span className="text-sm font-semibold">Lettre US</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex flex-col h-auto py-3 gap-0.5 min-w-0"
                      disabled={isPatternLocked}
                      onClick={() => handleDownload('a0')}
                    >
                      <Scroll className="w-4 h-4 shrink-0" />
                      <span className="text-sm font-semibold">A0</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex flex-col h-auto py-3 gap-0.5 min-w-0"
                      disabled={isPatternLocked}
                      onClick={() => handleDownload('projection')}
                    >
                      <div className="flex items-center gap-1 shrink-0">
                        <Monitor className="w-4 h-4" />
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="text-muted-foreground hover:text-foreground transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <HelpCircle className="w-3 h-3" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="text-xs whitespace-pre-line leading-relaxed w-64">
                            {t('pdf.projectionTooltip')}
                          </PopoverContent>
                        </Popover>
                      </div>
                      <span className="text-sm font-semibold">Projection</span>
                    </Button>
                  </div>
                </div>

                {/* Upgrade prompts */}
                {!user && (
                  <Card className="p-4 bg-primary/5 border-primary/20">
                    <p className="text-sm text-foreground mb-3">
                      {t('misc.signInPrompt')}
                    </p>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => navigate('/auth')}
                    >
                      {t('action.signIn')}
                    </Button>
                  </Card>
                )}

                {user && subscription.tier === 'none' && !loading && (
                  <Card className="p-4 bg-primary/5 border-primary/20">
                    <p className="text-sm text-foreground mb-3">
                      {t('misc.upgradePrompt')}
                    </p>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => navigate('/pricing')}
                    >
                      {t('action.viewPlans')}
                    </Button>
                  </Card>
                )}
              </div>

              {/* Right panel - Pattern preview (order-1 on mobile so it shows first) */}
              <div className="bg-card rounded-xl border border-border overflow-hidden relative order-1 lg:order-2">
                {isPatternLocked && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="text-center p-6">
                      <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-serif text-xl font-semibold mb-2">
                        {t('locked.title')}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                        {t('locked.description')} {priceFormatted}.
                      </p>
                      <div className="flex gap-3 justify-center">
                        <Button onClick={() => navigate('/pricing')}>
                          {t('action.viewPlans')}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handlePatternPurchase(patternType)}
                        >
                          {t('locked.buyFor')} {priceFormatted}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-foreground">
                      {selectedProfileName ? `${selectedProfileName}'s ` : ''}
                      {patternType === 'skirt' ? t('title.basicSkirt')
                        : patternType === 'bodice' ? t('title.basicBodice')
                        : patternType === 'bodice-dartless' ? t('title.dartlessBodice')
                        : patternType === 'bodice-with-darts' ? t('title.bodiceWithDarts')
                        : patternType === 'bodice-knit' ? t('title.knitBodice')
                        : patternType === 'pants-dartless' || patternType === 'pants' ? t('title.dartlessPants')
                        : patternType === 'pants-with-darts' ? t('title.pantsWithDarts')
                        : patternType === 'sleeve' ? t('title.basicSleeve')
                        : t('title.patternPreview')}
                    </h2>
                    {!isPantsVariant && patternType !== 'pants' && (
                      <div className="flex items-center gap-2 mt-1">
                        {patternType === 'skirt' ? (
                          <MeasurementGuide category={category} />
                        ) : patternType === 'sleeve' ? (
                          <SleeveMeasurementGuide category={category} />
                        ) : (
                          <BodiceMeasurementGuide category={category} />
                        )}
                        <button
                          onClick={() => {
                            if (patternType === 'skirt') setSkirtMeasurements(defaultSkirtMeasurements[category]);
                            else if (patternType === 'bodice') setBodiceMeasurements(defaultBodiceMeasurements[category]);
                            else if (patternType === 'bodice-dartless') setDartlessBodiceMeasurements(defaultDartlessBodiceMeasurements[category]);
                            else if (patternType === 'bodice-with-darts') setBodiceDartsMeasurements(defaultBodiceDartsMeasurements[category]);
                            else if (patternType === 'bodice-knit') setKnitBodiceMeasurements(defaultKnitBodiceMeasurements[category]);
                            else if (patternType === 'sleeve') setSleeveMeasurements(defaultSleeveMeasurements[category]);
                          }}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          {t('action.reset')}
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {isBodiceVariant && (
                      <Tabs value={bodicePanel} onValueChange={(v) => setBodicePanel(v as 'front' | 'back')}>
                        <TabsList className="h-8">
                          <TabsTrigger value="front" className="text-xs px-3">Front</TabsTrigger>
                          <TabsTrigger value="back" className="text-xs px-3">Back</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    )}
                    <div className="text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">
                      Scale: {patternType === 'skirt'
                        ? ((skirtMeasurements.hip / 4 + 1) / 10).toFixed(1)
                        : isPantsVariant || patternType === 'pants'
                        ? ((pantsMeasurements.hip / 4 + 1) / 10).toFixed(1)
                        : patternType === 'sleeve'
                        ? ((sleeveMeasurements.upperArm / 2 + 1) / 10).toFixed(1)
                          : isBodiceDartless
                            ? ((dartlessBodiceMeasurements.bust / 4 + 1) / 10).toFixed(1)
                            : isBodiceWithDarts
                              ? ((bodiceDartsMeasurements.bust / 4 + 1) / 10).toFixed(1)
                              : isBodiceKnit
                                ? ((knitBodiceMeasurements.bust / 4 + 1) / 10).toFixed(1)
                                : ((bodiceMeasurements.bust / 4 + 1) / 10).toFixed(1)}:10 cm
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  {patternType === 'skirt' ? (
                    <SkirtPatternPreview measurements={skirtMeasurements} category={category} />
                  ) : isBodiceDartless ? (
                    <DartlessBodicePatternPreview
                      measurements={dartlessBodiceMeasurements}
                      category={category}
                    />
                  ) : isBodiceWithDarts ? (
                    <BodiceWithDartsPatternPreview
                      measurements={bodiceDartsMeasurements}
                      category={category}
                    />
                  ) : isBodiceKnit ? (
                    <KnitBodicePatternPreview
                      measurements={knitBodiceMeasurements}
                      category={category}
                    />
                  ) : patternType === 'bodice' ? (
                    <BodicePatternPreview
                      measurements={bodiceMeasurements}
                      panel={bodicePanel}
                    />
                  ) : isPantsWithDarts ? (
                    <PantsWithDartsPatternPreview measurements={pantsMeasurements} category={category} />
                  ) : isPantsDartless ? (
                    <PantsPatternPreview measurements={pantsMeasurements} category={category} />
                  ) : patternType === 'sleeve' ? (
                    <SleevePatternPreview measurements={sleeveMeasurements} category={category} />
                  ) : (
                    <SkirtPatternPreview measurements={skirtMeasurements} category={category} />
                  )}
                </div>
                <div className="mx-4 mb-4 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200">
                  <span className="shrink-0 text-base">⚠️</span>
                  <span>{t('warn.noSeamAllowance')}</span>
                </div>
              </div>
            </div>

            {/* Info section */}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-card rounded-lg border border-border">
                <h3 className="font-serif text-lg font-semibold mb-2 text-foreground">
                  {t('info.customPatterns')}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('info.customPatternsDesc')}
                </p>
              </div>
              <div className="p-6 bg-card rounded-lg border border-border">
                <h3 className="font-serif text-lg font-semibold mb-2 text-foreground">
                  {t('info.bodicePattern')}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('info.bodicePatternDesc')}
                </p>
              </div>
              <div className="p-6 bg-card rounded-lg border border-border">
                <h3 className="font-serif text-lg font-semibold mb-2 text-foreground">
                  {t('info.pantsPattern')}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('info.pantsPatternDesc')}
                </p>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>{t('info.footer')}</p>
        </div>
      </footer>
      <LegalFooter />
    </div>
  );
};

export default Index;
