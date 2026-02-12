import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Category, PatternType, SkirtMeasurements, BodiceMeasurements, PantsMeasurements, SleeveMeasurements, Measurements, isBodiceMeasurements, isPantsMeasurements, isSleeveMeasurements, UnifiedMeasurements } from '@/types/sloper';
import { useAuth } from '@/contexts/AuthContext';
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
    if (patternType === 'pants') {
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
      toast.error('Please sign in to purchase patterns');
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
      toast.error('Failed to start checkout');
    }
  };

  const isPatternLocked = !canAccessPattern(patternType) && patternType !== 'skirt';

  const handleExportPDF = () => {
    const measurements = getCurrentMeasurements();
    // Both dartless and regular bodice now use the same BodiceMeasurements type
    generatePatternPDF(measurements as SkirtMeasurements | BodiceMeasurements, patternType, measurementUnit);
    toast.success('PDF downloaded!');
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
                onClick={() => setSearchParams({})}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Patterns
              </Button>
            </div>

            <div className="text-center mb-8">
              <h1 className="font-serif text-2xl font-semibold text-foreground mb-2">
                Manage Profiles
              </h1>
              <p className="text-muted-foreground">
                Save and manage your measurement profiles
              </p>
            </div>

            <div className="flex items-center justify-center gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground block">
                  Category
                </label>
                <CategorySelector selected={category} onSelect={handleCategoryChange} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground block">
                  Units
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
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
              <div className="flex items-center gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Category
                  </label>
                  <CategorySelector selected={category} onSelect={handleCategoryChange} />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Units
                  </label>
                  <UnitToggle unit={measurementUnit} onChange={handleUnitChange} />
                </div>
              </div>

              <PatternTypeNav selected={patternType} onSelect={handlePatternTypeChange} category={category} />
            </div>

            {/* Main content */}
            <div className="grid lg:grid-cols-[360px_1fr] gap-8">
              {/* Left panel - Measurements */}
              <div className="space-y-6">
                {/* Profile Manager - Basic/Pro only - Now at top */}
                {user && (subscription.tier === 'basic' || subscription.tier === 'pro') && (
                  <div id="profile-manager">
                    <ProfileManager
                      userId={user.id}
                      category={category}
                      patternType={patternType}
                      currentMeasurements={getCurrentMeasurements() as Measurements}
                      onLoadProfile={(m) => handleLoadProfile(m)}
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
                ) : patternType === 'pants' ? (
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
                      Export PDF
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
                      Print
                    </Button>
                  </div>
                </div>

                {/* Upgrade prompts */}
                {!user && (
                  <Card className="p-4 bg-primary/5 border-primary/20">
                    <p className="text-sm text-foreground mb-3">
                      <strong>Sign in</strong> to save your measurements and access all pattern types.
                    </p>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => navigate('/auth')}
                    >
                      Sign In
                    </Button>
                  </Card>
                )}

                {user && subscription.tier === 'none' && (
                  <Card className="p-4 bg-primary/5 border-primary/20">
                    <p className="text-sm text-foreground mb-3">
                      <strong>Upgrade</strong> to access dress, pants, and sleeve patterns.
                    </p>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => navigate('/pricing')}
                    >
                      View Plans
                    </Button>
                  </Card>
                )}
              </div>

              {/* Right panel - Pattern preview */}
              <div className="bg-card rounded-xl border border-border overflow-hidden relative">
                {isPatternLocked && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="text-center p-6">
                      <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-serif text-xl font-semibold mb-2">
                        Pattern Locked
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                        Subscribe to access this pattern, or purchase it individually for ${STRIPE_CONFIG.singlePurchase.price}.
                      </p>
                      <div className="flex gap-3 justify-center">
                        <Button onClick={() => navigate('/pricing')}>
                          View Plans
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handlePatternPurchase(patternType)}
                        >
                          Buy for ${STRIPE_CONFIG.singlePurchase.price}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-foreground">
                      {patternType === 'skirt' ? 'Basic Skirt' 
                        : patternType === 'bodice' ? 'Basic Bodice'
                        : patternType === 'bodice-dartless' ? 'Dartless Bodice'
                        : patternType === 'bodice-with-darts' ? 'Bodice with Darts'
                        : patternType === 'bodice-knit' ? 'Knit Bodice'
                        : patternType === 'pants' ? 'Basic Pants'
                        : patternType === 'sleeve' ? 'Basic Sleeve'
                        : 'Pattern Preview'}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      {patternType === 'skirt' || patternType === 'pants' ? (
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
                          else if (patternType === 'pants') setPantsMeasurements(defaultPantsMeasurements[category]);
                          else if (patternType === 'sleeve') setSleeveMeasurements(defaultSleeveMeasurements[category]);
                        }}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset
                      </button>
                    </div>
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
                        : patternType === 'pants'
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
                  ) : patternType === 'pants' ? (
                    <PantsPatternPreview measurements={pantsMeasurements} />
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
                  Custom Patterns
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Create basic pattern blocks made to your exact measurements. They serve
                  as the foundation for creating any garment style, from simple A-line skirts
                  to complex fitted designs.
                </p>
              </div>
              <div className="p-6 bg-card rounded-lg border border-border">
                <h3 className="font-serif text-lg font-semibold mb-2 text-foreground">
                  Bodice Pattern
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The bodice pattern includes front and back panels with bust darts for shaping.
                  It forms the basis for tops, dresses, and jackets with proper fit through
                  the torso.
                </p>
              </div>
              <div className="p-6 bg-card rounded-lg border border-border">
                <h3 className="font-serif text-lg font-semibold mb-2 text-foreground">
                  Pants Pattern
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The pants pattern includes front and back panels with waist dart for shaping.
                  Full measurement control from waist to ankle for a perfect fit.
                </p>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Sloper Studio — Create custom-fit sewing patterns</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
