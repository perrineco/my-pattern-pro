import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Category, PatternType, SkirtMeasurements, BodiceMeasurements, PantsMeasurements, SleeveMeasurements, Measurements, isBodiceMeasurements, isPantsMeasurements, isSleeveMeasurements, UnifiedMeasurements } from '@/types/sloper';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
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
import { Download, Printer, Lock, ArrowLeft, RotateCcw } from 'lucide-react';
import { MeasurementGuide } from '@/components/MeasurementGuide';
import { BodiceMeasurementGuide } from '@/components/BodiceMeasurementGuide';
import { SleeveMeasurementGuide } from '@/components/SleeveMeasurementGuide';
import { toast } from 'sonner';
import { getPatternsLimit, STRIPE_CONFIG } from '@/lib/stripe-config';
import { generatePatternPDF } from '@/lib/pdf-export';

const Index = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isProfileMode = searchParams.get('mode') === 'profiles';
  const { user, session, subscription, purchasedPatterns } = useAuth();
  const { t } = useLanguage();
  
  const [category, setCategory] = useState<Category>('women');
  const [patternType, setPatternType] = useState<PatternType>('skirt');
  const [skirtMeasurements, setSkirtMeasurements] = useState<SkirtMeasurements>(
    defaultSkirtMeasurements.women
  );
  const [bodiceMeasurements, setBodiceMeasurements] = useState<BodiceMeasurements>(
    defaultBodiceMeasurements.women
  );
  const [dartlessBodiceMeasurements, setDartlessBodiceMeasurements] = useState<BodiceMeasurements>(
    defaultDartlessBodiceMeasurements.women
  );
  const [knitBodiceMeasurements, setKnitBodiceMeasurements] = useState<BodiceMeasurements>(
    defaultKnitBodiceMeasurements.women
  );
  const [bodiceDartsMeasurements, setBodiceDartsMeasurements] = useState<BodiceMeasurements>(
    defaultBodiceDartsMeasurements.women
  );
  const [pantsMeasurements, setPantsMeasurements] = useState<PantsMeasurements>(
    defaultPantsMeasurements.women
  );
  const [sleeveMeasurements, setSleeveMeasurements] = useState<SleeveMeasurements>(
    defaultSleeveMeasurements.women
  );
  const [bodicePanel, setBodicePanel] = useState<'front' | 'back'>('front');
  const [selectedProfileName, setSelectedProfileName] = useState<string | null>(null);
  
  // Unit toggle state - persist to localStorage
  const [measurementUnit, setMeasurementUnit] = useState<MeasurementUnit>(() => {
    const saved = localStorage.getItem('measurementUnit');
    return (saved === 'cm' || saved === 'inches') ? saved : 'cm';
  });

  // Persist unit preference when it changes
  const handleUnitChange = (unit: MeasurementUnit) => {
    setMeasurementUnit(unit);
    localStorage.setItem('measurementUnit', unit);
  };
  
  // Profile mode state
  const [unifiedMeasurements, setUnifiedMeasurements] = useState<UnifiedMeasurements>(
    defaultUnifiedMeasurements.women
  );
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
    setSkirtMeasurements(defaultSkirtMeasurements[newCategory]);
    setBodiceMeasurements(defaultBodiceMeasurements[newCategory]);
    setDartlessBodiceMeasurements(defaultDartlessBodiceMeasurements[newCategory]);
    setKnitBodiceMeasurements(defaultKnitBodiceMeasurements[newCategory]);
    setBodiceDartsMeasurements(defaultBodiceDartsMeasurements[newCategory]);
    setPantsMeasurements(defaultPantsMeasurements[newCategory]);
    setSleeveMeasurements(defaultSleeveMeasurements[newCategory]);
    setUnifiedMeasurements(defaultUnifiedMeasurements[newCategory]);
    setSelectedProfileId(null);
  };

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

  const handleLoadProfile = (loadedMeasurements: Measurements) => {
    if (isBodiceMeasurements(loadedMeasurements)) {
      setBodiceMeasurements(loadedMeasurements);
    } else if (isPantsMeasurements(loadedMeasurements)) {
      setPantsMeasurements(loadedMeasurements);
    } else {
      setSkirtMeasurements(loadedMeasurements as SkirtMeasurements);
    }
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

  const handleExportPDF = () => {
    const measurements = getCurrentMeasurements();
    // Both dartless and regular bodice now use the same BodiceMeasurements type
    generatePatternPDF(measurements as SkirtMeasurements | BodiceMeasurements, patternType, measurementUnit);
    toast.success(t('toast.pdfDownloaded'));
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

            <div className="flex items-center justify-center gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground block">
                  {t('label.category')}
                </label>
                <CategorySelector selected={category} onSelect={handleCategoryChange} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground block">
                  {t('label.units')}
                </label>
                <UnitToggle unit={measurementUnit} onChange={handleUnitChange} />
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
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6 mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    {t('label.category')}
                  </label>
                  <CategorySelector selected={category} onSelect={handleCategoryChange} />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    {t('label.units')}
                  </label>
                  <UnitToggle unit={measurementUnit} onChange={handleUnitChange} />
                </div>
              </div>

              <div className="w-full lg:w-auto overflow-x-auto">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
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
                      onLoadProfile={(m) => handleLoadProfile(m)}
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
                {/* Action buttons */}
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 gap-2"
                      size="lg"
                      disabled={isPatternLocked}
                      onClick={handleExportPDF}
                    >
                      <Download className="w-4 h-4" />
                      {t('action.exportPdf')}
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="gap-2"
                      disabled={isPatternLocked}
                      onClick={() => {
                        handleExportPDF();
                        toast.info('PDF generated - print from your PDF viewer');
                      }}
                    >
                      <Printer className="w-4 h-4" />
                      {t('action.print')}
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

                {user && subscription.tier === 'none' && (
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
                        {t('locked.description')}
                      </p>
                      <div className="flex gap-3 justify-center">
                        <Button onClick={() => navigate('/pricing')}>
                          {t('action.viewPlans')}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handlePatternPurchase(patternType)}
                        >
                          {t('locked.buyFor')}
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
                                : ((bodiceMeasurements.bust / 4 + 1) / 10).toFixed(1)}:10
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
    </div>
  );
};

export default Index;
