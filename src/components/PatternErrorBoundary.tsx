import { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  // Remounts the boundary (clearing any previous error) whenever this changes,
  // e.g. pass the current pattern type so switching tabs recovers automatically.
  resetKey?: unknown;
}

interface State {
  error: Error | null;
}

// Wraps a single garment tab's content so a crash there (e.g. a measurement field
// missing from a legacy saved profile) can't unmount the rest of the app — only
// this tab shows a fallback, and the other tabs keep working.
export class PatternErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidUpdate(prevProps: Props) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('Pattern tab crashed:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="p-6 rounded-lg border border-destructive/30 bg-destructive/5 text-sm text-foreground flex flex-col items-center gap-2 text-center">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <p>Une erreur est survenue sur cet onglet. Essayez de changer de mesures ou de sélectionner un autre profil.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
