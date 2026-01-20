import { Scissors } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Scissors className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-semibold text-foreground tracking-tight">
              Sloper Studio
            </h1>
            <p className="text-xs text-muted-foreground">
              Create your custom sewing patterns
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
