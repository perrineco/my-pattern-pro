import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Labels
  'label.category': { en: 'Category', fr: 'Catégorie' },
  'label.units': { en: 'Units', fr: 'Unités' },
  'label.garmentType': { en: 'Garment Type', fr: 'Type de vêtement' },

  // Pattern types (nav buttons)
  'pattern.skirt': { en: 'Skirt', fr: 'Jupe' },
  'pattern.bodice': { en: 'Bodice', fr: 'Corsage' },
  'pattern.dress': { en: 'Dress', fr: 'Robe' },
  'pattern.pants': { en: 'Pants', fr: 'Pantalon' },
  'pattern.sleeve': { en: 'Sleeve', fr: 'Manche' },
  'pattern.dartless': { en: 'Dartless', fr: 'Sans pinces' },
  'pattern.withDarts': { en: 'With Darts', fr: 'Avec pinces' },
  'pattern.forKnit': { en: 'For Knit', fr: 'Pour maille' },

  // Pattern preview titles
  'title.basicSkirt': { en: 'Basic Skirt', fr: 'Jupe de base' },
  'title.basicBodice': { en: 'Basic Bodice', fr: 'Corsage de base' },
  'title.dartlessBodice': { en: 'Dartless Bodice', fr: 'Corsage sans pinces' },
  'title.bodiceWithDarts': { en: 'Bodice with Darts', fr: 'Corsage avec pinces' },
  'title.knitBodice': { en: 'Knit Bodice', fr: 'Corsage maille' },
  'title.basicPants': { en: 'Basic Pants', fr: 'Pantalon de base' },
  'title.basicSleeve': { en: 'Basic Sleeve', fr: 'Manche de base' },
  'title.patternPreview': { en: 'Pattern Preview', fr: 'Aperçu du patron' },

  // Buttons & actions
  'action.reset': { en: 'Reset', fr: 'Réinitialiser' },
  'action.exportPdf': { en: 'Export PDF', fr: 'Exporter PDF' },
  'action.print': { en: 'Print', fr: 'Imprimer' },
  'action.signIn': { en: 'Sign In', fr: 'Connexion' },
  'action.signOut': { en: 'Sign Out', fr: 'Déconnexion' },
  'action.plans': { en: 'Plans', fr: 'Abonnements' },
  'action.adjustments': { en: 'Adjustments', fr: 'Ajustements' },
  'action.pricing': { en: 'Pricing', fr: 'Tarifs' },
  'action.contact': { en: 'Contact', fr: 'Contact' },
  'action.viewPlans': { en: 'View Plans', fr: 'Voir les abonnements' },
  'action.manageProfiles': { en: 'Manage Profiles', fr: 'Gérer les profils' },
  'action.manageSubscription': { en: 'Manage Subscription', fr: 'Gérer l\'abonnement' },
  'action.contactUs': { en: 'Contact Us', fr: 'Nous contacter' },
  'action.backToPatterns': { en: 'Back to Patterns', fr: 'Retour aux patrons' },

  // Misc
  'misc.soon': { en: 'Soon', fr: 'Bientôt' },
  'misc.free': { en: 'Free', fr: 'Gratuit' },
  'misc.plan': { en: 'plan', fr: 'plan' },
  'misc.createPatterns': { en: 'Create your custom sewing patterns', fr: 'Créez vos patrons de couture sur mesure' },
  'misc.signInPrompt': { en: 'Sign in to save your measurements and access all pattern types.', fr: 'Connectez-vous pour sauvegarder vos mesures et accéder à tous les types de patrons.' },
  'misc.upgradePrompt': { en: 'Upgrade to access dress, pants, and sleeve patterns.', fr: 'Passez à un abonnement supérieur pour accéder aux patrons de robe, pantalon et manche.' },
  'misc.language': { en: 'Language', fr: 'Langue' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'en' || saved === 'fr') ? saved : 'en';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
