import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Category, PatternType, SkirtMeasurements } from '@/types/sloper';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { CategorySelector } from '@/components/CategorySelector';
import { PatternTypeNav } from '@/components/PatternTypeNav';
import { SkirtMeasurementForm, defaultMeasurements } from '@/components/SkirtMeasurementForm';
import { SkirtPatternPreview } from '@/components/SkirtPatternPreview';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Printer, Save, Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getPatternsLimit, STRIPE_CONFIG } from '@/lib/stripe-config';

const Index = () => {
  const navigate = useNavigate();
  const { user, session, subscription, purchasedPatterns, refreshPurchasedPatterns } = useAuth();
  
  const [category, setCategory] = useState<Category>('women');
  const [patternType, setPatternType] = useState<PatternType>('skirt');
  const [measurements, setMeasurements] = useState<SkirtMeasurements>(
    defaultMeasurements.women
  );
  const [saving, setSaving] = useState(false);

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
    setMeasurements(defaultMeasurements[newCategory]);
  };

  // Check if user can access the current pattern
  const canAccessPattern = (type: PatternType): boolean => {
    // Skirt is always free
    if (type === 'skirt') return true;
    
    // Pro subscribers have unlimited access
    if (subscription.tier === 'pro') return true;
    
    // Basic subscribers can access if under limit
    if (subscription.tier === 'basic') {
      const limit = getPatternsLimit('basic');
      return subscription.patternsUsedThisMonth < limit;
    }
    
    // Check if user purchased this pattern
    return purchasedPatterns.includes(type);
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

  const handleSaveMeasurements = async () => {
    if (!user) {
      toast.error('Please sign in to save measurements');
      navigate('/auth');
      return;
    }

    setSaving(true);
    try {
      // First check if a record exists
      const { data: existing } = await supabase
        .from('saved_measurements')
        .select('id')
        .eq('user_id', user.id)
        .eq('category', category)
        .eq('pattern_type', patternType)
        .maybeSingle();

      let error;
      if (existing) {
        // Update existing record
        const result = await supabase
          .from('saved_measurements')
          .update({
            measurements: JSON.parse(JSON.stringify(measurements)),
            name: `${category} ${patternType}`,
          })
          .eq('id', existing.id);
        error = result.error;
      } else {
        // Insert new record
        const result = await supabase.from('saved_measurements').insert([{
          user_id: user.id,
          category,
          pattern_type: patternType,
          measurements: JSON.parse(JSON.stringify(measurements)),
          name: `${category} ${patternType}`,
        }]);
        error = result.error;
      }

      if (error) throw error;
      toast.success('Measurements saved!');
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Failed to save measurements');
    } finally {
      setSaving(false);
    }
  };

  // Load saved measurements when user logs in
  useEffect(() => {
    const loadSavedMeasurements = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('saved_measurements')
          .select('measurements')
          .eq('user_id', user.id)
          .eq('category', category)
          .eq('pattern_type', patternType)
          .maybeSingle();

        if (error) throw error;
        if (data?.measurements) {
          const parsed = data.measurements as unknown as SkirtMeasurements;
          if (parsed && typeof parsed.waist === 'number') {
            setMeasurements(parsed);
          }
        }
      } catch (err) {
        console.error('Load measurements error:', err);
      }
    };

    loadSavedMeasurements();
  }, [user, category, patternType]);

  const isPatternLocked = !canAccessPattern(patternType) && patternType !== 'skirt';

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

          <PatternTypeNav selected={patternType} onSelect={setPatternType} />
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-[360px_1fr] gap-8">
          {/* Left panel - Measurements */}
          <div className="space-y-6">
            <SkirtMeasurementForm
              measurements={measurements}
              onChange={setMeasurements}
              category={category}
            />

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              {user && (
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full gap-2"
                  onClick={handleSaveMeasurements}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Measurements
                </Button>
              )}
              <div className="flex gap-3">
                <Button className="flex-1 gap-2" size="lg" disabled={isPatternLocked}>
                  <Download className="w-4 h-4" />
                  Export PDF
                </Button>
                <Button variant="outline" size="lg" className="gap-2" disabled={isPatternLocked}>
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
              </div>
            </div>

            {/* Upgrade prompt for free users */}
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
                  <strong>Upgrade</strong> to access bodice, dress, pants, and sleeve patterns.
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
                  Basic {patternType} sloper • Front panel
                </p>
              </div>
              <div className="text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">
                Scale: {((measurements.hip / 4 + 1) / 10).toFixed(1)}:10
              </div>
            </div>
            <div className="p-4">
              <SkirtPatternPreview measurements={measurements} />
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
              How to Measure
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Use a flexible measuring tape. Measure your natural waist (the narrowest
              part) and hips (the fullest part). Keep the tape level and snug but not
              tight.
            </p>
          </div>
          <div className="p-6 bg-card rounded-lg border border-border">
            <h3 className="font-serif text-lg font-semibold mb-2 text-foreground">
              Coming Soon
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bodice, dress, pants, and sleeve slopers are in development. Each pattern
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
