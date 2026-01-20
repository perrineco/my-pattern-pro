import { useState } from 'react';
import { Category, PatternType, SkirtMeasurements } from '@/types/sloper';
import { Header } from '@/components/Header';
import { CategorySelector } from '@/components/CategorySelector';
import { PatternTypeNav } from '@/components/PatternTypeNav';
import { SkirtMeasurementForm, defaultMeasurements } from '@/components/SkirtMeasurementForm';
import { SkirtPatternPreview } from '@/components/SkirtPatternPreview';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';

const Index = () => {
  const [category, setCategory] = useState<Category>('women');
  const [patternType, setPatternType] = useState<PatternType>('skirt');
  const [measurements, setMeasurements] = useState<SkirtMeasurements>(
    defaultMeasurements.women
  );

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
    setMeasurements(defaultMeasurements[newCategory]);
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
            <div className="flex gap-3">
              <Button className="flex-1 gap-2" size="lg">
                <Download className="w-4 h-4" />
                Export PDF
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Printer className="w-4 h-4" />
                Print
              </Button>
            </div>
          </div>

          {/* Right panel - Pattern preview */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-semibold text-foreground">
                  Pattern Preview
                </h2>
                <p className="text-sm text-muted-foreground">
                  Basic skirt sloper • Front panel
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
