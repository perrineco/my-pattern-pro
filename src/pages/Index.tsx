import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Category, PatternType, SkirtMeasurements, BodiceMeasurements, Measurements, isBodiceMeasurements } from '@/types/sloper';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { CategorySelector } from '@/components/CategorySelector';
import { PatternTypeNav } from '@/components/PatternTypeNav';
import { SkirtMeasurementForm, defaultMeasurements as defaultSkirtMeasurements } from '@/components/SkirtMeasurementForm';
import { BodiceMeasurementForm, defaultBodiceMeasurements } from '@/components/BodiceMeasurementForm';
import { DartlessBodiceMeasurementForm, DartlessBodiceMeasurements, defaultDartlessBodiceMeasurements } from '@/components/DartlessBodiceMeasurementForm';
import { SkirtPatternPreview } from '@/components/SkirtPatternPreview';
import { BodicePatternPreview } from '@/components/BodicePatternPreview';
import { DartlessBodicePatternPreview } from '@/components/DartlessBodicePatternPreview';
import { ProfileManager } from '@/components/ProfileManager';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Printer, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { getPatternsLimit, STRIPE_CONFIG } from '@/lib/stripe-config';
import { generatePatternPDF, SeamAllowance } from '@/lib/pdf-export';

const Index = () => {
  const navigate = useNavigate();
  const { user, session, subscription, purchasedPatterns } = useAuth();
  
  const [category, setCategory] = useState<Category>('women');
  const [patternType, setPatternType] = useState<PatternType>('skirt');
  const [skirtMeasurements, setSkirtMeasurements] = useState<SkirtMeasurements>(
    defaultSkirtMeasurements.women
  );
  const [bodiceMeasurements, setBodiceMeasurements] = useState<BodiceMeasurements>(
    defaultBodiceMeasurements.women
  );
  const [dartlessBodiceMeasurements, setDartlessBodiceMeasurements] = useState<DartlessBodiceMeasurements>(
    defaultDartlessBodiceMeasurements.women
  );
  const [seamAllowance, setSeamAllowance] = useState<SeamAllowance>(1);
  const [bodicePanel, setBodicePanel] = useState<'front' | 'back'>('front');

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
    setSkirtMeasurements(defaultSkirtMeasurements[newCategory]);
    setBodiceMeasurements(defaultBodiceMeasurements[newCategory]);
    setDartlessBodiceMeasurements(defaultDartlessBodiceMeasurements[newCategory]);
  };

  const handlePatternTypeChange = (type: PatternType) => {
    setPatternType(type);
  };

  // Helper to check if current pattern is a bodice variant
  const isBodiceVariant = patternType.startsWith('bodice');
  const isBodiceDartless = patternType === 'bodice-dartless';

  // Get current measurements based on pattern type
  const getCurrentMeasurements = (): Measurements | DartlessBodiceMeasurements => {
    if (isBodiceDartless) {
      return dartlessBodiceMeasurements;
    }
    if (patternType === 'bodice') {
      return bodiceMeasurements;
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
    // For dartless bodice, we need to convert to regular bodice measurements format for PDF
    if (isBodiceDartless) {
      const dartlessMeasurements = measurements as DartlessBodiceMeasurements;
      const bodiceFormat: BodiceMeasurements = {
        bust: dartlessMeasurements.bust,
        waist: dartlessMeasurements.waist,
        shoulderToWaist: dartlessMeasurements.shoulderToWaist,
        bustHeight: dartlessMeasurements.armholeDepth, // Use armhole depth as approximation
        shoulderWidth: dartlessMeasurements.shoulderWidth,
        backWidth: dartlessMeasurements.backWidth,
        chestWidth: dartlessMeasurements.backWidth - 2, // Approximate
        armholeDepth: dartlessMeasurements.armholeDepth,
        neckWidth: dartlessMeasurements.neckWidth,
        shoulderSlope: dartlessMeasurements.shoulderSlope,
      };
      generatePatternPDF(bodiceFormat, 'bodice-dartless', seamAllowance);
    } else {
      generatePatternPDF(measurements as SkirtMeasurements | BodiceMeasurements, patternType, seamAllowance);
    }
    toast.success('PDF downloaded!');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Top controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Category
              </label>
              <CategorySelector selected={category} onSelect={handleCategoryChange} />
            </div>
          </div>

          <PatternTypeNav selected={patternType} onSelect={handlePatternTypeChange} />
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-[360px_1fr] gap-8">
          {/* Left panel - Measurements */}
          <div className="space-y-6">
            {patternType === 'skirt' ? (
              <SkirtMeasurementForm
                measurements={skirtMeasurements}
                onChange={setSkirtMeasurements}
                category={category}
              />
            ) : isBodiceDartless ? (
              <DartlessBodiceMeasurementForm
                measurements={dartlessBodiceMeasurements}
                onChange={setDartlessBodiceMeasurements}
                category={category}
              />
            ) : patternType === 'bodice' ? (
              <BodiceMeasurementForm
                measurements={bodiceMeasurements}
                onChange={setBodiceMeasurements}
                category={category}
              />
            ) : (
              <SkirtMeasurementForm
                measurements={skirtMeasurements}
                onChange={setSkirtMeasurements}
                category={category}
              />
            )}

            {/* Seam Allowance Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Seam Allowance
              </label>
              <div className="flex gap-2">
                {([0, 0.5, 1, 1.5] as SeamAllowance[]).map((value) => (
                  <Button
                    key={value}
                    variant={seamAllowance === value ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => setSeamAllowance(value)}
                  >
                    {value === 0 ? 'None' : `${value}cm`}
                  </Button>
                ))}
              </div>
            </div>

            {/* Profile Manager - Basic/Pro only */}
            {user && (subscription.tier === 'basic' || subscription.tier === 'pro') && (
              <ProfileManager
                userId={user.id}
                category={category}
                patternType={patternType}
                currentMeasurements={getCurrentMeasurements() as Measurements}
                onLoadProfile={(m) => handleLoadProfile(m)}
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
                <h2 className="font-serif text-lg font-semibold text-foreground">
                  Pattern Preview
                </h2>
                <p className="text-sm text-muted-foreground">
                  {isBodiceDartless ? 'Dartless' : 'Basic'} {patternType.replace('bodice-dartless', 'bodice')} sloper • {isBodiceVariant ? `${bodicePanel} panel` : 'Front panel'}
                </p>
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
                    : isBodiceDartless
                      ? ((dartlessBodiceMeasurements.bust / 4 + 1) / 10).toFixed(1)
                      : ((bodiceMeasurements.bust / 4 + 1) / 10).toFixed(1)}:10
                </div>
              </div>
            </div>
            <div className="p-4">
              {patternType === 'skirt' ? (
                <SkirtPatternPreview measurements={skirtMeasurements} seamAllowance={seamAllowance} />
              ) : isBodiceDartless ? (
                <DartlessBodicePatternPreview 
                  measurements={dartlessBodiceMeasurements} 
                  seamAllowance={seamAllowance}
                  panel={bodicePanel}
                />
              ) : patternType === 'bodice' ? (
                <BodicePatternPreview 
                  measurements={bodiceMeasurements} 
                  seamAllowance={seamAllowance}
                  panel={bodicePanel}
                />
              ) : (
                <SkirtPatternPreview measurements={skirtMeasurements} seamAllowance={seamAllowance} />
              )}
            </div>
          </div>
        </div>

        {/* Info section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-card rounded-lg border border-border">
            <h3 className="font-serif text-lg font-semibold mb-2 text-foreground">
              What is a Sloper?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A sloper is a basic pattern block made to your exact measurements. It serves
              as the foundation for creating any garment style, from simple A-line skirts
              to complex fitted designs.
            </p>
          </div>
          <div className="p-6 bg-card rounded-lg border border-border">
            <h3 className="font-serif text-lg font-semibold mb-2 text-foreground">
              Bodice Pattern
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The bodice sloper includes front and back panels with bust darts for shaping.
              It forms the basis for tops, dresses, and jackets with proper fit through
              the torso.
            </p>
          </div>
          <div className="p-6 bg-card rounded-lg border border-border">
            <h3 className="font-serif text-lg font-semibold mb-2 text-foreground">
              Coming Soon
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Dress, pants, and sleeve slopers are in development. Each pattern
              will include detailed construction guides and seam allowance options.
            </p>
          </div>
        </div>
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
