import { useNavigate } from 'react-router-dom';

export function LegalFooter() {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-border py-6 mt-auto">
      <div className="container mx-auto px-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>© 2026 Petit Citron Studio</span>
        <span className="hidden sm:inline">·</span>
        <button onClick={() => navigate('/mentions-legales')} className="hover:text-foreground transition-colors">Mentions légales</button>
        <span>·</span>
        <button onClick={() => navigate('/cgv')} className="hover:text-foreground transition-colors">CGV</button>
        <span>·</span>
        <button onClick={() => navigate('/confidentialite')} className="hover:text-foreground transition-colors">Confidentialité</button>
      </div>
    </footer>
  );
}
